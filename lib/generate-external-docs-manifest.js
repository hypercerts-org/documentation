const { mkdirSync, writeFileSync } = require('fs');
const { dirname } = require('path');
const { CONTENT_PATH, loadExternalDocSources } = require('./external-docs');
const { collectExternalDocSnapshots } = require('./external-docs-snapshot');

/**
 * Fetch every registered Markdown file once and write the immutable build snapshot.
 */
async function generateExternalDocs() {
  const sources = loadExternalDocSources();
  const token = process.env.DOCS_SOURCE_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const snapshots = await collectExternalDocSnapshots(sources, token);
  const content = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sources: Object.fromEntries(snapshots.map((snapshot) => [snapshot.id, snapshot])),
  };

  mkdirSync(dirname(CONTENT_PATH), { recursive: true });
  writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);

  console.log(`Generated build-time snapshots for ${snapshots.length} external Markdown source${snapshots.length === 1 ? '' : 's'}`);
}

generateExternalDocs().catch((error) => {
  console.error(error);
  process.exit(1);
});
