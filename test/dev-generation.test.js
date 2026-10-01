const assert = require('node:assert/strict');
const test = require('node:test');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { getGitHubToken } = require('../lib/github-auth');
const { sha256 } = require('../lib/external-docs-snapshot');
const { readCompatibleSnapshot, loadExternalSnapshots } = require('../lib/external-docs-cache');

const source = { id: 'test', title: 'Test', repo: 'hypercerts-org/example', ref: 'main', path: 'CHANGELOG.md', trackRelease: true };
const snapshot = { ...source, markdown: '# Changelog', contentHash: sha256('# Changelog'), release: null };
const cached = { schemaVersion: 1, generatedAt: '2026-09-01T00:00:00Z', sources: { test: snapshot } };
function cacheFile(context, content = cached) {
  const directory = mkdtempSync(join(tmpdir(), 'docs-dev-cache-'));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, 'snapshot.json');
  writeFileSync(file, JSON.stringify(content));
  return file;
}

test('explicit credentials take precedence without invoking gh', () => {
  const noCli = () => { throw new Error('gh must not be invoked'); };
  assert.equal(getGitHubToken({ DOCS_SOURCE_TOKEN: ' docs ', GITHUB_TOKEN: 'github', GH_TOKEN: 'gh' }, noCli), 'docs');
  assert.equal(getGitHubToken({ DOCS_SOURCE_TOKEN: ' ', GITHUB_TOKEN: 'github', GH_TOKEN: 'gh' }, noCli), 'github');
  assert.equal(getGitHubToken({ GH_TOKEN: 'gh' }, noCli), 'gh');
});

test('local fetches can reuse gh credentials with stdout captured and stderr suppressed', () => {
  let invoked = false;
  const value = getGitHubToken({}, (command, args, options) => {
    invoked = true;
    assert.equal(command, 'gh');
    assert.deepEqual(args, ['auth', 'token', '--hostname', 'github.com']);
    assert.deepEqual(options.stdio, ['ignore', 'pipe', 'ignore']);
    assert.equal(options.timeout, 5000);
    return 'local-test-token\n';
  });
  assert(invoked);
  assert.equal(value, 'local-test-token');
});

test('CI does not consult gh and a missing local CLI is handled', () => {
  let invoked = false;
  assert.equal(getGitHubToken({ CI: 'true' }, () => { invoked = true; }), '');
  assert.equal(invoked, false);
  assert.equal(getGitHubToken({}, () => { throw new Error('no gh'); }), '');
});

test('development startup reuses a matching snapshot without any auth or network lookup', async context => {
  const file = cacheFile(context);
  const forbidden = () => { assert.fail('No network or credential lookup on cache hit'); };
  const result = await loadExternalSnapshots([source], { preferCache: true, file, collect: forbidden, getToken: forbidden });
  assert.equal(result.reused, true);
  assert.equal(result.generatedAt, cached.generatedAt);
  assert.deepEqual(result.snapshots, [snapshot]);
});

test('production and explicit refresh fetch fresh content even when a cache exists', async context => {
  const file = cacheFile(context);
  let requests = 0;
  const result = await loadExternalSnapshots([source], {
    file,
    getToken: () => 'test-token',
    collect: async (sources, token) => {
      requests++;
      assert.equal(token, 'test-token');
      assert.deepEqual(sources, [source]);
      return [{ ...snapshot, markdown: '# Fresh content' }];
    },
  });
  assert.equal(requests, 1);
  assert.equal(result.reused, false);
  assert.equal(result.snapshots[0].markdown, '# Fresh content');
});

test('cache invalidates when registry identity or release tracking changes', context => {
  const file = cacheFile(context);
  for (const change of [{ ref: 'v2' }, { path: 'docs/CHANGELOG.md' }, { repo: 'hypercerts-org/other' }, { title: 'Other' }, { trackRelease: false }]) {
    assert.equal(readCompatibleSnapshot([{ ...source, ...change }], file), null);
  }
  assert.equal(readCompatibleSnapshot([], file), null);
});

test('incomplete, corrupted, or pre-release-metadata snapshots are not reused', context => {
  for (const content of [
    { ...cached, sources: {} },
    { ...cached, sources: { test: { ...snapshot, markdown: '# Changed' } } },
    { ...cached, sources: { test: { ...snapshot, release: undefined } } },
    { ...cached, sources: { test: { ...snapshot, release: { version: '1.0.0-beta' } } } },
    { ...cached, generatedAt: 'invalid' },
  ]) {
    assert.equal(readCompatibleSnapshot([source], cacheFile(context, content)), null);
  }
  const file = cacheFile(context);
  writeFileSync(file, '{incomplete');
  assert.equal(readCompatibleSnapshot([source], file), null);
});

test('a cold dev start fetches, and a failed fresh fetch never silently falls back', async context => {
  const file = cacheFile(context, {});
  let requested = false;
  const result = await loadExternalSnapshots([source], { preferCache: true, file, getToken: () => '', collect: async () => { requested = true; return [snapshot]; } });
  assert(requested);
  assert.equal(result.reused, false);
  await assert.rejects(() => loadExternalSnapshots([source], {
    file: cacheFile(context),
    getToken: () => '',
    collect: async () => { throw new Error('rate limited'); },
  }), /rate limited/);
});
