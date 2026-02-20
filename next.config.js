const withMarkdoc = require('@markdoc/next.js');

module.exports = withMarkdoc({ mode: 'static' })({
  output: 'export',
  pageExtensions: ['md', 'mdoc', 'js', 'jsx', 'ts', 'tsx'],
});
