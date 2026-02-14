---
title: Why ATProto?
description: Why the Hypercerts Protocol is built on AT Protocol.
---

# Why ATProto?

## Introduction

Hypercerts need a data layer that is open, portable, and not controlled by any single institution. To unlock value recognition networks, contributions must move freely across platforms, accumulate evaluations over time, and connect seamlessly to funding systems. This is not possible with traditional data silos, proprietary databases, or isolated reporting tools.

That's why the Hypercerts Protocol is built on top of AT Protocol (ATProto) — the decentralized social data layer that also powers Bluesky.

ATProto gives Hypercerts three essential properties: portable user-controlled data, shared schemas across applications, and a decentralized trust-graph for impact. Each of these properties addresses a fundamental requirement for building value recognition networks at scale. Together, they create an infrastructure where contributions remain interoperable, verifiable, and connected across the entire ecosystem.

## Portable, User-Controlled Data

Hypercerts are stored in data repositories on Personal Data Servers (PDS) or Shared Data Servers (SDS). A PDS holds the data for an individual user; an SDS extends this model to organizations, allowing multiple people to write to the same repository with access control.

Users can choose where their data lives: on servers run by the Hypercerts Foundation, on servers run by other platforms, or on servers they self-host. This ensures contributors, evaluators, and funders retain full control over their own data. They can switch hosting providers at any time without losing their records, and without needing permission from any platform.

Applications read from PDS and SDS — they do not own or lock in the underlying data. This is a fundamental architectural shift from traditional platforms. When you build an application on ATProto, you're building a view over user-owned data, not a database that you control. Your application queries a user's PDS via XRPC (the cross-server RPC protocol), retrieves the records it needs, and presents them to the user. But the canonical source of truth remains in the user's repository.

This means users can migrate their entire repository — all records, all blobs, all history — to a new PDS at any time. If they're unhappy with their current provider, they can export their data and import it elsewhere. If a platform shuts down, their records survive. Applications are interchangeable views over user-owned data, not gatekeepers of that data.

{% callout type="note" %}
**For developers:** This portability is enforced at the protocol level. A user's repository is identified by their DID (decentralized identifier), not by the server hosting it. When a user migrates to a new PDS, they update their DID document to point to the new server, and all applications automatically follow. No data is lost, no history is broken.
{% /callout %}

Contrast this with alternatives: Unlike storing data in a platform's database, the user's records survive if the platform shuts down. Unlike IPFS, data has a clear owner and mutable state — you can update a record without creating a new content hash. Unlike traditional cloud storage, the data is structured and queryable, not just a collection of files.

For Hypercerts, this portability is essential. A contributor's activity claims, an evaluator's assessments, a funder's portfolio — all of these need to persist across platforms and outlive any single application. ATProto makes this possible by design.

## Shared Schemas Across Applications

ATProto allows different applications to use common data schemas, called lexicons. Hypercerts rely on these shared schemas to describe contributions, evidence, and evaluations in a consistent, machine-readable format.

Because the structure is standardized across the network, any application built on ATProto can understand and work with hypercert data. A contribution recorded in one application can be evaluated in another, viewed in a third, and incorporated into funding mechanisms elsewhere — without custom integrations or duplicated data.

Lexicons are JSON schemas that define the structure of records. When you create a record with collection `org.hypercerts.claim.activity`, any application that knows that lexicon can parse it. The lexicon specifies which fields are required, which are optional, what data types are allowed, and how nested objects should be structured. This is like having a shared database schema across the entire network.

{% callout type="note" %}
**For developers:** Lexicons are versioned and namespaced. The namespace `org.hypercerts.claim` indicates that this schema is defined by the Hypercerts organization. The version number ensures backward compatibility — applications can support multiple versions of a lexicon and handle migrations gracefully. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons) for details on how lexicons work and how to define your own.
{% /callout %}

This shared schema layer is what enables true interoperability. Without it, every application would need custom adapters to understand data from other applications. With lexicons, interoperability is built in from day one, not bolted on later.

For Hypercerts, this means a contribution recorded in a project management tool can be automatically recognized by a funding platform, evaluated by a third-party assessment service, and displayed in a portfolio dashboard — all without any of these applications needing to coordinate with each other. They simply read the same standardized records from the user's PDS.

This also enables composability. An evaluation record can reference an activity claim by its AT-URI (the unique identifier for a record in ATProto). A funding decision can reference both the claim and the evaluations. A trust signal can reference the evaluator's history. These references create a rich, interconnected graph of impact data that any application can traverse and analyze.

## A Decentralized Trust-Graph for Impact

ATProto provides persistent identities for both individuals and organizations through DIDs (decentralized identifiers). These identities can receive endorsements and badges, and over time they accumulate a visible record of their activity: the contributions they make, the evaluations they provide, and the hypercerts they are associated with. Together, these signals form a durable trust-graph — a reputation layer that follows users and organizations across platforms.

DIDs are cryptographically verifiable. A DID like `did:plc:abc123` is permanent even if the user changes handles or servers. The DID is the root of identity in ATProto — everything else (handles, profile information, server location) can change, but the DID remains constant.

When an evaluator creates an evaluation record, their DID is attached as the author. This means you can trace their entire evaluation history across the network. How many evaluations have they done? In which domains? How accurate were their assessments when later evidence emerged? All of this information is publicly queryable and verifiable.

{% callout type="note" %}
**For developers:** This enables programmatic trust scoring. You can build algorithms that analyze an evaluator's track record, compare their assessments to consensus views, identify patterns of bias or accuracy, and weight their evaluations accordingly. Because all of this data is structured and portable, these trust signals can be computed by anyone and shared across applications.
{% /callout %}

