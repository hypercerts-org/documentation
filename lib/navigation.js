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
        title: "Testing & Deployment",
        path: "/getting-started/testing-and-deployment",
      },
    ],
  },
  {
    section: "Reference",
    children: [
      { title: "Overview", path: "/reference" },
      { title: "Glossary", path: "/reference/glossary" },
      { title: "FAQ", path: "/reference/faq" },
      {
        group: "Lexicons",
        children: [
          { title: "Introduction", path: "/lexicons/introduction-to-lexicons" },
          { title: "Lexicon inventory", path: "/reference/lexicon-inventory" },
          {
            title: "Hypercerts Lexicons",
            path: "/lexicons/hypercerts-lexicons",
            children: [
              { title: "Activity Claim", path: "/lexicons/hypercerts-lexicons/activity-claim" },
              { title: "Contribution", path: "/lexicons/hypercerts-lexicons/contribution" },
              { title: "Rights", path: "/lexicons/hypercerts-lexicons/rights" },
              { title: "Collection", path: "/lexicons/hypercerts-lexicons/collection" },
              { title: "Feature", path: "/lexicons/hypercerts-lexicons/feature" },
              { title: "Vocabulary Tag", path: "/lexicons/hypercerts-lexicons/vocabulary-tag" },
              { title: "Work Scope", path: "/lexicons/hypercerts-lexicons/work-scope" },
              { title: "Attachment", path: "/lexicons/hypercerts-lexicons/attachment" },
              { title: "Measurement", path: "/lexicons/hypercerts-lexicons/measurement" },
              { title: "Evaluation", path: "/lexicons/hypercerts-lexicons/evaluation" },
              { title: "Acknowledgement", path: "/lexicons/hypercerts-lexicons/acknowledgement" },
              { title: "Funding Receipt", path: "/lexicons/hypercerts-lexicons/funding-receipt" },
              { title: "Shared Definitions", path: "/lexicons/hypercerts-lexicons/shared-defs" },
            ],
          },
          {
            title: "Certified Lexicons",
            path: "/lexicons/certified-lexicons",
            children: [
              { title: "Profile", path: "/lexicons/certified-lexicons/profile" },
              { title: "Organization", path: "/lexicons/certified-lexicons/organization" },
              { title: "Location", path: "/lexicons/certified-lexicons/location" },
              { title: "Badge Definition", path: "/lexicons/certified-lexicons/badge-definition" },
              { title: "Badge Award", path: "/lexicons/certified-lexicons/badge-award" },
              { title: "Badge Response", path: "/lexicons/certified-lexicons/badge-response" },
              { title: "Follows", path: "/lexicons/certified-lexicons/follows" },
              { title: "Likes and Reposts", path: "/lexicons/certified-lexicons/likes-and-reposts" },
              { title: "EVM Link", path: "/lexicons/certified-lexicons/evm-link" },
              { title: "Signatures", path: "/lexicons/certified-lexicons/signatures" },
              { title: "Shared Definitions", path: "/lexicons/certified-lexicons/shared-defs" },
            ],
          },
        ],
      },
      {
        group: "XRPC API",
        children: [{ title: "Overview", path: "/reference/xrpc-api" }],
      },
      {
        group: "SDK",
        children: [{ title: "Overview", path: "/reference/sdk" }],
      },
      {
        group: "Services and tooling",
        children: [
          { title: "Overview", path: "/reference/services" },
          { title: "certified.app", path: "/reference/services/certified-app" },
          { title: "Certified PDSs", path: "/reference/services/certified-pdss" },
          { title: "Entryway", path: "/reference/services/entryway" },
          { title: "Certified Group Service", path: "/reference/services/certified-group-service" },
          { title: "Relay and Jetstream", path: "/reference/services/relay" },
          { title: "Indexer and Hypercerts API", path: "/reference/services/indexer" },
          { title: "Labelers", path: "/reference/services/labelers" },
          { title: "Feed Service", path: "/reference/services/feed-service" },
        ],
      },
    ],
  },
  {
    section: "Releases",
    children: [
      { title: "Releases overview", path: "/releases" },
      { title: "Hypercerts Protocol", path: "/releases/protocol", badge: `v${releaseCatalog.protocol[0].version}` },
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
