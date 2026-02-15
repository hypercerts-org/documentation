---
title: Indexers & Discovery
---

# {% $markdoc.frontmatter.title %}

## Indexers and Discovery

#### Why indexers?

ATProto is federated — data is distributed across thousands of PDSs. To discover records, you need an indexer that crawls the network and aggregates data. Indexers subscribe to repository commits via the firehose (a real-time stream of all changes across the network).

#### What indexers do

Indexers fetch records, parse them according to their lexicons, and store them in a queryable database. They provide APIs for searching, filtering, and aggregating hypercert data. For example, an indexer might offer endpoints like:

- `GET /claims?workScope=Documentation&workTimeframeFrom=2026-01-01`
- `GET /evaluations?subject=at://did:plc:alice123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a`
- `GET /contributors?did=did:plc:alice123`

#### Running your own indexer

You can run your own indexer if you want full control over data availability and query performance. The Hypercerts Foundation provides reference indexer implementations. You can also use third-party indexers or build custom indexing logic for your application's specific needs.
