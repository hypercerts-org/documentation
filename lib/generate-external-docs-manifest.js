const { mkdirSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');
const {
  loadExternalDocSources,
  sourceToPublicManifestEntry,
} = require('./external-docs');

const OUTPUT = join(__dirname, '..', 'public', 'external-docs.json');

/**
 * Generate the browser-readable manifest used to resolve remote-doc registry ids.
 */
function generateExternalDocsManifest() {
  const sources = loadExternalDocSources();
  const manifest = {
    schemaVersion: 1,
    sources: Object.fromEntries(
      sources.map((source) => [source.id, sourceToPublicManifestEntry(source)])
    ),
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Generated external docs manifest for ${sources.length} source${sources.length === 1 ? '' : 's'}`);
}

generateExternalDocsManifest();
