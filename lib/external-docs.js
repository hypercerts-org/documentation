const { readFileSync } = require('fs');
const { join, posix } = require('path');
const yaml = require('js-yaml');

const SOURCE_ORG = 'hypercerts-org';
const REGISTRY_PATH = join(__dirname, '..', 'docs-sources.yml');
const MARKDOWN_EXTENSIONS = /\.(md|mdoc|mdx)$/i;

/**
 * Return true when a registry path points at a Markdown file instead of a docs directory.
 */
function isMarkdownFilePath(value) {
  return MARKDOWN_EXTENSIONS.test(value);
}

/**
 * Encode a GitHub path without collapsing its slash-separated path segments.
 */
function encodeGitHubPath(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}

/**
 * Normalize a docs-sources.yml path and reject absolute paths or parent traversal.
 */
function normalizeRegistryPath(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid docs-sources.yml: ${fieldName} must be a non-empty relative path.`);
  }

  const normalized = value.trim().replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/$/, '');
  const parts = normalized.split('/');

  if (normalized.startsWith('/') || parts.includes('..') || parts.includes('')) {
    throw new Error(`Invalid docs-sources.yml: ${fieldName} must be a relative path without empty segments or "..".`);
  }

  return normalized;
}

/**
 * Parse the YAML frontmatter block from a Markdown file.
 */
function parseMarkdownFrontmatter(markdown, label = 'Markdown file') {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  try {
    return yaml.load(match[1]) || {};
  } catch (error) {
    throw new Error(`Invalid frontmatter in ${label}: ${error.message}`);
  }
}

/**
 * Build the raw.githubusercontent.com URL for a registered external docs file.
 */
function buildRawGitHubUrl(source, filePath) {
  return `https://raw.githubusercontent.com/${source.owner}/${source.repoName}/${encodeURIComponent(source.branch)}/${encodeGitHubPath(filePath)}`;
}

/**
 * Build the GitHub browser URL for a registered external docs path.
 */
function buildGitHubSourceUrl(source, filePath, mode = 'blob') {
  return `https://github.com/${source.owner}/${source.repoName}/${mode}/${encodeURIComponent(source.branch)}/${encodeGitHubPath(filePath)}`;
}

/**
 * Return the single Markdown file that a remote-doc page should render, when configured.
 */
function getEntrypointPath(source) {
  if (source.entrypoint) return posix.join(source.docsPath, source.entrypoint);
  if (isMarkdownFilePath(source.docsPath)) return source.docsPath;
  return null;
}

/**
 * Validate and normalize one source entry from docs-sources.yml.
 */
function normalizeSource(rawSource, index) {
  const label = `sources[${index}]`;

  if (!rawSource || typeof rawSource !== 'object' || Array.isArray(rawSource)) {
    throw new Error(`Invalid docs-sources.yml: ${label} must be an object.`);
  }

  const id = rawSource.id;
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`Invalid docs-sources.yml: ${label}.id must be a lowercase id like "epds" or "certified-group-service".`);
  }

  const title = rawSource.title;
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error(`Invalid docs-sources.yml: source "${id}" must set a human-readable title.`);
  }

  const repo = rawSource.repo;
  if (typeof repo !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new Error(`Invalid docs-sources.yml: source "${id}" repo must look like "hypercerts-org/ePDS".`);
  }

  const [owner, repoName] = repo.split('/');
  if (owner.toLowerCase() !== SOURCE_ORG) {
    throw new Error(`Invalid docs-sources.yml: source "${id}" must use a ${SOURCE_ORG} repository so browser-rendered docs cannot load arbitrary hosts.`);
  }

  const branch = rawSource.branch;
  if (typeof branch !== 'string' || branch.trim() === '') {
    throw new Error(`Invalid docs-sources.yml: source "${id}" must set the branch to read, for example "main".`);
  }

  const docsPath = normalizeRegistryPath(rawSource.docsPath, `source "${id}" docsPath`);
  const entrypoint = rawSource.entrypoint
    ? normalizeRegistryPath(rawSource.entrypoint, `source "${id}" entrypoint`)
    : '';

  const routeBase = rawSource.routeBase || rawSource.route || '';
  if (routeBase && (typeof routeBase !== 'string' || !routeBase.startsWith('/'))) {
    throw new Error(`Invalid docs-sources.yml: source "${id}" routeBase must start with "/".`);
  }

  const source = {
    id,
    title: title.trim(),
    repo,
    owner,
    repoName,
    branch: branch.trim(),
    docsPath,
    entrypoint,
    routeBase,
  };

  const entrypointPath = getEntrypointPath(source);
  return {
    ...source,
    entrypointPath,
    rawUrl: entrypointPath ? buildRawGitHubUrl(source, entrypointPath) : '',
    sourceUrl: entrypointPath
      ? buildGitHubSourceUrl(source, entrypointPath, 'blob')
      : buildGitHubSourceUrl(source, docsPath, 'tree'),
  };
}

