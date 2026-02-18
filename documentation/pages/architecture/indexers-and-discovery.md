---
title: Indexers & Discovery
---

# {% $markdoc.frontmatter.title %}

## Indexers and Discovery

#### Why indexers?

ATProto is federated — data is distributed across thousands of PDSs. To discover records, you need an indexer that crawls the network and aggregates data. Indexers subscribe to repository commits via the firehose (a real-time stream of all changes across the network).

#### What indexers do

Indexers fetch records, parse them according to their lexicons, and store them in a queryable database. They provide APIs for searching, filtering, and aggregating hypercert data. For example, an indexer might offer endpoints like:

- `GET /claims?workScope=Documentation&startDate=2026-01-01`
- `GET /evaluations?subject=at://did:plc:alice123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a`
- `GET /contributors?did=did:plc:alice123`

#### The Hypercerts Indexer: Hyperindex

[Hyperindex](https://github.com/hypercerts-org/hyperindex) is the reference indexer for the Hypercerts ecosystem. It's a Go AT Protocol AppView server that indexes records matching your configured lexicons and exposes them via a GraphQL API.

Hyperindex connects to the network via Jetstream (real-time event stream), indexes matching records to a database (SQLite or PostgreSQL), and provides typed GraphQL queries for all hypercert record types.

For setup instructions and usage, see the [Hyperindex tool page](/tools/hyperindex).

#### Running your own indexer

You can run your own indexer if you want full control over data availability and query performance. [Hyperindex](https://github.com/hypercerts-org/hyperindex) is the recommended starting point — clone the repository, register your lexicons, and you have a fully functional indexer with a GraphQL API. You can also build custom indexing logic for your application's specific needs.
