const crypto = require('crypto');
const { mkdirSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');
const { loadExternalDocSources } = require('./external-docs');

const DEFAULT_OUTPUT = join(__dirname, '..', 'public', 'docs-fingerprint.json');
const GITHUB_API_VERSION = '2022-11-28';

/**
 * Serialize values with stable object-key ordering so hashes do not depend on construction order.
 */
function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

/**
 * Compute a sha256 digest with the prefix used in generated fingerprint files.
 */
function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}

/**
 * Read a --output value from the CLI arguments.
 */
function getOutputPath(argv) {
  const outputIndex = argv.findIndex((arg) => arg === '--output' || arg === '-o');
  if (outputIndex !== -1) {
    const output = argv[outputIndex + 1];
    if (!output) throw new Error('Missing value after --output.');
    return output;
  }

  const inlineOutput = argv.find((arg) => arg.startsWith('--output='));
  if (inlineOutput) return inlineOutput.slice('--output='.length);

  return DEFAULT_OUTPUT;
}

/**
 * Fetch JSON from the GitHub REST API with optional authentication for private repos or rate limits.
 */
async function fetchGitHubJson(url, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': 'hypercerts-docs-refresh',
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${url} returned ${response.status} ${response.statusText || ''}. Check repo, branch, docsPath, and DOCS_SOURCE_TOKEN. ${body}`.trim());
  }

  return response.json();
}

/**
 * Fetch the Git tree for a source branch and return blob entries under docsPath.
 */
async function fetchSourceEntries(source, token) {
  const treeUrl = `https://api.github.com/repos/${source.owner}/${source.repoName}/git/trees/${encodeURIComponent(source.branch)}?recursive=1`;
  const tree = await fetchGitHubJson(treeUrl, token);

  if (tree.truncated) {
    throw new Error(`GitHub returned a truncated tree for ${source.repo}@${source.branch}. Narrow source "${source.id}" docsPath or split it into smaller sources before fingerprinting.`);
  }

  const root = source.docsPath.replace(/\/$/, '');
  const prefix = `${root}/`;
  const files = (tree.tree || [])
    .filter((entry) => entry.type === 'blob' && (entry.path === root || entry.path.startsWith(prefix)))
    .map((entry) => ({
      path: entry.path,
      sha: entry.sha,
      size: entry.size || 0,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  if (files.length === 0) {
    throw new Error(`No files found for source "${source.id}" at ${source.repo}@${source.branch}:${source.docsPath}. Check docs-sources.yml.`);
  }

  return files;
}

/**
 * Compute the per-source and combined fingerprints for all registered external docs.
 */
async function generateFingerprint() {
  const sources = loadExternalDocSources();
  const token = process.env.DOCS_SOURCE_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const outputSources = {};
  const stableSources = [];

  for (const source of sources) {
    const files = await fetchSourceEntries(source, token);
    const stableSource = {
      id: source.id,
      repo: source.repo,
      branch: source.branch,
      docsPath: source.docsPath,
      entrypoint: source.entrypoint || '',
      routeBase: source.routeBase || '',
      files,
    };
    const fingerprint = sha256(stableStringify(stableSource));

    outputSources[source.id] = {
      title: source.title,
      repo: source.repo,
      branch: source.branch,
      docsPath: source.docsPath,
      entrypoint: source.entrypoint || undefined,
      routeBase: source.routeBase || undefined,
      fileCount: files.length,
      fingerprint,
      files,
    };
    stableSources.push({ ...stableSource, fingerprint });
  }

  const combinedFingerprint = sha256(stableStringify({ schemaVersion: 1, sources: stableSources }));

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sources: outputSources,
    combinedFingerprint,
  };
}

async function main() {
  const output = getOutputPath(process.argv.slice(2));
  const fingerprint = await generateFingerprint();

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(fingerprint, null, 2)}\n`);
  console.log(`Generated docs fingerprint ${fingerprint.combinedFingerprint} → ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
