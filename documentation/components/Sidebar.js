import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { navigation } from '../lib/navigation';

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

function NavItem({ item, currentPath, depth = 0 }) {
  const hasChildren = item.children && item.children.length > 0;
  const active = item.path && isActive(item.path, currentPath);
  const childActive = hasChildren && isChildActive(item, currentPath);
  const [expanded, setExpanded] = useState(childActive || active);

  useEffect(() => {
    if (childActive || active) {
      setExpanded(true);
    }
  }, [childActive, active]);

  const handleToggle = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const paddingLeft = `${12 + depth * 12}px`;

  const chevron = hasChildren ? (
    <svg
      className="sidebar-chevron"
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : null;

  return (
    <li className="sidebar-nav-item">
      {item.path ? (
        <Link
          href={item.path}
          className={`sidebar-link${active ? " sidebar-link-active" : ""}${
            childActive ? " sidebar-link-parent-active" : ""
          }`}
          style={{ paddingLeft }}
          onClick={hasChildren && !item.path ? handleToggle : undefined}
        >
          {chevron}
          {item.title}
        </Link>
      ) : (
        <span
          className={`sidebar-link sidebar-link-toggle${
            childActive ? " sidebar-link-parent-active" : ""
          }`}
          style={{ paddingLeft }}
          onClick={handleToggle}
        >
          {chevron}
          {item.title}
        </span>
      )}
      {hasChildren && expanded && (
        <ul className="sidebar-nav-children">
          {item.children.map((child) => (
            <NavItem
              key={child.path || child.title}
              item={child}
              currentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
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
            <NavItem
              key={child.path || child.title}
              item={child}
              currentPath={currentPath}
            />
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

        {/* Nav content — hidden when collapsed */}
        <div className="sidebar-content">
          <ul className="sidebar-nav">
            {navigation.map((item, i) => (
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
