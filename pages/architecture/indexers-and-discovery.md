---
title: Indexers & Discovery
description: How indexers make hypercerts findable across the network.
---

# {% $markdoc.frontmatter.title %}

## Why indexers?

ATProto is federated — data is distributed across thousands of PDSs. To discover records, you need an indexer that crawls the network and aggregates data. Indexers subscribe to repository commits via the firehose (a real-time stream of all changes across the network).

## What indexers do

Indexers fetch records, parse them according to their lexicons, and store them in a queryable database. They provide APIs for searching, filtering, and aggregating hypercert data. For example, Hyperindex exposes a GraphQL API with Relay-style pagination:

```graphql
query {
  orgHypercertsClaimActivity(first: 10) {
    edges {
      node {
        uri
        cid
        title
        shortDescription
        workScope
        startDate
        endDate
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

The GraphQL field names are derived from lexicon NSIDs — `org.hypercerts.claim.activity` becomes `orgHypercertsClaimActivity`, `org.hypercerts.claim.evaluation` becomes `orgHypercertsClaimEvaluation`, and so on. Every record type registered with the indexer gets its own query field.

## Reverse lookups with Constellation

ATProto has no built-in reverse lookup — given a hypercert URI, there is no native way to find which attachments, evaluations, or measurements reference it. [Constellation](https://constellation.microcosm.blue) is an external backlinks service that solves this.

Constellation indexes AT Protocol records and returns all records that reference a given subject URI. For example, given an activity claim URI, it returns all evaluations, measurements, and attachments that reference it. The [Scaffold Starter App](/tools/scaffold) uses Constellation for this purpose.

{% callout type="note" %}
Constellation's API is under active development and may change. No known instances have a full network backfill yet.
{% /callout %}

## The Hypercerts Indexer: Hyperindex

[Hyperindex](https://github.com/hypercerts-org/hyperindex) is the reference indexer for the Hypercerts ecosystem. It's a Go AT Protocol AppView server that indexes records matching your configured lexicons and exposes them via a GraphQL API.

Hyperindex connects to the network via Jetstream (a filtered real-time event stream), indexes matching records to a database (SQLite or PostgreSQL), and automatically generates typed GraphQL queries for all registered record types.

For setup instructions and usage, see the [Hyperindex tool page](/tools/hyperindex).

## Running your own indexer

You can run your own indexer if you want full control over data availability and query performance. [Hyperindex](https://github.com/hypercerts-org/hyperindex) is the recommended starting point — clone the repository, register your lexicons, and you have a fully functional indexer with a GraphQL API. You can also build custom indexing logic for your application's specific needs.

For an overview of how indexers fit into the protocol stack, see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle#stage-4-discovery--indexing).
