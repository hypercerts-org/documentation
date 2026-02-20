import React from 'react';

export function Callout({ type = 'info', title, children }) {
  const typeClass = `callout--${type}`;

  return (
    <div className={`callout ${typeClass}`}>
      {title && <div className="callout-title">{title}</div>}
      <div className="callout-body">{children}</div>
    </div>
  );
}
