---
title: Architecture Overview
description: How the Hypercerts Protocol stack fits together.
---

# Architecture Overview

The Hypercerts Protocol combines AT Protocol for data portability with blockchain for ownership guarantees.

## The Hypercerts Stack

The protocol operates across three layers that work together to enable portable impact claims with verifiable ownership.

The **Application Layer** is where users interact with the system. Funding platforms, dashboards, and evaluation tools live here. These applications read from and write to the layers below.

The **Data Layer** uses AT Protocol to store claims, evidence, and evaluations. Personal Data Servers (PDS) and Shared Data Servers (SDS) host user-controlled records. Relays aggregate data across servers. Indexers build queryable views that applications consume.

The **Ownership Layer** uses blockchain to handle tokenization, funding flows, and immutability guarantees. Smart contracts mint tokens representing hypercert ownership. On-chain state references ATProto records via URI.

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│   Funding platforms, dashboards, tools  │
├─────────────────────────────────────────┤
│         Data Layer (AT Protocol)        │
│   PDS/SDS → Relay → App View/Indexer   │
├─────────────────────────────────────────┤
│      Ownership Layer (Blockchain)       │
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

Blockchain components handle ownership, funding, and financial guarantees.

#### Anchoring

Anchoring links ATProto records to on-chain state. A smart contract stores the AT-URI of a hypercert's activity claim. This creates a verifiable connection between the data layer and ownership layer.

#### Tokenization

Hypercerts are represented as transferable tokens on-chain. A token can represent full ownership or fractional shares. Token holders have rights defined in the hypercert's `org.hypercerts.claim.rights` record.

#### Funding Mechanisms

Tokens enable various funding models. Direct purchase, retroactive funding, impact certificates, and quadratic funding all operate on the ownership layer. Funds flow through smart contracts that enforce rules and distribute payments.

#### Multi-Chain Support

Different communities use different chains. The protocol supports Ethereum, Optimism, Celo, and other EVM-compatible networks. A hypercert's data lives on ATProto regardless of which chain holds its token.

## How the Layers Connect

The bridge between ATProto and blockchain is a reference system that maintains data portability while enabling ownership.

A hypercert's **content** lives on ATProto. The activity claim, evidence records, measurements, and evaluations are all ATProto records. This data is portable — users control it, can migrate it, and applications can read it without blockchain access.

A hypercert's **ownership and funding state** lives on-chain. The token, transaction history, and smart contract logic are blockchain records. This provides immutability guarantees and enables financial mechanisms.

**References connect the layers.** An on-chain token stores the AT-URI of its corresponding activity claim. ATProto records can include on-chain addresses in their metadata. Applications resolve these references to show complete information.

{% callout type="note" %}
The separation matters. ATProto provides data portability — users can switch servers, applications can read across the network, and records outlive any single platform. Blockchain provides ownership guarantees — tokens are transferable, transactions are irreversible, and smart contracts enforce rules. Neither layer can provide both properties alone.
{% /callout %}

#### Cross-Layer Example

A contributor creates an activity claim on their PDS. The claim gets URI `at://did:plc:alice/org.hypercerts.claim.activity/3k7`. An application calls a smart contract to mint a token, passing the AT-URI. The contract stores the URI and mints token ID 42. The token's metadata includes the AT-URI. Applications can now:

- Query the indexer for the activity claim using the AT-URI
- Query the blockchain for ownership using token ID 42
- Resolve between them using the stored reference

```
ATProto Record                    Blockchain Token
─────────────────                 ────────────────
URI: at://did:plc:alice/...  ←──  Token ID: 42
Content: activity claim           Owner: 0xBob...
Evidence: [...]                   Metadata: { uri: "at://..." }
Evaluations: [...]                Contract: 0xHyper...
```

## Key Design Decisions

The architecture reflects specific tradeoffs between cost, flexibility, and guarantees.

#### Why Not Fully On-Chain?

Storing rich data on-chain is expensive. A single activity claim with evidence and measurements could cost hundreds of dollars in gas fees. Schema changes require contract upgrades. Large files like images or PDFs are impractical. On-chain storage works for ownership state but not for the full data layer.

#### Why Not Fully Off-Chain?

Pure off-chain systems lack ownership guarantees. Without blockchain, there's no way to enforce transferability, create liquid markets, or guarantee immutability of ownership records. Funding mechanisms like retroactive public goods funding require smart contracts to distribute funds according to rules.

#### Why ATProto Over IPFS, Ceramic, or Other Alternatives?

IPFS provides content-addressed storage but no identity layer, no mutable state, and no schemas. Data is just bytes. Ceramic has similar goals to ATProto but a smaller ecosystem and less mature tooling. Traditional databases offer no portability or interoperability.

ATProto is the only technology that combines persistent DIDs, shared lexicons, user-controlled data, and a growing ecosystem of interoperable applications. The Bluesky network demonstrates that ATProto scales to millions of users and billions of records.

#### Why This Separation of Concerns?

Each layer does what it does best. ATProto handles identity, data portability, and schemas. Blockchain handles ownership, funding, and immutability. Applications compose these layers to build features neither could provide alone.

A hypercert can accumulate evaluations over years without any on-chain transactions. Ownership can transfer on-chain without modifying ATProto records. This separation reduces costs, increases flexibility, and maintains portability.

## What This Enables

The architecture supports use cases that require both data portability and ownership guarantees.

**Cross-platform evaluation.** An evaluator on Platform A can assess a contribution created on Platform B. The evaluation is stored on the evaluator's PDS, references the original claim via AT-URI, and is visible to any application that queries the indexer.

**Retroactive funding.** Funders can purchase tokens representing past contributions. The contribution's data lives on ATProto and continues accumulating evidence and evaluations. Ownership transfers happen on-chain without modifying the original records.

**Portable reputation.** A contributor's entire history — all claims, contributions, and evaluations — follows them across platforms. Their DID is the persistent identifier. Applications can compute trust scores based on the full history.

**Composable funding mechanisms.** Smart contracts can implement quadratic funding, impact certificates, milestone-based payments, or novel mechanisms. All reference the same ATProto records, so different funding models can coexist.

## Next Steps

For a detailed walkthrough of how a hypercert moves through the system, see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle).

To understand the specific record types and their schemas, see [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

To learn why ATProto was chosen for the data layer, see [Why ATProto?](/getting-started/why-atproto).
