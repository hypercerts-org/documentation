import releaseCatalog from './release-catalog.json' with { type: 'json' };

export const navigation = [
  {
    section: "Guide",
    children: [
      { title: "Start Here", path: "/guide" },
      { title: "Why AT Protocol?", path: "/core-concepts/why-at-protocol" },
      { title: "A Shared Language", path: "/core-concepts/hypercerts-core-data-model" },
      { title: "Activity Claims", path: "/core-concepts/what-is-hypercerts" },
      { title: "Projects and Collections", path: "/core-concepts/projects-and-collections" },
      { title: "Evidence and Measurements", path: "/core-concepts/evidence-and-measurements" },
      { title: "Evaluations", path: "/core-concepts/evaluations" },
      { title: "Trust and Recognition", path: "/core-concepts/certified-identity" },
      { title: "Funding and Learning", path: "/core-concepts/funding-and-value-flow" },
      { title: "Describing and Classifying Work", path: "/core-concepts/cel-work-scopes" },
      { title: "Records That Change Over Time", path: "/architecture/data-flow-and-lifecycle" },
      { title: "Finding and Reusing Information", path: "/architecture/portability-and-scaling" },
      { title: "What You Can Build", path: "/core-concepts/common-use-cases" },
      { title: "Building on Shared Records", path: "/core-concepts/validation-and-interpretation" },
    ],
  },
  {
    section: "Client Integration",
    children: [
      { title: "Integration overview", path: "/client-integration" },
      {
        title: "Building on Hypercerts",
        path: "/getting-started/building-on-hypercerts",
      },
      {
        title: "Account & Identity Setup",
        path: "/architecture/account-and-identity",
      },
      {
        title: "Integrate with ePDS",
        path: "/tutorials/epds",
      },
      {
        title: "Testing & Deployment",
        path: "/getting-started/testing-and-deployment",
      },
    ],
  },
  {
    section: "Reference",
    children: [
      { title: "Reference overview", path: "/reference" },
      { title: "Lexicon inventory", path: "/reference/lexicon-inventory" },
      { title: "Glossary", path: "/reference/glossary" },
      { title: "FAQ", path: "/reference/faq" },
      {
        title: "Architecture",
        path: "/architecture/overview",
        children: [
          {
            title: "ePDS Architecture",
            path: "/architecture/epds",
          },
          {
            title: "Certified Group Service",
            path: "/architecture/certified-group-service",
          },
        ],
      },
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
      {
        title: "Services and tooling",
        children: [
          {
            title: "Certified Services",
            path: "/reference/certified-services",
          },
          { title: "Certified PDSs", path: "/reference/certified-pdss" },
          {
            title: "Certified Group Services",
            path: "/reference/certified-group-services",
          },
          {
            title: "Hypercerts Feed Service",
            path: "/tools/hypercerts-feed-service",
          },
          { title: "Labelers", path: "/tools/labelers" },
          { title: "Hyperindex (legacy)", path: "/tools/hyperindex" },
          {
            title: "Agent Skills",
            path: "/tools/hypercerts-agent-skills",
          },
        ],
      },
    ],
  },
  {
    section: "Changes",
    children: [
      { title: "Changes overview", path: "/changes" },
      { title: "Hypercerts Protocol", path: "/changes/protocol", badge: `v${releaseCatalog.protocol[0].version}` },
      ...releaseCatalog.components.map(component => ({
        title: component.title,
        path: component.path,
        badge: component.label,
      })),
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

function containsPath(items, targetPath) {
  return items.some((item) =>
    item.path === targetPath ||
    (item.children && containsPath(item.children, targetPath)),
  );
}

/**
 * Return the top-level documentation section containing a path.
 */
export function getNavigationSection(currentPath) {
  return navigation.find(
    (item) => item.section && item.children && containsPath(item.children, currentPath),
  ) || null;
}

/**
 * Given a path, return adjacent pages from the same documentation section.
 */
export function getPrevNext(currentPath) {
  const section = getNavigationSection(currentPath);
  const flat = flattenNavigation(section ? [section] : navigation);
  const index = flat.findIndex((item) => item.path === currentPath);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}
