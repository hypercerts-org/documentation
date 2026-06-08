---
title: Certified Services
description: Public service endpoints and status pages for Certified-operated Hypercerts infrastructure.
---

# Certified Services

This page lists public service surfaces for Certified-operated Hypercerts infrastructure.

## Indexers

| Service | Environment | Public URL | Purpose |
|---|---|---|---|
| Hyperindex API | Production | [`api.indexer.hypercerts.dev/graphql`](https://api.indexer.hypercerts.dev/graphql) | GraphQL API for indexed Hypercerts and Certified records; supports standard introspection |
| Hyperindex GraphiQL | Production | [`api.indexer.hypercerts.dev/graphiql`](https://api.indexer.hypercerts.dev/graphiql) | Browser-based explorer for the production GraphQL API |
| Hyperindex Client | Production | [`indexer.hypercerts.dev`](https://indexer.hypercerts.dev) | Frontend view for the production indexer |
| Hyperindex API | Staging | [`dev.api.indexer.hypercerts.dev/graphql`](https://dev.api.indexer.hypercerts.dev/graphql) | GraphQL API for staging data and testing; supports standard introspection |
| Hyperindex GraphiQL | Staging | [`dev.api.indexer.hypercerts.dev/graphiql`](https://dev.api.indexer.hypercerts.dev/graphiql) | Browser-based explorer for the staging GraphQL API |
| Hyperindex Client | Staging | [`dev.indexer.hypercerts.dev`](https://dev.indexer.hypercerts.dev) | Frontend view for the staging indexer |

## PDSs

Certified operates multiple ePDS environments for identity and sign-in flows:

| Service | Environment | Use |
|---|---|---|
| [`certified.one`](https://certified.one) | Production ePDS | Production "Sign in with Certified" |
| [`dev.certified.app`](https://dev.certified.app) | Staging ePDS | Staging/testing before production rollout |
| `*.test.certified.app` | Test ePDS instances | Hypercerts core testing and bleeding-edge validation |

For full PDS details (versions, active test instances, and guidance), see [Certified PDSs](/reference/certified-pdss).

## Group Services

Certified operates multiple [CGS](/architecture/certified-group-service) environments for group-governed repositories:

| Service | Environment | Use |
|---|---|---|
| [`groups.certified.app`](https://groups.certified.app) | Production CGS | Production group-governed repositories |
| [`dev.groups.certified.app`](https://dev.groups.certified.app) | Staging CGS | Staging/testing before production rollout |
| [`test.groups.certified.app`](https://test.groups.certified.app) | Test CGS | Hypercerts core testing and bleeding-edge validation |

For full CGS details (versions, environments, and guidance), see [Certified Group Services](/reference/certified-group-services).

## Hyperscan

| Service | Public URL | Purpose |
|---|---|---|
| [Hyperscan](/tools/hyperscan) | [`www.hyperscan.dev`](https://www.hyperscan.dev) | Ecosystem-wide view of indexers and related discovery infrastructure |

## Labelers

| Service | Environment | Public URL | Purpose |
|---|---|---|---|
| Activity Labeler | Production | [`activitylabeler.hypercerts.dev`](https://activitylabeler.hypercerts.dev/) | Labels hypercert activity records for quality and likely-test detection |
| Orglabeler | Production | [`orglabeler.hypercerts.dev`](https://orglabeler.hypercerts.dev/) | Labels certified organization records using merged profile and organization context |

The ATProto labeler identities are Certified accounts that publish each `app.bsky.labeler.service/self` declaration:

| Service | Labeler handle | DID | Service record |
|---|---|---|---|
| Activity Labeler | `activitylabeler.certified.one` | `did:plc:antf7bsm6f4ohkqfdckefyt7` | [PDSls](https://pds.ls/at://did:plc:antf7bsm6f4ohkqfdckefyt7/app.bsky.labeler.service/self) · [Hyperscan](https://www.hyperscan.dev/data?did=did%3Aplc%3Aantf7bsm6f4ohkqfdckefyt7&collection=app.bsky.labeler.service&rkey=self) |
| Orglabeler | `orglabeler.certified.one` | `did:plc:pswneepkd5lesumj7ejmkbal` | [PDSls](https://pds.ls/at://did:plc:pswneepkd5lesumj7ejmkbal/app.bsky.labeler.service/self) · [Hyperscan](https://www.hyperscan.dev/data?did=did%3Aplc%3Apswneepkd5lesumj7ejmkbal&collection=app.bsky.labeler.service&rkey=self) |

## Status pages

| Page | Covers |
|---|---|
| [`certified.instatus.com`](https://certified.instatus.com/) | Production and staging services |
| [`test-certified.instatus.com`](https://test-certified.instatus.com/) | Test services |

## Related pages

- [Hyperindex](/tools/hyperindex)
- [Labelers](/tools/labelers)
- [Certified PDSs](/reference/certified-pdss)
- [Certified Group Services](/reference/certified-group-services)
