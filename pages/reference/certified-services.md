---
title: Certified Services
description: Public service endpoints and status pages for Certified-operated Hypercerts infrastructure.
---

# Certified Services

This page lists public service surfaces for Certified-operated Hypercerts infrastructure.

## Indexers

| Service | Environment | Public URL | Purpose |
|---|---|---|---|
| Hyperindex API | Production | [`api.indexer.hypercerts.dev/graphql`](https://api.indexer.hypercerts.dev/graphql) | GraphQL API for indexed Hypercerts and Certified records |
| Hyperindex Client | Production | [`indexer.hypercerts.dev`](https://indexer.hypercerts.dev) | Frontend view for the production indexer |
| Hyperindex API | Staging | [`dev.api.indexer.hypercerts.dev/graphql`](https://dev.api.indexer.hypercerts.dev/graphql) | GraphQL API for staging data and testing |
| Hyperindex Client | Staging | [`dev.indexer.hypercerts.dev`](https://dev.indexer.hypercerts.dev) | Frontend view for the staging indexer |

## PDSs

Certified operates multiple ePDS environments for identity and sign-in flows:

| Service | Environment | Use |
|---|---|---|
| [`certified.one`](https://certified.one) | Production ePDS | Production "Sign in with Certified" |
| [`dev.certified.app`](https://dev.certified.app) | Staging ePDS | Staging/testing before production rollout |
| `*.test.certified.app` | Test ePDS instances | Hypercerts core testing and bleeding-edge validation |

For full PDS details (versions, active test instances, and guidance), see [Certified PDSs](/reference/certified-pdss).

## Hyperscan

| Service | Public URL | Purpose |
|---|---|---|
| Hyperscan | [`www.hyperscan.dev`](https://www.hyperscan.dev) | Ecosystem-wide view of indexers and related discovery infrastructure |

## Labelers

| Service | Environment | Public URL | Purpose |
|---|---|---|---|
| Hyperlabel | Production | [`hyperlabel-production.up.railway.app`](https://hyperlabel-production.up.railway.app/) | Labels hypercert activity records for quality and likely-test detection |
| Orglabeler | Production | [`orglabeler-production.up.railway.app`](https://orglabeler-production.up.railway.app/) | Labels certified organization records using merged profile and organization context |

## Status pages

| Page | Covers |
|---|---|
| [`certified.instatus.com`](https://certified.instatus.com/) | Production and staging services |
| [`test-certified.instatus.com`](https://test-certified.instatus.com/) | Test services |

## Related pages

- [Hyperindex](/tools/hyperindex)
- [Labelers](/tools/labelers)
- [Certified PDSs](/reference/certified-pdss)
