import Link from 'next/link';

const icons = {
  guide: <path d="M12 6.5C9.5 4.5 6 4 3 5v14c3-1 6.5-.5 9 1.5C14.5 18.5 18 18 21 19V5c-3-1-6.5-.5-9 1.5Zm0 0v14" />,
  integration: <path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" />,
  reference: <><rect x="5" y="3" width="15" height="18" rx="2" /><path d="M9 3v18M3 7h4m-4 5h4m-4 5h4m5-10h5m-5 4h5" /></>,
  changes: <><path d="M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7" /><path d="M12 7v5l3 2" /></>,
};

/** A section introduction and its curated links on the documentation landing page. */
export function DocsSection({ title, href, icon, description, children }) {
  const headingId = `docs-${icon}`;

  return (
    <section className="docs-section" aria-labelledby={headingId}>
      <div className="docs-section-intro">
        <span className="docs-section-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            {icons[icon]}
          </svg>
        </span>
        <h2 id={headingId}>
          <Link href={href} className="docs-section-title">
            {title}
            <svg className="docs-section-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </h2>
        <p>{description}</p>
      </div>
      <div className="docs-section-links">{children}</div>
    </section>
  );
}
