---
title: Certified Services
description: Public service endpoints and status pages for Certified-operated Hypercerts infrastructure.
---

# Certified Services

This page lists public service surfaces for Certified-operated Hypercerts infrastructure.

## Indexers

| Service | Environment | Public URL | Purpose |
|---|---|---|---|
| Hyperindex API | Production | [`api.hi.gainforest.app/graphql`](https://api.hi.gainforest.app/graphql) | GraphQL API for indexed Hypercerts and Certified records |
| Hyperindex Client | Production | [`hi.gainforest.app`](https://hi.gainforest.app) | Frontend view for the production indexer |
| Hyperindex API | Staging | [`dev.api.hi.gainforest.app/graphql`](https://dev.api.hi.gainforest.app/graphql) | GraphQL API for staging data and testing |
| Hyperindex Client | Staging | [`dev.hi.gainforest.app`](https://dev.hi.gainforest.app) | Frontend view for the staging indexer |

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

## Status pages

| Page | Covers |
|---|---|
| [`certified.instatus.com`](https://certified.instatus.com/) | Production and staging services |
| [`test-certified.instatus.com`](https://test-certified.instatus.com/) | Test services |

## Related pages

- [Hyperindex](/tools/hyperindex)
- [Certified PDSs](/reference/certified-pdss)
