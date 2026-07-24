const withMarkdoc = require('@markdoc/next.js');

module.exports = withMarkdoc({ mode: 'static' })({
  output: 'export',
  pageExtensions: ['md', 'mdoc', 'js', 'jsx', 'ts', 'tsx'],
  /**
   * Preprocess Markdown pages with external-document snapshots before Markdoc compilation.
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.(md|mdoc)$/,
      enforce: 'pre',
      use: [require.resolve('./lib/external-docs-loader')],
    });
    return config;
  },
});
