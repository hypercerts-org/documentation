---
title: Architecture Overview
description: How the Hypercerts Protocol stack fits together.
---

# Architecture Overview

The Hypercerts Protocol uses [AT Protocol](https://atproto.com/docs) for identity, repositories, record addressing, signed commits, and portability. Hypercerts and Certified Lexicons define domain records; applications and services write, discover, index, and interpret them.

## Current layers

![The Hypercerts Stack](/images/architecture-stack.svg)

**Source records.** Hypercerts and Certified records live in AT Protocol repositories hosted by PDSs. Public Lexicons define their shapes. A compatible consumer can fetch known records directly and preserve their AT-URIs and CIDs.

**Discovery and views.** Relays observe repository events. Indexers select records, resolve references, build backlink indexes, and expose queryable views. Coverage and interpretation depend on each service. [Hyperindex](/tools/hyperindex) is retained as legacy GraphQL infrastructure while the target XRPC API is being developed.

**Applications.** Funding platforms, project tools, evaluation services, dashboards, and agents read source or indexed records and publish new records. Their authentication, private data, workflows, ranking, and payment execution are outside the record schemas.

**Managed access.** [Certified](https://certified.app), ePDS, and the [Certified Group Service](/architecture/certified-group-service) provide account and organization-oriented access paths. They support the protocol but do not define its source-record semantics.

## How Data Flows

A client writes a record to a repository through a PDS or managed service. A relay may observe the repository event; an indexer may include it; an application may query that index or fetch the source directly. Each step has its own availability and policy.

![Data flow through ATProto](/images/architecture-dataflow.svg)

For record versions, relationship directions, and reverse discovery, see [Records, References & Lifecycle](/architecture/data-flow-and-lifecycle).

## Why It's Trustworthy

Signed repository commits make unauthorized changes detectable and attribute publication to the repository DID. Strong references identify the exact record version a publisher cited. Optional record-content signatures, acknowledgements, and evaluations can add other provenance and corroboration signals.

These mechanisms do not prove that a claim is true, that every named actor participated, or that an evaluator is independent. Applications must distinguish repository publishers from actors named inside records and apply their own trust policies.

## Boundaries

The released protocol does not guarantee a complete index, private records, payment settlement, claim freezing, tokenization, organization governance, or one universal trust model. See the [Guide](/guide) for domain meaning, [Client Integration](/client-integration) for current integration guidance, and [Reference](/reference) for exact service contracts.
