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

test('published stable release metadata is captured in the build snapshot', async context => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  global.fetch = async url => String(url).endsWith('/releases/latest')
    ? response({ json: { tag_name: 'v1.4.12', published_at: '2026-09-01T00:00:00Z', draft: false, prerelease: false } })
    : String(url).includes('/commits?') ? response({ json: [] }) : response({ text: '# Changelog' });
  const snapshot = await collectSourceSnapshot({ ...source, trackRelease: true });
  assert.equal(snapshot.release.version, '1.4.12');
  assert.equal(snapshot.release.url, 'https://github.com/hypercerts-org/ePDS/releases/tag/v1.4.12');
});

test('tracks the API release behind its scoped package tag among the repository\'s other packages', async context => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  const apiSource = {
    id: 'api-changelog',
    title: 'Hypercerts API changelog',
    repo: 'hypercerts-org/api',
    ref: 'main',
    path: 'happyview-modules/CHANGELOG.md',
    trackRelease: true,
    releaseTagPrefix: '@hypercerts-org/happyview-modules@',
  };
  const release = (tag, extra = {}) => ({ tag_name: tag, published_at: '2026-11-03T09:22:45Z', draft: false, prerelease: false, ...extra });
  const snapshotFor = releases => {
    global.fetch = async url => String(url).includes('/releases?')
      ? response({ json: releases })
      : String(url).includes('/commits?') ? response({ json: [] }) : response({ text: '# @hypercerts-org/happyview-modules\n\n## 0.3.0' });
    return collectSourceSnapshot(apiSource);
  };

  // The repository's newest release belongs to another package; the API's is found by its prefix.
  const snapshot = await snapshotFor([
    release('@hypercerts-org/api@0.1.0'),
    release('@hypercerts-org/happyview-modules@0.4.0-beta.1', { prerelease: true }),
    release('@hypercerts-org/happyview-modules@0.3.0'),
    release('@hypercerts-org/hypercerts-api@0.2.0'),
  ]);
  assert.equal(snapshot.release.version, '0.3.0');
  assert.equal(snapshot.release.url, 'https://github.com/hypercerts-org/api/releases/tag/%40hypercerts-org%2Fhappyview-modules%400.3.0');
  assert.equal(snapshot.path, 'happyview-modules/CHANGELOG.md');
  assert.equal(await snapshotFor([]).then(item => item.release), null);
  await assert.rejects(() => snapshotFor([release('@hypercerts-org/api@0.1.0')]), /No stable release of api-changelog/);
  await assert.rejects(() => snapshotFor([release('@hypercerts-org/happyview-modules@0.3')]), /stable semantic release tag/);
});

test('an accessible repository without a GitHub release is explicitly unreleased', async context => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  global.fetch = async url => String(url).endsWith('/releases/latest')
    ? response({ ok: false, status: 404 })
    : String(url).includes('/commits?') ? response({ json: [] }) : response({ text: '# Changelog' });
  assert.equal((await collectSourceSnapshot({ ...source, trackRelease: true })).release, null);
});

test('failed release requests and unstable tags cannot silently become version badges', async context => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  for (const failure of [response({ ok: false, status: 403 }), response({ ok: false, status: 500 }), response({ json: { tag_name: 'v1.5.0-beta.1', prerelease: true } })]) {
    global.fetch = async url => String(url).endsWith('/releases/latest') ? failure
      : String(url).includes('/commits?') ? response({ json: [] }) : response({ text: '# Changelog' });
    await assert.rejects(() => collectSourceSnapshot({ ...source, trackRelease: true }), /Release metadata|stable semantic/);
  }
});

test('publishing a release changes the refresh fingerprint even if Markdown is unchanged', () => {
  const snapshot = { ...source, trackRelease: true, contentHash: sha256('# Changelog'), release: null };
  const published = { ...snapshot, release: { version: '1.4.1', tag: 'v1.4.1', url: 'https://github.com/hypercerts-org/example/releases/tag/v1.4.1', publishedAt: '2026-09-01T00:00:00Z' } };
  assert.notEqual(buildFingerprintDocument([snapshot]).combinedFingerprint, buildFingerprintDocument([published]).combinedFingerprint);
});
