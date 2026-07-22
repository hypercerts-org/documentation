import { Tag, nodes } from '@markdoc/markdoc';
import externalDocLinks from '../../lib/external-doc-links';

const { resolveExternalDocImageSrc } = externalDocLinks;

/** Markdoc image node that resolves relative images from external documentation repositories. */
const image = {
  ...nodes.image,
  /**
   * Rewrite external relative image sources while leaving local and absolute sources unchanged.
   */
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const source = config.variables?.externalDocSource;
    return new Tag('img', {
      ...attributes,
      src: source ? resolveExternalDocImageSrc(attributes.src, source) : attributes.src,
    });
  },
};

export default image;
