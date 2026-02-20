export const navigation = [
  {
    section: "Get Started",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>',
    children: [
      { title: "Welcome", path: "/" },
      { title: "Quickstart", path: "/getting-started/quickstart" },
      {
        title: "Creating Your First Hypercert",
        path: "/getting-started/creating-your-first-hypercert",
      },
      {
        title: "Working with Evaluations",
        path: "/getting-started/working-with-evaluations",
      },
      { title: "Common Use Cases", path: "/getting-started/common-use-cases" },
      {
        title: "Building on Hypercerts",
        path: "/getting-started/building-on-hypercerts",
      },
      {
        title: "Testing & Deployment",
        path: "/getting-started/testing-and-deployment",
      },
    ],
  },
  {
    section: "Core Concepts",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>',
    children: [
      {
        title: "What are Hypercerts?",
        path: "/core-concepts/what-is-hypercerts",
      },
      {
        title: "Core Data Model",
        path: "/core-concepts/hypercerts-core-data-model",
      },
      {
        title: "Certified Identity",
        path: "/core-concepts/certified-identity",
      },
      { title: "Why ATProto?", path: "/core-concepts/why-atproto" },
      {
        title: "Funding & Value Flow",
        path: "/core-concepts/funding-and-value-flow",
      },
    ],
  },
  {
    section: "Tools",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.42 15.17l-5.1 5.1a2.121 2.121 0 11-3-3l5.1-5.1m0 0L3.34 8.09A2.25 2.25 0 013 6.38V4.5h2.25a2.25 2.25 0 011.71.75l4.08 4.08m3.96-3.96l2.88-2.88a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-2.88 2.88m-3.96 3.96l3.96-3.96"/></svg>',
    children: [
      { title: "Scaffold Starter App", path: "/tools/scaffold" },
      { title: "Hypercerts CLI", path: "/tools/hypercerts-cli" },
      { title: "Hyperindex", path: "/tools/hyperindex" },
      { title: "Hyperboard", path: "/tools/hyperboard" },
    ],
  },
  {
    section: "Architecture",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"/></svg>',
    children: [
      { title: "Architecture Overview", path: "/architecture/overview" },
      {
        title: "Account & Identity Setup",
        path: "/architecture/account-and-identity",
      },
      {
        title: "Data Flow & Lifecycle",
        path: "/architecture/data-flow-and-lifecycle",
      },
      {
        title: "Indexers & Discovery",
        path: "/architecture/indexers-and-discovery",
      },
      {
        title: "Portability & Scaling",
        path: "/architecture/portability-and-scaling",
      },
    ],
  },
  {
    section: "Reference",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>',
    children: [
      {
        title: "Lexicons",
        path: "/lexicons/introduction-to-lexicons",
        children: [
          {
            title: "General Lexicons",
            path: "/lexicons/general-lexicons",
            children: [
              {
                title: "Shared Definitions",
                path: "/lexicons/general-lexicons/shared-defs",
              },
              {
                title: "Location",
                path: "/lexicons/general-lexicons/location",
              },
            ],
          },
          {
            title: "Hypercerts Lexicons",
            path: "/lexicons/hypercerts-lexicons",
            children: [
              {
                title: "Activity Claim",
                path: "/lexicons/hypercerts-lexicons/activity-claim",
              },
              {
                title: "Contribution",
                path: "/lexicons/hypercerts-lexicons/contribution",
              },
              {
                title: "Attachment",
                path: "/lexicons/hypercerts-lexicons/attachment",
              },
              {
                title: "Measurement",
                path: "/lexicons/hypercerts-lexicons/measurement",
              },
              {
                title: "Evaluation",
                path: "/lexicons/hypercerts-lexicons/evaluation",
              },
              {
                title: "Collection",
                path: "/lexicons/hypercerts-lexicons/collection",
              },
              { title: "Rights", path: "/lexicons/hypercerts-lexicons/rights" },
            ],
          },
        ],
      },
      { title: "Glossary", path: "/reference/glossary" },
      { title: "FAQ", path: "/reference/faq" },
      { title: "Roadmap", path: "/roadmap" },
    ],
  },
  {
    section: "Ecosystem & Vision",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 10-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m-6.218-8.677a2.25 2.25 0 01-2.078 0"/></svg>',
    children: [
      {
        title: "Why We Need Hypercerts",
        path: "/ecosystem/why-we-need-hypercerts",
      },
    ],
  },
];

/**
 * Flatten the navigation tree into an ordered array of { title, path, section } objects.
 * Used for computing previous/next page links and search.
 */
export function flattenNavigation(nav = navigation, currentSection = "") {
  const result = [];
  for (const item of nav) {
    const section = item.section || currentSection;
    if (item.path) {
      result.push({ title: item.title, path: item.path, section });
    }
    if (item.children) {
      result.push(...flattenNavigation(item.children, section));
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
