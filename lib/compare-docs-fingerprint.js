const { readFileSync } = require('fs');

/**
 * Read a generated docs-fingerprint.json file and return its combined fingerprint.
 */
function readCombinedFingerprint(path, label) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read ${label} fingerprint at ${path}: ${error.message}`);
  }

  return typeof parsed.combinedFingerprint === 'string' ? parsed.combinedFingerprint : '';
}

function main() {
  const [currentPath, deployedPath] = process.argv.slice(2);
  if (!currentPath || !deployedPath) {
    throw new Error('Usage: node lib/compare-docs-fingerprint.js <current-docs-fingerprint.json> <deployed-docs-fingerprint.json>');
  }

  const current = readCombinedFingerprint(currentPath, 'current');
  if (!current) {
    throw new Error(`Current fingerprint file ${currentPath} does not contain combinedFingerprint.`);
  }

  const deployed = readCombinedFingerprint(deployedPath, 'deployed');
  const changed = current !== deployed;

  console.error(changed
    ? `External docs changed: deployed=${deployed || '<missing>'} current=${current}`
    : `External docs unchanged: ${current}`);

  console.log(`changed=${changed ? 'true' : 'false'}`);
  console.log(`current_fingerprint=${current}`);
  console.log(`deployed_fingerprint=${deployed}`);
  console.log(`reason=${changed ? 'combined fingerprint differs' : 'combined fingerprint matches deployed site'}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
