---
title: Architecture Overview
description: How the Hypercerts Protocol stack fits together.
---

# Architecture Overview

The Hypercerts Protocol uses AT Protocol for data portability. On-chain anchoring for ownership and funding is [planned](/core-concepts/funding-and-value-flow).

## The Hypercerts Stack

The protocol operates across three layers that work together to enable portable impact claims with verifiable ownership.

The **Data Layer** is the foundation. AT Protocol stores claims, attachments, and evaluations. Personal Data Servers (PDS) host user-controlled records — organizations can create dedicated PDS accounts for shared repositories. Relays aggregate data across servers. Indexers build queryable views that applications consume.

The **Application Layer** sits on top of the data layer. Funding platforms, dashboards, and evaluation tools live here. These applications read from and write to the data layer using the [Hypercerts SDK](/tools/sdk) and [Hyperindex](/tools/hyperindex).

The **Ownership Layer** is planned but not yet implemented. The intended design uses a freeze-then-fund model where hypercerts are frozen and anchored on-chain before funding — ensuring funders know exactly what they are paying for. See [Funding & Value Flow](/core-concepts/funding-and-value-flow) for details.

![The Hypercerts Stack](/images/architecture-stack.svg)

## Data Layer Deep Dive

ATProto components form a pipeline from user-controlled storage to globally queryable views.

#### Personal Data Servers (PDS)

A PDS stores a user's records — activity claims, contributions, evaluations. Each record gets a unique AT-URI like `at://did:plc:abc123/org.hypercerts.claim.activity/tid`. The PDS signs records and includes them in the user's repository. Users can migrate to a different PDS by updating their DID document.

#### Relays

Relays (formerly called BGS) aggregate data across many PDS instances. When a user writes a new record to their PDS, the relay picks it up and makes it available to downstream consumers. Relays provide a firehose of all network activity.

#### App Views and Indexers

Indexers read from relays and build queryable databases. They filter for specific record types, resolve references between records, and expose APIs that applications use. Different indexers can build different views of the same underlying data.

#### Lexicons

Lexicons are shared schemas that define record structure. For example, `org.hypercerts.claim.activity` specifies fields like `workScope`, `startDate`, and `endDate`. Other lexicons define attachments, measurements, evaluations, rights, funding receipts, and collections. Any application that knows the lexicons can parse any record. This enables interoperability without custom integrations. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons) for the full set.

#### The Flow

A typical data flow: a user writes a record to their PDS → the PDS signs it and adds it to the user's repository → the relay picks up the new record → indexers read from the relay and update their databases → applications query indexers to display the data.

![Data flow through ATProto](/images/architecture-dataflow.svg)

## Security Model

ATProto's cryptographic properties make hypercerts tamper-evident and auditable without a central authority.

#### Signed repositories

Every PDS repository is a Merkle tree signed by the user's DID signing key. Any modification to a record changes the Merkle root, invalidating the signature. This means you can verify a record came from a specific DID, detect if a record was altered after creation, and audit the entire history of a repository.

#### Strong references

When one record references another — for example, an evaluation referencing an activity claim — the reference includes both the AT-URI and the CID (content hash). If the referenced record is modified, its CID changes and the mismatch is detectable. This makes cross-record references tamper-evident.

#### Identity verification

DIDs are cryptographically verifiable. A `did:plc` identifier resolves via the [PLC directory](https://plc.directory) to a DID document containing the public key for signature verification, the user's current PDS, and their handle. Always verify the DID matches the expected identity before trusting a record.

#### Data integrity chain

These properties combine into an auditable chain:

1. Alice creates an activity claim. Her PDS signs the repository, producing CID `bafyA`.
2. Bob evaluates Alice's claim, referencing `{ uri: "at://alice/...", cid: "bafyA" }`.
3. Anyone can verify: Alice's signature proves she created the claim, Bob's signature proves he created the evaluation, and the CID proves Bob evaluated the exact version Alice published.

## Ownership Layer (Planned)

The ownership layer is not yet implemented. The planned design freezes ATProto records and anchors them on-chain before funding, ensuring funders know exactly what they are paying for. For the full planned design — including anchoring, tokenization, and funding mechanisms — see [Funding & Value Flow](/core-concepts/funding-and-value-flow).

## How the Layers Connect

A hypercert's **content** lives on ATProto. The activity claim, attachment records, measurements, and evaluations are all ATProto records. This data is portable — users control it, can migrate it, and applications can read it without blockchain access.

A hypercert's **ownership and funding state** will live on-chain once the tokenization layer is built. The planned bridge is a freeze-then-fund mechanism. See [Funding & Value Flow](/core-concepts/funding-and-value-flow) for the full cross-layer design.

{% callout type="note" %}
The separation matters. ATProto provides data portability — users can switch servers, applications can read across the network, and records outlive any single platform. On-chain anchoring will provide ownership and funding guarantees. Neither layer can provide both properties alone.
{% /callout %}

## Key Design Decisions

The architecture reflects specific tradeoffs between cost, flexibility, and guarantees.

#### Why Not Fully On-Chain?

Storing rich data on-chain is expensive. A single activity claim with attachments and measurements could cost hundreds of dollars in gas fees. Schema changes require contract upgrades. Large files like images or PDFs are impractical. On-chain storage works for ownership state but not for the full data layer.

#### Why Not Fully Off-Chain?

Mutable records are fine for collaboration, but funding requires immutability. Without on-chain anchoring, there's no way to freeze a hypercert's state and guarantee that the claim a funder evaluates is the same claim they end up funding. Additionally, funding mechanisms like retroactive public goods funding require on-chain logic to distribute funds according to rules. See [Funding & Value Flow](/core-concepts/funding-and-value-flow) for the planned freeze-then-fund design.

#### Why ATProto Over IPFS, Ceramic, or Other Alternatives?

IPFS provides content-addressed storage but no identity layer, no mutable state, and no schemas. Data is just bytes. Ceramic has similar goals to ATProto but a smaller ecosystem and less mature tooling. Traditional databases offer no portability or interoperability.

ATProto is the only technology that combines persistent DIDs, shared lexicons, user-controlled data, and a growing ecosystem of interoperable applications. The Bluesky network demonstrates that ATProto scales to millions of users and billions of records.

#### Why This Separation of Concerns?

Each layer does what it does best. ATProto handles identity, data portability, and schemas. On-chain anchoring will handle ownership, funding, and immutability. This separation reduces costs, increases flexibility, and maintains portability.

## What This Enables

**Cross-platform evaluation.** An evaluator on Platform A can assess a contribution created on Platform B. The evaluation is stored on the evaluator's PDS, references the original claim via AT-URI, and is visible to any application that queries the indexer. This works today with the ATProto data layer.

**Retroactive funding.** Planned — see [Funding & Value Flow](/core-concepts/funding-and-value-flow).

**Portable reputation.** A contributor's entire history — all claims, contributions, and evaluations — follows them across platforms. Their DID is the persistent identifier. Applications can compute trust scores based on the full history. This works today with the ATProto data layer.

**Composable funding mechanisms.** Planned — see [Funding & Value Flow](/core-concepts/funding-and-value-flow).

## Next Steps

For a detailed walkthrough of how a hypercert moves through the system, see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle).

For the planned on-chain funding and tokenization design, see [Funding & Value Flow](/core-concepts/funding-and-value-flow).

To understand the specific record types and their schemas, see [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

To learn why ATProto was chosen for the data layer, see [Why AT Protocol?](/core-concepts/why-at-protocol).
