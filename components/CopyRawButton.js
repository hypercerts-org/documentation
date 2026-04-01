import { useState } from 'react';
import { useRouter } from 'next/router';

function getRawUrl(currentPath) {
  if (currentPath === '/') return '/raw/index.md';
  return `/raw${currentPath}.md`;
}

export function CopyRawButton() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0] || '/';
  const rawUrl = getRawUrl(currentPath);

  const handleCopy = async () => {
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
    }
  };

  return (
    <div className="page-tools" aria-label="Page tools">
      <button
        className="page-tools-button"
        onClick={handleCopy}
        type="button"
      >
        {copied ? 'Copied' : copyError ? 'Copy failed' : 'Copy raw'}
      </button>
      <a
        className="page-tools-link"
        href={rawUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        View raw
      </a>
    </div>
  );
}
