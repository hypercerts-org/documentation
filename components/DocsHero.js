import React from 'react';
import { Eyebrow, Heading } from '@hypercerts-org/ui-react';

/**
 * The documentation landing hero: eyebrow, a heading that turns from roman to italic,
 * and a standfirst, on the warm ground with one guilloche cropped past the edge.
 */
export function DocsHero({ eyebrow, title, turn, children }) {
  return (
    <header className="docs-hero">
      <img className="docs-hero-ornament" src="/images/ornament/guilloche_01.svg" alt="" aria-hidden="true" />
      <div className="docs-hero-content">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading level={1} size="display-3" turn={turn} className="docs-hero-heading">
          {title}
        </Heading>
        <div className="docs-hero-standfirst">{children}</div>
      </div>
    </header>
  );
}
