const Markdoc = require("@markdoc/markdoc");

module.exports = {
  render: "HeroBanner",
  attributes: {
    title: { type: String },
    "cta-href": { type: String },
    "cta-text": { type: String },
  },
  transform(node, config) {
    const attrs = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Markdoc.Tag(
      "HeroBanner",
      {
        title: attrs.title,
        ctaHref: attrs["cta-href"],
        ctaText: attrs["cta-text"],
      },
      children
    );
  },
};
