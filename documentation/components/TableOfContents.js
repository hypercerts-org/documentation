import { useState, useEffect, useRef } from 'react';

export function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);

  // Extract H2 headings from the DOM after render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const article = document.querySelector('.layout-content article');
    if (!article) return;

    const h2Elements = article.querySelectorAll('h2');
    const items = Array.from(h2Elements).map((el) => {
      // Ensure each heading has an id for anchor linking
      if (!el.id) {
        el.id = el.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return { id: el.id, text: el.textContent };
    });
    setHeadings(items);
  }, []);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const callback = (entries) => {
      // Find the first heading that is intersecting
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <h4 className="toc-title">On this page</h4>
      <ul className="toc-list">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`toc-link${activeId === id ? ' toc-link-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(id);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(id);
                  // Update URL hash without scroll jump
                  history.pushState(null, '', `#${id}`);
                }
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
