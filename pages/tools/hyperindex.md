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

Built in Go. Source: [github.com/gainforest/hyperindex](https://github.com/gainforest/hyperindex). Tap reference implementation: [github.com/bluesky-social](https://github.com/bluesky-social/indigo/tree/main/cmd/tap).

Hosted production and staging endpoints: [Certified Services](/reference/certified-services#indexers).

## Why indexers & discovery

AT Protocol is federated, so hypercert records are distributed across many PDSs instead of living in a single database. If an app wants to discover records across users and organizations, it needs a way to aggregate that network data into one queryable view.

Indexers handle that job. They consume network events, fetch and parse records by lexicon, normalize them into query-ready storage, and expose APIs for search, filtering, and aggregation.

Hyperindex is the reference indexer used in this ecosystem.

If you want to inspect indexers running across the broader ecosystem, use [Hyperscan](https://www.hyperscan.dev).

## How it works

Hyperindex is **Tap-first** (recommended). Tap handles ingestion, and Hyperindex consumes Tap events, stores records, and exposes them via GraphQL.

```text
ATProto Relay ──→ Tap ──→ Hyperindex Consumer ──→ Records DB ──→ GraphQL API
                                     │
                               Activity Log ──→ Admin Dashboard
```

Jetstream mode still exists as a legacy/non-Tap mode, but Tap is the preferred setup.

## Quick start

For local development with default settings:

```bash
git clone https://github.com/gainforest/hyperindex.git
cd hyperindex
cp .env.example .env
go run ./cmd/hyperindex
```

Open [http://localhost:8080/graphiql/admin](http://localhost:8080/graphiql/admin) to access the admin interface.

## Register lexicons

Lexicons define the AT Protocol record types you want to index. You can register them via:

1. Admin GraphQL API at `/graphiql/admin`
2. Client admin UI at `https://<client-url>/lexicons` (you must log in with an admin DID)

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
        startDate
        createdAt
      }
    }
  }
}

