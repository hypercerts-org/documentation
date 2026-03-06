import { useRouter } from 'next/router';
import lastUpdated from '../lib/lastUpdated.json';

export function LastUpdated() {
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  const date = lastUpdated[currentPath];

  if (!date) return null;

  return (
    <p className="last-updated">
      Last updated{' '}
      {new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </p>
  );
}
