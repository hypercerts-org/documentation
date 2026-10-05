---
title: Feed Service
description: A read-only service that returns ordered feeds of recent Hypercerts activity from the accounts a viewer follows.
---

# Feed Service

The Feed Service builds activity feeds. Given a viewer, it returns the recent Hypercerts activity from the accounts that viewer follows, newest first: new Hypercerts, collections, evaluations, measurements, updates, and endorsements. Your application sends one request and gets back entries that are ready to display, so it does not have to assemble a timeline from individual records.

## Where it fits

The Feed Service reads from a database of indexed Hypercerts records, the kind of view the [indexer](/reference/services/indexer) builds, and it uses labels from the [Orglabeler](/reference/services/labelers) to filter organizations. Applications call it directly. It is read-only: it does not collect records from the network or write anything. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

In AT Protocol, a feed is produced in two steps. First, something decides which records belong in the feed and in what order. Its output is a **skeleton**: a bare list of record addresses, called AT-URIs, of the form `at://<account>/<collection>/<record key>`. Second, the skeleton is **hydrated**: each address is replaced with what a client needs to draw the entry, such as the record's content and the author's name and avatar.

Bluesky splits these steps between two parties. Anyone can run a **feed generator**, a small service that implements `app.bsky.feed.getFeedSkeleton` and returns a skeleton of posts. Bluesky's own AppView (the service that indexes the network and serves an API over it) hydrates that skeleton and delivers it to the Bluesky app.

The Feed Service borrows the two-step idea but is not a Bluesky feed generator. It selects Hypercerts records, not posts. Its methods live in the `org.hypercerts.feed.*` namespace, and Bluesky apps do not display it. It also does both steps itself, so one call returns a finished feed.

## How it works

### Who is in the feed

A feed starts from the viewer's follows: the accounts named in the viewer's `app.certified.graph.follow` records. The request can adjust that scope:

- **Trusted evaluators** add the accounts that the evaluators you name have endorsed.
- **Organization quality** keeps or removes organizations by their Orglabeler label, for example allowing only `high-quality` and `standard`. The service's operator decides which labelers count. Callers cannot choose label sources.
- **Event kinds** limit which kinds of events appear.

The viewer's own records are left out.

### Event kinds

Each entry has a kind that says what happened: `cert.create` (a new Hypercert activity), `collection.create`, `project.created_with_cert` (a project collection created together with an activity), `evaluation.create`, `measurement.create`, `update.create` (a new update or attachment), `endorsement.award`, and `hyperboard.create`. Leave the filter out to receive all of them.

### Skeleton and hydrated feeds

The service offers the same feed in both forms:

- `org.hypercerts.feed.getFeedSkeleton` returns only the ordered AT-URIs. Use it when another part of your application loads and renders the records.
- `org.hypercerts.feed.getFeed` returns hydrated entries: the event kind, the actor (DID, handle, display name, avatar), and content specific to that kind. A DID is an account's permanent ID, and a handle is its readable name.

Actor details come from the account's Certified profile when there is one, then from its Bluesky profile. Evaluations, measurements, and updates include a reference to the record they are about. The service does not load that target, so fetch it yourself if you want to show it.

### Order and paging

Entries are ordered newest first, by the record's `createdAt` when it is valid and otherwise by the time the record was indexed. A response can include a cursor, an opaque string you send back to get the next page.

### Optional authentication

Without authentication, the request names its viewer. With it, the service takes the viewer from the verified caller. It accepts an AT Protocol service auth token: a short-lived JWT (JSON Web Token, a signed JSON document) that the user's PDS (Personal Data Server, the server hosting their account) issues for one service and one method.

## Using it from your application

Both methods are XRPC procedures. XRPC is AT Protocol's convention for HTTP APIs, and a procedure is a method called with `POST` and a JSON body at `/xrpc/<method name>`. The body has the same shape for both:

- `feedId` selects the feed algorithm. The one registered today is `org.hypercerts.feed.defs#hypercertsFeed`.
- `params` holds that algorithm's settings. It starts with a `$type` naming the parameter format, followed by `viewerDid` and the optional `trustedEvaluators`, `organizationQuality`, and `kinds`.
- `limit` and `cursor` control paging. They go at the top level, not inside `params`.

This request asks for a hydrated feed of new Hypercerts and evaluations:

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

The response has a `feed` array and, when there is another page, a `cursor`. Each entry has a `subject`, the AT-URI of the source record, and a `view` holding the `kind`, the `actor`, and the kind-specific `content`, such as an activity's title and short description. Send the same body to `getFeedSkeleton` to get entries with only the `subject`.

A few things to plan for:

- **Pages can be short.** The hydrated feed drops records that fail validation against their schema, and does not replace them. A page can hold fewer entries than `limit`, or none. Keep paging until no cursor is returned.
- **New variants can appear.** `view` and `content` are open unions, which means new types can be added. Skip the ones your application does not recognize.
- **Cursors belong to one feed.** Send a cursor back only with the same `feedId`.
- **Authenticated requests need a new token each time.** Request it from the user's PDS with `com.atproto.server.getServiceAuth`, naming the service's DID (the bare DID, without a `#hypercerts_feed` suffix) and the exact method, and send it as `Authorization: Bearer <token>`. You can then leave out `viewerDid`. A token works once, and an invalid one returns HTTP 401.

The service's hosts and DIDs are listed under [Running services](/reference/services#running-services). The [repository README](https://github.com/hypercerts-org/hypercerts-feed-service#readme) documents every parameter, error name, and edge case.

## Status and source

The Feed Service is released and running in production and staging. See the [Feed Service releases](/releases/feed-service) for the current version and release history.

The source code and the Lexicon schemas for its methods are in the [hypercerts-feed-service repository](https://github.com/hypercerts-org/hypercerts-feed-service). Running your own instance is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services) and [Running services](/reference/services#running-services)
- [Indexer and Hypercerts API](/reference/services/indexer)
- [Labelers](/reference/services/labelers)
- [Certified lexicons](/lexicons/certified-lexicons)
- [Feed Service releases](/releases/feed-service)
