---
title: Hyperindex
description: A Go ATProto indexer that indexes hypercert records and exposes them via GraphQL.
---

# Hyperindex

Hyperindex (`hi`) is a Go AT Protocol AppView server that indexes records and exposes them via GraphQL. Use it to:

- Index all hypercert-related records from the ATProto network in real time
- Query indexed data through a typed GraphQL API
- Backfill historical records from any user or the entire network
- Run your own indexer for full control over data availability and query performance

Built in Go on [bluesky-social/indigo](https://github.com/bluesky-social/indigo). Source: [github.com/hypercerts-org/hyperindex](https://github.com/hypercerts-org/hyperindex).

## How it works

Hyperindex connects to the AT Protocol network via Jetstream (a real-time event stream). It watches for records matching your configured lexicons, parses them, and stores them in a queryable database (SQLite or PostgreSQL). It then exposes a GraphQL API for querying the indexed data.

```
Jetstream ──→ Consumer ──→ Records DB ──→ GraphQL API
                 │
           Activity Log ──→ Admin Dashboard

Backfill Worker ──→ AT Protocol Relay ──→ Records DB
```

## Quick start

```bash
git clone https://github.com/hypercerts-org/hyperindex.git
cd hyperindex
cp .env.example .env
go run ./cmd/hypergoat
```

Open [http://localhost:8080/graphiql/admin](http://localhost:8080/graphiql/admin) to access the admin interface.

## Register lexicons

Lexicons define the AT Protocol record types you want to index. Register them via the Admin GraphQL API at `/graphiql/admin`:

```graphql
mutation {
  uploadLexicons(files: [...])  # Upload lexicon JSON files
}
```

Or place lexicon JSON files in a directory and set the `LEXICON_DIR` environment variable.

For hypercerts, you would register the `org.hypercerts.claim.*` lexicons — see [Introduction to Lexicons](/lexicons/introduction-to-lexicons) for the full list.

## Query via GraphQL

Access your indexed data at `/graphql`:

```graphql
# Query records by collection
query {
  records(collection: "org.hypercerts.claim.activity") {
    edges {
      node {
        uri
        did
        value
      }
    }
  }
}

# With typed queries (when lexicon schemas are loaded)
query {
  orgHypercertsClaimActivity(first: 10) {
    edges {
      node {
        uri
        workScope
        impactScope
        createdAt
      }
    }
  }
}
```

## Endpoints

| Endpoint | Description |
|---|---|
| `/graphql` | Public GraphQL API |
| `/graphql/ws` | GraphQL subscriptions (WebSocket) |
| `/admin/graphql` | Admin GraphQL API |
| `/graphiql` | GraphQL playground (public API) |
| `/graphiql/admin` | GraphQL playground (admin API) |
| `/health` | Health check |
| `/stats` | Server statistics |

## Running with Docker

```bash
docker compose up --build
```

## Learn more

- [GitHub repository](https://github.com/hypercerts-org/hyperindex) — source code, issues, and documentation
- [Indexers & Discovery](/architecture/indexers-and-discovery) — how indexers fit into the Hypercerts architecture
- [Building on Hypercerts](/reference/building-on-hypercerts) — integration patterns for platforms and tools
