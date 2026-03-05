---
title: Architecture Overview
description: How the Hypercerts Protocol stack fits together.
---

# Architecture Overview

The Hypercerts Protocol uses AT Protocol for data portability. On-chain anchoring for ownership and funding is [planned](/core-concepts/funding-and-value-flow).

## The Hypercerts Stack

The protocol operates across three layers.

The **Data Layer** is the foundation. AT Protocol stores claims, attachments, and evaluations. Personal Data Servers (PDS) host user-controlled records. Relays aggregate data across servers. Indexers build queryable views that applications consume.

The **Application Layer** sits on top of the data layer. Funding platforms, dashboards, and evaluation tools live here. These applications read from and write to the data layer using the [ATProto API](https://atproto.com/docs) and [Hyperindex](/tools/hyperindex).

The **Ownership Layer** is planned but not yet implemented. The intended design freezes hypercerts and anchors them on-chain before funding — ensuring funders know exactly what they are paying for. See [Funding & Value Flow](/core-concepts/funding-and-value-flow) for details.

![The Hypercerts Stack](/images/architecture-stack.svg)

## Data Layer

ATProto components form a pipeline from user-controlled storage to globally queryable views.

**Personal Data Servers (PDS)** store a user's records — activity claims, contributions, evaluations. Each record gets a unique AT-URI. The PDS signs records and includes them in the user's repository. Users can migrate to a different PDS by updating their DID document. The [ePDS](/architecture/account-and-identity#oauth-for-epds) adds email/passwordless login for applications that need it.

**Relays** aggregate data across many PDS instances. When a user writes a new record, the relay picks it up and makes it available to downstream consumers via a firehose stream.

**Indexers** read from relays and build queryable databases. They filter for specific record types, resolve references between records, and expose APIs that applications use. Different indexers can build different views of the same data. See [Indexers & Discovery](/architecture/indexers-and-discovery).

**Lexicons** are shared schemas that define record structure. Any application that knows the lexicons can parse any record — this enables interoperability without custom integrations. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

For the full pipeline — how a hypercert moves from creation through enrichment, evaluation, discovery, and funding — see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle).

![Data flow through ATProto](/images/architecture-dataflow.svg)

## Security Model

ATProto's cryptographic properties make hypercerts tamper-evident and auditable without a central authority.

**Signed repositories.** Every PDS repository is a Merkle tree signed by the user's DID signing key. Any modification to a record changes the Merkle root, invalidating the signature. This means you can verify a record came from a specific DID, detect if a record was altered after creation, and audit the entire history of a repository.

**Strong references.** When one record references another — for example, an evaluation referencing an activity claim — the reference includes both the AT-URI and the CID (content hash). If the referenced record is modified, its CID changes and the mismatch is detectable.

**Identity verification.** DIDs are cryptographically verifiable. A `did:plc` identifier resolves via the [PLC directory](https://plc.directory) to a DID document containing the public key for signature verification, the user's current PDS, and their handle. See [Account & Identity](/architecture/account-and-identity).

These properties combine into an auditable chain: Alice creates an activity claim and her PDS signs the repository, producing a CID. Bob evaluates Alice's claim, referencing both the AT-URI and that CID. Anyone can verify Alice's signature proves she created the claim, Bob's signature proves he created the evaluation, and the CID proves Bob evaluated the exact version Alice published.

## Key Design Decisions

**Why not fully on-chain?** Rich data is expensive to store on-chain. A single activity claim with attachments could cost hundreds of dollars in gas. On-chain storage works for ownership state but not for the full data layer.

**Why not fully off-chain?** Funding requires immutability. Without on-chain anchoring, there's no way to freeze a hypercert and guarantee that what a funder evaluated is what they end up funding.

**Why ATProto?** It combines persistent DIDs, shared schemas, user-controlled data, and a growing ecosystem. IPFS has no identity layer or schemas. Ceramic has similar goals but a smaller ecosystem. The Bluesky network demonstrates ATProto scales to millions of users. See [Why AT Protocol?](/core-concepts/why-at-protocol).

## What This Enables

**Cross-platform evaluation.** An evaluator on Platform A can assess a contribution created on Platform B. The evaluation references the original claim via AT-URI and is visible to any application that queries an indexer.

**Portable reputation.** A contributor's entire history — claims, contributions, evaluations — follows them across platforms via their DID. See [Portability & Data Access](/architecture/portability-and-scaling).