Funding mechanisms can use this trust-graph to guide their decisions. Instead of relying on isolated applications, private networks, or opaque institutional histories, funders can draw from a shared, ecosystem-wide view of identity, contribution, and credibility. This makes evaluation more robust, reduces dependence on centralized gatekeepers, and enables new funding models that leverage trust built across many different contexts.

For example, a funder might prioritize contributions that have been evaluated by assessors with strong track records in a specific domain. Or they might weight evaluations based on the evaluator's reputation score. Or they might look for contributions that have been endorsed by trusted community members. All of these strategies become possible when identity and reputation are portable and verifiable.

Contrast this with siloed reputation systems: Unlike a single platform's star ratings or karma scores, this reputation is portable and verifiable. An evaluator's track record follows them across every application in the network. A contributor's history of impact is visible to every funder. This creates stronger incentives for quality and accountability, because reputation cannot be gamed by switching platforms or creating new accounts.

## Why Not Other Technologies?

When building a decentralized data layer for impact, several alternatives might come to mind. Here's why ATProto is the best fit:

**Pure blockchain:** Too expensive for rich data. Storing detailed contribution records, evidence documents, and evaluation histories on-chain would cost thousands of dollars per hypercert. Blockchains also have limited schema flexibility — you can't easily evolve data structures or add new fields without complex migration logic. And they're poor for large blobs like images, videos, or datasets.

**IPFS/Filecoin:** Content-addressed storage is great for immutability, but it lacks an identity layer. There's no concept of "this record belongs to this user" or "this user updated their record." There's no mutable state — every change creates a new content hash, making it hard to track the current version of a contribution. And there are no schemas — data is just bytes, with no standardized structure.

**Ceramic:** Similar goals to ATProto (decentralized data with schemas and identity), but a smaller ecosystem and less mature tooling. Ceramic is still evolving its data model and has fewer production applications. ATProto benefits from the momentum of Bluesky and a growing developer community.

**Traditional databases:** No portability, no interoperability, platform lock-in. If you store hypercerts in your application's database, users can't take their data elsewhere. Other applications can't read it without custom API integrations. And if your platform shuts down, the data is lost.

ATProto provides the best combination of identity, schemas, federation, and an existing growing ecosystem. It's the only technology that gives you persistent DIDs, shared lexicons, user-controlled data, and a network of interoperable applications — all in one protocol.

## ATProto + Blockchain: Better Together

ATProto handles the data layer — claims, evidence, evaluations, trust signals — while blockchain handles the ownership layer: tokenization, funding flows, and immutability guarantees.

This two-layer architecture plays to the strengths of each technology. ATProto is optimized for rich, structured data that needs to be queryable, portable, and interoperable. Blockchains are optimized for ownership, scarcity, and strong cryptographic guarantees.

Onchain anchoring allows certain parts of a hypercert — such as its ownership or the final version of its metadata — to be secured with cryptographic guarantees. Tokenization adds the ability to represent hypercerts as transferable certificates, enabling mechanisms like milestone-based payouts, retroactive rewards, collective funding pools, or entirely new funding models built around tradable impact certificates.

Different token standards can be used for different use cases — from non-transferable recognition to fully tradable certificates — and these tokens can live on whichever blockchain best fits the needs of a project or community.

{% callout type="note" %}
**For developers:** A typical flow might look like this: (1) A contributor creates an activity claim on ATProto with detailed metadata, evidence links, and work scope. (2) When the contribution is ready to be funded, a smart contract mints a hypercert token on-chain, with the token metadata pointing to the ATProto record via its AT-URI. (3) Funders purchase or reward the token, transferring ownership on-chain. (4) Evaluations and additional evidence continue to accumulate on ATProto, enriching the record over time. (5) The token's value may increase or decrease based on these evaluations, creating incentives for quality.
{% /callout %}

This separation of concerns is powerful. The data layer remains open, flexible, and user-controlled. The ownership layer provides the guarantees and mechanisms needed to connect that data to real funding flows. Together, they create an infrastructure where contributions are both richly documented and financially valuable.

For more details on how these two layers work together, see [The Hypercerts Infrastructure](/getting-started/the-hypercerts-infrastructure).

## What This Means for Builders

If you're building on Hypercerts, ATProto gives you several key advantages:

**Instant interoperability:** Your application can read and write hypercert data using standard lexicons. You don't need to build custom integrations with other platforms — if they're using the same lexicons, you can work with their data automatically.

**User ownership:** Users control their data, not you. This reduces your liability and maintenance burden. You don't need to worry about data migrations, backups, or GDPR compliance for user data — users manage their own repositories.

**Network effects:** Every application you build adds value to the entire network. When you create a new evaluation tool, it works with contributions from every other application. When you build a funding platform, it can leverage trust signals from across the ecosystem.

**Future-proof:** Because data is portable and schemas are versioned, your application can evolve without breaking compatibility. Users can migrate to new versions at their own pace, and you can support multiple schema versions simultaneously.

**Composability:** You can build on top of existing data. Want to create a specialized evaluation tool for climate projects? Just query for activity claims with `workScope.impactScope` containing climate-related tags. Want to build a funder dashboard? Aggregate evaluation records and compute trust scores. The data is already there, structured and queryable.

This is the foundation that makes value recognition networks possible: open data, shared schemas, portable identity, and a growing ecosystem of interoperable applications. ATProto provides all of this, and Hypercerts builds on it to create a new infrastructure for recognizing and rewarding collective value.
