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

A persistent, cryptographically verifiable identifier for a person or organization. Format: `did:plc:...`. Resolved via the PLC directory.

#### Evaluation

A third-party assessment of a hypercert or other claim. Created on the evaluator's own PDS. Lexicon: `org.hypercerts.claim.evaluation`.

#### Evidence

A piece of supporting documentation attached to a hypercert. Can be a URI or uploaded blob. Lexicon: `org.hypercerts.claim.evidence`.

#### Hypercert

A structured digital record of a contribution: who did what, when, where, and with what evidence. The core primitive of the protocol.

#### Indexer (App View)

A service that reads from relays and builds queryable views of hypercert data across many PDS instances.

#### Lexicon

An ATProto schema definition that specifies the structure of a record type. Like a form template with required and optional fields.

#### Measurement

A quantitative observation attached to a claim. Lexicon: `org.hypercerts.claim.measurement`.

#### PDS (Personal Data Server)

A server that stores a user's ATProto data. Users can self-host or use a provider.

#### Relay

An ATProto service that aggregates data from many PDS instances and streams it to indexers.

#### Rights

A record describing what rights a holder has to a hypercert (display, transfer, etc.). Lexicon: `org.hypercerts.claim.rights`.

#### SDS (Shared Data Server)

Like a PDS but for organizations. Multiple users can write to the same repository.

#### Strong Reference

An ATProto reference that includes both the AT URI and CID of the target record, ensuring the reference is tamper-evident.

#### Work Scope

The "what" dimension of a hypercert, defined using logical operators (allOf, anyOf, noneOf) to precisely bound the work being claimed.

#### XRPC

The RPC protocol used by ATProto for client-server communication.
