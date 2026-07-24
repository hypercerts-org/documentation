const { readFileSync } = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const {
  resolveExternalDocSnapshot,
  resolvePageDocument,
} = require('./external-doc-page');

/** Default GitHub organizations trusted as external documentation sources. */
const DEFAULT_ALLOWED_SOURCE_ORGS = ['hypercerts-org', 'gainforest'];
/** Absolute path to the external documentation source registry. */
const REGISTRY_PATH = join(__dirname, '..', 'docs-sources.yml');
/** Absolute path to the generated build-time external documentation snapshot. */
const CONTENT_PATH = join(__dirname, 'external-docs-content.json');
/** File extensions accepted for registered external Markdown sources. */
const MARKDOWN_EXTENSIONS = /\.(md|mdoc|mdx)$/i;
/** Registry keys allowed on each external documentation source. */
const SOURCE_FIELDS = new Set(['id', 'title', 'repo', 'ref', 'path']);

/**
 * Read the trusted GitHub organization allowlist, falling back to project defaults.
 */
function getAllowedSourceOrgs(env = process.env) {
  const configured = env.DOCS_ALLOWED_SOURCE_ORGS;
  if (typeof configured !== 'string' || configured.trim() === '') {
    return [...DEFAULT_ALLOWED_SOURCE_ORGS];
  }

  const organizations = [...new Set(configured
    .split(',')
    .map((owner) => owner.trim().toLowerCase())
    .filter(Boolean))];

  if (organizations.length === 0 || organizations.some((owner) => !/^[a-z0-9_.-]+$/.test(owner))) {
    throw new Error('DOCS_ALLOWED_SOURCE_ORGS must be a comma-separated list of GitHub organization names.');
  }

  return organizations;
}

/**
 * Return true when a registry path points at a supported Markdown file.
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
 * Normalize and validate one registry path without allowing absolute or parent-relative traversal.
 */
function normalizeRegistryPath(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid docs-sources.yml: ${fieldName} must be a non-empty relative Markdown path.`);
  }

  if (value.includes('\\')) {
    throw new Error(`Invalid docs-sources.yml: ${fieldName} must use forward slashes.`);
  }

  const normalized = value.trim().replace(/^\.\//, '').replace(/\/$/, '');
  const parts = normalized.split('/');
  if (normalized.startsWith('/') || parts.includes('..') || parts.includes('')) {
    throw new Error(`Invalid docs-sources.yml: ${fieldName} must be a relative path without empty segments or "..".`);
  }
  if (!isMarkdownFilePath(normalized)) {
    throw new Error(`Invalid docs-sources.yml: ${fieldName} must point to a .md, .mdoc, or .mdx file.`);
  }

  return normalized;
}

/**
 * Validate one raw registry entry and return the normalized source consumed by snapshot generation.
 */
function normalizeSource(rawSource, index, allowedOrgs) {
  const label = `sources[${index}]`;
  if (!rawSource || typeof rawSource !== 'object' || Array.isArray(rawSource)) {
    throw new Error(`Invalid docs-sources.yml: ${label} must be an object.`);
  }

  const unsupportedFields = Object.keys(rawSource).filter((field) => !SOURCE_FIELDS.has(field));
  if (unsupportedFields.length > 0) {
    throw new Error(`Invalid docs-sources.yml: ${label} contains unsupported field${unsupportedFields.length === 1 ? '' : 's'} ${unsupportedFields.map((field) => `"${field}"`).join(', ')}. Use only id, title, repo, ref, and path.`);
  }

  const { id, title, repo, ref } = rawSource;
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`Invalid docs-sources.yml: ${label}.id must be a lowercase id like "epds" or "certified-group-service".`);
  }
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error(`Invalid docs-sources.yml: source "${id}" must set a human-readable title.`);
  }
  if (typeof repo !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new Error(`Invalid docs-sources.yml: source "${id}" repo must look like "owner/repository".`);
  }

  const [owner] = repo.split('/');
  if (!allowedOrgs.includes(owner.toLowerCase())) {
    throw new Error(`Invalid docs-sources.yml: source "${id}" must use one of these trusted GitHub owners: ${allowedOrgs.join(', ')}.`);
  }
  if (typeof ref !== 'string' || ref.trim() === '') {
    throw new Error(`Invalid docs-sources.yml: source "${id}" must set a branch, tag, or commit in ref.`);
  }
  if (/[\u0000-\u001f\u007f]/.test(ref)) {
    throw new Error(`Invalid docs-sources.yml: source "${id}" ref must not contain control characters.`);
  }

  return {
    id,
    title: title.trim(),
    repo,
    ref: ref.trim(),
    path: normalizeRegistryPath(rawSource.path, `source "${id}" path`),
  };
}

/**
 * Load and validate the build-time external documentation registry.
 */
function loadExternalDocSources(registryPath = REGISTRY_PATH, env = process.env) {
  let document;
  try {
    document = yaml.load(readFileSync(registryPath, 'utf8')) || {};
  } catch (error) {
    throw new Error(`Unable to read docs source registry at ${registryPath}: ${error.message}`);
  }

  if (!Array.isArray(document.sources)) {
    throw new Error('Invalid docs-sources.yml: expected a top-level "sources" array.');
  }

  const allowedOrgs = getAllowedSourceOrgs(env);
  const seen = new Set();
  return document.sources.map((rawSource, index) => {
    const source = normalizeSource(rawSource, index, allowedOrgs);
    if (seen.has(source.id)) {
      throw new Error(`Invalid docs-sources.yml: duplicate source id "${source.id}".`);
    }
    seen.add(source.id);
    return source;
  });
}

/**
 * Parse the YAML frontmatter block from a Markdown file.
 */
function parseMarkdownFrontmatter(markdown, label = 'Markdown file') {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {};

  try {
    return yaml.load(match[1]) || {};
  } catch (error) {
    throw new Error(`Invalid frontmatter in ${label}: ${error.message}`);
  }
}

/**
 * Load the immutable external documentation snapshot generated before the site build.
 */
function loadExternalDocsContent(contentPath = CONTENT_PATH) {
  try {
    const content = JSON.parse(readFileSync(contentPath, 'utf8'));
    if (!content.sources || typeof content.sources !== 'object' || Array.isArray(content.sources)) {
      throw new Error('expected a top-level "sources" object');
    }
    return content;
  } catch (error) {
    throw new Error(`Unable to read generated external docs content at ${contentPath}: ${error.message}. Run npm run generate:external-docs first.`);
  }
}

module.exports = {
  CONTENT_PATH,
  DEFAULT_ALLOWED_SOURCE_ORGS,
  REGISTRY_PATH,
  encodeGitHubPath,
  getAllowedSourceOrgs,
  isMarkdownFilePath,
  loadExternalDocSources,
  loadExternalDocsContent,
  parseMarkdownFrontmatter,
  resolveExternalDocSnapshot,
  resolvePageDocument,
};
