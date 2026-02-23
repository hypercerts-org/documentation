export const navigation = [
  {
    section: "Get Started",
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

/**
 * Get all draft pages (pages with draft: true in frontmatter).
 * Returns an array of { title, path, description } objects.
 * This function is only called at build time in getStaticProps.
 */
export function getDraftPages() {
  // Dynamic require to avoid breaking client-side bundles
  // Use eval to prevent webpack from trying to bundle these modules
  const fs = eval('require')('fs');
  const path = eval('require')('path');

  const pagesDir = path.join(process.cwd(), 'pages');
  const draftPages = [];

  /**
   * Parse simple YAML frontmatter (key: value pairs)
   */
  function parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return {};

    const frontmatterText = frontmatterMatch[1];
    const frontmatter = {};

    frontmatterText.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        
        // Parse boolean values
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        // Remove quotes from strings
        else if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        
        frontmatter[key] = value;
      }
    });

    return frontmatter;
  }

  /**
   * Recursively scan directory for .md and .mdoc files
   */
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(md|mdoc)$/.test(entry.name)) {
        processFile(fullPath);
      }
    }
  }

  /**
   * Process a single markdown file
   */
  function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    // Only include if draft: true
    if (frontmatter.draft === true) {
      // Convert file path to URL path
      const relativePath = path.relative(pagesDir, filePath);
      const urlPath = filePathToUrl(relativePath);

      draftPages.push({
        title: frontmatter.title || 'Untitled',
        path: urlPath,
        description: frontmatter.description,
      });
    }
  }

  /**
   * Convert file path to URL path
   * pages/drafts/my-page.md → /drafts/my-page
   * pages/architecture/index.md → /architecture
   */
  function filePathToUrl(relativePath) {
    // Remove file extension
    let urlPath = relativePath.replace(/\.(md|mdoc)$/, '');

    // Handle index files
    if (urlPath.endsWith('/index')) {
      urlPath = urlPath.slice(0, -6); // Remove '/index'
    } else if (urlPath === 'index') {
      urlPath = '';
    }

    // Ensure leading slash
    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath;
    }

    // Handle root index
    if (urlPath === '/') {
      return '/';
    }

    return urlPath;
  }

  scanDirectory(pagesDir);
  return draftPages;
}
