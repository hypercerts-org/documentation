import { Tag } from "@markdoc/markdoc";

/**
 * Normalize a fence language declaration to the first lowercase language token.
 */
function getFenceLanguage(language) {
  return String(language || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)[0];
}

const fence = {
  render: "CodeBlock",
  attributes: {
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    process: {
      type: Boolean,
      render: false,
      default: true,
    },
  },
  /**
   * Route Mermaid fences to the diagram component and preserve the normal code-block path for other languages.
   */
  transform(node, config) {
    const attributes = node.transformAttributes(config);

    if (getFenceLanguage(attributes.language) === "mermaid") {
      return new Tag("MermaidDiagram", {
        chart: attributes.content,
      });
    }

    return new Tag("CodeBlock", attributes);
  },
};

export default fence;
