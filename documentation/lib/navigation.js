export const navigation = [
  { title: "Welcome", path: "/" },
  {
    section: "Get Started",
    children: [
      { title: "Quickstart", path: "/getting-started/quickstart" },
      {
        title: "Creating Your First Hypercert",
        path: "/tutorials/creating-your-first-hypercert",
      },
      {
        title: "Working with Evaluations",
        path: "/tutorials/working-with-evaluations",
      },
      { title: "Common Use Cases", path: "/tutorials/common-use-cases" },
      {
        title: "Building on Hypercerts",
        path: "/reference/building-on-hypercerts",
      },
      {
        title: "Testing & Deployment",
        path: "/reference/testing-and-deployment",
      },
    ],
  },
  {
    section: "Core Concepts",
    children: [
      {
        title: "What are Hypercerts?",
        path: "/getting-started/what-is-hypercerts",
      },
      {
        title: "Core Data Model",
        path: "/getting-started/hypercerts-core-data-model",
      },
      { title: "Certified Identity", path: "/ecosystem/what-is-certified" },
      { title: "Why ATProto?", path: "/getting-started/why-atproto" },
      {
        title: "Funding & Value Flow",
        path: "/architecture/funding-and-tokenization",
      },
    ],
  },
  {
    section: "Tools",
    children: [
      { title: "Scaffold Starter App", path: "/tools/scaffold" },
      { title: "Hypercerts CLI", path: "/tools/hypercerts-cli" },
      { title: "Hyperindex", path: "/tools/hyperindex" },
      { title: "Hyperboard", path: "/tools/hyperboard" },
    ],
  },
  {
    section: "Architecture",
    children: [
      { title: "Architecture Overview", path: "/architecture/overview" },
      {
        title: "Account & Identity Setup",
        path: "/getting-started/account-and-identity",
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
    children: [
      {
        title: "Why We Need Hypercerts",
        path: "/ecosystem/why-we-need-hypercerts",
      },
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
