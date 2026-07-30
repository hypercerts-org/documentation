const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://docs.hypercerts.org';

function getPages(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      pages.push(...getPages(fullPath, `${base}/${entry.name}`));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdoc')) {
      const name = entry.name.replace(/\.(md|mdoc)$/, '');
      const urlPath = name === 'index' ? base || '/' : `${base}/${name}`;
      pages.push(urlPath);
    }
  }

  return pages;
}

function generateSitemap() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  const pages = getPages(pagesDir);

  const today = new Date().toISOString().split('T')[0];

  const urls = pages
    .map((pg) => {
      const priority = pg === '/' ? '1.0' : pg.startsWith('/getting-started') ? '0.8' : '0.6';
      return `  <url>
    <loc>${SITE_URL}${pg}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, sitemap);
  console.log(`Sitemap generated with ${pages.length} URLs → public/sitemap.xml`);
}

generateSitemap();
