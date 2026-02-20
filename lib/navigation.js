export const navigation = [
  { title: "Welcome", path: "/" },
  {
    section: "Get Started",
    children: [
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
      { title: "Why AT Protocol?", path: "/core-concepts/why-at-protocol" },
      {
        title: "Funding & Value Flow",
        path: "/core-concepts/funding-and-value-flow",
      },
    ],
  },
  {
    section: "Tools",
    children: [
      { title: "Hypercerts SDK", path: "/tools/sdk" },
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
    children: [
      {
        title: "Lexicons",
        path: "/lexicons/introduction-to-lexicons",
        children: [
          {
            title: "Certified Lexicons",
            path: "/lexicons/certified-lexicons",
            children: [
              {
                title: "Shared Definitions",
                path: "/lexicons/certified-lexicons/shared-defs",
              },
              {
                title: "Location",
                path: "/lexicons/certified-lexicons/location",
              },
              {
                title: "Profile",
                path: "/lexicons/certified-lexicons/profile",
              },
              {
                title: "Badge Definition",
                path: "/lexicons/certified-lexicons/badge-definition",
              },
              {
                title: "Badge Award",
                path: "/lexicons/certified-lexicons/badge-award",
              },
              {
                title: "Badge Response",
                path: "/lexicons/certified-lexicons/badge-response",
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
              {
                title: "Funding Receipt",
                path: "/lexicons/hypercerts-lexicons/funding-receipt",
              },
              {
                title: "Acknowledgement",
                path: "/lexicons/hypercerts-lexicons/acknowledgement",
              },
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