# With typed filter queries (title contains "Hypercerts")
query {
  orgHypercertsClaimActivity(
    first: 10
    where: { title: { contains: "Hypercerts" } }
  ) {
    edges {
      node {
        uri
        title
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

## Deployment configuration

Use this section when deploying Hyperindex (backend, Tap, and client). It lists the environment variables you should set first for a reliable initial deployment, followed by optional variables for advanced tuning.

### Baseline deployment variables

These are the variables you should set first to get a stable deployment running.

Note: some managed platforms (including Railway) may auto-provision a subset of variables.

### Hyperindex backend

| Variable | Example | What it is for |
|---|---|---|
| `HOST` | `0.0.0.0` | Makes the app reachable in container runtime |
| `PORT` | `8080` | App port |
| `DATABASE_URL` | `sqlite:/data/hypergoat.db` | Main indexed-records database |
| `EXTERNAL_BASE_URL` | `https://hyperindex.example.com` | Public backend URL used by frontend/admin flows and GraphiQL links |
| `SECRET_KEY_BASE` | `<long-random-secret>` | Session/signing secret |
| `ADMIN_DIDS` | `did:plc:...` | DIDs with admin privileges |
| `TRUST_PROXY_HEADERS` | `true` | Trust forwarded auth headers from client proxy |
| `TAP_ENABLED` | `true` | Enables Tap mode |
| `TAP_URL` | `ws://tap.railway.internal:2480` | Tap websocket endpoint |
| `TAP_ADMIN_PASSWORD` | `<same-as-tap-service>` | Tap admin auth secret |

### Tap service

| Variable | Example | What it is for |
|---|---|---|
| `TAP_DATABASE_URL` | `sqlite:///data/tap.db` | Persists Tap cursor/state (self-managed; Railway autoconfigures) |
| `TAP_ADMIN_PASSWORD` | `<shared-secret>` | Protects Tap admin routes |
| `TAP_COLLECTION_FILTERS` | `app.certified.*,org.hypercerts.*` | Filters ingested record collections |
| `TAP_SIGNAL_COLLECTION` | `app.certified.actor.profile` | Signal collection for repo discovery |

### Client (Next.js)

| Variable | Example | What it is for |
|---|---|---|
| `NEXT_PUBLIC_HYPERINDEX_URL` | `https://hyperindex.example.com` | Browser-side URL of your Hyperindex backend |
| `HYPERINDEX_URL` | `https://hyperindex.example.com` | Server-side URL of your Hyperindex backend (used by Next API proxy routes). If unset, it falls back to `NEXT_PUBLIC_HYPERINDEX_URL` |
| `NEXT_PUBLIC_CLIENT_URL` | `https://hyperindex-frontend.example.com` | Client frontend URL used for OAuth client metadata and auth redirects |
| `COOKIE_SECRET` | `<long-random-secret>` | Session encryption |
| `ATPROTO_JWK_PRIVATE` | `<jwk-json>` | Confidential OAuth signing key |

Hyperindex normalizes both `NEXT_PUBLIC_HYPERINDEX_URL` and `HYPERINDEX_URL`: it trims surrounding whitespace, removes trailing slashes, and prepends `https://` when no scheme is provided.

### Optional variables

Set these only when needed.

### Backend
- `ALLOWED_ORIGINS`
- `TAP_DISABLE_ACKS`

> `TAP_DISABLE_ACKS` is configured on the **backend/indexer** service.
> In some deployments, ACK mode (`TAP_DISABLE_ACKS=false`) can cause repeated websocket disconnect loops (for example: `connection reset by peer`, `close 1006`, frequent reconnect backoff).
> If you see that pattern, set `TAP_DISABLE_ACKS=true` on the **Hyperindex backend** to stabilize ingestion first, then investigate Tap resource/config compatibility before re-enabling ACK mode.

### Tap
- `TAP_FULL_NETWORK`
- `TAP_FIREHOSE_PARALLELISM`
- `TAP_RESYNC_PARALLELISM`
- `TAP_OUTBOX_PARALLELISM`
- `TAP_MAX_DB_CONNS`
- `TAP_OUTBOX_CAPACITY`
- `TAP_NO_REPLAY`
- `TAP_REPO_FETCH_TIMEOUT`

> `TAP_FULL_NETWORK=true` enables full-network tracking and triggers a broad historical backfill across discoverable repos.
> This can materially increase ingestion load, network requests, and storage use.

### Client
- Additional auth/provider-specific settings depending on deployment model

## Common pitfalls

- **Wrong variable on wrong service**
  - `TAP_COLLECTION_FILTERS`, `TAP_SIGNAL_COLLECTION`, `TAP_FULL_NETWORK` belong to **Tap**
  - `TAP_DISABLE_ACKS`, `TAP_ENABLED`, `TAP_URL` belong to **Hyperindex backend**

- **Client works but admin requests fail**
  - `HYPERINDEX_URL` is missing on the client deployment
  - `NEXT_PUBLIC_HYPERINDEX_URL` alone is not enough for server-side proxy routes
  - `EXTERNAL_BASE_URL` does not match the backend's public URL

- **`admin privileges required` while logged in**
  - `TRUST_PROXY_HEADERS` is missing/false
  - Logged-in DID is not present in `ADMIN_DIDS`

- **Trailing slash URL issues**
  - `NEXT_PUBLIC_CLIENT_URL` must **not** include a trailing slash.
  - Use:
    - `https://hyperindex-frontend.example.com` ✅
    - `https://hyperindex-frontend.example.com/` ❌
  - A trailing slash can cause OAuth client metadata lookup errors (for example: `client_metadata not found`).

- **Healthcheck confusion**
  - Backend healthcheck should be `/health`
  - Frontend usually uses `/` unless you explicitly add a `/health` route

## Deploy on Railway

### 1) Deploy Hyperindex backend

1. Create a Railway service from the repository
2. Attach a persistent volume mounted to `/data`
3. Set healthcheck path to `/health`
4. Add backend variables from the baseline list above
5. Deploy

Use `PORT=8080` for the Hyperindex service. For public URL variables (for example `EXTERNAL_BASE_URL`, `NEXT_PUBLIC_HYPERINDEX_URL`, `HYPERINDEX_URL`), use the Railway-generated HTTPS domain (typically without appending `:8080`).

### 2) Deploy Tap

1. Create a Railway service from image:
   `ghcr.io/bluesky-social/indigo/tap:latest` (or a pinned tag)
2. Attach a persistent volume mounted to `/data`
3. Add Tap variables from the baseline list above, but **do not manually set `TAP_DATABASE_URL` on Railway** (Railway autoconfigures this for the service)
4. Deploy

See the official ATProto Tap Railway guide: [RAILWAY_DEPLOY.md](https://github.com/bluesky-social/indigo/blob/main/cmd/tap/RAILWAY_DEPLOY.md).

### 3) Connect backend to Tap

Set on backend service:

- `TAP_ENABLED=true`
- `TAP_URL=ws://<tap-private-host>:2480`
- `TAP_ADMIN_PASSWORD=<same-as-tap-service>`

Redeploy backend after updating these values.

### 4) Deploy client (Next.js)

Deploy client on Railway/Vercel/etc and set:

- `NEXT_PUBLIC_HYPERINDEX_URL=<hyperindex-backend-public-url>`
- `HYPERINDEX_URL=<hyperindex-backend-public-url>`
- auth/session vars (`NEXT_PUBLIC_CLIENT_URL`, `COOKIE_SECRET`, `ATPROTO_JWK_PRIVATE`) as needed

### Railway-specific DB path notes

For mounted volumes at `/data`:

**Railway**

- Backend SQLite: `DATABASE_URL=sqlite:/data/hypergoat.db`
- Tap SQLite: do not manually set `TAP_DATABASE_URL` (it is autoconfigured)

**Non-Railway/self-managed**

- Backend SQLite: `DATABASE_URL=sqlite:/data/hypergoat.db`
- Tap SQLite: `TAP_DATABASE_URL=sqlite:///data/tap.db`

## Running with Docker

```bash
docker compose up --build
```

## Learn more

- [GitHub repository](https://github.com/gainforest/hyperindex) — source code, issues, and documentation
- [Certified Services](/reference/certified-services#indexers) — current public indexer endpoints
- [Building on Hypercerts](/getting-started/building-on-hypercerts) — integration patterns for platforms and tools
