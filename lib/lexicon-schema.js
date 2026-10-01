const { existsSync, readFileSync } = require('fs');
const { dirname, join } = require('path');

const SCHEMA_MARKER = /^{% lexicon-schema nsid="([a-zA-Z0-9.]+)" \/%}$/gm;
const LEXICON_REPO = 'https://github.com/hypercerts-org/hypercerts-lexicon';

/** Documentation routes for lexicons that have their own reference page. */
const LEXICON_ROUTES = {
  'org.hypercerts.claim.activity': '/lexicons/hypercerts-lexicons/activity-claim',
  'org.hypercerts.claim.contribution': '/lexicons/hypercerts-lexicons/contribution',
  'org.hypercerts.claim.contributorInformation': '/lexicons/hypercerts-lexicons/contribution',
  'org.hypercerts.claim.rights': '/lexicons/hypercerts-lexicons/rights',
  'org.hypercerts.collection': '/lexicons/hypercerts-lexicons/collection',
  'org.hypercerts.entity.feature': '/lexicons/hypercerts-lexicons/feature',
  'org.hypercerts.vocab.tag': '/lexicons/hypercerts-lexicons/vocabulary-tag',
  'org.hypercerts.workscope.tag': '/lexicons/hypercerts-lexicons/work-scope',
  'org.hypercerts.workscope.cel': '/lexicons/hypercerts-lexicons/work-scope',
  'org.hypercerts.context.attachment': '/lexicons/hypercerts-lexicons/attachment',
  'org.hypercerts.context.measurement': '/lexicons/hypercerts-lexicons/measurement',
  'org.hypercerts.context.evaluation': '/lexicons/hypercerts-lexicons/evaluation',
  'org.hypercerts.context.acknowledgement': '/lexicons/hypercerts-lexicons/acknowledgement',
  'org.hypercerts.funding.receipt': '/lexicons/hypercerts-lexicons/funding-receipt',
  'org.hypercerts.defs': '/lexicons/hypercerts-lexicons/shared-defs',
  'app.certified.actor.profile': '/lexicons/certified-lexicons/profile',
  'app.certified.actor.organization': '/lexicons/certified-lexicons/organization',
  'app.certified.location': '/lexicons/certified-lexicons/location',
  'app.certified.badge.definition': '/lexicons/certified-lexicons/badge-definition',
  'app.certified.badge.award': '/lexicons/certified-lexicons/badge-award',
  'app.certified.badge.response': '/lexicons/certified-lexicons/badge-response',
  'app.certified.graph.follow': '/lexicons/certified-lexicons/follows',
  'app.certified.graph.entityFollow': '/lexicons/certified-lexicons/follows',
  'app.certified.feed.like': '/lexicons/certified-lexicons/likes-and-reposts',
  'app.certified.feed.repost': '/lexicons/certified-lexicons/likes-and-reposts',
  'app.certified.link.evm': '/lexicons/certified-lexicons/evm-link',
  'app.certified.signature.proof': '/lexicons/certified-lexicons/signatures',
  'app.certified.signature.defs': '/lexicons/certified-lexicons/signatures',
  'app.certified.defs': '/lexicons/certified-lexicons/shared-defs',
};

/** Short names for common external definitions. */
const REF_NAMES = {
  'com.atproto.repo.strongRef': 'strongRef',
  'app.bsky.richtext.facet': 'richtext facet',
  'pub.leaflet.pages.linearDocument': 'Leaflet linear document',
};

/** Locate the installed lexicon package, which pins the schema version the documentation describes. */
function packageDir() {
  const manifest = require.resolve('@hypercerts-org/lexicon/package.json', { paths: [process.cwd(), __dirname] });
  return dirname(manifest);
}

function packageVersion() {
  return JSON.parse(readFileSync(join(packageDir(), 'package.json'), 'utf8')).version;
}

