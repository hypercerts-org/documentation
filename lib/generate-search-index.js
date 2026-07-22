const { readdirSync, statSync, readFileSync, writeFileSync } = require("fs");
const { join, relative } = require("path");
const {
  loadExternalDocSources,
  parseMarkdownFrontmatter,
  resolveFrontmatterRawSource,
} = require("./external-docs");

const PAGES_DIR = join(__dirname, "..", "pages");
const OUTPUT = join(__dirname, "..", "public", "search-index.json");
const MAX_BODY_LENGTH = 5000;

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(full));
    } else if (full.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function getStringFrontmatterValue(frontmatter, key) {
  return frontmatter[key] ? String(frontmatter[key]) : "";
}

function extractHeadings(content) {
  const headings = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Match h2 (## ) or h3 (### )
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      headings.push(h2Match[1].trim());
    } else if (h3Match) {
      headings.push(h3Match[1].trim());
    }
  }

  return headings;
}

function stripMarkdown(content) {
  let text = content;

  // Remove frontmatter
  text = text.replace(/^---\n[\s\S]*?\n---\n?/, "");

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, "");

  // Remove Markdoc tags ({% ... %} and {% /... %})
  text = text.replace(/\{%[\s\S]*?%\}/g, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Remove heading markers
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove markdown links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Remove bold/italic markers without collapsing underscores inside tokens.
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/(^|[^\w])__([^_]+)__(?=[^\w]|$)/g, "$1$2");
  text = text.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, "$1$2");

  // Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, "$1");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ");

  return text.trim();
}

function getSection(path) {
  if (path === "/") return "Get Started";
  if (path.startsWith("/getting-started")) return "Get Started";
  if (path.startsWith("/core-concepts")) return "Core Concepts";
  if (path.startsWith("/tools")) return "Tools";
  if (path.startsWith("/architecture")) return "Architecture";
  if (path.startsWith("/lexicons")) return "Reference";
  if (path.startsWith("/reference")) return "Reference";
  if (path.startsWith("/ecosystem")) return "Ecosystem & Vision";
  if (path === "/roadmap") return "Reference";
  return "Other";
}

async function getIndexContent(file, localContent, remoteSource) {
  if (!remoteSource) return localContent;

  const response = await fetch(remoteSource.rawUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${remoteSource.label} for search index ${relative(PAGES_DIR, file)}: ${remoteSource.rawUrl} returned ${response.status} ${response.statusText || ""}`.trim());
  }

  return response.text();
}

async function main() {
  const files = walkDir(PAGES_DIR);
  const sources = loadExternalDocSources();
  const index = [];

  for (const file of files) {
    const localContent = readFileSync(file, "utf-8");
    const rel = "/" + relative(PAGES_DIR, file).replace(/\.md$/, "");
    const path = rel === "/index" ? "/" : rel;

    const frontmatter = parseMarkdownFrontmatter(localContent, relative(PAGES_DIR, file));
    const title = getStringFrontmatterValue(frontmatter, "title");
    const description = getStringFrontmatterValue(frontmatter, "description");
    const remoteSource = resolveFrontmatterRawSource(frontmatter, sources);
    const content = await getIndexContent(file, localContent, remoteSource);
    const headings = extractHeadings(content);
    const section = getSection(path);

    // For the home page, only include title (body is mostly card markup)
    let body = "";
    if (path !== "/") {
      body = stripMarkdown(content);
      if (body.length > MAX_BODY_LENGTH) {
        body = body.substring(0, MAX_BODY_LENGTH);
      }
    }

    index.push({
      path,
      title,
      description: description || "",
      section,
      headings,
      body,
    });
  }

  writeFileSync(OUTPUT, JSON.stringify(index, null, 2) + "\n");
  console.log(
    `Generated search index for ${index.length} pages (${
      Buffer.byteLength(JSON.stringify(index)) / 1024
    } KB)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
