const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync, statSync } = require('node:fs');
const { createRequire } = require('node:module');
const { dirname, join, relative } = require('node:path');

const ROOT = join(__dirname, '..');
const PAGES_DIR = join(ROOT, 'pages', 'lexicons');

const packageDir = dirname(require.resolve('@hypercerts-org/lexicon/package.json', { paths: [ROOT] }));
// The validator ships as a dependency of the lexicon package, so resolve it from there.
const { Lexicons, jsonToLex } = createRequire(join(packageDir, 'package.json'))('@atproto/lexicon');

function walk(dir, extension) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full, extension);
    return name.endsWith(extension) ? [full] : [];
  });
}

/** Load every schema in the installed package and note which ones define a record. */
function loadLexicons() {
  const lexicons = new Lexicons();
  const recordTypes = new Set();
  for (const file of walk(join(packageDir, 'lexicons'), '.json')) {
    const doc = JSON.parse(readFileSync(file, 'utf8'));
    lexicons.add(doc);
    if (doc.defs?.main?.type === 'record') recordTypes.add(doc.id);
  }
  return { lexicons, recordTypes };
}

const { lexicons, recordTypes } = loadLexicons();

/** Collect the fenced JSON examples on the Lexicon reference pages that are complete records. */
function recordExamples() {
  const examples = [];
  for (const file of walk(PAGES_DIR, '.md')) {
    const markdown = readFileSync(file, 'utf8');
    for (const [, block] of markdown.matchAll(/```json\n([\s\S]*?)```/g)) {
      let value;
      try {
        value = JSON.parse(block);
      } catch {
        continue; // fragments such as `"rights": { ... }` are not standalone JSON
      }
      if (recordTypes.has(value?.$type)) examples.push({ page: relative(ROOT, file), type: value.$type, value });
    }
  }
  return examples;
}

const examples = recordExamples();

test('lexicon pages contain record examples', () => {
  assert.ok(examples.length > 0, 'expected at least one record example on the Lexicon pages');
});

for (const example of examples) {
  test(`${example.page}: ${example.type} example validates against the installed schema`, () => {
    assert.doesNotThrow(() => lexicons.assertValidRecord(example.type, jsonToLex(example.value)));
  });
}
