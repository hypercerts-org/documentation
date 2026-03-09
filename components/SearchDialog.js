import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import FlexSearch from 'flexsearch';

// Module-level variables to persist across dialog opens
let searchData = null;
let searchIndex = null;
let isLoading = false;

// Generate a context snippet with the matched term highlighted
function getSnippet(body, query, contextChars = 60) {
  const lower = body.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return '';
  const start = Math.max(0, idx - contextChars);
  const end = Math.min(body.length, idx + query.length + contextChars);
  let snippet = '';
  if (start > 0) snippet += '...';
  snippet += body.slice(start, end);
  if (end < body.length) snippet += '...';
  return snippet;
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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);
  const router = useRouter();
  const debounceTimerRef = useRef(null);

  // Load search index on first open
  useEffect(() => {
    if (isOpen && !searchData && !isLoading) {
      isLoading = true;
      setLoading(true);
      fetch('/search-index.json')
        .then(res => res.json())
        .then(data => {
          searchData = data;
          // Create FlexSearch index
          searchIndex = new FlexSearch.Document({
            document: {
              id: 'path',
              index: ['title', 'description', 'headings', 'body'],
            },
            tokenize: 'forward',
          });
          // Add all entries to the index — join headings array into string for FlexSearch
          data.forEach(entry => {
            searchIndex.add({
              ...entry,
              headings: Array.isArray(entry.headings) ? entry.headings.join(' ') : (entry.headings || ''),
            });
          });
          setLoading(false);
          isLoading = false;
        })
        .catch(err => {
          console.error('Failed to load search index:', err);
          setLoading(false);
          isLoading = false;
        });
    }
  }, [isOpen]);

  // Quick links for empty state
  const quickLinks = searchData
    ? QUICK_LINK_PATHS
        .map(p => searchData.find(page => page.path === p))
        .filter(Boolean)
    : [];

  // Perform search with debouncing
  useEffect(() => {
    const trimmedQuery = query.trim();
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!trimmedQuery || !searchIndex || !searchData) {
      setResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      // Search the index
      const searchResults = searchIndex.search(trimmedQuery, { limit: 20, enrich: true });
      
      // Merge and deduplicate results by path, prioritizing field order
      const pathMap = new Map();
      const fieldPriority = { title: 1, description: 2, headings: 3, body: 4 };
      
      searchResults.forEach(fieldResult => {
        const field = fieldResult.field;
        const priority = fieldPriority[field] || 999;
        
        fieldResult.result.forEach(item => {
          const path = item.id;
          if (!pathMap.has(path) || pathMap.get(path).priority > priority) {
            const entry = searchData.find(e => e.path === path);
            if (entry) {
              pathMap.set(path, {
                ...entry,
                priority,
                matchedField: field,
              });
            }
          }
        });
      });
      
      // Convert to array and sort by priority
      const mergedResults = Array.from(pathMap.values()).sort((a, b) => a.priority - b.priority);
      
      // Generate snippets for body matches
      mergedResults.forEach(result => {
        if (result.matchedField === 'body' && result.body) {
          result.snippet = getSnippet(result.body, trimmedQuery);
        } else if (result.description) {
          result.snippet = result.description;
        }
      });
      
      setResults(mergedResults);
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Group results by section
  const trimmedQuery = query.trim();
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

  // Helper to highlight matched term in snippet
  const highlightSnippet = (snippet, query) => {
    if (!snippet || !query) return snippet;
    const lower = snippet.toLowerCase();
    const queryLower = query.toLowerCase();
    const idx = lower.indexOf(queryLower);
    if (idx === -1) return snippet;
    
    const before = snippet.slice(0, idx);
    const match = snippet.slice(idx, idx + query.length);
    const after = snippet.slice(idx + query.length);
    
    return (
      <>
        {before}
        <mark>{match}</mark>
        {after}
      </>
    );
  };

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
          {loading ? (
            /* Loading state */
            <div className="search-no-results">Loading...</div>
          ) : !hasQuery ? (
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
                            {page.snippet && (
                              <span className="search-result-snippet">
                                {highlightSnippet(page.snippet, trimmedQuery)}
                              </span>
                            )}
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