/** Load one lexicon document by NSID from the installed package. */
function loadLexicon(nsid) {
  const file = join(packageDir(), 'lexicons', ...nsid.split('.')) + '.json';
  if (!existsSync(file)) throw new Error(`Unknown lexicon "${nsid}". Check the NSID or update @hypercerts-org/lexicon.`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

function sourceUrl(nsid) {
  return `${LEXICON_REPO}/blob/v${packageVersion()}/lexicons/${nsid.split('.').join('/')}.json`;
}

function escapeCell(text) {
  return String(text || '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
}

/** Render a reference as readable text, linking local definitions and documented lexicons. */
function refLabel(ref, nsid) {
  if (ref.startsWith('#')) return `[\`${ref.slice(1)}\`](#${ref.slice(1).toLowerCase()})`;
  const [target, def] = ref.split('#');
  if (target === nsid && def) return `[\`${def}\`](#${def.toLowerCase()})`;
  const name = REF_NAMES[ref] || REF_NAMES[target] || (def ? `${target}#${def}` : target);
  const route = LEXICON_ROUTES[target];
  if (!route) return `\`${name}\``;
  return `[\`${name}\`](${def && def !== 'main' ? `${route}#${def.toLowerCase()}` : route})`;
}

/** Name the record a strong reference points to, taken from the schema's "must conform with the lexicon" convention. */
function strongRefLabel(description) {
  const text = String(description || '');
  const target = text.match(/conform (?:with|to) the lexicon ([a-z]+(?:\.[a-zA-Z]+)+)/)?.[1]
    || text.match(/[Rr]eferences? to (?:an? )?([a-z]+(?:\.[a-zA-Z]+){2,}) records?/)?.[1];
  if (!target) return '`strongRef`';
  const route = LEXICON_ROUTES[target];
  return `\`strongRef\` → ${route ? `[\`${target}\`](${route})` : `\`${target}\``}`;
}

/** Describe a property's type in a compact, human-readable form. */
function typeLabel(prop, nsid) {
  switch (prop.type) {
    case 'string':
      return prop.format ? `string (${prop.format})` : 'string';
    case 'array':
      return `array of ${typeLabel({ ...prop.items, description: prop.items.description || prop.description }, nsid)}`;
    case 'ref':
      return prop.ref === 'com.atproto.repo.strongRef' ? strongRefLabel(prop.description) : refLabel(prop.ref, nsid);
    case 'union':
      return `union: ${prop.refs.map(ref => refLabel(ref, nsid)).join(', ')}`;
    case 'cid-link':
      return 'CID link';
    default:
      return prop.type;
  }
}

/** Collect validation rules that the schema enforces, shown next to the description. */
function constraints(prop) {
  const rules = [];
  for (const key of ['minLength', 'maxLength', 'minGraphemes', 'maxGraphemes', 'minimum', 'maximum', 'maxSize']) {
    if (prop[key] === undefined) continue;
    const label = prop.type === 'array' && key.endsWith('Length') ? key.replace('Length', 'Items') : key;
    rules.push(`${label}: ${prop[key]}`);
  }
  if (prop.type === 'array' && prop.items) {
    for (const key of ['maxLength', 'maxGraphemes', 'maxSize']) {
      if (prop.items[key] !== undefined) rules.push(`item ${key}: ${prop.items[key]}`);
    }
  }
  if (prop.accept) rules.push(`accept: ${prop.accept.join(', ')}`);
  if (prop.const !== undefined) rules.push(`const: ${prop.const}`);
  if (prop.default !== undefined) rules.push(`default: ${prop.default}`);
  const code = rules.map(rule => `\`${rule}\``).join(' ');
  const values = prop.enum || prop.knownValues || prop.items?.knownValues || prop.items?.enum;
  const valueText = values ? ` ${prop.enum || prop.items?.enum ? 'One of' : 'Known values'}: ${values.map(value => `\`${value}\``).join(', ')}.` : '';
  return `${code ? ` ${code}` : ''}${valueText}`;
}

function propertyTable(object, nsid, { requiredColumn = false } = {}) {
  const required = new Set(object.required || []);
  const rows = Object.entries(object.properties || {}).map(([name, prop]) => {
    const cells = [`\`${name}\``, typeLabel(prop, nsid)];
    if (requiredColumn) cells.push(required.has(name) ? 'Yes' : 'No');
    cells.push(`${escapeCell(prop.description)}${constraints(prop)}`);
    return `| ${cells.join(' | ')} |`;
  });
  const header = requiredColumn ? '| Property | Type | Required | Description |\n|---|---|---|---|' : '| Property | Type | Description |\n|---|---|---|';
  return `${header}\n${rows.join('\n')}`;
}

function splitProperties(object, required) {
  const pick = (names) => ({ properties: Object.fromEntries(Object.entries(object.properties || {}).filter(([name]) => names(name))) });
  return {
    requiredProps: pick(name => required.has(name)),
    optionalProps: pick(name => !required.has(name)),
  };
}

/** Render one lexicon's schema as Markdown: record key, required and optional properties, and local definitions. */
function renderLexiconSchema(nsid) {
  const lexicon = loadLexicon(nsid);
  const main = lexicon.defs.main;
  const parts = [];

  if (main?.type === 'record') {
    const object = main.record;
    const required = new Set(object.required || []);
    const { requiredProps, optionalProps } = splitProperties(object, required);
    parts.push(`**Record key:** \`${main.key}\` · **Lexicon version:** ${packageVersion()} · [View the schema](${sourceUrl(nsid)})`);
    if (Object.keys(requiredProps.properties).length) parts.push(`### Required properties\n\n${propertyTable(requiredProps, nsid)}`);
    if (Object.keys(optionalProps.properties).length) parts.push(`### Optional properties\n\n${propertyTable(optionalProps, nsid)}`);
  } else if (main?.type === 'object') {
    parts.push(`**Type:** object, embedded in other records · **Lexicon version:** ${packageVersion()} · [View the schema](${sourceUrl(nsid)})`);
    parts.push(`### Properties\n\n${propertyTable(main, nsid, { requiredColumn: true })}`);
  } else {
    parts.push(`**Lexicon version:** ${packageVersion()} · [View the schema](${sourceUrl(nsid)})`);
  }

  const defs = Object.entries(lexicon.defs).filter(([name]) => name !== 'main');
  if (defs.length) {
    parts.push('### Definitions');
    for (const [name, def] of defs) {
      const body = def.type === 'object'
        ? propertyTable(def, nsid, { requiredColumn: true })
        : `Type: ${typeLabel(def, nsid)}.${constraints(def)}`;
      parts.push(`#### \`${name}\`\n\n${escapeCell(def.description)}\n\n${body}`);
    }
  }

  return parts.join('\n\n');
}

/** Files a page's generated schema depends on, so dev servers and build caches rebuild when they change. */
function lexiconDependencies(markdown) {
  const files = [__filename, join(packageDir(), 'package.json')];
  for (const [, nsid] of markdown.matchAll(SCHEMA_MARKER)) {
    files.push(join(packageDir(), 'lexicons', ...nsid.split('.')) + '.json');
  }
  return files;
}

/** Expand lexicon schema markers so rendering, search, and raw Markdown share the generated tables. */
function expandLexiconMarkdown(markdown) {
  return markdown.replace(SCHEMA_MARKER, (_, nsid) => renderLexiconSchema(nsid));
}

module.exports = { SCHEMA_MARKER, expandLexiconMarkdown, lexiconDependencies, renderLexiconSchema, loadLexicon, packageVersion };
