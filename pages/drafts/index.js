import Link from 'next/link';
import { getDraftPages } from '../../lib/navigation';

export default function DraftsPage({ draftPages }) {
  return (
    <>
      <style jsx>{`
        .drafts-subtitle {
          font-size: 16px;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-8);
          line-height: 1.6;
        }

        .drafts-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .draft-item {
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }

        .draft-item:last-child {
          border-bottom: none;
        }

        .draft-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--color-link);
          margin-bottom: var(--space-2);
          transition: color var(--transition-fast);
        }

        .draft-title:hover {
          color: var(--color-link-hover);
        }

        .draft-description {
          font-size: 15px;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-2);
          line-height: 1.6;
        }

        .draft-path {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-text-secondary);
          background: var(--color-bg-subtle);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          display: inline-block;
        }

        .no-drafts {
          font-size: 15px;
          color: var(--color-text-secondary);
          padding: var(--space-8) 0;
          text-align: center;
        }
      `}</style>

      <h1>Draft Pages</h1>
      <p className="drafts-subtitle">
        These pages are work-in-progress and not yet listed in the sidebar.
      </p>

      {draftPages.length === 0 ? (
        <p className="no-drafts">No draft pages yet.</p>
      ) : (
        <ul className="drafts-list">
          {draftPages.map((page) => (
            <li key={page.path} className="draft-item">
              <Link href={page.path} className="draft-title">
                {page.title}
              </Link>
              {page.description && (
                <p className="draft-description">{page.description}</p>
              )}
              <code className="draft-path">{page.path}</code>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export async function getStaticProps() {
  const draftPages = getDraftPages();

  return {
    props: {
      draftPages,
      markdoc: {
        frontmatter: {
          title: 'Draft Pages',
        },
      },
    },
  };
}
