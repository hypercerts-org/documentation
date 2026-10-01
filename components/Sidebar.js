import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getNavigationSection, navigation } from '../lib/navigation';

function isActive(path, currentPath) {
  return path === currentPath;
}

function isChildActive(item, currentPath) {
  if (item.path && isActive(item.path, currentPath)) return true;
  if (item.children) {
    return item.children.some((child) => isChildActive(child, currentPath));
  }
  return false;
}

/**
 * Render one navigation entry. An entry with children is a category: its row links to the category page,
 * and its children are shown while that page or one of its descendants is active.
 */
function NavItem({ item, currentPath }) {
  const hasChildren = item.children && item.children.length > 0;
  const active = item.path && isActive(item.path, currentPath);
  const childActive = hasChildren && isChildActive(item, currentPath);
  const expanded = hasChildren && (active || childActive);
  const className = `sidebar-link${active ? ' sidebar-link-active' : ''}${childActive && !active ? ' sidebar-link-parent-active' : ''}`;

  const content = (
    <>
      <span className="sidebar-link-label">
        {item.title}
        {item.badge && <span className="sidebar-release-badge">{item.badge}</span>}
      </span>
      {hasChildren && (
        <svg className={`sidebar-link-chevron${expanded ? ' sidebar-link-chevron-open' : ''}`} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );

  return (
    <li className="sidebar-nav-item">
      {item.path ? (
        <Link href={item.path} className={className} aria-current={active ? 'page' : undefined} aria-expanded={hasChildren ? expanded : undefined}>
          {content}
        </Link>
      ) : (
        <span className={className}>{content}</span>
      )}
      {expanded && (
        <ul className="sidebar-nav-children">
          {item.children.map((child) => (
            <NavItem key={child.path || child.title} item={child} currentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Render a titled subsection inside a documentation section without adding a nesting level. */
function NavGroup({ item, currentPath }) {
  return (
    <li className="sidebar-group">
      <h4 className="sidebar-group-header">{item.group}</h4>
      <ul className="sidebar-section-list">
        {item.children.map((child) => (
          <NavItem key={child.path || child.title} item={child} currentPath={currentPath} />
        ))}
      </ul>
    </li>
  );
}

function NavSection({ item, currentPath }) {
  if (item.section) {
    return (
      <li className="sidebar-section">
        <h3 className="sidebar-section-header">{item.section}</h3>
        <ul className="sidebar-section-list">
          {item.children.map((child) => (
            child.group
              ? <NavGroup key={child.group} item={child} currentPath={currentPath} />
              : <NavItem key={child.path || child.title} item={child} currentPath={currentPath} />
          ))}
        </ul>
      </li>
    );
  }
  return <NavItem item={item} currentPath={currentPath} />;
}

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  const currentSection = getNavigationSection(currentPath);
  const visibleNavigation = currentSection ? [currentSection] : navigation;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const handleRouteChange = () => {
      if (onCloseRef.current) onCloseRef.current();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      <nav className={`sidebar${isOpen ? ' sidebar-open' : ''}${collapsed ? ' sidebar-collapsed' : ''}`}>
        {/* Toggle button — always in the sidebar */}
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {collapsed ? (
              <>
                <line x1="3" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </>
            ) : (
              <>
                <path d="M10 5L6 9l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="15" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>

        {/* Mobile close button — shown only when drawer is open */}
        {isOpen && (
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Nav content — hidden when collapsed */}
        <div className="sidebar-content">
          <div className="sidebar-section-switcher">
            <span className="sidebar-section-switcher-title">Sections</span>
            {navigation.map((section) => {
              const overview = section.children.find((child) => child.path);
              if (!overview) return null;

              const active = section.section === currentSection?.section;
              return (
                <Link
                  key={section.section}
                  href={overview.path}
                  className={`sidebar-section-switcher-link${active ? ' sidebar-section-switcher-link-active' : ''}`}
                >
                  {section.section}
                </Link>
              );
            })}
          </div>
          <ul className="sidebar-nav">
            {visibleNavigation.map((item, i) => (
              <NavSection
                key={item.section || item.path || i}
                item={item}
                currentPath={currentPath}
              />
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
