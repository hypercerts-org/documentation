---
title: "Release Notes: hypercerts-lexicon v0.11.0"
description: Breaking changes, new lexicons, and schema refinements in hypercerts-lexicon v0.11.0.
---

# Release Notes: hypercerts-lexicon v0.11.0

{% callout type="warning" %}
**This release contains breaking changes.** If you are upgrading from v0.10.0, read the [breaking changes](#breaking-changes) section carefully before updating.
{% /callout %}

Released April 7, 2026. View the full release on [GitHub](https://github.com/hypercerts-org/hypercerts-lexicon/releases/tag/v0.11.0).

```bash
npm install @hypercerts-org/lexicon@0.11.0
```

---

## New lexicons

### EVM identity linking

**`app.certified.link.evm`** — A new record type for creating verifiable links between ATProto identities and EVM wallet addresses. Each record contains a cryptographic proof (currently EIP-712 typed data signatures for EOA wallets) that binds a DID to an Ethereum address onchain.

The `proof` field is an open union, so future signature methods (ERC-1271, ERC-6492) can be added without breaking existing records.

```json
{
  "address": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  "proof": {
    "$type": "app.certified.link.evm#eip712Proof",
    "signature": "0x...",
    "message": {
      "did": "did:plc:abc123",
      "evmAddress": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      "chainId": "1",
      "timestamp": "1711929600",
      "nonce": "0"
    }
  },
  "createdAt": "2026-04-03T00:00:00.000Z"
}
```

### Vendored Leaflet and richtext lexicons

**`pub.leaflet.*`** and **`pub.leaflet.richtext.facet`** — The package now ships the full set of Leaflet block and richtext facet lexicon JSON files (17 files). Previously, these external schemas were shimmed at the TypeScript type level via `@atcute` packages, which caused `LexiconDefNotFoundError` at runtime when validating records with `description` or facet fields. Vendoring them fixes runtime validation and removes the `@atcute/leaflet` and `@atcute/bluesky` dependencies.

This is a **packaging change**, not a schema change. No record structures are affected.

---

## Breaking changes

This release includes three breaking schema changes. All were identified early enough in adoption that the team decided the long-term gains outweigh the migration cost.

### Evaluation scores are now strings

**`org.hypercerts.context.evaluation`**

The `min`, `max`, and `value` fields on evaluation scores changed from `integer` to `string`. ATProto has no native decimal type, and integer-only scores made use cases like "3.7 out of 5" impossible.

```diff
  // Before
- { "min": 0, "max": 10, "value": 7 }
  // After
+ { "min": "0", "max": "10", "value": "7.5" }
```

| Consumer | Action |
| --- | --- |
| Indexers | Change column type from `INTEGER` to `TEXT`. Backfill existing records. Update any numeric sorting or filtering logic. |
| AppViews | Parse scores as strings. Use `parseFloat()` for numeric display where appropriate. |
| Frontend | Handle both numeric strings (`"3.7"`) and potentially non-numeric strings (`"A+"`) in display components. |

### Badge references are now strong refs

**`app.certified.badge.award`** and **`app.certified.badge.response`**

Badge awards and responses now reference their parent records via `com.atproto.repo.strongRef` instead of plain lexicon refs. Strong references include both a URI and a content hash (CID), pinning the reference to a specific version of the badge definition.

```diff
  // Before
- "badge": "at://did:plc:abc/app.certified.badge.definition/123"
  // After
+ "badge": {
+   "uri": "at://did:plc:abc/app.certified.badge.definition/123",
+   "cid": "bafyrei..."
+ }
```

| Consumer | Action |
| --- | --- |
| Indexers | Update parsing to expect `{ uri, cid }` objects instead of plain URI strings for `badge` and `badgeAward` fields. |
| AppViews | Update resolution logic. Dereference using both `uri` and `cid` for content verification. |
| SDK consumers | Regenerate types. Any code constructing badge awards or responses must supply the full strong ref. |

### Funding receipt fields normalized

**`org.hypercerts.funding.receipt`**

The `from`, `to`, and `for` fields have been reworked for consistency and stronger type safety.

| Field | Before (v0.10.0) | After (v0.11.0) |
| --- | --- | --- |
| `from` | Required, DID ref | **Optional**, union of `#text` \| `app.certified.defs#did` \| `com.atproto.repo.strongRef` |
| `to` | Plain string | Union of `#text` \| `app.certified.defs#did` \| `com.atproto.repo.strongRef` |
| `for` | AT-URI string | `com.atproto.repo.strongRef` (pins to a specific record version) |

The `from` and `to` fields were asymmetric — `from` required an AT Protocol identity while `to` accepted any string. Now both are three-way unions that accept a free-text string (`#text`), a DID, or a strong reference. This treats senders and recipients uniformly while preserving the ability to reference non-ATProto participants. `from` is also optional, properly supporting anonymous funding. `for` is now a strong ref, ensuring the receipt always points to the exact version of the activity it funded.

```diff
  // Before
- "from": { "$type": "app.certified.defs#did", "did": "did:plc:sender" },
- "to": "did:plc:recipient",
- "for": "at://did:plc:abc/org.hypercerts.claim.activity/123"

  // After — with a DID
+ "from": { "$type": "app.certified.defs#did", "did": "did:plc:sender" },
+ "to": { "$type": "app.certified.defs#did", "did": "did:plc:recipient" },

  // After — with a free-text identifier
+ "to": { "$type": "org.hypercerts.funding.receipt#text", "value": "0xAb58...eC9B" },

  // After — for field
+ "for": {
+   "uri": "at://did:plc:abc/org.hypercerts.claim.activity/123",
+   "cid": "bafyrei..."
+ }
```

| Consumer | Action |
| --- | --- |
| Indexers | Update parsing for `from`, `to` (now unions with `$type` discriminator), and `for` (now `{ uri, cid }`). Allow `NULL` for `from`. |
| AppViews | Update resolution logic for all three fields. Handle `#text` variants for display. |
| SDK consumers | Regenerate types. Code constructing receipts must supply union-typed `to` and strong ref `for`. |
| Frontend | Update forms to construct proper union objects. Handle `#text` for non-ATProto participants. Handle missing `from` for anonymous display. |

---

## Schema changes

{% callout %}
Even new optional fields require attention from indexers and AppViews. If an indexer doesn't store a new field, that data is silently lost for every downstream consumer. The changes below are non-breaking — existing records remain valid — but ignoring them means incomplete data.
{% /callout %}

### Known values

Several free-text string fields now declare `knownValues` — canonical values that establish interoperability conventions across the ecosystem. Custom values are still permitted.

| Lexicon | Field | Known values |
| --- | --- | --- |
| `org.hypercerts.collection` | `type` | `favorites` · `project` · `portfolio` · `program` |
| `org.hypercerts.context.attachment` | `contentType` | `report` · `audit` · `evidence` · `testimonial` · `methodology` |
| `app.certified.badge.definition` | `badgeType` | `endorsement` · `verification` · `participation` · `certification` · `affiliation` · `recognition` |

**Action:** Indexers should index these values for filtering and categorization. AppViews and frontends can use them for dropdowns, search facets, and display grouping. No schema migration required.

### Badge icon is now optional

**`app.certified.badge.definition`** — The `icon` field moved from `required` to optional. Not all badges have a visual representation — endorsements, participation records, and text-based certifications can now omit the icon entirely.

**Action:** Indexers should allow `NULL` in the icon column. Frontend developers must add a fallback or placeholder when rendering badges without an icon.

### Contributors array is uncapped

**`org.hypercerts.claim.activity`** — Removed the `maxLength: 1000` constraint on the `contributors` array. ATProto records have a natural 1 MB size limit (~2,000–4,000 contributors), making the artificial cap unnecessary.

**Action:** Remove any hardcoded length limits matching the old max. Frontends should implement pagination or lazy loading for large contributor lists.

### Rich text on collection short descriptions

**`org.hypercerts.collection`** — Added `shortDescriptionFacets`, an optional array of rich text facets (mentions, URLs, hashtags) that annotate the `shortDescription` field. This brings collections in line with activity claims, which already supported facets.

**Action:** Indexers must store the new field when present. AppViews should include facets in API responses. Frontends can render rich text using the standard ATProto facet model.

---

## Documentation improvements

- **Contributor and item defs** now have descriptions, improving TypeScript IntelliSense and AI code generation.
- **`occurredAt` vs `createdAt`** semantics clarified on funding receipts. `occurredAt` is when the funding happened in the real world; `createdAt` is when the record was written to the PDS.
- **Stale references** in board and measurement lexicon descriptions have been corrected.
- **README** rewritten with an ASCII namespace map and structured reference tables.
- **AI agent skill** added for downstream developers. Install via `npx skills add hypercerts-org/hypercerts-lexicon`.

---

## Upgrading

```bash
npm install @hypercerts-org/lexicon@0.11.0
```

The source of truth for lexicon definitions is the [NPM package](https://www.npmjs.com/package/@hypercerts-org/lexicon) and the published ATProto repository. The `main` branch on GitHub is a development branch — do not build production applications against it.

After upgrading, regenerate your TypeScript types and run your validation suite against the updated schemas. The package includes all lexicon JSON files and pre-built type definitions.
