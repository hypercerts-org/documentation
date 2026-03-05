import { useEffect } from 'react';
import { useRouter } from 'next/router';
import lastUpdated from '../lib/lastUpdated.json';

export function LastUpdated() {
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  const date = lastUpdated[currentPath];

  useEffect(() => {
    if (!date) return;

    // Remove any existing last-updated element
    const existing = document.querySelector('.last-updated');
    if (existing) existing.remove();

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
