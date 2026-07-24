import { Tag, nodes } from '@markdoc/markdoc';
import externalDocLinks from '../../lib/external-doc-links';

const { resolveExternalDocHref } = externalDocLinks;

const link = {
  ...nodes.link,
  render: 'Link',
  /**
   * Rewrite external relative links to GitHub while preserving standard local-page link rendering.
   */
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const source = config.variables?.externalDocSource;
    return new Tag(
      'Link',
      {
        ...attributes,
        href: source ? resolveExternalDocHref(attributes.href, source) : attributes.href,
      },
      node.transformChildren(config),
    );
  },
};

export default link;
