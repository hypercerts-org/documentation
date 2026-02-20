import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { flattenNavigation } from '../lib/navigation';

export function SearchDialog({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();
  const allPages = flattenNavigation();

  // Filter pages by title match (case-insensitive substring)
  const results = query.trim().length > 0
    ? allPages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : allPages;

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const navigate = useCallback((path) => {
    router.push(path);
    onClose();
  }, [router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <svg className="search-input-icon" viewBox="0 0 20 20" fill="none" width="20" height="20">
            <path d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length > 0) {
                navigate(results[0].path);
              }
            }}
          />
          <kbd className="search-input-kbd">ESC</kbd>
        </div>
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-no-results">No pages found</div>
          ) : (
            <ul className="search-results-list">
              {results.map((page) => (
                <li key={page.path}>
                  <button
                    className="search-result-item"
                    onClick={() => navigate(page.path)}
                    type="button"
                  >
                    <span className="search-result-title">{page.title}</span>
                    <span className="search-result-path">{page.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
