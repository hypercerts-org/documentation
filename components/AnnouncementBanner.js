import { useState, useEffect } from 'react';
import Link from 'next/link';

const BANNER_ID = 'lexicon-v0.11.0';

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(`banner-dismissed-${BANNER_ID}`);
    if (!stored) setDismissed(false);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem(`banner-dismissed-${BANNER_ID}`, 'true');
  };

  if (dismissed) return null;

  return (
    <div className="announcement-banner">
      <div className="announcement-banner-inner">
        <span className="announcement-banner-date">April 8, 2026</span>
        <span className="announcement-banner-text">
          <strong>hypercerts-lexicon v0.11.0</strong> — breaking changes to evaluation scores, badge references, and funding receipts.{' '}
          <a href="https://github.com/hypercerts-org/hypercerts-lexicon/releases/tag/v0.11.0" className="announcement-banner-link" target="_blank" rel="noopener noreferrer">
            Read the release notes&nbsp;&rarr;
          </a>
        </span>
        <button
          className="announcement-banner-close"
          onClick={dismiss}
          aria-label="Dismiss banner"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
