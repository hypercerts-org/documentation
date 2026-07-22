import Markdoc, { Tag, nodes } from '@markdoc/markdoc';

/**
 * Format a Markdoc validation result with its one-based source line when available.
 */
function formatValidationError(validation) {
  const line = validation.lines?.[0];
  const location = Number.isInteger(line) ? `line ${line + 1}: ` : '';
  return `${location}${validation.error.message}`;
}

/** Markdoc document node that validates external pages and provides source context to child nodes. */
const document = {
  ...nodes.document,
  /**
   * Transform a document while rejecting invalid external Markdoc and preserving normal local rendering.
   */
  transform(node, config) {
    const frontmatter = config.variables?.markdoc?.frontmatter || {};
    const source = frontmatter.__externalDocSource;
    if (!source) {
      return new Tag('article', {}, node.transformChildren(config));
    }

    const validationErrors = Markdoc.validate(node, config)
      .filter((validation) => validation.error.level !== 'warning');
    if (validationErrors.length > 0) {
      const details = validationErrors.map(formatValidationError).join('; ');
      throw new Error(`External doc "${source.id}" contains invalid Markdoc. ${details}`);
    }

    const externalConfig = {
      ...config,
      variables: {
        ...config.variables,
        externalDocSource: source,
      },
    };

    return new Tag('article', {}, node.transformChildren(externalConfig));
  },
};

export default document;
