const { readdirSync, statSync, readFileSync, writeFileSync } = require("fs");
const { join, relative } = require("path");

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

function extractFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { title: "", description: "" };

  const frontmatter = fmMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

  return {
    title: titleMatch ? titleMatch[1].trim() : "",
    description: descMatch ? descMatch[1].trim() : "",
  };
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

  // Remove bold/italic markers
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");

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

const files = walkDir(PAGES_DIR);
const index = [];

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const rel = "/" + relative(PAGES_DIR, file).replace(/\.md$/, "");
  const path = rel === "/index" ? "/" : rel;

  const { title, description } = extractFrontmatter(content);
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
