/**
 * Resolve one externalDoc id to the exact Markdown snapshot used by the build.
 */
function resolveExternalDocSnapshot(externalDoc, content) {
  if (typeof externalDoc !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(externalDoc)) {
    throw new Error('externalDoc must be a lowercase registry id such as "epds".');
  }

  const snapshot = content?.sources?.[externalDoc];
  if (!snapshot) {
    throw new Error(`Unknown externalDoc "${externalDoc}". Add it to docs-sources.yml and run npm run generate:external-docs.`);
  }
  if (typeof snapshot.markdown !== 'string' || snapshot.markdown.trim() === '') {
    throw new Error(`External doc "${externalDoc}" has no generated Markdown. Run npm run generate:external-docs and check the registered repo, ref, and path.`);
  }

  return snapshot;
}

/**
 * Remove an optional LF- or CRLF-delimited frontmatter block from Markdown content.
 */
function getMarkdownBody(markdown) {
  const frontmatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return frontmatter ? markdown.slice(frontmatter[0].length) : markdown;
}

/**
 * Resolve the Markdown and source metadata for one page.
 * Pages with externalDoc must contain frontmatter only so stale local fallback content cannot diverge from the build snapshot.
 */
function resolvePageDocument(frontmatter, localMarkdown, content, label = 'Markdown page') {
  if (!Object.prototype.hasOwnProperty.call(frontmatter, 'externalDoc')) {
    return { markdown: localMarkdown, externalDoc: null };
  }

  if (getMarkdownBody(localMarkdown).trim() !== '') {
    throw new Error(`${label} sets externalDoc and must not contain a local Markdown body. Remove the stale fallback content; external source failures stop the build.`);
  }

  const externalDoc = resolveExternalDocSnapshot(frontmatter.externalDoc, content);
  return { markdown: externalDoc.markdown, externalDoc };
}

module.exports = {
  resolveExternalDocSnapshot,
  resolvePageDocument,
};
