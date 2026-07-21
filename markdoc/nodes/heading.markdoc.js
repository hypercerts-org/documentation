import { Tag, nodes } from "@markdoc/markdoc";

const headingIdsByPage = new WeakMap();

function getHeadingText(node) {
  return Array.from(node.walk())
    .filter((child) => child.type === "text" || child.type === "code")
    .map((child) => child.attributes.content || "")
    .join("");
}

function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "section";
}

function getUniqueId(config, baseId) {
  const page = config.variables?.markdoc || config;
  let usedIds = headingIdsByPage.get(page);
  if (!usedIds) {
    usedIds = new Set();
    headingIdsByPage.set(page, usedIds);
  }

  let id = baseId;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

const heading = {
  ...nodes.heading,
  attributes: {
    ...nodes.heading.attributes,
    id: { type: String },
  },
  transform(node, config) {
    const baseId = node.attributes.id || generateId(getHeadingText(node));
    const id = getUniqueId(config, baseId);

    return new Tag(
      "Heading",
      { level: node.attributes.level, id },
      node.transformChildren(config),
    );
  },
};

export default heading;
