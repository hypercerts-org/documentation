import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);
  const clickedRef = useRef(false);
  const router = useRouter();
  const currentPath = router.asPath.split("#")[0].split("?")[0];

  // Extract H2 and H3 headings from the DOM after render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const article = document.querySelector(".layout-content article");
    if (!article) {
      setHeadings([]);
      return;
    }

    const elements = article.querySelectorAll("h2, h3");
    const items = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id = el.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return {
        id: el.id,
        text: el.textContent,
        level: el.tagName === "H3" ? 3 : 2,
      };
    });
    setHeadings(items);
    setActiveId("");
  }, [currentPath]);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const callback = (entries) => {
      // Skip observer updates while a click-scroll is in progress
      if (clickedRef.current) return;

      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -60% 0px",
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

  if (headings.length < 2) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <h4 className="toc-title">On this page</h4>
      <ul className="toc-list">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`toc-link${level === 3 ? " toc-link-h3" : ""}${
                activeId === id ? " toc-link-active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(id);
                if (target) {
                  // Suppress observer during scroll animation
                  clickedRef.current = true;
                  setActiveId(id);
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.pushState(null, "", `#${id}`);
                  // Re-enable observer after scroll settles
                  setTimeout(() => {
                    clickedRef.current = false;
                  }, 800);
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
