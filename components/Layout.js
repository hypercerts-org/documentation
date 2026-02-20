import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { getPrevNext } from '../lib/navigation';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from './ThemeToggle';
import { SearchDialog } from './SearchDialog';

export default function Layout({ children, frontmatter }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  const { prev, next } = getPrevNext(currentPath);
  const pageTitle = frontmatter?.title
    ? `${frontmatter.title} - Hypercerts Protocol`
    : 'Hypercerts Protocol';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const toggleCollapsed = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(next));
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Geist+Mono:wght@400;500&display=swap"
        />
        <title>{pageTitle}</title>
        <link rel="icon" href="/images/hypercerts_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/hypercerts_logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {frontmatter?.description && (
          <meta name="description" content={frontmatter.description} />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark'){d.classList.add('dark')}else if(t==='light'){d.classList.remove('dark')}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){d.classList.add('dark')}}catch(e){}})()`
          }}
        />
      </Head>

      <header className="layout-header">
        <a href="#main-content" className="skip-to-content">Skip to content</a>
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
            <img
              src="/images/hypercerts_logo.png"
              alt="Hypercerts logo"
              className="layout-logo-icon"
            />
            <span className="layout-logo-text">Hypercerts</span>
            <span className="layout-logo-badge">Docs</span>
          </Link>
          <span className="header-divider" aria-hidden="true" />
          <nav className="header-nav" aria-label="Main navigation">
            <Link href="/getting-started/quickstart" className="header-nav-link">Docs</Link>
            <Link href="/tools/scaffold" className="header-nav-link">Tools</Link>
          </nav>
          <span className="header-divider" aria-hidden="true" />
          <button
            className="search-icon-btn"
            onClick={() => setSearchOpen(true)}
            type="button"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            className="search-pill"
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <svg className="search-pill-icon" viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <span className="search-pill-text">Find something...</span>
            <kbd className="search-pill-kbd"><span>⌘</span>K</kbd>
          </button>
          <div style={{ flex: 1 }} />
          <ThemeToggle />
          <a
            href="https://github.com/hypercerts-org"
            className="header-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </header>

      <div className="layout-container">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapsed}
        />

        <main className="layout-content" id="main-content">
          <Breadcrumbs />
          <article>{children}</article>

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
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
