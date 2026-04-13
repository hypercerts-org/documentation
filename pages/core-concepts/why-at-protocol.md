---
title: Why AT Protocol?
description: Why the Hypercerts Protocol is built on AT Protocol.
---

# Why AT Protocol?

The Hypercerts Protocol is built on [AT Protocol](https://atproto.com/docs) — the same open protocol for decentralized data that powers Bluesky.

In Hypercerts v0.1, every hypercert was an on-chain token — publishing one required a wallet, gas fees, and a blockchain transaction. This created friction for the contributors, researchers, and organizations the protocol is designed to serve. By moving the data layer to ATProto, creating a hypercert requires no wallet, no gas, and no transaction fees. On-chain anchoring is reserved for where it actually matters: funding and settlement.

ATProto gives hypercerts three properties that matter for impact funding: portable data, shared schemas, and a trust graph rooted in cryptographic identity.

## Portable, user-controlled data

Contributions must outlive any single platform.

Hypercert records are stored in signed user repositories hosted on Personal Data Servers (PDS). Each repository is cryptographically tied to a user's DID — not to the server hosting it. Contributors, evaluators, and funders choose where their data lives: on Hypercerts Foundation infrastructure, on third-party providers, or self-hosted. They can migrate at any time without losing records or needing anyone's permission.

Applications are views over user-owned data — not gatekeepers of it. See [Portability & Data Access](/architecture/portability-and-scaling).

## Shared schemas across applications

For impact funding to work across applications, a contribution recorded in one app must be evaluable in another and fundable in a third — without bespoke integrations.

ATProto enables this through [lexicons](/lexicons/introduction-to-lexicons): shared, namespaced schemas that define how records are structured. Because lexicons are open, any app can create compatible records and any app can read them. No bilateral API integrations required.

Records reference each other via AT-URIs, forming a traversable graph: an evaluation references an activity claim, a funding receipt references both the claim and the funder. This graph is what indexers crawl to build queryable views. See [Hyperindex](/tools/hyperindex).

## A decentralized trust graph

ATProto provides persistent, portable identities via Decentralized Identifiers (DIDs). Every record carries its author's DID and cryptographic signature. Over time, these identities accumulate contribution records, evaluations, endorsements, and funding decisions — forming a durable impact trust graph that persists across platforms.

Trust becomes computable across the ecosystem — not siloed within individual platforms. A funder can trace who evaluated a project, what else those evaluators have assessed, and how their past judgments correlated with outcomes. Because all records are signed and publicly indexable, trust models can be independently implemented, compared, and audited.

## Data layer + ownership layer

The design principle: keep rich, evolving contribution data off-chain (ATProto) and use on-chain systems only where immutability and settlement matter. ATProto handles the data layer — claims, attachments, evaluations, trust signals. On-chain anchoring and tokenization handle the funding layer — immutable snapshots, programmable funding, and settlement mechanisms. See [Architecture Overview](/architecture/overview) for how the layers fit together.
