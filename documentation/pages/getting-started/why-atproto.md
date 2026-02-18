---
title: Why ATProto?
description: Why the Hypercerts Protocol is built on AT Protocol.
---

# Why ATProto?

The Hypercerts Protocol is built on the AT Protocol (ATProto) — an open protocol for decentralized social data that also powers Bluesky.

ATProto provides the foundational infrastructure needed to recognize, evaluate, and fund impact across applications — without locking contributions, reputation, or funding histories into any single platform.

It gives Hypercerts three essential properties:

- Portable, user-controlled data
- Shared schemas readable across applications  
- A decentralized identity and trust graph for impact

Together, these make it possible to build new funding systems that are interoperable and not owned by any single institution.

## Portable, user-controlled data

Contributions must outlive any single platform.

Hypercert records are stored in **signed user repositories** hosted on Personal Data Servers (PDS). Each repository is cryptographically tied to a user or organization’s DID — not to the server hosting it. Contributors, evaluators, and funders choose where their data is hosted: on Hypercerts Foundation infrastructure, on other third-party providers, or self-hosted servers. 

They can migrate at any time without losing records or needing anyone’s permission. Repository data is exported and transferred as signed CAR (Content Addressed Archive) files, preserving record integrity and full history across migrations.

Applications are views over user-owned data — not gatekeepers of it.

## Shared schemas across applications

For impact funding to work across applications, contributions recorded in one application must be evaluable in another and fundable in a third — without bespoke integrations.

ATProto enables this through **lexicons**: shared, namespaced JSON schemas that define how records are structured. For example `org.hypercerts.claim.activity` defines how a contribution is recorded — its fields, attachments, authorship, and metadata.

Because lexicons are open and namespaced:

- Any app can create compatible records  
- Any app can read and interpret them  
- No bilateral API integrations are required  

Records reference each other via **AT-URIs**, forming a traversable graph: An evaluation references an activity claim, outcomes reference prior contributions, and a funding decision references both.

Records are distributed through ATProto’s indexing infrastructure and real-time **firehose**, allowing applications to efficiently discover and process records as they are created. All without centralized APIs. Interoperability is built in from day one.

See: [Introduction to Lexicons](/lexicons/introduction-to-lexicons)

## A decentralized identity & impact trust graph

ATProto provides persistent, portable identities via **Decentralized Identifiers (DIDs)** for individuals and organizations. Every record carries its author’s DID and cryptographic signature.

Over time, these identities accumulate contribution records, evaluations, endorsements, funding decisions, etc. Together, these form a durable **impact trust graph** that persists across platforms.

For example, a funder can analyze:

- Who evaluated a project  
- What else those evaluators have assessed  
- In which domains they operate  
- How their past judgments correlated with outcomes  

Trust becomes computable across the ecosystem — not siloed within individual platforms. Because all records are signed and publicly indexable, trust scoring models can be independently implemented, compared, and audited.

## ATProto + Blockchain: A Hybrid Stack

ATProto handles the rich and evolving data layer — claims, attachments, evaluations, trust signals. Onchain anchoring and tokenization improve the funding layer with immutable and permanent records as well as programmable funding and settlement mechanisms.

For details on how these two layers work together, see [Funding & Tokenization](/architecture/funding-and-tokenization) and [Architecture Overview](/architecture/overview).
