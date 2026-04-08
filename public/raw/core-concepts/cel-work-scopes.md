---
title: CEL Work Scopes
description: How CEL (Common Expression Language) makes hypercert work scopes machine-readable, composable, and queryable.
---

# CEL Work Scopes

Hypercert work scopes describe what work was done. A CEL expression alongside the human-readable work scope makes hypercerts machine-verifiable, composable, and queryable.

[CEL (Common Expression Language)](https://github.com/google/cel-spec) is an open-source expression language built by Google for evaluating conditions in distributed systems. It's used by Kubernetes, Firebase, and Google Cloud IAM.

## Why structured scopes matter

A community in coastal Kenya mints a hypercert for "mangrove restoration and environmental education." A collective in Uganda creates one for "agroforestry with beekeeping." A drone operator in the Amazon documents "biodiversity monitoring in the Negro River region." These are all legible to a person reading them one at a time. They're invisible to any system trying to connect funders to relevant work at scale.

As the Hypercerts Protocol grows on ATProto — with actions, evaluations, and evidence living as persistent, portable records — the richer the network becomes, the harder it is to find, compare, validate, and compose claims when the most important field is unstructured text.

## Architecture: two layers

The design uses two complementary layers:

1. **Vocabulary layer** — `workScopeTag` records define what each tag *means* (e.g., what `mangrove_restoration` refers to, its description, hierarchy, and links to external ontologies).
2. **Composition layer** — `celExpression` objects compose those tags into evaluable logic on activity records (e.g., "this work includes mangrove restoration AND environmental education, AND is in Kenya").

```text
workScopeTag records (vocabulary)
  ├── mangrove_restoration
  ├── environmental_education
  ├── fishpond_management
  └── ecotourism

           ↓ referenced by

celExpression (composition)
  expression: scope.hasAll(['mangrove_restoration', 'environmental_education'])
                && scope.hasAny(['fishpond_management', 'ecotourism'])
                && location.country == 'KE'
  usedTags: [strongRef → mangrove_restoration, strongRef → environmental_education, ...]

           ↓ embedded in

activity.workScope (union)
  → celExpression   (structured, machine-evaluable)
  → workScopeString (simple free-form fallback)
```

The vocabulary layer tells you what a tag means. The composition layer tells you what logic applies to a specific hypercert. The `workScopeString` fallback supports simple free-form scopes.

## Lexicon schemas

### `org.hypercerts.ontology.celExpression`

A CEL expression object embedded inline in the `activity.workScope` union. It's intentionally an `object` type (not a `record`) so it can be embedded directly without requiring a separate collection.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `expression` | `string` | Yes | A CEL expression encoding the work scope conditions. Max 10,000 characters. |
| `usedTags` | `strongRef[]` | Yes | Strong references to `workScopeTag` records used in the expression. Enables fast indexing by AT-URI and provides referential integrity. Max 100 entries. |
| `version` | `string` | Yes | CEL context schema version. Known values: `v1`. Open enum — new versions can be added non-breakingly. |
| `createdAt` | `datetime` | Yes | Client-declared timestamp when this expression was originally created. |

### `org.hypercerts.ontology.workScopeTag`

A reusable scope atom — the building block of the vocabulary. Each record represents a single concept like `mangrove_restoration` or `biodiversity_monitoring`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | `string` | Yes | Lowercase, underscore-separated machine-readable key (e.g., `mangrove_restoration`). Used as the canonical identifier in CEL expressions. |
| `label` | `string` | Yes | Human-readable display name. |
| `kind` | `string` | No | Category type. Known values: `topic`, `language`, `domain`, `method`, `tag`. |
| `description` | `string` | No | Longer explanation of the scope. |
| `parent` | `strongRef` | No | Reference to a parent `workScopeTag` for taxonomy/hierarchy support. |
| `status` | `string` | No | Lifecycle status. Known values: `proposed`, `accepted`, `deprecated`. Communities propose tags, curators accept them, deprecated tags point to replacements. |
| `supersededBy` | `strongRef` | No | When status is `deprecated`, points to the replacement `workScopeTag`. |
| `aliases` | `string[]` | No | Alternative names or identifiers for this scope. |
| `sameAs` | `uri[]` | No | Links to equivalent concepts in external ontologies (e.g., Wikidata QIDs, ENVO terms, SDG targets). |
| `externalReference` | `uri \| blob` | No | External reference as a URI or blob. |
| `createdAt` | `datetime` | Yes | Client-declared timestamp when this record was originally created. |

### `activity.workScope` union

The `workScope` field on `org.hypercerts.claim.activity` accepts two variants:

- **`celExpression`** — a structured, machine-evaluable scope (described above).
- **`workScopeString`** — a simple free-form string for cases where a CEL expression isn't needed.

## Examples

### Mangrove restoration in coastal Kenya

```json
{
  "$type": "org.hypercerts.claim.activity",
  "title": "Tsunza Mangrove Restoration & Education",
  "workScope": {
    "$type": "org.hypercerts.ontology.celExpression",
    "expression": "scope.hasAll(['mangrove_restoration', 'environmental_education']) && scope.hasAny(['fishpond_management', 'ecotourism']) && location.country == 'KE'",
    "usedTags": [
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/mangrove_restoration", "cid": "..." },
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/environmental_education", "cid": "..." },
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/fishpond_management", "cid": "..." },
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/ecotourism", "cid": "..." }
    ],
    "version": "v1",
    "createdAt": "2025-07-22T10:00:00Z"
  },
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z"
}
```

### Agroforestry in Uganda

```json
{
  "workScope": {
    "$type": "org.hypercerts.ontology.celExpression",
    "expression": "scope.hasAll(['agroforestry', 'tree_planting', 'beekeeping']) && location.country == 'UG'",
    "usedTags": [
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/agroforestry", "cid": "..." },
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/tree_planting", "cid": "..." },
      { "uri": "at://did:plc:curator/org.hypercerts.ontology.workScopeTag/beekeeping", "cid": "..." }
    ],
    "version": "v1",
    "createdAt": "2025-06-15T08:00:00Z"
  }
}
```

## What CEL unlocks

### Funder matching

Funders can define their criteria as CEL expressions and the appview matches them against existing hypercerts:

```cel
// "All mangrove work in East Africa"
scope.has("mangrove_restoration") && location.country in ["KE", "TZ", "MZ", "MG"]
```

### Evaluation matching

An auditor who verified mangrove survival rates can express applicability as a CEL condition, and the appview automatically matches it to relevant hypercerts:

```cel
scope.has("mangrove_restoration")
  && location.country == "KE"
  && time.end >= timestamp("2025-01-01T00:00:00Z")
```

### Overlap detection

When someone mints a new hypercert, CEL can check whether the claimed work scope overlaps with existing claims:

```cel
existing.scope.overlaps(new.scope)
  && existing.time.start < new.time.end
  && new.time.start < existing.time.end
  && existing.location.region == new.location.region
```

### Measurement-based queries

Because CEL can access linked measurement records, funders can write queries that go beyond tags:

```cel
// "Agroforestry that planted 500+ verified trees"
scope.has("agroforestry")
  && measurements.exists(m, m.metric == "trees_planted" && m.value >= 500)
```

## CEL context schema (v1)

Every CEL expression evaluates against a typed context. Each variable maps to data already present in the activity record and its linked records.

| Variable | Type | Source | Description |
|----------|------|--------|-------------|
| `scope` | `ScopeSet` | `usedTags` on the CEL expression | The set of `workScopeTag` keys |
| `location` | `Location` | Linked location records | Geo context |
| `time` | `TimeRange` | `startDate` / `endDate` on activity | Work time range |
| `contributors` | `list(Contributor)` | Contributors on activity | Contributor DIDs and roles |
| `measurements` | `list(Measurement)` | Linked measurement records | Measurement data |
| `evidence` | `list(Evidence)` | Linked attachment records | Evidence / attachments |

### Custom functions on `ScopeSet`

| Function | Signature | Semantics |
|----------|-----------|-----------|
| `has` | `ScopeSet.has(string) → bool` | True if label key is present |
| `hasAll` | `ScopeSet.hasAll(list(string)) → bool` | True if every key is present |
| `hasAny` | `ScopeSet.hasAny(list(string)) → bool` | True if at least one is present |
| `overlaps` | `ScopeSet.overlaps(ScopeSet) → bool` | True if the two sets share any key |

## Starter tag vocabulary

`workScopeTag` records are published as ATProto records that anyone can reference via strong references. [Certified](https://certified.app) publishes curated tag sets for specific domains. Here's an example for regenerative work:

| Domain | Example tags |
|--------|-------------|
| Agroforestry | `agroforestry`, `shade_trees`, `coffee_cultivation`, `beekeeping` |
| Forest conservation | `forest_protection`, `reforestation`, `tree_planting` |
| Marine / coastal | `mangrove_restoration`, `fishpond_management`, `coral_reef` |
| Biodiversity monitoring | `biodiversity_data_collection`, `drone_imagery`, `bioacoustics`, `edna` |
| Carbon / climate | `carbon_sequestration`, `emissions_reduction`, `soil_carbon` |
| Community livelihoods | `community_data_income`, `ecotourism`, `artisanal_crafts` |
| Education & capacity | `environmental_education`, `capacity_building`, `workshops` |

Anyone can create `workScopeTag` records for other domains. Communities don't write CEL by hand — the vocabulary powers a visual builder, and the structured expression gets generated behind the scenes.

## Where CEL lives in the stack

CEL doesn't need to run onchain. The evaluation layer belongs alongside the ATProto infrastructure:

| Layer | What lives here |
|-------|----------------|
| **ATProto records** | `workScopeTag` records define the vocabulary. Activity records carry the human-readable scope + CEL expression. |
| **Appview / indexer** | CEL parsing and evaluation (using `cel-go`, `cel-rust`, or `cel-js`). Handles validation, querying, overlap detection, evaluation matching. |
| **Client UI** | A scope builder that helps communities construct valid CEL from the `workScopeTag` vocabulary — no code writing required. |

## Further reading

- [CEL specification](https://github.com/google/cel-spec)
- [Core Data Model](/core-concepts/hypercerts-core-data-model) — how records connect
- [Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) — the `workScope` field in context
