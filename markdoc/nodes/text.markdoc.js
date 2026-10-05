const { nodes, Tag } = require('@markdoc/markdoc');

/** Preserve safe empty HTML anchors used by upstream changelogs without rendering arbitrary HTML. */
module.exports = {
  ...nodes.text,
  transform(node, config) {
    const text = node.attributes.content;
    if (!config.variables?.externalDocSource) return text;
    const parts = [];
    let offset = 0;
    for (const match of text.matchAll(/<a id="([A-Za-z][A-Za-z0-9_.:-]*)"><\/a>/g)) {
      parts.push(text.slice(offset, match.index), new Tag('span', { id: match[1] }, []));
      offset = match.index + match[0].length;
    }
    return parts.length ? [...parts, text.slice(offset)] : text;
  },
};
