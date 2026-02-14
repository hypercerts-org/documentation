export const navigation = [
  { title: 'Welcome', path: '/' },
  {
    section: 'Get Started',
    children: [
      { title: 'Quickstart', path: '/getting-started/quickstart' },
      { title: 'What is Certified?', path: '/getting-started/what-is-certified' },
    ],
  },
  {
    section: 'Core Concepts',
    children: [
      { title: "Why We're Building Hypercerts", path: '/getting-started/why-were-building-hypercerts' },
      { title: 'Introduction to Impact Claims', path: '/getting-started/introduction-to-impact-claims' },
      { title: 'The Impact and Work Space', path: '/getting-started/the-impact-and-work-space' },
      { title: 'Deep Dive: The Work Scope', path: '/deep-dive-the-work-scope' },
      { title: 'Why ATProto?', path: '/getting-started/why-atproto' },
      { title: 'The Hypercerts Infrastructure', path: '/getting-started/the-hypercerts-infrastructure' },
    ],
  },
  {
    section: 'Lexicons',
    children: [
      { title: 'Introduction to Lexicons', path: '/lexicons/introduction-to-lexicons' },
      {
        title: 'General Lexicons',
        path: '/lexicons/general-lexicons',
        children: [
          { title: 'Shared Defs', path: '/lexicons/general-lexicons/shared-defs' },
          { title: 'Location', path: '/lexicons/general-lexicons/location' },
        ],
      },
      {
        title: 'Hypercerts Lexicons',
        path: '/lexicons/hypercerts-lexicons',
        children: [
          { title: 'Activity Claim', path: '/lexicons/hypercerts-lexicons/activity-claim' },
          { title: 'Contribution', path: '/lexicons/hypercerts-lexicons/contribution' },
          { title: 'Evaluation', path: '/lexicons/hypercerts-lexicons/evaluation' },
          { title: 'Measurement', path: '/lexicons/hypercerts-lexicons/measurement' },
          { title: 'Evidence', path: '/lexicons/hypercerts-lexicons/evidence' },
          { title: 'Rights', path: '/lexicons/hypercerts-lexicons/rights' },
          { title: 'Collection', path: '/lexicons/hypercerts-lexicons/collection' },
        ],
      },
    ],
  },
  {
    section: 'Tutorials',
    children: [
      { title: 'Creating Your First Hypercert', path: '/tutorials/creating-your-first-hypercert' },
      { title: 'Working with Evaluations', path: '/tutorials/working-with-evaluations' },
      { title: 'Common Use Cases', path: '/tutorials/common-use-cases' },
    ],
  },
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
