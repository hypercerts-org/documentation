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
  loadExternalDocSources,
  parseMarkdownFrontmatter,
  resolveFrontmatterRawSource,
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

async function getRawMarkdown(file, sources) {
  const localMarkdown = readFileSync(file, 'utf-8');
  const pagePath = relative(PAGES_DIR, file);
  const frontmatter = parseMarkdownFrontmatter(localMarkdown, pagePath);
  const remoteSource = resolveFrontmatterRawSource(frontmatter, sources);

  if (!remoteSource) return localMarkdown;

  const response = await fetch(remoteSource.rawUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${remoteSource.label} for ${pagePath}: ${remoteSource.rawUrl} returned ${response.status} ${response.statusText || ''}`.trim());
  }

  return response.text();
}

async function main() {
  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = walkDir(PAGES_DIR);
  const sources = loadExternalDocSources();

  for (const file of files) {
    const outputPath = getRawOutputPath(file);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, await getRawMarkdown(file, sources));
  }

  console.log(`Generated raw markdown files for ${files.length} pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
