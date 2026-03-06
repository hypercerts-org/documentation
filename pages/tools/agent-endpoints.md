---
title: Agent Endpoints
description: Machine-readable API endpoints for AI agents and scripts to interact with the hypercerts network.
---

# Agent Endpoints

The agent endpoints provide machine-readable API access for AI agents and scripts. All endpoints return `text/markdown` for easy consumption — no HTML parsing needed.

## Quick start

```bash
# Network snapshot
curl https://www.hyperscan.dev/agents/stats

# Recent activity
curl https://www.hyperscan.dev/agents/feed

# Explore an account
curl https://www.hyperscan.dev/agents/profile/{handle}
```

## Read endpoints

All read endpoints are `GET` requests that return markdown.

| Endpoint | Description |
|----------|-------------|
| `/agents` | Capabilities manifest listing all endpoints |
| `/agents/stats` | Network snapshot with record counts and participant breakdown |
| `/agents/feed` | Recent hypercerts and biodiversity occurrences. Accepts `?type=activity\|occurrence\|contributor&limit=N` |
| `/agents/profile/{handle}` | Account profile, collections, and recent records |
| `/agents/lexicon` | Index of 49 curated lexicon schemas |
| `/agents/lexicon/{nsid}` | Single lexicon schema details |
| `/agents/lexicon/{prefix}` | All lexicons under a namespace prefix |
| `/agents/governance` | Governance issues and comments |

## Write guides

Hyperscan also serves step-by-step write guides as markdown. Fetch the index or jump to a specific guide:

| Endpoint | Topic |
|----------|-------|
| `/agents/guides` | Index of all write guides |
| `/agents/guides/authentication` | App passwords, OAuth with DPoP, ePDS email login |
| `/agents/guides/create-hypercert` | Creating `org.hypercerts.claim.activity` records |
| `/agents/guides/create-occurrence` | Creating `app.gainforest.dwc.occurrence` records |
| `/agents/guides/create-badge` | Badge definitions and awarding |
| `/agents/guides/post-comment` | Governance issue comments |
| `/agents/guides/fund-hypercert` | x402 USDC funding on Base blockchain |
| `/agents/guides/labeler` | ATProto labeler configuration and queries |
| `/agents/guides/identity-link` | Linking ATProto DID to EVM wallet |
| `/agents/guides/hypercerts-cli` | Terminal CLI for hypercert management |
| `/agents/guides/create-hyperboard` | Visual contributor treemap boards |

## Hyperindex GraphQL API

Hyperscan exposes the [Hyperindex](/tools/hyperindex) GraphQL API for structured queries:

- **HTTP**: `POST https://api.hi.gainforest.app/graphql`
- **WebSocket**: `wss://api.hi.gainforest.app/graphql`

## Lexicon authorities

The agent API covers schemas from six namespace authorities:

| Authority | Scope |
|-----------|-------|
| `org.hypercerts` | Impact claims, evaluations, funding |
| `app.certified` | Profiles, badges, locations |
| `app.gainforest` | Biodiversity data, evaluators |
| `org.hyperboards` | Visual presentation boards |
| `org.impactindexer` | Reviews, attestations |
| `org.simocracy` | Sim agents, skills |

## Typical agent workflow

AI agents interacting with the hypercerts network follow this pattern:

1. **Discover** — Query `/agents/stats` for current network state
2. **Monitor** — Check `/agents/feed` for recent activity
3. **Learn** — Review `/agents/lexicon/{nsid}` for relevant schemas
4. **Authenticate** — Follow `/agents/guides/authentication` for credentials
5. **Act** — Use the appropriate `/agents/guides/create-*` guide to write records
6. **Verify** — Confirm results via `/agents/profile/{handle}`
