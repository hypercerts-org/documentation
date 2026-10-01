---
title: Indexer and Hypercerts API
description: The indexer collects Hypercerts and Certified records from across the network and serves the Hypercerts API for reading and searching them. Under development.
---

# Indexer and Hypercerts API

The indexer collects Hypercerts and Certified records from across the network, stores them in a database organized for queries, and serves the Hypercerts API. Applications use that API to read, list, and search records without visiting every server that holds them. Both are under development: the API is not deployed yet, and this page describes its design and what to use in the meantime.

## Where it fits

The indexer reads the stream of record changes that [Jetstream](/reference/services/relay) delivers and picks up the labels that the [labelers](/reference/services/labelers) publish. Applications sit on the other side: they call the Hypercerts API directly or through the [SDK](/reference/sdk). The [Feed Service](/reference/services/feed-service) is a second reader of indexed data. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

In AT Protocol, each account's records live in its own repository on a PDS (Personal Data Server). Reading one record is easy when you know its address. A question such as "which activities have recent evaluations?" is not, because the answer is spread over many repositories on many servers.

An **AppView** is the kind of service that answers such questions. It consumes the network's stream of record changes, keeps the records it cares about in its own database, and serves an API over them. The records stay in their owners' repositories. The AppView holds a copy arranged for lookups.

This gives AT Protocol applications a characteristic shape: they **read from an indexed view and write to the user's PDS**. A new record reaches the view a moment later, by way of the relay.

AppViews and PDSs expose their APIs through **XRPC**, AT Protocol's convention for HTTP APIs. Each method is named by an NSID (Namespaced Identifier), such as `org.hypercerts.claim.getActivity`, and is called at `/xrpc/<NSID>`. Queries are `GET` requests with URL parameters, and procedures are `POST` requests with a JSON body. Both are described by Lexicon schemas, the same schema language that defines record types.

## How it works

### Built on HappyView

The Hypercerts Foundation is building the indexer on [HappyView](https://github.com/hypercerts-org/happyview), an AppView that is driven by Lexicon schemas. Given the schemas for a set of record types and API methods, HappyView sets up storage, indexing, and XRPC endpoints for them. Lua scripts define the query logic where a method needs more than a plain lookup.

The Foundation maintains a fork of HappyView and aims to contribute its changes back to the original project. The goal is for the hosted Hypercerts API to be standard HappyView plus Hypercerts configuration: the schemas, the configuration files, and the query scripts.

### From stream to searchable view

The indexer:

1. **Reads records from Jetstream**, which delivers Hypercerts and Certified record changes as JSON events and keeps an archive for catching up on the past.
2. **Links related records.** A record often points to another, such as an evaluation pointing to the activity it evaluates. The indexer connects them, so one query can return an activity together with its author's profile and its contributors.
3. **Applies labels.** It subscribes to the Hypercerts labelers, so results can take signals such as a quality tier or "likely test data" into account.

Coverage follows from the sources: the indexer sees records on the PDSs that the Hypercerts Relay follows, in the collections that Jetstream keeps. A record missing from a result may live outside that coverage.

### The Hypercerts API

The planned methods follow one pattern for each family of records: a get, a list, and a search query. For activities, those are `org.hypercerts.claim.getActivity`, `listActivities`, and `searchActivities`. Similar queries are planned for collections, evaluations, attachments, funding receipts, locations, and badge definitions, along with Certified queries such as `app.certified.actor.getProfile` and `app.certified.graph.listActorFollowers`.

Results are views, not bare records. A view wraps the original record, unchanged, with metadata such as its AT-URI (the record's `at://` address), its CID (a hash of its content), and details the indexer has looked up for you, such as the author's profile.

## Using it from your application

Once the API is released, the recommended way to use it is through the [SDK](/reference/sdk). You can also call it over HTTP like any XRPC service, and the [XRPC API reference](/reference/xrpc-api) will document each method.

The example shows the planned shape of one query, taken from the definitions in [hypercerts-api-endpoints](https://github.com/hypercerts-org/hypercerts-api-endpoints). That repository is a snapshot of planned definitions. The method is not deployed, and its shape may change before release.

```bash
# Planned query. Not deployed yet, and the shape may change.
curl --get https://<hypercerts-api-host>/xrpc/org.hypercerts.claim.getActivity \
  --data-urlencode 'uri=at://did:plc:example/org.hypercerts.claim.activity/3msek4eui2i27'

# Planned response:
# {
#   "activity": {
#     "uri": "at://did:plc:example/org.hypercerts.claim.activity/3msek4eui2i27",
#     "cid": "bafyrei...",
#     "indexedAt": "2026-08-05T22:08:58.761Z",
#     "did": "did:plc:example",
#     "author": { ... },        the author's profile details
#     "record": { ... },        the original activity record, unchanged
#     "contributors": [ ... ]   contributors, with their profiles where known
#   }
# }
```

Until the API is available:

- **Read single records from their repository.** If you know which account published a record, read it from that account's PDS with `com.atproto.repo.getRecord`. See [Certified PDSs](/reference/services/certified-pdss).
- **Follow records as they change.** To build your own view, subscribe to Jetstream and backfill from its archive. See [Relay and Jetstream](/reference/services/relay).
- **Read labels directly.** Query the [labelers](/reference/services/labelers) for quality labels.
- **Design against the Lexicons.** The API returns the records described in [Hypercerts lexicons](/lexicons/hypercerts-lexicons) and [Certified lexicons](/lexicons/certified-lexicons), so you can build your data handling around those schemas now.

Writing does not change when the API arrives. Your application keeps writing records to the user's PDS, and the indexer picks them up from the stream.

## Status and source

The indexer and the Hypercerts API are under development, with no published release and no deployed endpoint. Follow their status on [Hypercerts API releases](/changes/api).

The source code is in the [happyview repository](https://github.com/hypercerts-org/happyview), and the planned method definitions are in [hypercerts-api-endpoints](https://github.com/hypercerts-org/hypercerts-api-endpoints). Running your own instance is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services)
- [Relay and Jetstream](/reference/services/relay)
- [Labelers](/reference/services/labelers)
- [Feed Service](/reference/services/feed-service)
- [XRPC API reference](/reference/xrpc-api)
- [Finding and Reusing Information](/architecture/portability-and-scaling)
