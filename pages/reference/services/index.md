---
title: Services and tooling
description: The services that make up the Hypercerts stack, how they fit together, and every running endpoint.
---

# Services and tooling

Hypercerts records live in the repositories of the people and organizations who publish them, spread across many servers. A set of services, most of them operated by the Hypercerts Foundation, lets people sign in and publish records, and lets applications find and read them.

This section describes each service at the level a project needs to integrate with Hypercerts: what it does, how it works, and how your application uses it. Most projects integrate through the [SDK](/reference/sdk), or by calling the [Hypercerts API](/reference/xrpc-api) directly. Running your own copy of a service is outside the scope of this documentation for now; each page links to the service's source code.

{% stack-diagram /%}

## Components

| Component | What it does | Status |
|---|---|---|
| [certified.app](/reference/services/certified-app) | The web app where people create and manage their Certified account | Running |
| [Certified PDSs](/reference/services/certified-pdss) | Host Certified accounts and their records. A PDS (Personal Data Server) stores an account's repository of records. | Running |
| [Entryway](/reference/services/entryway) | Signs users in to their Certified accounts | Under development; the Certified PDSs handle sign-in today |
| [Certified Group Service](/reference/services/certified-group-service) | Lets several people manage one group account with different roles | Running |
| [Relay and Jetstream](/reference/services/relay) | The relay collects record changes from PDSs across the network; Jetstream filters them down to Hypercerts and Certified records | Running |
| [Indexer and Hypercerts API](/reference/services/indexer) | Builds a searchable view of the records and serves the Hypercerts API | Under development |
| [Labelers](/reference/services/labelers) | Publish labels about records and accounts, such as "likely test data", that the indexer and apps can use | Running |
| [Feed Service](/reference/services/feed-service) | Serves ready-made feeds of recent Hypercerts activity | Running |

## Running services

All running endpoints are listed here and nowhere else, so there is one place to keep current as services are added or moved. **Production** is for live applications. **Staging** runs the upcoming release, so you can test your integration before it goes live. **Test** instances run the latest development code and can be reset without notice.

### Accounts and sign-in

| Service | Environment | Endpoint | Notes |
|---|---|---|---|
| Certified PDS | Production | [`certified.one`](https://certified.one) | Production "Sign in with Certified" (ePDS) |
| Certified PDS | Staging | [`dev.certified.app`](https://dev.certified.app) | Staging "Sign in with Certified" (ePDS) |
| Certified PDS | Test | `epds1.test.certified.app` | Development ePDS instance |
| Certified PDS | Test | `pds1.test.certified.app` | Standard PDS backing the test group service |
| Sign-in (auth) service | Production, staging | `auth.certified.one`, `auth.dev.certified.app` | Handles the email step of signing in; apps don't call it directly |
| certified.app | Production | [`certified.app`](https://certified.app) | Web app where people manage their Certified accounts |

### Group accounts

| Service | Environment | Endpoint | Service DID |
|---|---|---|---|
| Certified Group Service | Production | [`groups.certified.app`](https://groups.certified.app/health) | `did:web:groups.certified.app` |
| Certified Group Service | Staging | [`dev.groups.certified.app`](https://dev.groups.certified.app/health) | `did:web:dev.groups.certified.app` |
| Certified Group Service | Test | [`test.groups.certified.app`](https://test.groups.certified.app/health) | `did:web:test.groups.certified.app` |

### Reading and discovery

| Service | Environment | Endpoint |
|---|---|---|
| Hypercerts Relay | Production | `wss://relay.hypercerts.dev` |
| Hypercerts Relay | Staging | `wss://relay.staging.hypercerts.dev` |
| Jetstream | Production | `wss://jetstream.hypercerts.dev` |
| Jetstream | Staging | `wss://jetstream.staging.hypercerts.dev` |
| Hypercerts API | | Not yet deployed |

### Labels and feeds

| Service | Environment | Endpoint | Identity |
|---|---|---|---|
| Activity Labeler | Production | [`activitylabeler.hypercerts.dev`](https://activitylabeler.hypercerts.dev/) | `activitylabeler.certified.one` (`did:plc:antf7bsm6f4ohkqfdckefyt7`) |
| Orglabeler | Production | [`orglabeler.hypercerts.dev`](https://orglabeler.hypercerts.dev/) | `orglabeler.certified.one` (`did:plc:pswneepkd5lesumj7ejmkbal`) |
| Feed Service | Production | [`feed.hypercerts.dev`](https://feed.hypercerts.dev) | `did:web:feed.hypercerts.dev` |
| Feed Service | Staging | [`dev.feed.hypercerts.dev`](https://dev.feed.hypercerts.dev) | `did:web:dev.feed.hypercerts.dev` |

### Status pages

| Page | Covers |
|---|---|
| [`certified.instatus.com`](https://certified.instatus.com/) | Production and staging services |
| [`test-certified.instatus.com`](https://test-certified.instatus.com/) | Test services |

Most services report their running version on a health endpoint, such as `/health` or `/xrpc/_health`. Each service page explains how to check it.
