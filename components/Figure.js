import React from 'react';

export function Figure({ src, alt = '', caption }) {
  return (
    <figure className="figure">
      <img src={src} alt={alt} />
      {caption && <figcaption className="figure-caption">{caption}</figcaption>}
    </figure>
  );
}
