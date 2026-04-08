import { useState } from 'react';
import { useRouter } from 'next/router';

function getRawUrl(currentPath) {
  if (currentPath === '/') return '/raw/index.md';
  return `/raw${currentPath}.md`;
}

export function CopyRawButton() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0] || '/';
  const rawUrl = getRawUrl(currentPath);

  const handleCopy = async () => {
    setIsCopying(true);

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('Failed to load raw markdown');

      const raw = await response.text();

      try {
        await navigator.clipboard.writeText(raw);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = raw;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopyError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setCopied(false);
      setTimeout(() => setCopyError(false), 2000);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="page-tools" aria-label="Page tools">
      <button
        className="page-tools-button"
        onClick={handleCopy}
        type="button"
        disabled={isCopying}
      >
        <svg
          className="page-tools-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>{isCopying ? 'Copying...' : copied ? 'Copied' : copyError ? 'Copy failed' : 'Copy raw'}</span>
      </button>
      <a
        className="page-tools-link"
        href={rawUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="page-tools-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M14 5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 14 19 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 13v5a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>View raw</span>
      </a>
    </div>
  );
}
