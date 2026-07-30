const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { join, relative } = require('node:path');
const test = require('node:test');

const ROOT = join(__dirname, '..');
const PAGES_DIR = join(ROOT, 'pages');
const HIDDEN_PATHS = [
  '/tools/hypercerts-cli',
  '/tools/scaffold',
  '/tools/hyperboards',
];
const HIDDEN_PAGE_FILES = new Set(HIDDEN_PATHS.map((path) => `pages${path}.md`));

function walkMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walkMarkdownFiles(path) : path.endsWith('.md') ? [path] : [];
  });
}

test('keeps the hidden tool page source files', () => {
  for (const file of HIDDEN_PAGE_FILES) {
    assert.equal(existsSync(join(ROOT, file)), true, `${file} must remain available for direct routes`);
  }
});

test('excludes hidden tool pages from the generated search index', () => {
  execFileSync(process.execPath, ['lib/generate-search-index.js'], { cwd: ROOT });
  const index = JSON.parse(readFileSync(join(ROOT, 'public/search-index.json'), 'utf8'));
  const indexedHiddenPaths = index
    .map((page) => page.path)
    .filter((path) => HIDDEN_PATHS.includes(path));

  assert.deepEqual(indexedHiddenPaths, []);
});

test('excludes hidden tool pages from the generated sitemap', () => {
  execFileSync(process.execPath, ['lib/generate-sitemap.js'], { cwd: ROOT });
  const sitemap = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');

  for (const path of HIDDEN_PATHS) {
    assert.doesNotMatch(sitemap, new RegExp(`<loc>[^<]+${path}</loc>`));
  }
});

test('does not link to hidden tool pages from visible documentation or navigation', () => {
  const authoredFiles = [
    join(ROOT, 'components/Layout.js'),
    join(ROOT, 'components/SearchDialog.js'),
    join(ROOT, 'lib/navigation.js'),
    ...walkMarkdownFiles(PAGES_DIR).filter((file) => {
      const repoPath = relative(ROOT, file).split('\\').join('/');
      return !HIDDEN_PAGE_FILES.has(repoPath);
    }),
  ];

  for (const file of authoredFiles) {
    const content = readFileSync(file, 'utf8');
    for (const path of HIDDEN_PATHS) {
      assert.equal(
        content.includes(path),
        false,
        `${relative(ROOT, file)} still links to ${path}`,
      );
    }
  }
});
