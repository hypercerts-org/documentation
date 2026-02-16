export const navigation = [
  { title: 'Welcome', path: '/' },
  {
    section: 'Build',
    children: [
      { title: 'What are Hypercerts?', path: '/getting-started/what-is-hypercerts' },
      { title: 'Quickstart', path: '/getting-started/quickstart' },
      { title: 'Account & Identity Setup', path: '/getting-started/account-and-identity' },
      { title: 'Creating Your First Hypercert', path: '/tutorials/creating-your-first-hypercert' },
      { title: 'Working with Evaluations', path: '/tutorials/working-with-evaluations' },
      { title: 'Common Use Cases', path: '/tutorials/common-use-cases' },
    ],
  },
  {
    section: 'Understand',
    children: [
      { title: 'How Hypercerts Work', path: '/getting-started/how-hypercerts-work' },
      { title: 'Defining Work Scopes', path: '/getting-started/defining-work-scopes' },
      { title: "Why We're Building Hypercerts", path: '/getting-started/why-were-building-hypercerts' },
      { title: 'Why ATProto?', path: '/getting-started/why-atproto' },
    ],
  },
  {
    section: 'Architecture',
    children: [
      {
        title: 'Infrastructure Overview',
        path: '/getting-started/the-hypercerts-infrastructure',
        children: [
          { title: 'Indexers & Discovery', path: '/getting-started/infrastructure/indexers-and-discovery' },
          { title: 'Portability & Scaling', path: '/getting-started/infrastructure/portability-and-scaling' },
        ],
      },
      { title: 'Architecture Overview', path: '/architecture/overview' },
      { title: 'Data Flow & Lifecycle', path: '/architecture/data-flow-and-lifecycle' },
      { title: 'Funding & Tokenization', path: '/architecture/planned-funding-and-tokenization' },
    ],
  },
  {
    section: 'Tools',
    children: [
      { title: 'Hypercerts CLI', path: '/tools/hypercerts-cli' },
      { title: 'Scaffold Starter App', path: '/tools/scaffold' },
      { title: 'Hyperboard', path: '/tools/hyperboard' },
      { title: 'Hyperindex', path: '/tools/hyperindex' },
    ],
  },
  {
    section: 'Reference',
    children: [
      {
        title: 'Lexicons',
        path: '/lexicons/introduction-to-lexicons',
        children: [
          { title: 'General Lexicons', path: '/lexicons/general-lexicons' },
          { title: 'Hypercerts Lexicons', path: '/lexicons/hypercerts-lexicons' },
        ],
      },
      { title: 'Building on Hypercerts', path: '/reference/building-on-hypercerts' },
      { title: 'Testing & Deployment', path: '/reference/testing-and-deployment' },
      { title: 'Glossary', path: '/reference/glossary' },
      { title: 'FAQ', path: '/reference/faq' },
    ],
  },
  { title: 'Roadmap', path: '/roadmap' },
];

/**
 * Flatten the navigation tree into an ordered array of { title, path } objects.
 * Used for computing previous/next page links.
 */
export function flattenNavigation(nav = navigation) {
  const result = [];
  for (const item of nav) {
    if (item.path) {
      result.push({ title: item.title, path: item.path });
    }
    if (item.children) {
      result.push(...flattenNavigation(item.children));
    }
  }
  return result;
}

/**
 * Given a path, return { prev, next } objects or null.
 */
export function getPrevNext(currentPath) {
  const flat = flattenNavigation();
  const index = flat.findIndex((item) => item.path === currentPath);
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}
