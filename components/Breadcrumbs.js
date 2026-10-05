import { Breadcrumb } from "@hypercerts-org/ui-react";
import { useRouter } from "next/router";
import { navigation } from "../lib/navigation";

function findBreadcrumbs(nav, targetPath, trail = []) {
  for (const item of nav) {
    if (item.section || item.group) {
      const result = findBreadcrumbs(item.children || [], targetPath, [
        ...trail,
        { title: item.section || item.group },
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

  const items = [
    { label: 'Docs', href: '/' },
    ...crumbs.map((crumb, i) => ({
      label: crumb.title,
      href: i < crumbs.length - 1 ? crumb.path : undefined,
    })),
  ];

  return <Breadcrumb items={items} maxItems={6} className="breadcrumbs" />;
}
