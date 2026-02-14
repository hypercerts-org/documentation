import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { getPrevNext } from '../lib/navigation';
import { Breadcrumbs } from './Breadcrumbs';

export default function Layout({ children, frontmatter }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  const { prev, next } = getPrevNext(currentPath);
  const pageTitle = frontmatter?.title
    ? `${frontmatter.title} - Hypercerts Protocol`
    : 'Hypercerts Protocol';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {frontmatter?.description && (
          <meta name="description" content={frontmatter.description} />
        )}
      </Head>

      {/* Header */}
      <header className="layout-header">
        <div className="layout-header-inner">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link href="/" className="layout-logo">
            Hypercerts Protocol
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <div className="layout-container">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="layout-content">
          <Breadcrumbs />
          <article>{children}</article>

          {/* Pagination */}
          {(prev || next) && (
            <nav className="pagination" aria-label="Page navigation">
              <div className="pagination-prev">
                {prev && (
                  <Link href={prev.path} className="pagination-link">
                    <span className="pagination-label">Previous</span>
                    <span className="pagination-title">{prev.title}</span>
                  </Link>
                )}
              </div>
              <div className="pagination-next">
                {next && (
                  <Link href={next.path} className="pagination-link">
                    <span className="pagination-label">Next</span>
                    <span className="pagination-title">{next.title}</span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </main>

        <aside className="layout-toc">
          <TableOfContents />
        </aside>
      </div>
    </>
  );
}
