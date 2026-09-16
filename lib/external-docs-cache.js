const { readFileSync } = require('node:fs');
const { CONTENT_PATH } = require('./external-docs');
const { sha256, collectExternalDocSnapshots } = require('./external-docs-snapshot');
const { getGitHubToken } = require('./github-auth');

/** Local dev can reuse a complete snapshot only when it still matches the source registry. */
function readCompatibleSnapshot(sources, file = CONTENT_PATH) {
  try {
    const content = JSON.parse(readFileSync(file, 'utf8'));
    if (content.schemaVersion !== 1 || !Number.isFinite(Date.parse(content.generatedAt)) || !content.sources) return null;
    if (Object.keys(content.sources).length !== sources.length) return null;
    for (const source of sources) {
      const snapshot = content.sources[source.id];
      if (!snapshot) return null;
      if (['id', 'title', 'repo', 'ref', 'path', 'trackRelease'].some(key => snapshot[key] !== source[key])) return null;
      if (typeof snapshot.markdown !== 'string' || !snapshot.markdown.trim() || snapshot.contentHash !== sha256(snapshot.markdown)) return null;
      if (source.trackRelease) {
        if (!Object.prototype.hasOwnProperty.call(snapshot, 'release')) return null;
        if (snapshot.release !== null && !/^\d+\.\d+\.\d+$/.test(snapshot.release?.version || '')) return null;
      }
    }
    return content;
  } catch {
    return null;
  }
}

/** Fresh by default; only local dev explicitly opts into snapshot reuse. */
async function loadExternalSnapshots(sources, {
  preferCache = false,
  file = CONTENT_PATH,
  collect = collectExternalDocSnapshots,
  getToken = getGitHubToken,
} = {}) {
  const cached = preferCache ? readCompatibleSnapshot(sources, file) : null;
  if (cached) return {
    snapshots: sources.map(source => cached.sources[source.id]),
    generatedAt: cached.generatedAt,
    reused: true,
  };
  return {
    snapshots: await collect(sources, getToken()),
    generatedAt: new Date().toISOString(),
    reused: false,
  };
}

module.exports = { readCompatibleSnapshot, loadExternalSnapshots };
