---
title: Why ATProto?
description: Why the Hypercerts Protocol is built on AT Protocol.
---

# Why ATProto?

The Hypercerts Protocol is built on AT Protocol (ATProto) — the decentralized social data layer that also powers Bluesky. ATProto gives Hypercerts three essential properties: portable user-controlled data, shared schemas across applications, and a decentralized trust-graph for impact.

## The Philosophy

#### Portable, user-controlled data

Contributions must outlive any single platform. Hypercerts are stored on Personal Data Servers (PDS) or Shared Data Servers (SDS) that users control. Contributors, evaluators, and funders choose where their data lives — on Hypercerts Foundation servers, other providers, or self-hosted — and can switch at any time without losing records or needing anyone's permission. Applications are views over user-owned data, not gatekeepers of it.

#### Shared schemas across applications

For value recognition networks to work, contributions recorded in one tool must be evaluable in another and fundable in a third — without custom integrations. ATProto's lexicons provide shared data schemas across the entire network. A contribution structured as `org.hypercerts.claim.activity` is readable by any application that knows that lexicon. Interoperability is built in from day one.

#### A decentralized trust-graph for impact

ATProto provides persistent identities (DIDs) for individuals and organizations. Over time, these identities accumulate contributions, evaluations, and endorsements — forming a durable trust-graph that follows users across platforms. Funders can draw from an ecosystem-wide view of identity and credibility, rather than relying on siloed reputation systems that reset when you switch platforms.

## For Builders

#### Data ownership and portability

Your application reads from a user's PDS via XRPC — it does not own the data. A user's repository is identified by their DID, not by the server hosting it. When a user migrates to a new PDS, they update their DID document and all applications automatically follow. You don't need to handle data migrations, backups, or worry about data loss if your platform shuts down.

#### Lexicons and composability

Lexicons are versioned, namespaced JSON schemas (e.g., `org.hypercerts.claim.activity`). They define required fields, types, and nested structures. Any app that knows the lexicon can parse the record. Records reference each other via AT-URIs, creating a traversable graph: an evaluation references an activity claim, a funding decision references both. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons) for details.

#### Programmable trust

Every record carries its author's DID. You can trace an evaluator's entire history across the network — how many evaluations, in which domains, how accurate. This enables programmatic trust scoring: algorithms that weight evaluations based on track record, detect patterns, and surface credible assessments. Because the data is structured and portable, these trust signals can be computed by anyone.

## Why Not Other Technologies?

| Technology | Limitation for Hypercerts |
|---|---|
| **Pure blockchain** | Too expensive for rich data, limited schema flexibility, poor for large blobs |
| **IPFS / Filecoin** | No identity layer, no mutable state, no schemas — data is just bytes |
| **Ceramic** | Similar goals but smaller ecosystem, less mature tooling |
| **Traditional databases** | No portability, no interoperability, platform lock-in |

ATProto is the only technology that combines persistent DIDs, shared lexicons, user-controlled data, and a growing ecosystem of interoperable applications in one protocol.

## ATProto + Blockchain: Better Together

ATProto handles the data layer — claims, evidence, evaluations, trust signals. On-chain anchoring is planned to handle the funding layer — freezing hypercert state and enabling funding flows. The intended flow: a contributor creates an activity claim on ATProto, the claim accumulates evidence and evaluations, when ready for funding the claim will be frozen and its snapshot anchored on-chain, funders will commit resources against the frozen cert (knowing exactly what they're paying for), and evaluations continue accumulating on ATProto over time. The tokenization layer is not yet implemented, but the architecture is designed for it.

For details on how these two layers work together, see [The Hypercerts Infrastructure](/getting-started/the-hypercerts-infrastructure).
