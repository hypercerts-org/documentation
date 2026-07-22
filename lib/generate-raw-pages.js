const {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
} = require('fs');
const { dirname, join, relative } = require('path');
const {
  loadExternalDocsContent,
  parseMarkdownFrontmatter,
  resolvePageDocument,
} = require('./external-docs');

const PAGES_DIR = join(__dirname, '..', 'pages');
const OUTPUT_DIR = join(__dirname, '..', 'public', 'raw');

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(full));
    } else if (full.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function getRawOutputPath(filePath) {
  const rel = relative(PAGES_DIR, filePath)
    .replace(/\.md$/, '')
    .replace(/\\/g, '/');
  const route = rel === 'index' ? '/index' : `/${rel.replace(/\/index$/, '')}`;
  const outputRel = route === '/index' ? 'index.md' : `${route.slice(1)}.md`;
  return join(OUTPUT_DIR, outputRel);
}

/**
 * Resolve one page to the exact Markdown that should be published in the raw artifact tree.
 */
function getRawMarkdown(file, externalContent) {
  const localMarkdown = readFileSync(file, 'utf-8');
  const pagePath = relative(PAGES_DIR, file);
  const frontmatter = parseMarkdownFrontmatter(localMarkdown, pagePath);
  return resolvePageDocument(frontmatter, localMarkdown, externalContent, pagePath).markdown;
}

/**
 * Regenerate raw Markdown artifacts for every documentation page.
 */
async function main() {
  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = walkDir(PAGES_DIR);
  const externalContent = loadExternalDocsContent();

  for (const file of files) {
    const outputPath = getRawOutputPath(file);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, getRawMarkdown(file, externalContent));
  }

  console.log(`Generated raw markdown files for ${files.length} pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
