---
title: API and indexer
description: How the Hypercerts API's indexing pipeline makes Hypercerts and Certified records searchable across the network.
---

# API and indexer

The Hypercerts API lets applications search and read Hypercerts and Certified records across accounts, without querying each account's PDS (Personal Data Server). It serves an indexed view over XRPC; the original records remain in their authors' repositories.

{% callout type="info" title="Explore the API endpoints" %}
Open the [Hypercerts API endpoint explorer](https://endpoints.api.hypercerts.dev) for the current list of methods, their parameters, response schemas, examples, and error cases.
{% /callout %}

## Where it fits

[Jetstream](/reference/services/relay) delivers record changes to the indexer, which builds the view served by the API. Applications write records to the user's PDS and read across accounts through the API. The [Feed Service](/reference/services/feed-service) provides ready-made feeds separately. See the [services overview](/reference/services) for the full diagram.

## How it works

The indexer uses [HappyView](https://github.com/hypercerts-org/happyview) to consume Jetstream events, store selected records in an indexed database, and connect related records, such as an evaluation and the activity it evaluates. Coverage is limited to PDSs followed by the Hypercerts Relay and record collections retained by Jetstream. Records outside that scope will not appear in API results.

The API returns indexed views rather than bare records. Depending on the method, a view includes the record's AT-URI (`at://` address), CID (content hash), indexing metadata, and related context.

## Using it from your application

XRPC names each HTTP method with an NSID (Namespaced Identifier) at `/xrpc/<NSID>`. Queries use `GET` with URL parameters. The public read queries need no user session. Call them directly or use the [SDK](/reference/sdk) when available.

For example, retrieve an activity by its full AT-URI. Replace the placeholders with the DID and record key of an activity available to the API:

```bash
activity_uri='at://<author-did>/org.hypercerts.claim.activity/<record-key>'
curl --get 'https://api.hypercerts.dev/xrpc/org.hypercerts.claim.getActivity' \
  --data-urlencode "uri=$activity_uri"
```

The API is for indexed reads, not repository writes. New or updated records may take time to appear.

Choose another read path when it better fits your use case:

- **Read a known record directly from its repository.** Use `com.atproto.repo.getRecord` when you know the record's address. See [Certified PDSs](/reference/services/certified-pdss).
- **Follow live record changes.** Use Jetstream for a custom live view or lossless change processing. See [Relay and Jetstream](/reference/services/relay).
- **Read labels directly.** Query a [labeler](/reference/services/labelers) when your application needs label data. <!-- Previously: Query a [labeler](/reference/services/labelers) for special cases; the Hypercerts API already includes labels in its query results. -->

## Status and source

Production endpoint: [`api.hypercerts.dev`](https://api.hypercerts.dev). See [Hypercerts API releases](/releases/api) for its changelog and the [API repository](https://github.com/hypercerts-org/api) for source code.
