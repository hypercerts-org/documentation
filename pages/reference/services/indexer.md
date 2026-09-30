---
title: Indexer and Hypercerts API
description: The indexer collects Hypercerts and Certified records from across the network and serves the Hypercerts API for reading and discovering them. Under development.
---

# Indexer and Hypercerts API

{% callout type="info" title="Under development" %}
The indexer and the Hypercerts API are being built and have no published release yet. The planned API methods may change before release.
{% /callout %}

Hypercerts records are spread across many servers, one repository per account. Reading a single record is easy if you know where it lives, but questions such as "which activities have recent evaluations?" would mean visiting every server. The **indexer** answers those questions: it collects Hypercerts and Certified records from across the network, stores them in a database organized for queries, and serves the **Hypercerts API**, which applications use to read, list, and search those records.

## What it does

An account's records live in its repository on a **PDS** (Personal Data Server). Hypercerts records live in many PDSs. The [relay](/reference/services/relay) collects changes from those servers, and Jetstream filters them down to Hypercerts and Certified records. The indexer reads that filtered stream, builds a searchable view of the records, and serves the Hypercerts API. Applications use the [SDK](/reference/sdk) or call the API directly. [Labelers](/reference/services/labelers) publish labels about records, which the indexer picks up. Around that path, the [entryway](/reference/services/entryway) handles sign-in, the [Certified Group Service](/reference/services/certified-group-service) handles group accounts, and the [feed service](/reference/services/feed-service) builds feeds.

The records themselves stay in their owners' repositories. The indexer holds a copy arranged for lookups, so an application can find records across all accounts with one request. [Finding and Reusing Information](/architecture/portability-and-scaling) explains the role of indexers in the wider network.

## How it works

The Hypercerts Foundation is building the indexer on [HappyView](https://github.com/hypercerts-org/happyview), a lexicon-driven AppView for AT Protocol:

- An **AppView** is an AT Protocol service that collects records from the network, indexes them, and serves an API over them.
- **Lexicon-driven** means HappyView takes its data model from Lexicon schemas, the files that define each record type and API method. Given the schemas, it sets up storage, indexing, and API endpoints for them. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

The indexer:

1. **Reads records from Jetstream.** Jetstream is the Hypercerts service that delivers Hypercerts and Certified record changes as a stream of JSON events, with an archive for catching up on past events. See [Relay and Jetstream](/reference/services/relay).
2. **Links related records.** A record often refers to another, such as an evaluation that points to the activity it evaluates. The indexer connects these so that one query can return, for example, the evaluations of an activity.
3. **Applies labels.** It picks up the labels published by the Hypercerts [labelers](/reference/services/labelers), such as quality tiers and likely test data, so that results can take them into account.
4. **Serves the Hypercerts API.** The API is an **XRPC** API: XRPC is AT Protocol's convention for calling a service over HTTP, where each method is named by an NSID (Namespaced Identifier), such as `org.hypercerts.claim.getActivity`.

The Foundation maintains a fork of HappyView at [hypercerts-org/happyview](https://github.com/hypercerts-org/happyview) and aims to contribute its changes back to the original project. The goal is for the hosted Hypercerts API to be standard HappyView plus Hypercerts configuration: the Lexicon schemas, configuration files, and Lua scripts that define the database queries.

### Planned API methods

The planned methods follow a pattern of get, list, and search queries for each family of records, for example:

- `org.hypercerts.claim.getActivity`, `org.hypercerts.claim.listActivities`, and `org.hypercerts.claim.searchActivities` for activities
- `app.certified.actor.getProfile` for Certified profiles
- `app.certified.graph.listActorFollowers` for follow relationships

Similar queries are planned for organizations, collections, evaluations, attachments, locations, badge definitions, and funding receipts. You can browse the current set in [hypercerts-api-endpoints](https://github.com/hypercerts-org/hypercerts-api-endpoints). That repository is a snapshot of planned definitions, not a list of deployed methods, and the set may change before release. The [XRPC API reference](/reference/xrpc-api) will document each method once the API is released.

## Using it from your application

Once released, the recommended way to use the Hypercerts API is through the [SDK](/reference/sdk). You can also call the API directly over HTTP, as with any XRPC service. The [XRPC API reference](/reference/xrpc-api) will list the methods, their parameters, and their responses.

Until then:

- **Read single records from their repository.** If you know which account published a record, read it from that account's PDS with the standard AT Protocol methods.
- **Follow records as they change.** To build your own view of Hypercerts records, subscribe to Jetstream and backfill from its archive. See [Relay and Jetstream](/reference/services/relay).
- **Read labels directly.** Query the [labelers](/reference/services/labelers) for quality labels.
- **Design against the Lexicons.** The API returns the records described in [Hypercerts Lexicons](/lexicons/hypercerts-lexicons) and [Certified Lexicons](/lexicons/certified-lexicons), so you can build your data handling around those schemas now.

## Status

Under development, with no published release. Follow the API's status on [Changes](/changes/api).

## Running your own

Operating your own indexer is outside the scope of this documentation for now. The source code is in the [hypercerts-org/happyview repository](https://github.com/hypercerts-org/happyview).

## Related

- [Services overview and running endpoints](/reference/services#running-services)
- [XRPC API reference](/reference/xrpc-api)
- [SDK](/reference/sdk)
- [Relay and Jetstream](/reference/services/relay)
- [Labelers](/reference/services/labelers)
- [Finding and Reusing Information](/architecture/portability-and-scaling)
- [Data flow and lifecycle](/architecture/data-flow-and-lifecycle)
- [HappyView documentation](https://happyview.dev)
