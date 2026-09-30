---
title: Feed Service
description: A read-only service that builds ordered, viewer-scoped feeds of Hypercerts activity.
---

# Feed Service

The Hypercerts Feed Service builds activity feeds. Given a viewer, it returns the recent Hypercerts activity from the accounts that viewer follows, newest first: new Hypercerts, collections, evaluations, measurements, updates, and endorsements. Your application sends one request and gets back either display-ready entries or a list of record references to load itself.

## What it does

Hypercerts records live in many personal data servers (PDSs). The [relay](/reference/services/relay) collects changes from those servers, Jetstream filters them, and the [indexer](/reference/services/indexer) serves the Hypercerts API that applications use through the SDK or API. [Labelers](/reference/services/labelers) add labels the indexer uses, the [entryway](/reference/services/entryway) handles sign-in, and the [Certified Group Service](/reference/services/certified-group-service) handles group accounts.

The feed service is a standalone service beside that path. It reads indexed Hypercerts data and turns it into feeds. It is read-only: it does not ingest records, change indexed data, write records, or call PDSs or AppViews while serving a request.

A feed here is an ordered, paged list of events chosen for one viewer. It is not a Bluesky feed generator: its procedures use the `org.hypercerts.feed.*` namespace, not `app.bsky.feed.*`, and Bluesky apps do not display it.

## How it works

### Who is in the feed

A feed starts from the viewer's follows: the accounts named in the viewer's current `app.certified.graph.follow` records. The request can then change that scope:

