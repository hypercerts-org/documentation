---
title: Glossary
description: Key terms and definitions used in the Hypercerts Protocol.
---

# {% $markdoc.frontmatter.title %}

{% $markdoc.frontmatter.description %}

---

#### Activity Claim

The central record in the hypercerts data model. Describes who did what, when, and where. Lexicon: `org.hypercerts.claim.activity`.

#### AT Protocol (ATProto)

A decentralized social data protocol. The data layer for Hypercerts. Provides portable identity, shared schemas, and federation.

#### CID

Content Identifier. A cryptographic hash of a record's content, used in strong references to ensure tamper-evidence.

#### Collection

A group of hypercerts with a shared property, where each claim has a weight. Lexicon: `org.hypercerts.claim.collection`.

#### Contribution

A record describing a specific contributor's role in an activity claim. Lexicon: `org.hypercerts.claim.contribution`.

#### DID (Decentralized Identifier)

A DID is a permanent, cryptographically verifiable identifier for a user or organization. It looks like `did:plc:abc123xyz`. When you create an account on [certified.app](https://certified.app) or [Bluesky](https://bsky.app), you get a DID. Your DID never changes, even if you switch servers or handles.

Every record you create carries your DID as the author. This enables persistent identity across platforms — your contribution history, evaluation track record, and trust signals follow you everywhere.

#### Evaluation

A third-party assessment of a hypercert or other claim. Created on the evaluator's own PDS. Lexicon: `org.hypercerts.claim.evaluation`.

#### Evidence

A piece of supporting documentation attached to a hypercert. Can be a URI or uploaded blob. Lexicon: `org.hypercerts.claim.evidence`.

#### Hypercert

A structured digital record of a contribution: who did what, when, where, and with what evidence. The core primitive of the protocol.

#### Indexer (App View)

A service that reads from relays and builds queryable views of hypercert data across many PDS instances.

#### Lexicon

A lexicon is a versioned JSON schema that defines the structure of a record type. For example, `org.hypercerts.claim.activity` defines the fields for an activity claim: title, description, workScope, workTimeframe, rights, etc.

Lexicons enable interoperability. Any app that knows the `org.hypercerts.claim.activity` lexicon can parse activity claims, regardless of which app created them. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons) for details.

#### Measurement

A quantitative observation attached to a claim. Lexicon: `org.hypercerts.claim.measurement`.

#### PDS (Personal Data Server)

A PDS is where your data lives. It's a server that stores your repository — the collection of all records you've created. You can host your PDS yourself, use a provider like the Hypercerts Foundation, or switch providers at any time without losing data.

Applications read from your PDS via XRPC (the API protocol ATProto uses). They don't own your data — they're views over it. If an app shuts down, your records remain on your PDS.

#### Relay

An ATProto service that aggregates data from many PDS instances and streams it to indexers.

#### Repository

A repository is a user's collection of records, identified by their DID. It's structured as a Merkle Search Tree (MST) — a content-addressed data structure that provides cryptographic integrity and efficient syncing.

When you create a record, it's added to your repository. The repository is versioned — every change produces a new commit with a unique CID (content hash). This makes the repository tamper-evident and auditable.

#### Rights

A record describing what rights a holder has to a hypercert (display, transfer, etc.). Lexicon: `org.hypercerts.claim.rights`.

#### SDS (Shared Data Server)

Like a PDS but for organizations. Multiple users can write to the same repository.

#### Strong Reference

An ATProto reference that includes both the AT URI and CID of the target record, ensuring the reference is tamper-evident.

#### Work Scope

The "what" dimension of a hypercert, defined using logical operators (allOf, anyOf, noneOf) to precisely bound the work being claimed.

#### XRPC

XRPC is the HTTP-based API protocol ATProto uses. Applications call XRPC methods to read and write records. For example, `com.atproto.repo.createRecord` creates a new record on a PDS. `com.atproto.repo.getRecord` fetches an existing record by AT-URI.

The Hypercerts SDK wraps XRPC calls in a developer-friendly interface — you don't need to construct XRPC requests manually.
