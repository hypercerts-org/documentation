import React from 'react';

export function Column({ children }) {
  return (
    <div className="column" style={{ flex: 1, minWidth: 0 }}>
      {children}
    </div>
  );
}