- **Trusted evaluators** add the accounts that selected evaluators have endorsed through active endorsement awards.
- **Organization quality** keeps or removes organizations based on labels from the [Orglabeler](/reference/services/labelers#orglabeler). The service operator configures which labelers are trusted; callers cannot choose label sources.
- **Event kinds** limit which kinds of events appear.

The viewer's own records are left out. Records from deleted, deactivated, suspended, or taken-down accounts are removed from the indexed data before the feed reads it.

### Skeleton and hydrated feeds

The service offers the same feed in two forms:

- A **skeleton** is the bare list of selected records, each given only as an AT-URI (the `at://` address of a record). Use it when another part of your application loads and renders the records.
- A **hydrated** feed fills in each entry with what a client needs to display it: the event kind, the actor (DID, handle, display name, avatar), and content specific to that kind of event.

For actor details, the service uses the account's Certified profile when it has one, then its Bluesky profile, then the handle or DID.

### Order and paging

Entries are ordered newest first, by the record's `createdAt` when it is valid and otherwise by the time the record was indexed. Each response can include a cursor, an opaque string you send back to get the next page. A cursor is valid only for the feed that issued it.

Each page is a separate read, so changes that happen between requests can appear on later pages.

### XRPC procedures

The service exposes XRPC procedures. XRPC is the AT Protocol's HTTP API convention: each method has a namespaced ID and is called at `/xrpc/<method-id>`. A procedure is an XRPC method called with `POST` and a JSON body.

| Procedure | Returns |
|---|---|
| `org.hypercerts.feed.getFeed` | Hydrated entries with an actor, event kind, and display-ready content |
| `org.hypercerts.feed.getFeedSkeleton` | Ordered source-record AT-URIs for clients that hydrate records themselves |

Both procedures take the same request body:

- `feedId` selects the feed algorithm. The registered value is `org.hypercerts.feed.defs#hypercertsFeed`.
- `params` holds values for that algorithm. For the Hypercerts feed it needs `$type: "org.hypercerts.feed.defs#hypercertsFeedParams"`, which names the parameter format, and it accepts only the fields that format defines:
  - `viewerDid`: the viewer whose follows define the base scope. Required without authentication. With authentication, leave it out or set it to the caller's DID.
  - `trustedEvaluators`: evaluator DIDs whose endorsed accounts are added to the scope.
  - `organizationQuality`: which Orglabeler labels to allow, for example `{"allowed": ["high-quality", "standard"], "includeUnrated": false}`.
  - `kinds`: the event kinds to return. Leave it out, or pass an empty list, for all kinds.
- `limit` sets the page size.
- `cursor` requests the next page.

`limit` and `cursor` go at the top level of the body, not inside `params`. The `params` field is an open union, which means other feed algorithms can define their own parameter formats, or none.

## Using it from your application

### Get a hydrated feed

Use `getFeed` when your application needs entries ready for display:

```bash
curl --request POST \
  --url https://feed.hypercerts.dev/xrpc/org.hypercerts.feed.getFeed \
  --header 'content-type: application/json' \
  --data '{
    "feedId": "org.hypercerts.feed.defs#hypercertsFeed",
    "params": {
      "$type": "org.hypercerts.feed.defs#hypercertsFeedParams",
      "viewerDid": "did:plc:u7h3dstby64di67bxaotzxcz",
      "kinds": ["cert.create", "evaluation.create"]
    },
    "limit": 20
  }'
```

A hydrated entry contains the source record URI and a feed-specific view:

```json
{
  "feed": [
    {
      "subject": "at://did:plc:example/org.hypercerts.claim.activity/3msek4eui2i27",
      "view": {
        "$type": "org.hypercerts.feed.defs#hypercertsFeedView",
        "kind": "cert.create",
        "actor": {
          "did": "did:plc:example",
          "handle": "example.org",
          "displayName": "Example organization"
        },
        "content": {
          "$type": "org.hypercerts.feed.defs#activityView",
          "title": "Example activity",
          "shortDescription": "An activity selected for this viewer",
          "createdAt": "2026-08-05T22:08:58.761Z",
          "locationCount": 0
        }
      }
    }
  ],
  "cursor": "opaque-cursor-for-the-next-page"
}
```

The `view` and `content` fields are open unions, so new variants can appear. Ignore variants your application does not recognize rather than failing.

Evaluations, measurements, and updates include a `target` with the exact URI and CID (content hash) of the record they refer to. The service checks that the reference is well formed but does not load the target record; fetch it yourself if you need to show it.

The hydrated endpoint checks each selected record against its lexicon and drops records that fail. `limit` counts selected records, so a page can hold fewer entries than requested, or none, while the cursor still moves past every record checked. Keep paging until no cursor is returned.

### Get a feed skeleton

Use `getFeedSkeleton` when another part of your application will resolve and display the records:

```bash
curl --request POST \
  --url https://feed.hypercerts.dev/xrpc/org.hypercerts.feed.getFeedSkeleton \
  --header 'content-type: application/json' \
  --data '{
    "feedId": "org.hypercerts.feed.defs#hypercertsFeed",
    "params": {
      "$type": "org.hypercerts.feed.defs#hypercertsFeedParams",
      "viewerDid": "did:plc:u7h3dstby64di67bxaotzxcz"
    },
    "limit": 20
  }'
```

The response contains only ordered source-record AT-URIs and, when another page is available, a cursor:

```json
{
  "feed": [
    {
      "subject": "at://did:plc:example/org.hypercerts.claim.activity/3msek4eui2i27"
    }
  ],
  "cursor": "opaque-cursor-for-the-next-page"
}
```

Treat cursors as opaque and send them back only with the same `feedId`.

### Authenticate a request

Authentication is optional. Without it, the request names its viewer in `params.viewerDid`. With it, the service takes the viewer from the verified caller, so a signed-in user gets their own feed without your application asserting who they are.

The service uses AT Protocol service authentication. The signed-in user's PDS issues a short-lived JWT (a signed JSON token) that says which account is calling, which service the token is for, and which method it may call. Your application requests the token from the user's PDS, for example with the standard `com.atproto.server.getServiceAuth` procedure, and sends it as a bearer token:

```bash
curl --request POST \
  --url https://feed.hypercerts.dev/xrpc/org.hypercerts.feed.getFeed \
  --header 'content-type: application/json' \
  --header 'authorization: Bearer <service-auth-jwt>' \
  --data '{
    "feedId": "org.hypercerts.feed.defs#hypercertsFeed",
    "params": {"$type": "org.hypercerts.feed.defs#hypercertsFeedParams"},
    "limit": 20
  }'
```

The token has to meet these conditions:

- **Audience (`aud`)** is the service's bare DID. For production that is `did:web:feed.hypercerts.dev`. Leave off the `#hypercerts_feed` fragment; the DID document's service entry is for discovery, not for the audience.
- **Method (`lxm`)** is the exact procedure ID: `org.hypercerts.feed.getFeed` or `org.hypercerts.feed.getFeedSkeleton`.
- **Signature** comes from the caller's `#atproto` key.
- **Token ID (`jti`)** is present, non-empty, and at most 256 bytes.

Each token works once. Request a new token for every request and every retry, including after a failed request.

Errors to handle:

- An invalid, expired, or reused token returns HTTP 401. The service never falls back to anonymous access when a token is present.
- A `params.viewerDid` that differs from the caller returns HTTP 400 `InvalidRequest`.
- HTTP 503 means the service's store of used tokens is temporarily full. Retry later with a new token.

### Errors

The service returns these public error names: `InvalidRequest` (malformed body, missing or mismatched `params`, unknown kinds), `UnsupportedFeed` (unknown `feedId`), `InvalidCursor`, and `InternalError`. Parameter errors include a message that names the invalid field.

### Documented event kinds

Leave out `params.kinds`, or pass an empty array, to include every kind.

| Kind | Source record | Description |
|---|---|---|
| `cert.create` | `org.hypercerts.claim.activity` | A new Hypercert activity or certification claim |
| `collection.create` | `org.hypercerts.collection` | A new collection that is not paired with a project activity |
| `project.created_with_cert` | `org.hypercerts.collection` | A collection representing a project created together with a Hypercert activity |
| `evaluation.create` | `org.hypercerts.context.evaluation` | A new evaluation of a target record |
| `measurement.create` | `org.hypercerts.context.measurement` | A new measurement of a target record |
| `update.create` | `org.hypercerts.context.attachment` | A new update or attachment |
| `endorsement.award` | `app.certified.badge.award` | An endorsement awarded to an account |
| `hyperboard.create` | `org.hyperboards.board` | A new hyperboard |

A project's collection and its paired activity are combined before filtering and paging, so after a collection appears as `project.created_with_cert`, its paired activity does not appear again on a later page. Unknown kinds are rejected with `InvalidRequest`.

### Source code and contracts

The implementation, lexicon definitions, and complete request behavior are in the [hypercerts-org/hypercerts-feed-service](https://github.com/hypercerts-org/hypercerts-feed-service) repository. Running service URLs are listed under [Running services](/reference/services#running-services).

## Status

The current release is v0.2.0. The request shape is part of the public contract. See the [Feed Service changelog](/changes/feed-service) for release history.

## Running your own

Operating your own instance is outside the scope of this documentation for now. The source is public at [hypercerts-org/hypercerts-feed-service](https://github.com/hypercerts-org/hypercerts-feed-service).

## Related

- [Services overview](/reference/services)
- [Labelers](/reference/services/labelers)
- [Indexer](/reference/services/indexer)
- [XRPC API](/reference/xrpc-api)
- [Hypercerts lexicons](/lexicons/hypercerts-lexicons)
- [Certified lexicons](/lexicons/certified-lexicons)
- [Feed Service changelog](/changes/feed-service)
