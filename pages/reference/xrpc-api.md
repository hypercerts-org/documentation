---
title: XRPC API
description: Use the released Hypercerts API to query indexed Hypercerts and Certified records.
---

# XRPC API

The Hypercerts API is the XRPC interface for reading and discovering indexed Hypercerts and Certified records. Each method is identified by an NSID and called over HTTP using AT Protocol conventions.

{% callout type="info" title="Production API and endpoint reference" %}
Use [`https://api.hypercerts.dev`](https://api.hypercerts.dev) for production requests. Browse method parameters, response schemas, and examples in the [Hypercerts API endpoint explorer](https://endpoints.api.hypercerts.dev).
{% /callout %}

## Make a request

Queries use `GET` requests with parameters in the URL. Set `activity_uri` to the full AT-URI of an activity already indexed by the API; the angle-bracket values below are placeholders.

```bash
activity_uri='at://<author-did>/org.hypercerts.claim.activity/<record-key>'
curl --get 'https://api.hypercerts.dev/xrpc/org.hypercerts.claim.getActivity' \
  --data-urlencode "uri=$activity_uri"
```

The read queries are public; applications do not need a user session to call them. Use the endpoint explorer for each method's exact parameters, response shape, and error cases. Requests use XRPC routes in the form `/xrpc/<NSID>`; query methods use `GET` and procedures use `POST`.

## What you can query

The API provides queries across Hypercerts and Certified data, including:

- Hypercert activities, collections, contributions, evaluations, attachments, acknowledgements, funding receipts, and vocabulary tags.
- Certified profiles, organizations, follows, locations, and badge definitions, awards, and responses.
- List and search queries where supported, with pagination for larger result sets.

The endpoint explorer is the source for the current method inventory and schemas. The [Lexicons](/lexicons/introduction-to-lexicons) define the records and shared types returned by the API.

## Data and consistency

The API serves an indexed view of records from across the network. The source of truth remains each record owner's AT Protocol repository; new or updated records may take time to appear in query results. To read a known record directly, use its repository. For network-wide discovery, use the API or follow record changes through [Jetstream](/reference/services/relay).

The API is read-focused: applications continue writing records to the user's repository. See [Finding and Reusing Information](/architecture/portability-and-scaling) for the relationship between indexed reads and repository writes.

## Release history

See [Hypercerts API releases](/releases/api) for the API's release status.
