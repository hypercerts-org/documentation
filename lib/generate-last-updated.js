const { execSync } = require("child_process");
const { readdirSync, statSync, writeFileSync } = require("fs");
const { join, relative } = require("path");

const PAGES_DIR = join(__dirname, "..", "pages");
const OUTPUT = join(__dirname, "lastUpdated.json");

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

function getLastUpdated(filePath) {
  try {
    const date = execSync(`git log -1 --format="%aI" -- "${filePath}"`, {
      encoding: "utf-8",
    }).trim();
    return date || null;
  } catch {
    return null;
  }
}

const files = walkDir(PAGES_DIR);
const map = {};

for (const file of files) {
  const rel = "/" + relative(PAGES_DIR, file).replace(/\.md$/, "");
  const route = rel === "/index" ? "/" : rel;
  const date = getLastUpdated(file);
  if (date) {
    map[route] = date;
  }
}

writeFileSync(OUTPUT, JSON.stringify(map, null, 2) + "\n");
console.log(`Generated last-updated dates for ${Object.keys(map).length} pages`);
