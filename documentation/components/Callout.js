import React from 'react';

const typeStyles = {
  info: { borderColor: '#0570de', backgroundColor: '#f0f7ff' },
  warning: { borderColor: '#c84801', backgroundColor: '#fef9f0' },
  danger: { borderColor: '#df1b41', backgroundColor: '#fef0f4' },
  success: { borderColor: '#228403', backgroundColor: '#f0fef0' },
};

export function Callout({ type = 'info', title, children }) {
  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div
      className="callout"
      style={{
        borderLeft: `4px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        borderRadius: '0 6px 6px 0',
        padding: '16px',
        margin: '16px 0',
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 600,
            marginBottom: '4px',
            color: '#353a44',
          }}
        >
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
