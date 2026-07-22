const assert = require('node:assert/strict');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const test = require('node:test');
const {
  DEFAULT_ALLOWED_SOURCE_ORGS,
  getAllowedSourceOrgs,
  loadExternalDocSources,
  loadExternalDocsContent,
  parseMarkdownFrontmatter,
  resolveExternalDocSnapshot,
  resolvePageDocument,
} = require('../lib/external-docs');
const { compileExternalDocPage } = require('../lib/external-docs-loader');

function withTempFile(name, contents, run) {
  const directory = mkdtempSync(join(tmpdir(), 'external-docs-test-'));
  const path = join(directory, name);
  writeFileSync(path, contents);

  try {
    return run(path);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function loadRegistry(contents, env = {}) {
  return withTempFile('docs-sources.yml', contents, (path) => loadExternalDocSources(path, env));
}

const registry = `sources:
  - id: epds
    title: ePDS
    repo: hypercerts-org/ePDS
    ref: main
    path: docs/tutorial.md
`;

const snapshot = {
  id: 'epds',
  title: 'ePDS',
  repo: 'hypercerts-org/ePDS',
  ref: 'main',
  path: 'docs/tutorial.md',
  markdown: '# Canonical ePDS docs',
};
const content = { sources: { epds: snapshot } };

test('uses default source organizations when the environment override is absent or blank', () => {
  assert.deepEqual(getAllowedSourceOrgs({}), DEFAULT_ALLOWED_SOURCE_ORGS);
  assert.deepEqual(getAllowedSourceOrgs({ DOCS_ALLOWED_SOURCE_ORGS: '  ' }), DEFAULT_ALLOWED_SOURCE_ORGS);
});

test('normalizes and deduplicates configured source organizations', () => {
  assert.deepEqual(
    getAllowedSourceOrgs({ DOCS_ALLOWED_SOURCE_ORGS: ' Example-Org,HYPERCERTS-ORG,example-org ' }),
    ['example-org', 'hypercerts-org'],
  );
  assert.throws(
    () => getAllowedSourceOrgs({ DOCS_ALLOWED_SOURCE_ORGS: 'valid owner,other' }),
    /comma-separated list/,
  );
});

test('loads the single-file source schema', () => {
  assert.deepEqual(loadRegistry(registry), [{
    id: 'epds',
    title: 'ePDS',
    repo: 'hypercerts-org/ePDS',
    ref: 'main',
    path: 'docs/tutorial.md',
  }]);
});

for (const extension of ['md', 'mdoc', 'mdx']) {
  test(`accepts .${extension} source files`, () => {
    const [source] = loadRegistry(`sources:
  - id: docs
    title: Docs
    repo: hypercerts-org/docs
    ref: main
    path: guide.${extension}
`);
    assert.equal(source.path, `guide.${extension}`);
  });
}

test('rejects legacy URL and directory source fields', () => {
  for (const field of ['rawUrl', 'sourceUrl', 'docsPath', 'entrypoint', 'fingerprintMode']) {
    assert.throws(() => loadRegistry(`sources:
  - id: docs
    title: Docs
    repo: hypercerts-org/docs
    ref: main
    path: guide.md
    ${field}: legacy
`), new RegExp(`unsupported field.*${field}`));
  }
});

test('validates registry shape, source identity, repository, ref, path, and duplicates', () => {
  const invalidRegistries = [
    '{}',
    'sources: {}',
    'sources:\n  - id: Bad_ID\n    title: Bad\n    repo: hypercerts-org/docs\n    ref: main\n    path: guide.md',
    'sources:\n  - id: docs\n    repo: hypercerts-org/docs\n    ref: main\n    path: guide.md',
    'sources:\n  - id: docs\n    title: Docs\n    repo: invalid\n    ref: main\n    path: guide.md',
    'sources:\n  - id: docs\n    title: Docs\n    repo: unapproved/docs\n    ref: main\n    path: guide.md',
    'sources:\n  - id: docs\n    title: Docs\n    repo: hypercerts-org/docs\n    ref: ""\n    path: guide.md',
    'sources:\n  - id: docs\n    title: Docs\n    repo: hypercerts-org/docs\n    ref: main\n    path: guide.txt',
    'sources:\n  - id: docs\n    title: Docs\n    repo: hypercerts-org/docs\n    ref: main\n    path: ../guide.md',
    'sources:\n  - id: docs\n    title: Docs\n    repo: hypercerts-org/docs\n    ref: main\n    path: /guide.md',
    'sources:\n  - id: docs\n    title: Docs\n    repo: hypercerts-org/docs\n    ref: main\n    path: docs//guide.md',
    "sources:\n  - id: docs\n    title: Docs\n    repo: hypercerts-org/docs\n    ref: main\n    path: 'docs\\\\guide.md'",
    'sources:\n  - id: docs\n    title: One\n    repo: hypercerts-org/docs\n    ref: main\n    path: one.md\n  - id: docs\n    title: Two\n    repo: hypercerts-org/docs\n    ref: main\n    path: two.md',
  ];

  for (const value of invalidRegistries) {
    assert.throws(() => loadRegistry(value), /Invalid docs-sources.yml/);
  }
});

test('parses absent, LF, and CRLF frontmatter', () => {
  assert.deepEqual(parseMarkdownFrontmatter('# Heading'), {});
  assert.deepEqual(
    parseMarkdownFrontmatter('---\ntitle: Example\nexternalDoc: epds\n---\n'),
    { title: 'Example', externalDoc: 'epds' },
  );
  assert.deepEqual(
    parseMarkdownFrontmatter('---\r\ntitle: Example\r\nexternalDoc: epds\r\n---\r\n'),
    { title: 'Example', externalDoc: 'epds' },
  );
});

test('includes the file label in malformed frontmatter errors', () => {
  assert.throws(
    () => parseMarkdownFrontmatter('---\ntitle: [broken\n---\n', 'pages/broken.md'),
    /Invalid frontmatter in pages\/broken.md/,
  );
});

test('loads generated external content and reports missing or malformed files', () => {
  withTempFile('content.json', JSON.stringify(content), (path) => {
    assert.equal(loadExternalDocsContent(path).sources.epds.markdown, '# Canonical ePDS docs');
  });
  for (const malformed of ['{broken', '{}', '{"sources":[]}']) {
    withTempFile('content.json', malformed, (path) => {
      assert.throws(() => loadExternalDocsContent(path), /Run npm run generate:external-docs first/);
    });
  }
  assert.throws(
    () => loadExternalDocsContent(join(tmpdir(), 'missing-external-docs-content.json')),
    /Run npm run generate:external-docs first/,
  );
});

test('resolves externalDoc through the generated build snapshot', () => {
  assert.equal(resolveExternalDocSnapshot('epds', content), snapshot);
  assert.throws(() => resolveExternalDocSnapshot('missing', content), /Unknown externalDoc "missing"/);
  assert.throws(() => resolveExternalDocSnapshot(42, content), /externalDoc must be a lowercase registry id/);
  assert.throws(
    () => resolveExternalDocSnapshot('epds', { sources: { epds: { markdown: '  ' } } }),
    /has no generated Markdown/,
  );
});

test('uses external Markdown for a frontmatter-only external page', () => {
  const localMarkdown = '---\ntitle: ePDS\nexternalDoc: epds\n---\n';
  assert.deepEqual(
    resolvePageDocument({ title: 'ePDS', externalDoc: 'epds' }, localMarkdown, content, 'pages/epds.md'),
    { markdown: '# Canonical ePDS docs', externalDoc: snapshot },
  );
});

test('compiles external Markdown with local frontmatter and generated source metadata', () => {
  const localMarkdown = '---\ntitle: Local title\nexternalDoc: epds\n---\n';
  const externalContent = {
    sources: {
      epds: {
        ...snapshot,
        markdown: '---\ntitle: Upstream title\n---\n# Canonical body',
      },
    },
  };
  const compiled = compileExternalDocPage(
    { title: 'Local title', externalDoc: 'epds' },
    localMarkdown,
    externalContent,
    'pages/epds.md',
  );

  assert.deepEqual(parseMarkdownFrontmatter(compiled), {
    title: 'Local title',
    externalDoc: 'epds',
    __externalDocSource: {
      id: 'epds',
      repo: 'hypercerts-org/ePDS',
      ref: 'main',
      path: 'docs/tutorial.md',
    },
  });
  assert.match(compiled, /\n# Canonical body$/);
  assert.doesNotMatch(compiled, /Upstream title/);
});

test('compiles CRLF external pages and strips CRLF snapshot frontmatter', () => {
  const localMarkdown = '---\r\ntitle: Local title\r\nexternalDoc: epds\r\n---\r\n';
  const externalContent = {
    sources: {
      epds: {
        ...snapshot,
        markdown: '---\r\ntitle: Upstream title\r\n---\r\n# Canonical body',
      },
    },
  };
  const frontmatter = parseMarkdownFrontmatter(localMarkdown);
  const compiled = compileExternalDocPage(
    frontmatter,
    localMarkdown,
    externalContent,
    'pages/epds.md',
  );

  assert.equal(frontmatter.externalDoc, 'epds');
  assert.match(compiled, /\n# Canonical body$/);
  assert.doesNotMatch(compiled, /Upstream title/);
});

test('leaves ordinary local pages unchanged', () => {
  const localMarkdown = '---\ntitle: Local\n---\n# Local page';
  assert.deepEqual(
    resolvePageDocument({ title: 'Local' }, localMarkdown, content),
    { markdown: localMarkdown, externalDoc: null },
  );
});

test('rejects stale local fallback content on external pages', () => {
  const localMarkdown = '---\ntitle: ePDS\nexternalDoc: epds\n---\n# Stale fallback';
  assert.throws(
    () => resolvePageDocument({ title: 'ePDS', externalDoc: 'epds' }, localMarkdown, content, 'pages/epds.md'),
    /pages\/epds.md sets externalDoc and must not contain a local Markdown body/,
  );
});
