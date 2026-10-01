const assert = require('node:assert/strict');
const test = require('node:test');
const Markdoc = require('@markdoc/markdoc');
const text = require('../markdoc/nodes/text.markdoc');
const { resolveExternalDocHref, resolveExternalDocImageSrc } = require('../lib/external-doc-links');

test('root-level changelog relative links stay within the source repository and ref', () => {
  const source = { repo: 'hypercerts-org/certified-group-service', ref: 'main', path: 'CHANGELOG.md' };
  assert.equal(resolveExternalDocHref('../docs/api-reference.md#ownership-transfer', source), 'https://github.com/hypercerts-org/certified-group-service/blob/main/docs/api-reference.md#ownership-transfer');
  assert.equal(resolveExternalDocImageSrc('../images/example.png', source), 'https://raw.githubusercontent.com/hypercerts-org/certified-group-service/main/images/example.png');
});

test('explicit changelog anchors render safely and code examples remain literal', () => {
  const config = { nodes: { text }, variables: { externalDocSource: { repo: 'hypercerts-org/example' } } };
  const markdown = '- <a id="v0.6.0-ownership"></a> Ownership transfer\n\n`<a id="example"></a>`\n\n<a id="unsafe" onclick="bad()"></a>';
  const html = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(markdown), config));
  assert.match(html, /<span id="v0.6.0-ownership"><\/span>/);
  assert.doesNotMatch(html, /<a id="unsafe"/);
  assert.doesNotMatch(html, /<span id="example"/);
});
