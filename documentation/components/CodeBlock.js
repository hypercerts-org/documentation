import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

const LANGUAGE_META = {
  typescript: { label: 'TypeScript', color: '#3178c6' },
  javascript: { label: 'JavaScript', color: '#f0db4f' },
  bash: { label: 'Terminal', color: '#4eaa25' },
  shell: { label: 'Terminal', color: '#4eaa25' },
  json: { label: 'JSON', color: '#a0a0a0' },
  jsx: { label: 'JSX', color: '#61dafb' },
  tsx: { label: 'TSX', color: '#3178c6' },
  css: { label: 'CSS', color: '#264de4' },
  html: { label: 'HTML', color: '#e34c26' },
  markdown: { label: 'Markdown', color: '#a0a0a0' },
};

function getLangMeta(language) {
  const key = (language || '').toLowerCase();
  return LANGUAGE_META[key] || { label: language || 'Code', color: '#6b7280' };
}

export function CodeBlock({ content, language, children }) {
  const [copied, setCopied] = useState(false);
  const code = (content || children || '').replace(/\n$/, '');
  const meta = getLangMeta(language);

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
        <div className="codeblock-lang">
          <span
            className="codeblock-lang-dot"
            style={{ backgroundColor: meta.color }}
          />
          <span className="codeblock-lang-label">{meta.label}</span>
        </div>
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
      <Highlight theme={themes.nightOwl} code={code} language={language || 'text'}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="codeblock-pre">
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                return (
                  <span key={i} {...lineProps}>
                    {line.map((token, j) => (
                      <span key={j} {...getTokenProps({ token, key: j })} />
                    ))}
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
