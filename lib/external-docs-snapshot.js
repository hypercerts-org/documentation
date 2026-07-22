const crypto = require('crypto');
const { encodeGitHubPath } = require('./external-docs');

/** GitHub REST API version used for deterministic source and commit requests. */
const GITHUB_API_VERSION = '2022-11-28';

/**
 * Serialize a value with stable object-key ordering so fingerprints do not depend on construction order.
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
 * Compute a SHA-256 digest with the prefix used by generated fingerprint files.
 */
function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}

/**
 * Build GitHub API headers with optional bearer authentication and an explicit response media type.
 */
function getGitHubHeaders(token, accept, userAgent) {
  const headers = {
    Accept: accept,
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': userAgent,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Split a validated external source repository into its GitHub owner and repository name.
 */
function getRepoParts(source) {
  const [owner, repoName] = source.repo.split('/');
  return { owner, repoName };
}

/**
 * Fetch a GitHub API resource and convert non-success responses into actionable source errors.
 */
async function fetchGitHubResponse(url, token, accept, userAgent) {
  const response = await fetch(url, {
    headers: getGitHubHeaders(token, accept, userAgent),
    cache: 'no-store',
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${url} returned ${response.status} ${response.statusText || ''}. Check repo, ref, path, and DOCS_SOURCE_TOKEN. ${body}`.trim());
  }
  return response;
}

/**
 * Fetch the raw Markdown file registered by an external documentation source.
 */
async function fetchSourceMarkdown(source, token) {
  const { owner, repoName } = getRepoParts(source);
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/contents/${encodeGitHubPath(source.path)}?ref=${encodeURIComponent(source.ref)}`;
  const response = await fetchGitHubResponse(
    url,
    token,
    'application/vnd.github.raw+json',
    'hypercerts-docs-build',
  );
  const markdown = await response.text();
  if (markdown.trim() === '') {
    throw new Error(`External doc "${source.id}" at ${source.repo}@${source.ref}:${source.path} is empty. Add Markdown content or remove the source from docs-sources.yml.`);
  }
  return markdown;
}

/**
 * Read the latest source-file commit timestamp, returning null when commit metadata is unavailable.
 */
async function fetchSourceUpdatedAt(source, token) {
  const { owner, repoName } = getRepoParts(source);
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/commits?sha=${encodeURIComponent(source.ref)}&path=${encodeURIComponent(source.path)}&per_page=1`;

  try {
    const response = await fetchGitHubResponse(
      url,
      token,
      'application/vnd.github+json',
      'hypercerts-docs-build',
    );
    const commits = await response.json();
    return commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date || null;
  } catch {
    return null;
  }
}

/**
 * Fetch one immutable Markdown snapshot used by rendering, search, raw exports, and fingerprinting.
 */
async function collectSourceSnapshot(source, token = '') {
  const [markdown, updatedAt] = await Promise.all([
    fetchSourceMarkdown(source, token),
    fetchSourceUpdatedAt(source, token),
  ]);

  return {
    ...source,
    updatedAt,
    size: Buffer.byteLength(markdown),
    contentHash: sha256(markdown),
    markdown,
  };
}

/**
 * Fetch all registered sources concurrently and preserve registry order in the returned snapshots.
 */
async function collectExternalDocSnapshots(sources, token = '') {
  return Promise.all(sources.map((source) => collectSourceSnapshot(source, token)));
}

/**
 * Select only source identity and content fields that are allowed to affect a fingerprint.
 */
function stableSnapshotSource(snapshot) {
  return {
    id: snapshot.id,
    title: snapshot.title,
    repo: snapshot.repo,
    ref: snapshot.ref,
    path: snapshot.path,
    contentHash: snapshot.contentHash,
  };
}

/**
 * Build per-source and combined fingerprints from the exact Markdown snapshots used by the site build.
 */
function buildFingerprintDocument(snapshots) {
  const outputSources = {};
  const stableSources = [];
  const sortedSnapshots = [...snapshots].sort((a, b) => a.id.localeCompare(b.id));

  for (const snapshot of sortedSnapshots) {
    const stableSource = stableSnapshotSource(snapshot);
    const fingerprint = sha256(stableStringify(stableSource));
    outputSources[snapshot.id] = {
      title: snapshot.title,
      repo: snapshot.repo,
      ref: snapshot.ref,
      path: snapshot.path,
      updatedAt: snapshot.updatedAt || undefined,
      size: snapshot.size,
      contentHash: snapshot.contentHash,
      fingerprint,
    };
    stableSources.push({ ...stableSource, fingerprint });
  }

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sources: outputSources,
    combinedFingerprint: sha256(stableStringify({ schemaVersion: 1, sources: stableSources })),
  };
}

module.exports = {
  buildFingerprintDocument,
  collectExternalDocSnapshots,
  collectSourceSnapshot,
  sha256,
  stableStringify,
};
