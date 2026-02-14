import React from 'react';

export function Figure({ src, alt = '', caption }) {
  return (
    <figure className="figure" style={{ textAlign: 'center', margin: '24px 0' }}>
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }}
      />
      {caption && (
        <figcaption
          className="figure-caption"
          style={{ fontSize: '13px', color: '#687385', marginTop: '8px' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
