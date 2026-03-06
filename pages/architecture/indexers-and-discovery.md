---
title: Indexers & Discovery
description: How indexers make hypercerts findable across the network.
---

# {% $markdoc.frontmatter.title %}

## Why indexers?

ATProto is federated — data is distributed across multiple PDSs. To discover records, you need something that crawls the network and aggregates data into a queryable database.

That's what indexers do: they subscribe to the firehose (a real-time stream of repository commits), fetch and parse records according to their lexicons, and expose the results via APIs for searching, filtering, and aggregation.

## Hyperindex

[Hyperindex](https://github.com/hypercerts-org/hyperindex) is a reference indexer for the Hypercerts ecosystem. It listens to the network via [Jetstream](https://github.com/bluesky-social/jetstream), stores matching records in a database, and automatically generates a [GraphQL](https://graphql.org/) API for querying them.

Multiple indexers are running across the ecosystem — see [Hyperscan Indexers](https://www.hyperscan.dev/indexers) for a live list with health status.

You can also run your own instance and register custom lexicons alongside the standard `org.hypercerts.*` ones. See the [Hyperindex repository](https://github.com/hypercerts-org/hyperindex) for setup instructions.

For machine-readable access to network data, lexicon schemas, and write guides, see [Agent Endpoints](/tools/agent-endpoints).

For how indexers fit into the protocol stack, see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle#stage-4-discovery--indexing).
