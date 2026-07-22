import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Markdoc from '@markdoc/markdoc';
import tags from '../markdoc/tags';
import { fence, heading, link } from '../markdoc/nodes';
import { Callout } from './Callout';
import { Columns } from './Columns';
import { Column } from './Column';
import { Figure } from './Figure';
import { Heading } from './Heading';
import { CardLink } from './CardLink';
import { CodeBlock } from './CodeBlock';
import { Link } from './Link';
import { DotPattern } from './DotPattern';
import { HeroBanner } from './HeroBanner';
import { CardGrid } from './CardGrid';
import { MermaidDiagram } from './MermaidDiagram';

const SOURCE_ORG = 'hypercerts-org';
const EXTERNAL_DOCS_MANIFEST_URL = '/external-docs.json';
let externalDocsManifestPromise = null;
const RemoteMarkdownContext = React.createContext(null);

const markdocConfig = {
  tags,
  nodes: { fence, heading, link },
};

/**
 * Convert an allowed GitHub Markdown URL into the raw URL used by the browser fetch.
 * Only hypercerts-org GitHub sources are allowed so docs pages cannot become an open proxy.
 */
function resolveGitHubMarkdownSource(source) {
  const url = new URL(source);

  if (url.hostname === 'github.com') {
    const [, owner, repo, marker, ref, ...fileParts] = url.pathname.split('/');
    if (owner?.toLowerCase() !== SOURCE_ORG || marker !== 'blob' || !repo || !ref || fileParts.length === 0) {
      throw new Error('Remote docs must use a hypercerts-org GitHub blob URL, for example https://github.com/hypercerts-org/ePDS/blob/main/docs/tutorial.md.');
    }

    const filePath = fileParts.join('/');
    return {
      sourceUrl: url.toString(),
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`,
      owner,
      repo,
      ref,
      filePath,
    };
  }

  if (url.hostname === 'raw.githubusercontent.com') {
    const [, owner, repo, ref, ...fileParts] = url.pathname.split('/');
    if (owner?.toLowerCase() !== SOURCE_ORG || !repo || !ref || fileParts.length === 0) {
      throw new Error('Remote docs must use a raw.githubusercontent.com URL under hypercerts-org.');
    }

    const filePath = fileParts.join('/');
    return {
      sourceUrl: `https://github.com/${owner}/${repo}/blob/${ref}/${filePath}`,
      rawUrl: url.toString(),
      owner,
      repo,
      ref,
      filePath,
    };
  }

  throw new Error('Remote docs can only be loaded from github.com or raw.githubusercontent.com.');
}

