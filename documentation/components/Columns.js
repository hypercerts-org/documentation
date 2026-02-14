import React from 'react';

export function Columns({ gap = '24px', children }) {
  return (
    <div className="columns" style={{ display: 'flex', gap, margin: '16px 0' }}>
      {children}
    </div>
  );
}
