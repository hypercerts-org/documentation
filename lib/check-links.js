const { existsSync, readFileSync, readdirSync, statSync } = require('fs');
const { join, relative } = require('path');

const OUT_DIR = join(__dirname, '..', 'out');
const IGNORED_PREFIXES = ['/_next/'];

/** List every exported HTML file under a directory. */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith('.html') ? [full] : [];
  });
}

/** Resolve a site path such as /guide to its exported file, or null when nothing is exported there. */
function resolveTarget(path) {
  const clean = decodeURIComponent(path).replace(/\/$/, '');
  const candidates = clean === '' ? ['index.html'] : [`${clean}.html`, join(clean, 'index.html'), clean];
  for (const candidate of candidates) {
    const full = join(OUT_DIR, candidate);
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

const idCache = new Map();

/** Collect the element ids of an exported page, used to check #fragment links. */
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
  }
  return idCache.get(file);
}

/**
 * Check every internal link and fragment in the static export.
 * Run after `pnpm run build`; exits with a non-zero status when a link points nowhere.
 */
function checkLinks() {
  if (!existsSync(OUT_DIR)) throw new Error('No static export found. Run pnpm run build first.');

  const problems = [];
  const files = htmlFiles(OUT_DIR);

  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const page = `/${relative(OUT_DIR, file)}`;

    for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      const link = href.replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|tel:)/.test(link)) continue;
      if (IGNORED_PREFIXES.some((prefix) => link.startsWith(prefix))) continue;

      const [pathAndQuery, fragment] = link.split('#');
      const path = pathAndQuery.split('?')[0];
      const target = path === '' ? file : path.startsWith('/') ? resolveTarget(path) : null;

      if (!target) {
        problems.push(`${page}: broken link ${link}`);
      } else if (fragment && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(fragment))) {
        problems.push(`${page}: missing anchor ${link}`);
      }
    }
  }

  if (problems.length > 0) {
    console.error(`Found ${problems.length} broken internal link(s):\n${[...new Set(problems)].join('\n')}`);
    process.exit(1);
  }
  console.log(`Checked internal links in ${files.length} pages: all resolve.`);
}

checkLinks();
