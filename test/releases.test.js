const assert = require('node:assert/strict');
const test = require('node:test');
const { buildReleaseCatalog, expandReleaseMarkdown } = require('../lib/releases');
const { resolvePageDocument } = require('../lib/external-doc-page');
const { compileExternalDocPage } = require('../lib/external-docs-loader');
const history = require('../lib/protocol-releases.json');
const components = require('../lib/release-components.json');

function sources() {
  return components.filter(component => component.sourceId).map(component => ({
    id: component.sourceId,
    repo: `hypercerts-org/${component.id}`,
    ref: 'main',
    path: 'CHANGELOG.md',
    trackRelease: true,
    release: component.id === 'relay' ? null : {
      version: component.id === 'lexicons' ? '1.4.12' : '0.6.0',
      url: 'https://github.com/hypercerts-org/example/releases/tag/v0.6.0',
      publishedAt: '2026-09-01T00:00:00Z',
    },
  }));
}

test('component versions are independent of the protocol line and missing releases are explicit', () => {
  const catalog = buildReleaseCatalog(history, components, sources());
  assert.equal(catalog.protocol[0].version, '1.4');
  const byId = Object.fromEntries(catalog.components.map(component => [component.id, component]));
  assert.equal(byId.lexicons.label, 'v1.4.12');
  assert.equal(byId.lexicons.aligned, true);
  assert.equal(byId.cgs.label, 'v0.6.0');
  assert.equal(byId.cgs.aligned, false);
  for (const id of ['api', 'sdk', 'entryway', 'relay']) {
    assert.equal(byId[id].version, null);
    assert.equal(byId[id].label, 'Under development');
  }
  assert(byId.relay.changelogUrl);
  assert.equal(byId.sdk.changelogUrl, null);
});

test('registered component changelogs must be available and release-tracked', () => {
  assert.throws(() => buildReleaseCatalog(history, components, []), /Missing release-tracked source/);
  assert.throws(() => buildReleaseCatalog(history, components, sources().map(source => ({ ...source, trackRelease: false }))), /Missing release-tracked source/);
});

test('history keeps protocol lines distinct from component patch releases', () => {
  assert.deepEqual(history.map(release => release.version), ['1.4', '1.3', '1.2', '1.1', '1.0']);
  assert.throws(() => buildReleaseCatalog([...history, history[0]], components, sources()), /duplicate/);
  assert.throws(() => buildReleaseCatalog([{ ...history[0], sourceVersion: '1.3.1' }], components, sources()), /source version/);
});

test('release markers expand for page rendering, search, and raw Markdown through the shared resolver', () => {
  const catalog = buildReleaseCatalog(history, components, sources());
  const markdown = '{% protocol-title /%}\n\n{% release-summary /%}\n\n{% release-cards /%}\n\n{% protocol-history /%}\n';
  const result = resolvePageDocument({}, markdown, { releases: catalog }).markdown;
  assert.doesNotMatch(result, /{% (?:release-|protocol-)/);
  assert.match(result, /Hypercerts Protocol 1\.4/);
  assert.match(result, /badge="v1\.4\.12"/);
  assert.match(result, /title="Hypercerts Protocol" href="\/changes\/protocol" badge="v1\.4"/);
  assert(result.includes(history[0].cardSummary));
  assert.match(result, /badge="v0\.6\.0"/);
  assert.match(result, /badge="Under development"/);
  assert.match(result, /## 1\.0: First stable/);
  assert.doesNotMatch(result, /Read the release article/);
  assert.equal(expandReleaseMarkdown('# Ordinary page'), '# Ordinary page');
  assert.throws(() => expandReleaseMarkdown(markdown), /Missing release catalog/);
  const summary = expandReleaseMarkdown('{% release-summary /%}', catalog);
  assert.doesNotMatch(summary, /Read the protocol changelog|Lexicons 1\.4\.0 release/);
  const fullHistory = expandReleaseMarkdown('{% protocol-history /%}', catalog);
  assert.match(fullHistory, /Based on \[Lexicons 1\.4\.0\]/);
});

test('a later component patch updates badges without rewriting protocol history', () => {
  const before = buildReleaseCatalog(history, components, sources());
  const updated = sources();
  updated[0].release.version = '1.4.35';
  const after = buildReleaseCatalog(history, components, updated);
  assert.equal(expandReleaseMarkdown('{% protocol-history /%}', before), expandReleaseMarkdown('{% protocol-history /%}', after));
  assert.notEqual(expandReleaseMarkdown('{% release-cards /%}', before), expandReleaseMarkdown('{% release-cards /%}', after));
});

test('upstream changelog bodies are not expanded as local release instructions', () => {
  const content = { sources: { example: { id: 'example', repo: 'hypercerts-org/example', ref: 'main', path: 'CHANGELOG.md', markdown: '# Upstream\n{% release-summary /%}' } } };
  const output = compileExternalDocPage({ externalDoc: 'example' }, '---\nexternalDoc: example\n---\n', content, 'example.md');
  assert.match(output, /{% release-summary \/%}/);
});
