import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { flattenNavigation } from '../lib/navigation';

// Fuzzy match: all characters of query appear in text in order (case-insensitive)
function fuzzyMatch(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

// Paths for the curated quick links shown in the empty state
const QUICK_LINK_PATHS = [
  '/getting-started/quickstart',
  '/core-concepts/what-is-hypercerts',
  '/core-concepts/hypercerts-core-data-model',
  '/tools/scaffold',
  '/architecture/overview',
  '/reference/glossary',
];

export function SearchDialog({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);
  const router = useRouter();
  const allPages = flattenNavigation();

  // Quick links for empty state
  const quickLinks = QUICK_LINK_PATHS
    .map(p => allPages.find(page => page.path === p))
    .filter(Boolean);

  // Filter and sort results using fuzzy matching
  const trimmedQuery = query.trim();
  const results = trimmedQuery.length > 0
    ? allPages
        .filter(p => fuzzyMatch(trimmedQuery, p.title))
        .sort((a, b) => {
          const aExact = a.title.toLowerCase().includes(trimmedQuery.toLowerCase());
          const bExact = b.title.toLowerCase().includes(trimmedQuery.toLowerCase());
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return 0;
        })
    : [];

  // Group results by section
  const groupedResults = results.reduce((acc, page) => {
    const section = page.section || 'General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(page);
    return acc;
  }, {});

  // Flat list of results for keyboard navigation (same order as rendered)
  const flatResults = Object.values(groupedResults).flat();

  // Reset selectedIndex when query changes
  useEffect(() => {
    setSelectedIndex(flatResults.length > 0 ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedQuery]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(-1);
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

  // Determine what to show in the results area
  const hasQuery = trimmedQuery.length > 0;
  const hasResults = flatResults.length > 0;

  // Build a flat index counter for refs across groups
  let refIndex = 0;

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
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                const target = selectedIndex >= 0 ? flatResults[selectedIndex] : flatResults[0];
                if (target) navigate(target.path);
              }
            }}
          />
          <kbd className="search-input-kbd">ESC</kbd>
        </div>
        <div className="search-results">
          {!hasQuery ? (
            /* Empty state: show Quick Links */
            <ul className="search-results-list">
              <li>
                <div className="search-result-section">Quick Links</div>
                <ul className="search-results-list">
                  {quickLinks.map((page) => (
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
              </li>
            </ul>
          ) : hasResults ? (
            /* Results grouped by section */
            <ul className="search-results-list">
              {Object.entries(groupedResults).map(([section, items]) => (
                <li key={section}>
                  <div className="search-result-section">{section || 'General'}</div>
                  <ul className="search-results-list">
                    {items.map((page) => {
                      const currentRef = refIndex;
                      refIndex++;
                      const isSelected = currentRef === selectedIndex;
                      return (
                        <li key={page.path}>
                          <button
                            ref={el => { itemRefs.current[currentRef] = el; }}
                            className={`search-result-item${isSelected ? ' search-result-item-selected' : ''}`}
                            onClick={() => navigate(page.path)}
                            type="button"
                          >
                            <span className="search-result-title">{page.title}</span>
                            <span className="search-result-path">{page.path}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            /* No results: show message + quick links as fallback */
            <>
              <div className="search-no-results">No results for &ldquo;{trimmedQuery}&rdquo;</div>
              <ul className="search-results-list">
                <li>
                  <div className="search-result-section">Quick Links</div>
                  <ul className="search-results-list">
                    {quickLinks.map((page) => (
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
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
