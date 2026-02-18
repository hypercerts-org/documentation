---
title: Glossary
description: Key terms used in the Hypercerts documentation.
---

# Glossary

Terms you'll encounter when building with Hypercerts, ordered by how soon you'll need them.

---

#### Hypercert

A structured digital record of a contribution: who did what, when, where, and with what evidence. The core primitive of the protocol. Technically, a hypercert is an activity claim record with linked contributions, evidence, measurements, and evaluations.

#### Activity claim

The central record in the hypercerts data model. Describes the work that was done, when, and in what scope. Created using `repo.hypercerts.create()` in the SDK. Lexicon: `org.hypercerts.claim.activity`.

#### AT-URI

The permanent, globally unique identifier for a record. Looks like `at://did:plc:abc123/org.hypercerts.claim.activity/3k7`. You'll see these in every API response — they're how records reference each other.

#### DID (Decentralized Identifier)

A permanent identifier for a user or organization. Looks like `did:plc:abc123xyz`. You get one when you create an account on [certified.app](https://certified.app) or [Bluesky](https://bsky.app). Your DID never changes, even if you switch servers or handles. Every record you create carries your DID as the author.

#### CID (Content Identifier)

A cryptographic hash of a record's content. When you reference another record, you include both its AT-URI and CID — this makes the reference tamper-evident. If the record changes, the CID changes, and the mismatch is detectable.

#### Strong reference

A reference to another record that includes both the AT-URI and CID. Used when one record points to another (e.g., an evaluation referencing an activity claim). The CID ensures you're referencing a specific version of the record.

#### Evaluation

A third-party assessment of a hypercert. Created on the evaluator's own account, not the original author's. Lexicon: `org.hypercerts.claim.evaluation`.

#### Attachment

Supporting documentation linked to one or more records — a URL, uploaded file, or IPFS link. Can reference any record type, not only activity claims. Lexicon: `org.hypercerts.claim.attachment`.

#### Measurement

A quantitative observation attached to a hypercert (e.g., "12 pages written", "50 tons CO₂ reduced"). Lexicon: `org.hypercerts.claim.measurement`.

#### Contribution

A record describing a specific contributor's role in an activity claim, including their DID, role description, and date range. Lexicon: `org.hypercerts.claim.contribution`.

#### Collection

A group of hypercerts with a shared property, where each claim has a weight. Used for projects or portfolios. Lexicon: `org.hypercerts.claim.collection`.

#### Lexicon

A versioned schema that defines the structure of a record type. For example, `org.hypercerts.claim.activity` defines the required and optional fields for an activity claim. Lexicons enable interoperability — any app that knows the schema can read the record. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

#### Work scope

The "what" dimension of a hypercert, defined using logical operators (`allOf`, `anyOf`, `noneOf`) to precisely bound the work being claimed.

#### Hypergoat / Hyperindex

The AppView server that indexes hypercert records across the network and exposes them via a GraphQL API at `hypergoat.certified.app/graphql`. This is how applications query hypercert data without reading from individual servers directly.

#### PDS (Personal Data Server)

The server where your records are stored. You interact with it through the SDK — you don't need to manage it directly. You can use the Hypercerts Foundation's PDS, Bluesky's, or self-host one. Records are portable between PDS instances.

#### Certified

The ATProto identity provider for the Hypercerts ecosystem. When you sign up at [certified.app](https://certified.app), you get a DID, a PDS, and an embedded wallet. See [Account & Identity Setup](/getting-started/account-and-identity).
