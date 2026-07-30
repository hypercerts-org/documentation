const assert = require('node:assert/strict');
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
const ROUTE_PAGE_FILES = HIDDEN_PATHS.map((path) => `pages${path}.md`);
const DRAFT_PAGE_FILES = HIDDEN_PATHS.map((path) => `drafts${path}.md`);

function walkMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walkMarkdownFiles(path) : path.endsWith('.md') ? [path] : [];
  });
}

test('archives hidden tool pages outside the routable pages directory', () => {
  for (const file of ROUTE_PAGE_FILES) {
    assert.equal(existsSync(join(ROOT, file)), false, `${file} must not remain routable`);
  }
  for (const file of DRAFT_PAGE_FILES) {
    assert.equal(existsSync(join(ROOT, file)), true, `${file} must preserve the page source`);
  }
});

test('does not link to hidden tool pages from visible documentation or navigation', () => {
  const authoredFiles = [
    join(ROOT, 'components/Layout.js'),
    join(ROOT, 'components/SearchDialog.js'),
    join(ROOT, 'lib/navigation.js'),
    ...walkMarkdownFiles(PAGES_DIR),
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
