const { mkdirSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');
const { CONTENT_PATH, loadExternalDocSources } = require('./external-docs');
const { buildReleaseCatalog } = require('./releases');
const protocol = require('./protocol-releases.json');
const components = require('./release-components.json');
const { loadExternalSnapshots } = require('./external-docs-cache');

/**
 * Fetch fresh build content, or explicitly reuse compatible snapshots for local development.
 */
async function generateExternalDocs({ preferCache = false } = {}) {
  const sources = loadExternalDocSources();
  const { snapshots, generatedAt, reused } = await loadExternalSnapshots(sources, { preferCache });
  // Always rebuild local release summaries, even when the remote content is cached.
  const releases = buildReleaseCatalog(protocol, components, snapshots);
  const content = {
    schemaVersion: 1,
    generatedAt,
    sources: Object.fromEntries(snapshots.map((snapshot) => [snapshot.id, snapshot])),
    releases,
  };

  mkdirSync(dirname(CONTENT_PATH), { recursive: true });
  writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);
  writeFileSync(join(__dirname, 'release-catalog.json'), `${JSON.stringify(releases, null, 2)}\n`);

  if (reused) {
    console.log(`Reusing ${snapshots.length} external docs snapshots fetched ${generatedAt}. No GitHub requests. Run npm run generate to refresh upstream content.`);
  } else {
    console.log(`Generated build-time snapshots for ${snapshots.length} external Markdown source${snapshots.length === 1 ? '' : 's'}`);
  }
}

if (require.main === module) {
  generateExternalDocs({ preferCache: process.argv.includes('--prefer-cache') }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { generateExternalDocs };
