import React from 'react';
import { Banner } from '@hypercerts-org/ui-react';

const TONES = { info: 'info', note: 'info', warning: 'warning', danger: 'danger', success: 'success' };

/** A callout in page content, rendered with the design system's Banner. */
export function Callout({ type = 'info', title, children }) {
  return (
    <Banner tone={TONES[type] || 'info'} title={title} className="callout">
      {children}
    </Banner>
  );
}
