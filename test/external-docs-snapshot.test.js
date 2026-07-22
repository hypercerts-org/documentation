const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildFingerprintDocument,
  collectSourceSnapshot,
  sha256,
} = require('../lib/external-docs-snapshot');

function response({ ok = true, status = 200, statusText = 'OK', text = '', json }) {
  return {
    ok,
    status,
    statusText,
    text: async () => text,
    json: async () => json,
  };
}

const source = {
  id: 'epds',
  title: 'ePDS',
  repo: 'hypercerts-org/ePDS',
  ref: 'main',
  path: 'docs/tutorial.md',
};

test('build fingerprint uses the exact Markdown snapshot fetched for rendering', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  let upstreamMarkdown = '# Version A';
  let contentFetches = 0;

  global.fetch = async (url) => {
    if (String(url).includes('/commits?')) {
      return response({ json: [{ commit: { committer: { date: '2026-07-13T00:00:00Z' } } }] });
    }
    contentFetches += 1;
    return response({ text: upstreamMarkdown });
  };

  const snapshot = await collectSourceSnapshot(source);
  upstreamMarkdown = '# Version B';
  const fingerprint = buildFingerprintDocument([snapshot]);

  assert.equal(contentFetches, 1);
  assert.equal(snapshot.markdown, '# Version A');
  assert.equal(snapshot.contentHash, sha256('# Version A'));
  assert.notEqual(snapshot.contentHash, sha256(upstreamMarkdown));
  assert.equal(snapshot.updatedAt, '2026-07-13T00:00:00Z');
  assert.equal(fingerprint.sources.epds.contentHash, sha256('# Version A'));
});

test('fails when the registered Markdown file cannot be fetched', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });

  global.fetch = async (url) => {
    if (String(url).includes('/commits?')) {
      return response({ json: [] });
    }
    return response({ ok: false, status: 404, statusText: 'Not Found', text: 'missing' });
  };

  await assert.rejects(
    () => collectSourceSnapshot(source),
    /returned 404 Not Found.*Check repo, ref, path, and DOCS_SOURCE_TOKEN/,
  );
});

test('fails when the registered Markdown file is empty', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });

  global.fetch = async (url) => {
    if (String(url).includes('/commits?')) {
      return response({ json: [] });
    }
    return response({ text: '   \n' });
  };

  await assert.rejects(() => collectSourceSnapshot(source), /External doc "epds".*is empty/);
});

test('informational timestamps do not affect combined fingerprints', () => {
  const base = {
    ...source,
    size: 6,
    contentHash: sha256('# Docs'),
    markdown: '# Docs',
  };

  const first = buildFingerprintDocument([{ ...base, updatedAt: '2026-01-01T00:00:00Z' }]);
  const second = buildFingerprintDocument([{ ...base, updatedAt: '2026-07-01T00:00:00Z' }]);
  assert.equal(first.combinedFingerprint, second.combinedFingerprint);
});

test('registry ordering does not affect the combined fingerprint', () => {
  const first = {
    ...source,
    size: 3,
    contentHash: sha256('# A'),
    markdown: '# A',
  };
  const second = {
    id: 'hyperindex',
    title: 'Hyperindex',
    repo: 'gainforest/hyperindex',
    ref: 'main',
    path: 'docs/hyperindex.md',
    size: 3,
    contentHash: sha256('# B'),
    markdown: '# B',
  };

  assert.equal(
    buildFingerprintDocument([first, second]).combinedFingerprint,
    buildFingerprintDocument([second, first]).combinedFingerprint,
  );
});
