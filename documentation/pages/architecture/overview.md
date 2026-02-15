---
title: Architecture Overview
description: How the Hypercerts Protocol stack fits together.
---

# Architecture Overview

The Hypercerts Protocol combines AT Protocol for data portability with planned on-chain anchoring for ownership and funding guarantees.

## The Hypercerts Stack

The protocol operates across three layers that work together to enable portable impact claims with verifiable ownership.

The **Application Layer** is where users interact with the system. Funding platforms, dashboards, and evaluation tools live here. These applications read from and write to the layers below.

The **Data Layer** uses AT Protocol to store claims, evidence, and evaluations. Personal Data Servers (PDS) and Shared Data Servers (SDS) host user-controlled records. Relays aggregate data across servers. Indexers build queryable views that applications consume.

The **Ownership Layer** (planned, not yet implemented) will use blockchain to handle tokenization, funding flows, and immutability guarantees. The intended design: before a hypercert can be funded, its ATProto records must be frozen — a snapshot is taken and anchored on-chain. This ensures funders know exactly what they are funding, since the core claim cannot change after freezing. The specific on-chain mechanisms are being designed.

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│   Funding platforms, dashboards, tools  │
├─────────────────────────────────────────┤
│         Data Layer (AT Protocol)        │
│   PDS/SDS → Relay → App View/Indexer   │
├─────────────────────────────────────────┤
│  Ownership Layer (Blockchain) [planned] │
│   Tokenization, funding, rights         │
└─────────────────────────────────────────┘
```

## Data Layer Deep Dive

ATProto components form a pipeline from user-controlled storage to globally queryable views.

#### Personal Data Servers (PDS)

A PDS stores a user's records — activity claims, contributions, evaluations. Each record gets a unique AT-URI like `at://did:plc:abc123/org.hypercerts.claim.activity/tid`. The PDS signs records and includes them in the user's repository. Users can migrate to a different PDS by updating their DID document.

#### Relays

Relays (formerly called BGS) aggregate data across many PDS instances. When a user writes a new record to their PDS, the relay picks it up and makes it available to downstream consumers. Relays provide a firehose of all network activity.

#### App Views and Indexers

Indexers read from relays and build queryable databases. They filter for specific record types, resolve references between records, and expose APIs that applications use. Different indexers can build different views of the same underlying data.

#### Lexicons

Lexicons are shared schemas that define record structure. `org.hypercerts.claim.activity` specifies required fields like `workScope`, `impactScope`, and `timeframe`. Any application that knows the lexicon can parse the record. This enables interoperability without custom integrations.

#### The Flow

A typical data flow: a user writes a record to their PDS → the PDS signs it and adds it to the user's repository → the relay picks up the new record → indexers read from the relay and update their databases → applications query indexers to display the data.

```
User → PDS → Relay → Indexer → Application
         ↓
    (signed repo)
```

## Ownership Layer Deep Dive

The ownership layer is not yet implemented. This section describes the planned design for how blockchain components will handle ownership, funding, and financial guarantees.

#### Anchoring (Planned)

The planned approach: when a hypercert is ready to be funded, its ATProto records will be frozen — a snapshot of the current state is taken and anchored on-chain. This creates an immutable reference point. A smart contract will store the content identifier (CID) or AT-URI of the frozen snapshot, creating a verifiable connection between the data layer and ownership layer.

The freeze is critical: a funder must know exactly what they are funding. If the hypercert's core claim could still change after funding, the funder might end up paying for something different than what they signed up for.

#### Tokenization (Planned)

The specific on-chain mechanism is being designed. The concept: once a hypercert's records are frozen and anchored, the hypercert can be represented as a transferable token on-chain. A token could represent full ownership or fractional shares. Token holders would have rights defined in the hypercert's `org.hypercerts.claim.rights` record.

Note: evaluations and evidence can still accumulate AFTER freezing — they are separate records that reference the frozen claim. But the core activity claim itself becomes immutable once frozen.

#### Funding Mechanisms (Planned)

The intended design: tokens will enable various funding models. Direct purchase, retroactive funding, impact certificates, and quadratic funding would all operate on the ownership layer. Funds would flow through smart contracts that enforce rules and distribute payments.

#### Multi-Chain Support (TBD)

Different communities use different chains. The protocol is being designed to support Ethereum, Optimism, Celo, and other EVM-compatible networks. A hypercert's data will live on ATProto regardless of which chain holds its token.

## How the Layers Connect

The planned bridge between ATProto and blockchain is a freeze-then-fund mechanism that maintains data portability while enabling ownership.

A hypercert's **content** lives on ATProto. The activity claim, evidence records, measurements, and evaluations are all ATProto records. This data is portable — users control it, can migrate it, and applications can read it without blockchain access.

A hypercert's **ownership and funding state** will live on-chain (once the tokenization layer is built). The token, transaction history, and smart contract logic will be blockchain records. This will provide immutability guarantees and enable financial mechanisms.

