/** Markdoc configuration for the documentation landing hero rendered by DocsHero. */
module.exports = {
  render: 'DocsHero',
  attributes: {
    eyebrow: { type: String },
    title: { type: String, required: true },
    turn: { type: String },
  },
};
