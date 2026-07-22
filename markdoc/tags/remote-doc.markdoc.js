/**
 * Markdoc tag for rendering canonical Markdown from a registered Hypercerts GitHub repo at browser runtime.
 * The source can be a docs-sources.yml id such as "epds" or a direct hypercerts-org GitHub Markdown URL.
 */
module.exports = {
  render: 'RemoteMarkdown',
  attributes: {
    source: {
      type: String,
      required: true,
    },
  },
};
