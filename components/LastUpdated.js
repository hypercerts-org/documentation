import { useEffect } from 'react';
import { useRouter } from 'next/router';
import lastUpdated from '../lib/lastUpdated.json';

export function LastUpdated() {
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  const date = lastUpdated[currentPath];

  useEffect(() => {
    // Always remove any stale last-updated element from a previous route,
    // even if the current route has no date — otherwise the imperatively
    // appended element survives React reconciliation and ends up stranded
    // on the new page.
    const existing = document.querySelector('.last-updated');
    if (existing) existing.remove();

    if (!date) return;

    const article = document.querySelector('.layout-content article');
    if (!article) return;

    const el = document.createElement('p');
    el.className = 'last-updated';
    el.textContent = `Last updated ${new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;

    article.appendChild(el);
  }, [date, currentPath]);

  return null;
}
