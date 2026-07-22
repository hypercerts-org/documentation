/**
 * Markdoc tag for rendering canonical Markdown from a Hypercerts GitHub repo at browser runtime.
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
