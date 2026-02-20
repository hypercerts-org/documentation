import Link from "next/link";
import { useRouter } from "next/router";
import { navigation } from "../lib/navigation";

function findBreadcrumbs(nav, targetPath, trail = []) {
  for (const item of nav) {
    if (item.section) {
      const result = findBreadcrumbs(item.children || [], targetPath, [
        ...trail,
        { title: item.section },
      ]);
      if (result) return result;
    } else {
      if (item.path === targetPath) {
        return [...trail, { title: item.title, path: item.path }];
      }
      if (item.children) {
        const result = findBreadcrumbs(item.children, targetPath, [
          ...trail,
          { title: item.title, path: item.path },
        ]);
        if (result) return result;
      }
    }
  }
  return null;
}

export function Breadcrumbs() {
  const router = useRouter();
  const currentPath = router.asPath.split("#")[0].split("?")[0];

  // Dont show breadcrumbs on home page
  if (currentPath === "/") return null;

  const crumbs = findBreadcrumbs(navigation, currentPath) || [];

  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        <li className="breadcrumbs-item">
          <Link href="/" className="breadcrumbs-link">
            Docs
          </Link>
        </li>
        {crumbs.slice(0, -1).map((crumb, i) => (
          <li key={i} className="breadcrumbs-item">
            <span className="breadcrumbs-separator">/</span>
            {crumb.path ? (
              <Link href={crumb.path} className="breadcrumbs-link">
                {crumb.title}
              </Link>
            ) : (
              <span className="breadcrumbs-text">{crumb.title}</span>
            )}
          </li>
        ))}
        <li className="breadcrumbs-item">
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">{crumbs[crumbs.length - 1].title}</span>
        </li>
      </ol>
    </nav>
  );
}
