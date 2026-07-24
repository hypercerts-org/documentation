const assert = require('node:assert/strict');
const test = require('node:test');
const {
  resolveExternalDocHref,
  resolveExternalDocImageSrc,
} = require('../lib/external-doc-links');

const source = {
  repo: 'hypercerts-org/ePDS',
  ref: 'main',
  path: 'docs/tutorial.md',
};

test('leaves anchors, site paths, and absolute URLs unchanged', () => {
  for (const href of ['#section', '/reference/faq', 'https://example.com/docs', 'mailto:docs@example.com']) {
    assert.equal(resolveExternalDocHref(href, source), href);
  }
});

test('resolves relative files and directories to GitHub', () => {
  assert.equal(
    resolveExternalDocHref('./other.md?plain=1#section', source),
    'https://github.com/hypercerts-org/ePDS/blob/main/docs/other.md?plain=1#section',
  );
  assert.equal(
    resolveExternalDocHref('../packages/demo', source),
    'https://github.com/hypercerts-org/ePDS/tree/main/packages/demo',
  );
});

test('resolves relative images to raw GitHub content', () => {
  assert.equal(
    resolveExternalDocImageSrc('./images/architecture.png', source),
    'https://raw.githubusercontent.com/hypercerts-org/ePDS/main/docs/images/architecture.png',
  );
  assert.equal(resolveExternalDocImageSrc('/images/local.png', source), '/images/local.png');
});
