const RELEASE_MARKER = /^{% (protocol-title|release-summary|release-cards|protocol-history) \/%}$/gm;

/** Build a small shared catalog for navigation and rendered Markdown, without upstream bodies. */
function buildReleaseCatalog(protocol, components, snapshots) {
  if (!Array.isArray(protocol) || protocol.length === 0) throw new Error('Protocol release history must not be empty.');
  const seen = new Set();
  for (const release of protocol) {
    if (!/^\d+\.\d+$/.test(release.version) || seen.has(release.version)) throw new Error('Invalid or duplicate protocol release line.');
    if (!release.sourceVersion.startsWith(`${release.version}.`)) throw new Error('Protocol source version must belong to its release line.');
    seen.add(release.version);
  }
  return {
    protocol,
    components: components.map(component => {
      const source = component.sourceId ? snapshots.find(item => item.id === component.sourceId) : null;
      if (component.sourceId && !source?.trackRelease) throw new Error(`Missing release-tracked source for ${component.id}.`);
      const release = source?.release || null;
      return {
        ...component,
        version: release?.version || null,
        label: release ? `v${release.version}` : 'Under development',
        releaseUrl: release?.url || null,
        publishedAt: release?.publishedAt || null,
        changelogUrl: source ? `https://github.com/${source.repo}/blob/${source.ref}/${source.path}` : null,
        aligned: release ? release.version.split('.').slice(0, 2).join('.') === protocol[0].version : false,
      };
    }),
  };
}

function sourceLink(release) {
  return `https://github.com/hypercerts-org/hypercerts-lexicon/releases/tag/v${release.sourceVersion}`;
}

function renderReleaseFragment(kind, catalog) {
  if (!catalog?.protocol?.length || !catalog?.components) throw new Error('Missing release catalog. Run npm run generate:external-docs first.');
  const latest = catalog.protocol[0];
  if (kind === 'protocol-title') {
    return `# Hypercerts Protocol ${latest.version}`;
  }
  if (kind === 'release-summary') {
    return `## Hypercerts Protocol ${latest.version}\n\n**${latest.title}** · ${latest.date}\n\n${latest.summary}\n\n${latest.changes.map(change => `- ${change}`).join('\n')}\n\n${latest.compatibility}${latest.blogUrl ? `\n\n[Read the release article](${latest.blogUrl})` : ''}`;
  }
  if (kind === 'release-cards') {
    const cards = [
      `{% card-link title="Hypercerts Protocol" href="/changes/protocol" badge="v${latest.version}" %}\n${latest.cardSummary || latest.summary}\n{% /card-link %}`,
      ...catalog.components.map(component => `{% card-link title="${component.title}" href="${component.path}" badge="${component.label}" %}\n${component.description}\n{% /card-link %}`),
    ];
    return `{% card-grid %}\n${cards.join('\n')}\n{% /card-grid %}`;
  }
  if (kind === 'protocol-history') {
    return catalog.protocol.map(release => `## ${release.version}: ${release.title}\n\n${release.date} · Based on [Lexicons ${release.sourceVersion}](${sourceLink(release)})\n\n${release.summary}\n\n${release.changes.map(change => `- ${change}`).join('\n')}\n\n**For existing integrations:** ${release.compatibility}${release.blogUrl ? `\n\n[Read the release article](${release.blogUrl})` : ''}`).join('\n\n');
  }
  throw new Error(`Unknown release fragment: ${kind}`);
}

/** Expand local build-time markers before rendering, indexing, and raw Markdown export. */
function expandReleaseMarkdown(markdown, catalog) {
  return markdown.replace(RELEASE_MARKER, (_, kind) => renderReleaseFragment(kind, catalog));
}

module.exports = { buildReleaseCatalog, expandReleaseMarkdown, renderReleaseFragment };
