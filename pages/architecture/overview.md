---
title: Architecture Overview
description: How the Hypercerts Protocol stack fits together.
---

# Architecture Overview

The Hypercerts Protocol is built on [AT Protocol](https://atproto.com/docs) — the same decentralized data layer that powers Bluesky. Users own their data, applications are interoperable, and records are cryptographically signed.

## Three Layers

![The Hypercerts Stack](/images/architecture-stack.svg)

**Data.** All hypercert records — activity claims, contributions, attachments, evaluations, measurements — live on AT Protocol. Each user's data is stored on a Personal Data Server (PDS) they control. Shared schemas called [lexicons](/lexicons/introduction-to-lexicons) define the structure of every record type, so any application can read any record. Users can switch PDS providers without losing data. For cases where multiple identities need to co-manage a single repository, the [Certified Group Service (CGS)](/architecture/certified-group-service) adds role-based governance in front of a PDS. See [Account & Identity](/architecture/account-and-identity) and [Portability & Data Access](/architecture/portability-and-scaling).

**Applications.** Funding platforms, dashboards, and evaluation tools read from and write to the data layer. They query [indexers](/tools/hyperindex) that aggregate records from across the network into searchable databases. Different indexers can build different views of the same underlying data.

**Ownership (planned).** On-chain anchoring for funding and tokenization is not yet implemented. The intended design freezes a hypercert's ATProto records and anchors them on-chain before funding — so funders know exactly what they're paying for. See [Funding & Value Flow](/core-concepts/funding-and-value-flow).

## How Data Flows

A user writes a record to their PDS. The PDS signs it and adds it to the user's repository. A relay picks up the new record and streams it to indexers. Indexers update their databases. Applications query indexers to display the data.

![Data flow through ATProto](/images/architecture-dataflow.svg)

For the full lifecycle — creation, enrichment, evaluation, discovery, funding, and accumulation — see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle).

## Why It's Trustworthy

Every PDS repository is a Merkle tree signed by the user's DID key — any third-party tampering is detectable because the signature won't match. When one record references another (e.g., an evaluation pointing to an activity claim), the reference includes a content hash, so you can tell if the target was modified after the reference was created. DIDs resolve via the [PLC directory](https://plc.directory) to a public key, so signatures are independently verifiable.

This means: Alice creates a hypercert and her PDS signs it. Bob evaluates it, referencing Alice's record by URI and content hash. Anyone can verify Alice authored the claim, Bob authored the evaluation, and Bob evaluated the exact version Alice published.

## Why This Architecture

**Why not fully on-chain?** Storing rich data on-chain is expensive — a single activity claim with attachments could cost hundreds of dollars in gas. On-chain works for ownership state, not for the full data layer.

**Why not fully off-chain?** Funding requires immutability. Without on-chain anchoring, there's no way to guarantee that what a funder evaluated is what they end up funding.

**Why ATProto?** Persistent DIDs, shared schemas, user-controlled data, and a growing ecosystem. IPFS has no identity layer or schemas. Ceramic has similar goals but a smaller ecosystem. Bluesky demonstrates ATProto scales to millions of users. See [Why AT Protocol?](/core-concepts/why-at-protocol).
