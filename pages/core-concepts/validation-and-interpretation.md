---
title: Validation, Extension & Interpretation
description: How structural Lexicon validation differs from semantic compatibility, and how clients handle extensions and derived views.
---

# Validation, Extension & Interpretation

Passing Lexicon validation means a record has an accepted structural shape. It does not mean the record is true, authorized, complete, discoverable, or useful for a particular decision.

## Three layers of validation

| Layer | Typical checks | Who performs them |
|---|---|---|
| **Structural** | Required fields, primitive formats, lengths, unions, and referenced object shapes | SDKs, clients, validators, and indexers |
| **Semantic** | Expected target collection, project convention, numeric ranges, chronology, tag policy, and role consistency | Compatible applications and indexers |
| **Trust and policy** | Publisher authority, evaluator independence, evidence quality, payment verification, moderation, and ranking | Each application, community, or decision-maker |

A PDS stores AT Protocol repository records. Do not assume it enforces every Hypercerts domain rule. Writers should validate before publication, and readers should validate untrusted records again.

## Constraints beyond the Lexicons

Several released conventions cannot be fully expressed by the schemas:

- A project is a collection with `type: "project"`; `type` is optional and open.
- Most strong-reference fields structurally accept any strong reference even when their descriptions name expected target collections.
- Numeric amounts, weights, measurements, and scores are strings; meaningful ranges and arithmetic require application checks.
- Required arrays can still be empty unless a minimum length is declared.
- Date ordering, hierarchy cycles, record-key conventions, and cross-field equality require additional validation.
- A named contributor, evaluator, issuer, sender, or recipient is not automatically the repository publisher.

Compatible clients should document which of these rules they enforce on writes, reads, or both.

## Open values and unknown data

AT Protocol `knownValues` are not closed enums. A value outside the published list can remain structurally valid. Open unions similarly allow later record shapes.

Readers should:

1. Preserve unknown fields and values when round-tripping data.
2. Display a safe fallback instead of assigning an invented meaning.
3. Avoid rejecting an entire graph because one connected record is unknown.
4. Record which Lexicon package version and usage conventions they support.

## Extending the model

Use a standard `org.hypercerts.*` or `app.certified.*` field when it fits the intended meaning. When an application needs data outside those schemas, publish a separate namespaced record that references the standard subject rather than adding unregistered fields and expecting other clients to interpret them.

An extension becomes interoperable only when other consumers know its Lexicon and usage. Default Hypercerts indexers are not required to ingest application-specific namespaces.

## Aggregation and derived views

Search results, backlinks, totals, scores, and hydrated project views are derived from an indexer's observed records. They should retain links to source AT-URIs and state material policies such as:

- Included repositories and record collections.
- Accepted versions and extensions.
- Handling of updates, deletions, and stale strong references.
- Deduplication and conflict rules.
- Trusted publishers or vocabulary authorities.
- Moderation and ranking behavior.

Derived data should not overwrite or masquerade as source assertions. Two indexers can legitimately produce different views from different coverage or policies.

## Current compatibility boundary

There are no ratified Hypercerts conformance classes or universal test suite. The current compatibility baseline is the released Lexicons plus documented shared conventions. API availability, SDK behavior, service support, and user-facing workflows have their own versions and should not be inferred from record schemas.

Continue to [Client Integration](/client-integration) for tested implementation paths or [Reference](/reference) for exact contracts.