**The freeze-then-fund flow (planned):** A hypercert starts as mutable ATProto records. Before it can be funded, the records must be frozen — a snapshot is taken and anchored on-chain. This ensures funders know exactly what they are funding. Once frozen and anchored, the hypercert can be tokenized and listed for funding. Evaluations and evidence can still accumulate after freezing — they reference the frozen claim — but the core claim itself is immutable.

{% callout type="note" %}
The separation matters. ATProto provides data portability — users can switch servers, applications can read across the network, and records outlive any single platform. Blockchain will provide ownership guarantees — tokens are transferable, transactions are irreversible, and smart contracts enforce rules. Neither layer can provide both properties alone.
{% /callout %}

#### Cross-Layer Example (How This Will Work)

A contributor creates an activity claim on their PDS. The claim gets URI `at://did:plc:alice/org.hypercerts.claim.activity/3k7`. When ready to seek funding, the contributor freezes the hypercert. An application takes a snapshot of the ATProto records and calls a smart contract to anchor the snapshot on-chain, passing the AT-URI or content identifier. The contract stores the reference and mints token ID 42. The token's metadata includes the frozen snapshot reference. Applications will be able to:

- Query the indexer for the activity claim using the AT-URI
- Query the blockchain for ownership using token ID 42
- Resolve between them using the stored reference
- Verify that the on-chain token references the exact frozen state

```
ATProto Record                    Blockchain Token (planned)
─────────────────                 ──────────────────────────
URI: at://did:plc:alice/...  ←──  Token ID: 42
Content: activity claim           Owner: 0xBob...
Evidence: [...]                   Metadata: { frozen_uri: "at://..." }
Evaluations: [...]                Contract: 0xHyper...
[frozen snapshot]                 [anchored reference]
```

## Key Design Decisions

The architecture reflects specific tradeoffs between cost, flexibility, and guarantees.

#### Why Not Fully On-Chain?

Storing rich data on-chain is expensive. A single activity claim with evidence and measurements could cost hundreds of dollars in gas fees. Schema changes require contract upgrades. Large files like images or PDFs are impractical. On-chain storage works for ownership state but not for the full data layer.

#### Why Not Fully Off-Chain?

Pure off-chain systems lack ownership guarantees and cannot ensure what a funder pays for won't change. Without on-chain anchoring, there's no way to freeze a hypercert's state and guarantee that the claim a funder evaluates is the same claim they end up funding. Mutable records are fine for collaboration, but funding requires immutability. The planned freeze-then-fund mechanism solves this: freezing the ATProto records and anchoring the snapshot on-chain provides the immutability guarantee funders need. Additionally, funding mechanisms like retroactive public goods funding require smart contracts to distribute funds according to rules.

#### Why ATProto Over IPFS, Ceramic, or Other Alternatives?

IPFS provides content-addressed storage but no identity layer, no mutable state, and no schemas. Data is just bytes. Ceramic has similar goals to ATProto but a smaller ecosystem and less mature tooling. Traditional databases offer no portability or interoperability.

ATProto is the only technology that combines persistent DIDs, shared lexicons, user-controlled data, and a growing ecosystem of interoperable applications. The Bluesky network demonstrates that ATProto scales to millions of users and billions of records.

#### Why This Separation of Concerns?

Each layer does what it does best. ATProto handles identity, data portability, and schemas. Blockchain will handle ownership, funding, and immutability through the planned freeze-then-fund mechanism. Applications will compose these layers to build features neither could provide alone.

A hypercert can accumulate evaluations over years without any on-chain transactions. Once the tokenization layer is built, ownership will be able to transfer on-chain without modifying ATProto records. This separation reduces costs, increases flexibility, and maintains portability.

## What This Enables

The architecture will support use cases that require both data portability and ownership guarantees once the tokenization layer is built.

**Cross-platform evaluation.** An evaluator on Platform A can assess a contribution created on Platform B. The evaluation is stored on the evaluator's PDS, references the original claim via AT-URI, and is visible to any application that queries the indexer. (This works today with the ATProto data layer.)

**Retroactive funding.** (Planned) Funders will be able to purchase tokens representing past contributions. The contribution's data lives on ATProto and continues accumulating evidence and evaluations. Ownership transfers will happen on-chain without modifying the original frozen records.

**Portable reputation.** A contributor's entire history — all claims, contributions, and evaluations — follows them across platforms. Their DID is the persistent identifier. Applications can compute trust scores based on the full history. (This works today with the ATProto data layer.)

**Composable funding mechanisms.** (Planned) Smart contracts will be able to implement quadratic funding, impact certificates, milestone-based payments, or novel mechanisms. All will reference the same frozen ATProto snapshots, so different funding models can coexist.

## Next Steps

For a detailed walkthrough of how a hypercert moves through the system, see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle).

To understand the specific record types and their schemas, see [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

To learn why ATProto was chosen for the data layer, see [Why ATProto?](/getting-started/why-atproto).