/**
 * Load and validate the central external docs registry.
 */
function loadExternalDocSources(registryPath = REGISTRY_PATH) {
  let document;
  try {
    document = yaml.load(readFileSync(registryPath, 'utf8')) || {};
  } catch (error) {
    throw new Error(`Unable to read docs source registry at ${registryPath}: ${error.message}`);
  }

  if (!Array.isArray(document.sources)) {
    throw new Error('Invalid docs-sources.yml: expected a top-level "sources" array.');
  }

  const seen = new Set();
  return document.sources.map((source, index) => {
    const normalized = normalizeSource(source, index);
    if (seen.has(normalized.id)) {
      throw new Error(`Invalid docs-sources.yml: duplicate source id "${normalized.id}".`);
    }
    seen.add(normalized.id);
    return normalized;
  });
}

/**
 * Find one registered external docs source by id.
 */
function findExternalDocSource(id, sources = loadExternalDocSources()) {
  return sources.find((source) => source.id === id) || null;
}

/**
 * Convert a registry source into the public manifest consumed by browser components.
 */
function sourceToPublicManifestEntry(source) {
  return {
    id: source.id,
    title: source.title,
    repo: source.repo,
    branch: source.branch,
    docsPath: source.docsPath,
    entrypoint: source.entrypoint || undefined,
    routeBase: source.routeBase || undefined,
    sourceUrl: source.sourceUrl,
    rawUrl: source.rawUrl || undefined,
    filePath: source.entrypointPath || undefined,
  };
}

/**
 * Resolve a page frontmatter declaration to the raw Markdown URL that build scripts should fetch.
 */
function resolveFrontmatterRawSource(frontmatter, sources = loadExternalDocSources()) {
  if (frontmatter.externalDoc) {
    const id = String(frontmatter.externalDoc);
    const source = findExternalDocSource(id, sources);
    if (!source) {
      throw new Error(`Unknown externalDoc "${id}". Add it to docs-sources.yml or remove the externalDoc frontmatter.`);
    }
    if (!source.rawUrl) {
      throw new Error(`External doc "${id}" does not define a renderable Markdown file. Set entrypoint in docs-sources.yml or point docsPath at a Markdown file.`);
    }
    return { rawUrl: source.rawUrl, label: `externalDoc "${id}"` };
  }

  if (frontmatter.rawUrl) {
    return { rawUrl: String(frontmatter.rawUrl), label: 'rawUrl frontmatter' };
  }

  return null;
}

module.exports = {
  REGISTRY_PATH,
  SOURCE_ORG,
  buildGitHubSourceUrl,
  buildRawGitHubUrl,
  encodeGitHubPath,
  findExternalDocSource,
  getEntrypointPath,
  isMarkdownFilePath,
  loadExternalDocSources,
  parseMarkdownFrontmatter,
  resolveFrontmatterRawSource,
  sourceToPublicManifestEntry,
};
