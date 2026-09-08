---
title: Hypercerts Feed Service
description: Read ordered, viewer-scoped Hypercerts feeds from indexed network data.
---

# Hypercerts Feed Service

The Hypercerts Feed Service is a read-only TypeScript service that turns data indexed by [Hyperindex](/tools/hyperindex) into ordered, viewer-scoped Hypercerts feeds. It reads Hyperindex's current PostgreSQL data directly and exposes the results through custom XRPC procedures.

A feed starts with the accounts that a viewer follows through `app.certified.graph.follow` records. Clients can extend that scope with trusted evaluators, filter organizations by quality labels, and select the event kinds they want to display. Results are ordered newest first.

The service does not ingest records, modify indexed data, or call PDSs and AppViews while serving a request. It is also not a Bluesky feed generator: its procedures use the `org.hypercerts.feed.*` namespace rather than `app.bsky.feed.*`.

## Service endpoints

| Environment | Base URL |
|---|---|
| Production | [`https://feed.hypercerts.dev`](https://feed.hypercerts.dev) |
| Staging | [`https://dev.feed.hypercerts.dev`](https://dev.feed.hypercerts.dev) |

## Available procedures

Both procedures are unauthenticated HTTP `POST` requests with a JSON body.

| Procedure | Returns |
|---|---|
| `org.hypercerts.feed.getFeed` | Hydrated entries with an actor, event kind, and display-ready content |
| `org.hypercerts.feed.getFeedSkeleton` | Ordered source-record AT-URIs for clients that hydrate records themselves |

Both accept the same request shape:

- `feedId` selects the feed algorithm. The currently registered value is `org.hypercerts.feed.defs#hypercertsFeed`.
- For this feed, `params` must include `$type: "org.hypercerts.feed.defs#hypercertsFeedParams"`. This identifies the parameter format used by the feed; the remaining fields in `params` must be supported by that format.
- `params.viewerDid` selects the viewer whose follows define the base feed scope.
- `params.trustedEvaluators` can add subjects endorsed by selected evaluators.
- `params.organizationQuality` can filter organizations using quality labels from the configured [Orglabeler](/tools/labelers#orglabeler), which publishes labels for certified organizations.
- `params.kinds` can restrict the returned event kinds.
- `limit` controls page size.
- `cursor` requests the next page using the opaque cursor from the previous response.

`params` is an open union so additional feed algorithms may define different parameter types, including algorithms with no parameters. For the currently registered feed, include only the fields defined by `org.hypercerts.feed.defs#hypercertsFeedParams`; `limit` and `cursor` are generic top-level fields, not members of `params`.


## Get a hydrated feed with curl

Use `getFeed` when the application needs entries ready for presentation:

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

The `view` and `content` unions are open. Clients should tolerate variants they do not recognize.

The hydrated endpoint validates selected records against their Lexicons and drops invalid ones. `limit` applies to selected source records, so `getFeed` may return fewer entries, for example, `limit: 10` can yield fewer than 10 if validation fails. The cursor still advances past all selected records.

## Get a feed skeleton with curl

Use `getFeedSkeleton` when another part of the application will resolve or hydrate the selected records:

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

Keep cursors opaque and send them back only with the same `feedId`. Put `cursor` and `limit` at the top level of the request, not inside `params`.

## Supported event kinds

Omit `params.kinds`, or pass an empty array, to include every supported kind. These values describe the type of source record and the hydrated content returned for it:

| Kind | Source record | Description |
|---|---|---|
| `cert.create` | `org.hypercerts.claim.activity` | A new Hypercert activity or certification claim |
| `collection.create` | `org.hypercerts.collection` | A newly created collection that is not paired with a project activity |
| `project.created_with_cert` | `org.hypercerts.collection` | A collection representing a project created together with a Hypercert activity |
| `evaluation.create` | `org.hypercerts.context.evaluation` | A newly published evaluation of a target record |
| `measurement.create` | `org.hypercerts.context.measurement` | A newly published measurement of a target record |
| `hyperboard.create` | `org.hyperboards.board` | A newly created Hyperboard |
| `update.create` | `org.hypercerts.context.attachment` | A newly published update or attachment |
| `endorsement.award` | `app.certified.badge.award` | An endorsement awarded to an account |

## Source code and contracts

The implementation, Lexicon definitions, and complete request behavior are available in the [`hypercerts-org/hypercerts-feed-service`](https://github.com/hypercerts-org/hypercerts-feed-service) GitHub repository. Published [releases](https://github.com/hypercerts-org/hypercerts-feed-service/releases) and [changelogs](https://github.com/hypercerts-org/hypercerts-feed-service/blob/main/CHANGELOG.md) are also available on GitHub.

## See also

- [Certified Services](/reference/certified-services)
- [Hyperindex](/tools/hyperindex)