function isHttpUrl(source) {
  try {
    const url = new URL(source);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function throwIfAborted(signal) {
  if (!signal?.aborted) return;
  const error = new Error('Aborted');
  error.name = 'AbortError';
  throw error;
}

async function loadExternalDocsManifest() {
  if (!externalDocsManifestPromise) {
    externalDocsManifestPromise = fetch(EXTERNAL_DOCS_MANIFEST_URL, {
      cache: 'no-store',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${EXTERNAL_DOCS_MANIFEST_URL} returned ${response.status} ${response.statusText || 'without an external docs manifest'}. Run npm run generate:external-docs before starting the docs site.`);
        }
        return response.json();
      })
      .catch((error) => {
        externalDocsManifestPromise = null;
        throw error;
      });
  }

  return externalDocsManifestPromise;
}

function resolveRegisteredMarkdownSource(source, manifest) {
  const id = String(source || '').trim();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error('Remote doc source must be a GitHub URL or a docs-sources.yml id like "epds".');
  }

  const entry = manifest?.sources?.[id];
  if (!entry) {
    throw new Error(`No external docs source "${id}" was found in ${EXTERNAL_DOCS_MANIFEST_URL}. Add it to docs-sources.yml and rebuild.`);
  }

  const [owner, repo] = String(entry.repo || '').split('/');
  if (owner?.toLowerCase() !== SOURCE_ORG || !repo || !entry.branch || !entry.filePath || !entry.rawUrl || !entry.sourceUrl) {
    throw new Error(`External docs source "${id}" is incomplete. Set repo, branch, docsPath, and entrypoint in docs-sources.yml, then rebuild.`);
  }

  return {
    sourceUrl: entry.sourceUrl,
    rawUrl: entry.rawUrl,
    owner,
    repo,
    ref: entry.branch,
    filePath: entry.filePath,
  };
}

async function resolveMarkdownSource(source, signal) {
  if (isHttpUrl(source)) return resolveGitHubMarkdownSource(source);
  const manifest = await loadExternalDocsManifest();
  throwIfAborted(signal);
  return resolveRegisteredMarkdownSource(source, manifest);
}

/**
 * Remove optional YAML frontmatter before parsing remote Markdown with Markdoc.
 */
function stripFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) return markdown;

  const end = markdown.indexOf('\n---\n', 4);
  if (end === -1) return markdown;

  return markdown.slice(end + 5).trimStart();
}

/**
 * Resolve relative links in remotely-rendered docs back to the source GitHub repo.
 */
function resolveRemoteHref(href, source) {
  if (!href || href.startsWith('#') || href.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return href;
  }

  const sourceDir = source.filePath.split('/').slice(0, -1).join('/');
  const basePath = `/${source.owner}/${source.repo}/blob/${source.ref}/${sourceDir ? `${sourceDir}/` : ''}`;
  const resolved = new URL(href, `https://github.com${basePath}`);
  const [, owner, repo, , ref, ...repoPathParts] = resolved.pathname.split('/');
  const repoPath = repoPathParts.join('/');
  const lastSegment = repoPathParts[repoPathParts.length - 1] || '';
  const mode = /\.[a-z0-9]+$/i.test(lastSegment) ? 'blob' : 'tree';

  return `https://github.com/${owner}/${repo}/${mode}/${ref}/${repoPath}${resolved.hash}`;
}

function RemoteLink({ href, children, ...props }) {
  const source = useContext(RemoteMarkdownContext);
  const resolvedHref = source ? resolveRemoteHref(href, source) : href;

  return (
    <Link href={resolvedHref} {...props}>
      {children}
    </Link>
  );
}

const remoteMarkdocComponents = {
  Callout,
  Columns,
  Column,
  Figure,
  Heading,
  CardLink,
  CodeBlock,
  Fence: CodeBlock,
  Link: RemoteLink,
  DotPattern,
  HeroBanner,
  CardGrid,
  MermaidDiagram,
};

function getRawCacheUrl(currentPath) {
  if (currentPath === '/') return '/raw/index.md';
  return `/raw${currentPath.replace(/\.html$/, '')}.md`;
}

async function fetchMarkdown(url, signal, errorPrefix) {
  const response = await fetch(url, {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`${errorPrefix} returned ${response.status} ${response.statusText || 'without the Markdown file'}.`);
  }

  return response.text();
}

function transformMarkdown(markdown) {
  const ast = Markdoc.parse(stripFrontmatter(markdown));
  return Markdoc.transform(ast, markdocConfig);
}

/**
 * Runtime Markdoc renderer for Markdown files that live in Hypercerts service repos.
 * It tries the live GitHub raw source first, then the build-time `/raw` cache, then the wrapped local fallback.
 */
export function RemoteMarkdown({ source, children }) {
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0] || '/';
  const rawCacheUrl = getRawCacheUrl(currentPath);
  const [markdown, setMarkdown] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceInfo, setSourceInfo] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setMarkdown(null);
    setError(null);
    setSourceInfo(null);
    setIsLoading(true);

    async function loadRemoteMarkdown() {
      let nextSourceInfo;

      try {
        nextSourceInfo = await resolveMarkdownSource(source, controller.signal);
        setSourceInfo(nextSourceInfo);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err);
        return;
      }

      let githubError = null;

      try {
        const nextMarkdown = await fetchMarkdown(nextSourceInfo.rawUrl, controller.signal, 'GitHub');
        transformMarkdown(nextMarkdown);
        setMarkdown(nextMarkdown);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
        githubError = err;
      }

      try {
        const cachedMarkdown = await fetchMarkdown(rawCacheUrl, controller.signal, 'Build-time raw cache');
        transformMarkdown(cachedMarkdown);
        setMarkdown(cachedMarkdown);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(new Error(`${githubError.message} The build-time raw cache also failed: ${err.message}`));
      } finally {
        setIsLoading(false);
      }
    }

    loadRemoteMarkdown().finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
  }, [rawCacheUrl, source]);

  const renderedState = useMemo(() => {
    if (!markdown || !sourceInfo) return { renderedContent: null, renderError: null };

    try {
      const content = transformMarkdown(markdown);
      return {
        renderedContent: Markdoc.renderers.react(content, React, {
          components: remoteMarkdocComponents,
        }),
        renderError: null,
      };
    } catch (err) {
      return { renderedContent: null, renderError: err };
    }
  }, [markdown, sourceInfo]);
  const { renderedContent, renderError } = renderedState;
  const displayError = error || renderError;

  useEffect(() => {
    if (!renderedContent) return undefined;

    const frame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('remote-docs:loaded'));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [renderedContent]);

  if (renderedContent) {
    return (
      <RemoteMarkdownContext.Provider value={sourceInfo}>
        {renderedContent}
      </RemoteMarkdownContext.Provider>
    );
  }

  if (isLoading && !displayError) {
    return (
      <div className="remote-doc-status" role="status">
        Loading the canonical docs from GitHub…
      </div>
    );
  }

  return (
    <>
      <div className="remote-doc-status remote-doc-status--error" role="alert">
        <strong>Could not load the canonical docs.</strong>{' '}
        The browser could not load the registered source, the live GitHub raw file, or the build-time raw cache. Showing the local fallback below. Try refreshing, or edit{' '}
        {sourceInfo ? (
          <a href={sourceInfo.sourceUrl} target="_blank" rel="noopener noreferrer">the source file</a>
        ) : (
          'the configured source URL'
        )}{' '}
        if the URL is wrong. Details: {displayError?.message || 'No renderable Markdown source was available.'}
      </div>
      {children}
    </>
  );
}
