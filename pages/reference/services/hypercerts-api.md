---
title: Indexer and Hypercerts API
description: How the Hypercerts API's indexing pipeline makes Hypercerts and Certified records searchable across the network.
---

# Indexer and Hypercerts API

The hosted Hypercerts API at [`api.hypercerts.dev`](https://api.hypercerts.dev) collects Hypercerts and Certified records from across the network, organizes them for queries, and serves XRPC methods for reading and searching them. Applications use the API rather than visiting every server that holds a record. The [endpoint explorer](https://endpoints.api.hypercerts.dev) documents each method and its request and response schemas.

The **indexer** is the API's internal pipeline for building its searchable view, not a separate public service that applications need to integrate with. This page explains both that pipeline and the API it serves.

## Where it fits

The indexing pipeline reads record changes delivered by [Jetstream](/reference/services/relay) and uses labels published by the [labelers](/reference/services/labelers). Applications call the Hypercerts API directly or through the [SDK](/reference/sdk). The [Feed Service](/reference/services/feed-service) is a separate reader of indexed Hypercerts data. See the [services overview](/reference/services) for the full diagram.

## AT Protocol background

In AT Protocol, each account's records live in its own repository on a PDS (Personal Data Server). Reading one record is straightforward when you know its address. A question such as "which activities have recent evaluations?" is harder because the answer is spread across many repositories on many servers.

A service that answers such questions combines an indexer, a data plane, and an API over them. The indexer consumes the network's stream of record changes and keeps the records it cares about in the data plane, its own database. The API answers queries from that database. Records remain in their owners' repositories; the data plane holds copies arranged for lookups.

This gives AT Protocol applications a characteristic shape: they **read from an indexed view and write to the user's PDS**. A new record reaches the view after it travels through the relay and the indexing pipeline.

PDSs and APIs like this one use **XRPC**, AT Protocol's convention for HTTP APIs. Each method is named by an NSID (Namespaced Identifier), such as `org.hypercerts.claim.getActivity`, and is called at `/xrpc/<NSID>`. Queries use `GET` requests with URL parameters; procedures use `POST` requests with a JSON body. Lexicon schemas describe each method, using the same schema language as record types.

## How it works

### Built on HappyView

The hosted API and its indexing pipeline use [HappyView](https://github.com/hypercerts-org/happyview), a framework for indexing AT Protocol records and serving XRPC queries over them. The Hypercerts API bundle, including its Lexicons, query handlers, and installer, is maintained in the [Hypercerts API repository](https://github.com/hypercerts-org/api).

### From stream to searchable view

The indexing pipeline:

1. **Reads records from Jetstream**, which delivers Hypercerts and Certified record changes as JSON events and keeps an archive for catching up on the past.
2. **Links related records.** An evaluation, for example, points to the activity it evaluates. The index connects those records so a query can return an activity with related context, such as its author's profile and contributors, where supported by the method.
3. **Uses labels.** It incorporates labels published by Hypercerts labelers, so results can include signals such as a quality tier or "likely test data."

Coverage follows from the sources: the API sees records on PDSs followed by the Hypercerts Relay and in the collections Jetstream keeps. A record missing from a result may be outside that coverage.

### The Hypercerts API

The API exposes queries across Hypercerts and Certified records. Examples include `org.hypercerts.claim.getActivity`, `org.hypercerts.claim.searchActivities`, and `org.hypercerts.collection.listCollections`, as well as Certified queries such as `app.certified.actor.getProfile` and `app.certified.graph.listActorFollowers`. Methods vary by record family; see the [endpoint explorer](https://endpoints.api.hypercerts.dev) for the complete current list.

Results are views, not bare records. Depending on the method, a view wraps the original record with its AT-URI (the record's `at://` address), CID (a hash of its content), indexing metadata, and related context. Each method's schema describes its exact result.

## Using it from your application

Call the API directly over XRPC, or use the [SDK](/reference/sdk) where it fits your application. The [XRPC API reference](/reference/xrpc-api) has a quickstart; the endpoint explorer documents every method.

For example, retrieve an activity by its full AT-URI. Replace the placeholders with the DID and record key of an activity available to the API:

```bash
activity_uri='at://<author-did>/org.hypercerts.claim.activity/<record-key>'
curl --get 'https://api.hypercerts.dev/xrpc/org.hypercerts.claim.getActivity' \
  --data-urlencode "uri=$activity_uri"
```

The read queries are public; applications do not need a user session to call them. The API is for indexed reads, not repository writes. Applications continue writing records to the user's PDS, and new or updated records may take time to appear in query results.

Choose another read path when it better fits your use case:

- **Read a known record directly from its repository.** Use `com.atproto.repo.getRecord` when you know the record's address. See [Certified PDSs](/reference/services/certified-pdss).
- **Follow live record changes.** Use Jetstream for a custom live view or lossless change processing. See [Relay and Jetstream](/reference/services/relay).
- **Read labels directly.** Query a [labeler](/reference/services/labelers) for special cases; the Hypercerts API already includes labels in its query results.
- **Design against the Lexicons.** API results follow the [Hypercerts lexicons](/lexicons/hypercerts-lexicons) and [Certified lexicons](/lexicons/certified-lexicons).

## Status and source

The hosted API is running in production at [`api.hypercerts.dev`](https://api.hypercerts.dev). Find its release status and changelog on [Hypercerts API releases](/releases/api). The API bundle, including its Lexicons, query handlers, and installer, is maintained in the [Hypercerts API repository](https://github.com/hypercerts-org/api). Running your own instance is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services)
- [Relay and Jetstream](/reference/services/relay)
- [Labelers](/reference/services/labelers)
- [Feed Service](/reference/services/feed-service)
- [XRPC API reference](/reference/xrpc-api)
- [Finding and Reusing Information](/architecture/portability-and-scaling)
