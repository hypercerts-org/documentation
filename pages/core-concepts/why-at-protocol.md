---
title: Why AT Protocol?
description: Why the Hypercerts Protocol is built on AT Protocol.
---

# Why AT Protocol?

The Hypercerts Protocol is built on [AT Protocol](https://atproto.com/docs), the open protocol for decentralized data that also powers Bluesky.

Earlier Hypercerts versions centered on onchain tokens. The current model uses AT Protocol repositories for rich, evolving work records. Publishing these records does not inherently require a blockchain wallet, gas, or a settlement transaction.

ATProto gives hypercerts three properties that matter for impact funding: portable data, shared schemas, and a trust graph rooted in cryptographic identity.

## Portable, user-controlled data

Information about valuable work should be reusable beyond the application that collected it.

Hypercerts records are stored in AT Protocol repositories hosted on Personal Data Servers (PDSs). Each repository is addressed through a DID rather than a fixed server URL. An account migration that preserves the DID can therefore preserve record AT-URIs when the hosting location changes.

Applications can build views over source records without becoming the only database that defines those records. See [Public Data, Discovery & Portability](/architecture/portability-and-scaling).

## Shared schemas across applications

For project information to be reused, a record written by one application needs an open shape that another application can parse.

AT Protocol enables this through [Lexicons](/lexicons/introduction-to-lexicons): shared, namespaced schemas that define record structures. A client can implement those public schemas and usage conventions without obtaining a proprietary schema from the original application.

Records reference accounts and other records through DIDs, AT-URIs, and strong references. Indexers can observe those forward links and build backlink queries and hydrated views. See [Records, References & Lifecycle](/architecture/data-flow-and-lifecycle).

## Attributable inputs to trust

AT Protocol provides account identity through DIDs and attributes repository publication through signed commits. Hypercerts adds records that can name contributors, evaluators, issuers, funders, and subjects. These named actors may differ from the repository publisher.

This gives applications attributable inputs for their own trust models. It does not establish one trust score, verify every named actor, or guarantee that every public record has been indexed. See [Identity, Authorship & Trust](/core-concepts/certified-identity).

## Protocol boundary

The released Hypercerts Lexicons describe AT Protocol records. They do not define payment settlement, claim freezing, token ownership, or a canonical global index. Those capabilities can be implemented by applications or future schemas without changing the role of AT Protocol as the source-record layer.
