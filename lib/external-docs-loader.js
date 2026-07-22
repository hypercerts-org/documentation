const yaml = require('js-yaml');
const {
  CONTENT_PATH,
  loadExternalDocsContent,
  parseMarkdownFrontmatter,
  resolvePageDocument,
} = require('./external-docs');

/**
 * Strip upstream frontmatter so local page metadata remains authoritative after compilation.
 */
function stripMarkdownFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? markdown.slice(match[0].length) : markdown;
}

/**
 * Compile a frontmatter-only external page from its immutable Markdown snapshot.
 * Generated source metadata lets Markdoc resolve relative links without exposing registry URLs or the full snapshot to shared bundles.
 */
function compileExternalDocPage(frontmatter, source, content, label) {
  const page = resolvePageDocument(frontmatter, source, content, label);
  const { id, repo, ref, path } = page.externalDoc;
  const compiledFrontmatter = {
    ...frontmatter,
    __externalDocSource: { id, repo, ref, path },
  };

  return `---\n${yaml.dump(compiledFrontmatter, { lineWidth: -1, noRefs: true }).trimEnd()}\n---\n\n${stripMarkdownFrontmatter(page.markdown).trimStart()}`;
}

/**
 * Replace a frontmatter-only externalDoc page with its generated Markdown snapshot before Markdoc parses it.
 * The injected source metadata is consumed during transformation and is never written back to the page file.
 */
function externalDocsLoader(source) {
  const frontmatter = parseMarkdownFrontmatter(source, this.resourcePath);
  if (!Object.prototype.hasOwnProperty.call(frontmatter, 'externalDoc')) {
    return source;
  }

  const content = loadExternalDocsContent();
  this.addDependency(CONTENT_PATH);
  return compileExternalDocPage(frontmatter, source, content, this.resourcePath);
}

module.exports = externalDocsLoader;
module.exports.compileExternalDocPage = compileExternalDocPage;
