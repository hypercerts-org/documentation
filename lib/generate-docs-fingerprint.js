const { mkdirSync, readFileSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');
const { loadExternalDocSources } = require('./external-docs');
const {
  buildFingerprintDocument,
  collectExternalDocSnapshots,
} = require('./external-docs-snapshot');

/** Default public artifact written when the CLI receives no explicit output path. */
const DEFAULT_OUTPUT = join(__dirname, '..', 'public', 'docs-fingerprint.json');

/**
 * Fingerprinting process:
 *
 * 1. A site build fetches every registered Markdown file into one immutable snapshot.
 *    Rendering, search, raw exports, and this script all consume that same snapshot.
 * 2. Scheduled refresh checks have no build snapshot, so they fetch the registered files directly.
 * 3. Each source fingerprint includes its registry identity and SHA-256 content hash.
 * 4. Per-source fingerprints are sorted by id and combined into one stable fingerprint.
 * 5. Generation and source-update timestamps are informational and never affect comparisons.
 */

/**
 * Read a CLI option from separate or --name=value argument syntax.
 */
function getArgumentValue(argv, longName, shortName) {
  const index = argv.findIndex((arg) => arg === longName || arg === shortName);
  if (index !== -1) {
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value after ${argv[index]}.`);
    return value;
  }

  const inline = argv.find((arg) => arg.startsWith(`${longName}=`));
  return inline ? inline.slice(longName.length + 1) : null;
}

/**
 * Read the fingerprint output path from CLI arguments.
 */
function getOutputPath(argv) {
  return getArgumentValue(argv, '--output', '-o') || DEFAULT_OUTPUT;
}

/**
 * Read an optional generated snapshot path from CLI arguments.
 */
function getContentPath(argv) {
  return getArgumentValue(argv, '--content', '-c');
}

/**
 * Load snapshots from a generated content file and reject malformed source collections.
 */
function loadSnapshotsFromContent(contentPath) {
  let content;
  try {
    content = JSON.parse(readFileSync(contentPath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read external docs snapshot at ${contentPath}: ${error.message}. Run npm run generate:external-docs first.`);
  }

  if (!content.sources || typeof content.sources !== 'object' || Array.isArray(content.sources)) {
    throw new Error(`External docs snapshot at ${contentPath} must contain a "sources" object.`);
  }

  return Object.values(content.sources);
}

/**
 * Use an existing build snapshot when provided, otherwise fetch every registered source.
 */
async function getSnapshots(contentPath) {
  if (contentPath) return loadSnapshotsFromContent(contentPath);

  const sources = loadExternalDocSources();
  const token = process.env.DOCS_SOURCE_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  return collectExternalDocSnapshots(sources, token);
}

/**
 * Generate and write the combined external-documentation fingerprint artifact.
 */
async function main() {
  const argv = process.argv.slice(2);
  const output = getOutputPath(argv);
  const snapshots = await getSnapshots(getContentPath(argv));
  const fingerprint = buildFingerprintDocument(snapshots);

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(fingerprint, null, 2)}\n`);
  console.log(`Generated docs fingerprint ${fingerprint.combinedFingerprint} → ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
