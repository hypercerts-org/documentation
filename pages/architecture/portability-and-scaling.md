---
title: Public Data, Discovery & Portability
description: How source records, repository migration, relays, indexers, availability, and public-data limits differ.
---

# {% $markdoc.frontmatter.title %}

Hypercerts uses public AT Protocol repository records so independent applications can read and connect them. Publication, availability, discovery, and presentation are different operations, and none guarantees the others.

## Public source records

Records in the released Hypercerts and Certified collections should be treated as public. Do not publish secrets, private contact details, confidential applications, access tokens, or personal data that should not be replicated.

A source record being public does not mean every application will discover or display it. A reader may need its AT-URI, access to the current PDS, or an indexer that has observed it.

## Switching PDSs

AT-URIs use a DID rather than a server address. When an AT Protocol account migration preserves the DID, repository records can retain their identifiers after the DID document points to the new PDS.

Migration still depends on a correct repository transfer, DID update, supported account state, and consumers resolving the current DID document. Applications and stale caches do not necessarily update immediately. See the [AT Protocol account migration guide](https://atproto.com/guides/account-migration) for the protocol process.

## Discovery and indexed views

Cross-repository applications commonly use relays and indexers:

- A PDS hosts the current source repository.
- A relay observes repositories and emits events according to its crawl and policy scope.
- An indexer consumes selected events, resolves relationships, and builds queryable views.
- An application reads those views and may also fetch source records directly.

No index is inherently complete. Coverage can differ by repositories, collections, time range, moderation policy, retention, and failed ingestion. Applications should identify the source of aggregate claims and avoid presenting "not indexed" as "does not exist."

## Switching applications

Shared Lexicons make it possible for another application to parse a source record without a bilateral data export. Practical interoperability still depends on the second application supporting:

- The record's Lexicon version and shared usage conventions.
- Authentication and permissions for any writes.
- The relevant repository or indexer coverage.
- Unknown fields, record types, and values without data loss.
- Product-specific workflows that are not encoded in the protocol.

An application can therefore build on the same records without every application having identical features or trust policies.

## Updates, deletion, and persistence

Publishers can update and delete repository records. Other systems may retain prior versions, indexed copies, screenshots, exports, or references. Deleting the source is not a guarantee that all public copies disappear.

Consumers should distinguish:

- Current source state from cached or historical state.
- A missing record from one outside the indexer's coverage.
- An unavailable PDS from a deleted record.
- A strong reference to an older CID from a broken reference.

## Operational limits

Portability does not by itself guarantee availability. DIDs must resolve, PDSs must serve repositories, and indexing paths must remain healthy. Applications that depend on durable access should define retry, cache, source-verification, and outage behavior without presenting a cache as the source of truth.

Next: [Validation, Extension & Interpretation](/core-concepts/validation-and-interpretation).
