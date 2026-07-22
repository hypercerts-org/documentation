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
  const basePath = `/${owner}/${repoName}/blob/${encodedRef}/${sourceDirectory ? `${sourceDirectory}/` : ''}`;
  const resolved = new URL(href, `https://github.com${basePath}`);
  const [, resolvedOwner, resolvedRepo, , ref, ...repoPathParts] = resolved.pathname.split('/');
  const repoPath = repoPathParts.join('/');
  const lastSegment = repoPathParts[repoPathParts.length - 1] || '';
  const mode = /\.[a-z0-9]+$/i.test(lastSegment) ? 'blob' : 'tree';

  return `https://github.com/${resolvedOwner}/${resolvedRepo}/${mode}/${ref}/${repoPath}${resolved.search}${resolved.hash}`;
}

/**
 * Resolve a relative external-document image to public GitHub content that browsers can display.
 */
function resolveExternalDocImageSrc(src, source) {
  if (isAbsoluteOrSiteHref(src)) return src;

  const { owner, repoName, sourceDirectory } = getSourceLocation(source);
  const base = `https://raw.githubusercontent.com/${owner}/${repoName}/${encodeURIComponent(source.ref)}/${sourceDirectory ? `${sourceDirectory}/` : ''}`;
  return new URL(src, base).toString();
}

module.exports = {
  resolveExternalDocHref,
  resolveExternalDocImageSrc,
};
