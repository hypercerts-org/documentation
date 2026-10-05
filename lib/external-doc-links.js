/**
 * Return true when a link should remain unchanged instead of being resolved against an external repository.
 */
function isAbsoluteOrSiteHref(href) {
  return !href
    || href.startsWith('#')
    || href.startsWith('/')
    || /^[a-z][a-z0-9+.-]*:/i.test(href);
}

/**
 * Split external source metadata into repository coordinates and the Markdown file's containing directory.
 */
function getSourceLocation(source) {
  const [owner, repoName] = source.repo.split('/');
  const sourceDirectory = source.path.split('/').slice(0, -1).join('/');
  return { owner, repoName, sourceDirectory };
}

/**
 * Resolve a relative external-document link to the corresponding GitHub blob or tree URL.
 * For example, ../packages/demo from docs/tutorial.md becomes the repository's packages/demo tree.
 */
function resolveExternalDocHref(href, source) {
  if (isAbsoluteOrSiteHref(href)) return href;

  const { owner, repoName, sourceDirectory } = getSourceLocation(source);
  const encodedRef = encodeURIComponent(source.ref);
  // Resolve inside a virtual repository root so excess '..' cannot consume the ref or repository.
  const resolved = new URL(href, `https://repository.local/${sourceDirectory ? `${sourceDirectory}/` : ''}`);
  const repoPath = resolved.pathname.slice(1);
  const lastSegment = repoPath.split('/').pop() || '';
  const mode = /\.[a-z0-9]+$/i.test(lastSegment) ? 'blob' : 'tree';

  return `https://github.com/${owner}/${repoName}/${mode}/${encodedRef}/${repoPath}${resolved.search}${resolved.hash}`;
}

/**
 * Resolve a relative external-document image to public GitHub content that browsers can display.
 */
function resolveExternalDocImageSrc(src, source) {
  if (isAbsoluteOrSiteHref(src)) return src;

  const { owner, repoName, sourceDirectory } = getSourceLocation(source);
  const resolved = new URL(src, `https://repository.local/${sourceDirectory ? `${sourceDirectory}/` : ''}`);
  return `https://raw.githubusercontent.com/${owner}/${repoName}/${encodeURIComponent(source.ref)}${resolved.pathname}${resolved.search}${resolved.hash}`;
}

module.exports = {
  resolveExternalDocHref,
  resolveExternalDocImageSrc,
};
