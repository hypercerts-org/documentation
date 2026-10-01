import { useState } from 'react';
import { Highlight } from 'prism-react-renderer';

const LANGUAGE_LABELS = {
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  bash: 'Terminal',
  shell: 'Terminal',
  json: 'JSON',
  jsx: 'JSX',
  tsx: 'TSX',
  css: 'CSS',
  html: 'HTML',
  markdown: 'Markdown',
  text: 'Text',
};

/**
 * Syntax colours from the design system's text layer: ink, muted grey, and the one accent.
 * The values are CSS variables, so the theme follows light and dark mode.
 */
const codeTheme = {
  plain: { color: 'var(--color-code-text)', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--color-code-muted)', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--color-code-muted)' } },
    { types: ['string', 'char', 'attr-value', 'template-string', 'inserted'], style: { color: 'var(--color-accent)' } },
    { types: ['keyword', 'tag', 'selector', 'important', 'atrule', 'builtin'], style: { color: 'var(--color-code-text)', fontWeight: '600' } },
    { types: ['number', 'boolean', 'constant', 'symbol', 'deleted'], style: { color: 'var(--color-accent)' } },
    { types: ['property', 'attr-name', 'function', 'class-name', 'variable'], style: { color: 'var(--color-code-text)' } },
  ],
};

function getLangLabel(language) {
  const key = (language || '').toLowerCase();
  return LANGUAGE_LABELS[key] || language || 'Code';
}

export function CodeBlock({ content, language, children }) {
  const [copied, setCopied] = useState(false);
  const code = (content || children || '').replace(/\n$/, '');
  const label = getLangLabel(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="codeblock">
      <div className="codeblock-header">
        <span className="codeblock-lang-label">{label}</span>
        <button
          className="codeblock-copy"
          onClick={handleCopy}
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8.5l3 3 7-7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="5"
                y="5"
                width="8"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 10.5V3a1.5 1.5 0 011.5-1.5H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
      <Highlight theme={codeTheme} code={code} language={language || 'text'}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="codeblock-pre">
            <code>
              {tokens.map((line, i) => {
                const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
                return (
                  <span key={lineKey} {...lineProps}>
                    {line.map((token, j) => {
                      const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key: j });
                      return <span key={tokenKey} {...tokenProps} />;
                    })}
                    {'\n'}
                  </span>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
