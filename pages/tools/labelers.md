---
title: Labelers
description: AT Protocol labelers used in the Certified and Hypercerts ecosystem.
---

# Labelers

Labelers are AT Protocol services that publish signed labels on accounts or records so other apps can consume them. In this ecosystem, they are used to score record quality, detect likely test data, and publish reusable quality signals. For the underlying protocol, see the official [AT Protocol labels spec](https://atproto.com/specs/label).

## What labelers do here

The current labelers are quality-labeling services built on top of AT Protocol data.

- They ingest records from the network
- Evaluate them with project-specific criteria
- Publish signed labels through standard AT Protocol labeler endpoints
- Let other apps consume those labels as reusable quality signals

## How these labelers are set up

Both labelers use a shared Tap-based ingestion pipeline:

```text
AT Protocol Relay → Tap ingestion/backfill → Scoring or classification → Signed AT Protocol labels
```

In practice, this means:

1. **Tap ingests records** from the AT Protocol network
2. **Tap backfills older records** and keeps streaming new ones live
3. **Each labeler applies its own rubric** to the ingested records
4. **Signed labels are published** using the standard AT Protocol labeler interface

The shared ingestion layer is the same, but each labeler targets different record types and applies different criteria.

## Hyperlabel

**Production:** [hyperlabel-production.up.railway.app](https://hyperlabel-production.up.railway.app/)  
**Docs:** [hyperlabel-production.up.railway.app/docs](https://hyperlabel-production.up.railway.app/docs)

Hyperlabel scores the quality of hypercert activity records and publishes labels that help distinguish well-formed records from drafts, placeholders, or likely test data.

### What it labels

Hyperlabel watches:

- `org.hypercerts.claim.activity`

It ingests those records through Tap, evaluates them, and publishes signed labels based on their quality tier.

### How it is set up

Hyperlabel uses Tap to discover repos, backfill historical activity records, and stream live updates. Once a record is ingested, the labeler scores it, stores the result for the dashboard, and publishes the matching AT Protocol label.

### Criteria

Hyperlabel evaluates activity records across these main criteria:

- Title quality
- Summary quality
- Description quality
- Image present
- Work scope present
- Contributors present and detailed
- Locations present
- Date range present
- Rights present

It also applies penalties and test-detection heuristics for low-quality patterns such as placeholder text, repeated content, or obviously junk records. It also includes an asynchronous Hugging Face classification step that can downgrade non-meaningful content to a likely-test label.

## Orglabeler

**Production:** [orglabeler-production.up.railway.app](https://orglabeler-production.up.railway.app/)  
**Docs:** [orglabeler-production.up.railway.app/docs](https://orglabeler-production.up.railway.app/docs)

Orglabeler scores the quality of certified organization data and publishes labels that reflect how complete and credible an organization record looks.

### What it labels

Orglabeler ingests both:

- `app.certified.actor.profile`
- `app.certified.actor.organization`

It merges these records by DID for context, then applies labels to the **organization record URI**.

### How it is set up

Orglabeler uses Tap to ingest both profile and organization records, backfill older data, and stream new events. It merges profile and organization records by DID, uses that combined context during scoring, and then publishes a signed AT Protocol label on the organization record.

### Criteria

Orglabeler evaluates organization quality using criteria such as:

- Display name
- Description
- Organization type
- Profile website present
- Profile website resolves
- Profile website matches name
- Organization URLs present
- Organization URLs resolve
- Location valid
- Founded date valid
- Founded date age bonus
- Avatar present
- Banner present

It also runs an authenticity gate before completeness scoring. Obvious junk, placeholder, or test-style values are forced into the likely-test tier even if other fields are present.

## See also

- [Certified Services](/reference/certified-services)
- [Hyperindex](/tools/hyperindex)
