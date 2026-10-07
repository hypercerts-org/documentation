---
title: Relay and Jetstream
description: How the Hypercerts Relay and Jetstream gather Hypercerts and Certified record changes from across the network, and how an application subscribes to them.
---

# Relay and Jetstream

Hypercerts records are spread across many PDS instances included the [Certified PDSs](/reference/services/certified-pdss), the Hypercerts Relay subscribes to them and receives these events 
and makes them available in a single stream. While the relay provides a firehose subscription with full CBOR verification metadata, the Hypercerts Jetstream service provides an easily ingestible JSON subscription with the ability to perform a full backfill of watched lexicon collections.

The [Hypercerts API](/reference/services/hypercerts-api) uses that stream to maintain its searchable view. The [services overview](/reference/services) has the full diagram.

## URLs

| Service | URL | Use |
| --- | --- | --- |
| Relay firehose | `wss://relay.hypercerts.dev/xrpc/com.atproto.sync.subscribeRepos` | Receive raw AT Protocol repository events. Add `?cursor=<sequence>` to resume from a saved Relay cursor. |
| Relay crawl request | `https://relay.hypercerts.dev/xrpc/com.atproto.sync.requestCrawl` | Ask Relay to reconnect to an approved PDS. |
| Jetstream live stream | `wss://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.subscribeEvents` | Receive selected archived and live events in sequence order. |
| Jetstream archive plan | `https://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.planSnapshot` | Plan an archive download before connecting to the live stream. |
| Jetstream archive segments | `https://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.getSegment` | Download a segment named by an archive plan. |


The Relay firehose uses the standard `com.atproto.sync.subscribeRepos` event format. Jetstream uses the `network.bsky.jetstream.subscribeEvents` format.


## Subscribing to Relay

When subscribed to the relay, persist the sequence number from each event. On reconnect, send it as the `cursor` query parameter.

Relay keeps raw events for 72 hours. A cursor older than that window may not be available, so consumers should be able to recover from a newer position.


## Working with Jetstream

When subscribed with no parameters, the connection starts at the live tip. Add `cursor=<sequence>` to replay from a saved Jetstream sequence number, because Jetstream replays the event 
reconnects can deliver duplicated, therefore deduplicate or handle events idempotently on reconnect. 

Jetstream can filter the stream with these query parameters:

| Parameter | Meaning |
| --- | --- |
| `kinds=commit` | Receive record changes only. |
| `collections=<nsid>` | Receive commits for an exact collection NSID or a namespace pattern such as `org.hypercerts.context.*`. Use this together with `kinds=commit`. |
| `dids=<did>` | Receive events for one or more repository DIDs. |

If a saved Jetstream sequence is older than the retained stream, Jetstream returns `CursorTooOld`. Backfill from the archive, save the resulting sequence, then reconnect to the live stream.

### Backfill

**Note:** The archive/backfill endpoints require a Jetstream API Key, contact the Hypercerts team for one before using.

Jetstream backfill lets a client catch up from the retained archive before it starts receiving live events.

1. Send a `POST` request to `network.bsky.jetstream.planSnapshot` with the same `kinds`, `collections`, and `dids` filters that the live client will use.
2. Download every segment or block range in the returned plan.
3. Keep requesting pages until `plannedThroughSeq` equals `sealedTipSeq`. Keep the first `sealedTipSeq` as the fixed end of this backfill.
4. Connect to `subscribeEvents` with `cursor` set to the next sequence after the archive backfill. De-duplicate the small overlap at the handoff.

The Jetstream API Key should be included in the request as `Authorization: Bearer <api-key>` on archive-plan and segment-download requests.

Backfill returns events that Jetstream has retained and cannot return data older than the archive however it should be expected that Jetsream will have backfilled the PDS jetstream is subscribed to, if you find gaps contact Hypercerts.

When using `planSnapshot` for archival backfill it can return whole-segment entries or block ranges. Whole segments will use `getsegment` and block ranges require `getBlock` for each block index followed by decoding and exact filtering.

See [Bluesky Jetstream Docs](https://bsky.network/docs/jetstream/) for further details.


## Default lexicons

Jetstream stores the following collections by default. Relay does not filter its raw firehose by this list.

```text
app.certified.actor.organization
app.certified.actor.profile
app.certified.badge.award
app.certified.badge.definition
app.certified.badge.response
app.certified.graph.entityFollow
app.certified.graph.follow
app.certified.link.evm
app.certified.location
app.certified.signature.proof
org.hypercerts.claim.activity
org.hypercerts.claim.contribution
org.hypercerts.claim.contributorInformation
org.hypercerts.claim.rights
org.hypercerts.collection
org.hypercerts.context.acknowledgement
org.hypercerts.context.attachment
org.hypercerts.context.evaluation
org.hypercerts.context.measurement
org.hypercerts.funding.receipt
org.hypercerts.workscope.tag
```

Hypercerts adds additional lexicons on request. When a lexicon is added, Jetstream backfills the newly selected collections for every approved PDS.

## Request a PDS crawl

To ask Relay to reconnect, send its hostname as JSON:

```bash
curl --request POST \
  --url https://relay.hypercerts.dev/xrpc/com.atproto.sync.requestCrawl \
  --header 'content-type: application/json' \
  --data '{"hostname":"pds.example.com"}'
```

A newly approved PDS has a default limit of 100 active accounts. Relay's default configuration also sets a daily maximum of 50 new PDS subscriptions. Contact the hypercerts team to increase this limit.

## Using it from your application

Connect to Jetstream's `network.bsky.jetstream.subscribeEvents` method over a WebSocket. With no parameters you receive every event from the moment you connect. Narrow the stream with query parameters:

- `kinds=commit` for record changes only (a commit is a create, update, or delete of a record), leaving out account and identity events.
- `collections=<name>` for one collection or a pattern such as `org.hypercerts.context.*`. Repeat the parameter for several.
- `dids=<did>` for one or more accounts, given by DID (permanent account ID).
- `cursor=<sequence>` to resume from a saved position.

This example follows new activity and evaluation records:

```js
const url = new URL("wss://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.subscribeEvents");
url.searchParams.append("kinds", "commit");
url.searchParams.append("collections", "org.hypercerts.claim.activity");
url.searchParams.append("collections", "org.hypercerts.context.evaluation");

const socket = new WebSocket(url);
socket.addEventListener("message", (event) => {
  const change = JSON.parse(event.data);
  console.log(change); // save its sequence number as your cursor
});
```

## Status and source

The hosted Hypercerts Relay and Jetstream are running in production and staging. The project has no published release yet. Follow releases on [Relay releases](/releases/relay).

The source code for both, including Jetstream, is in the [hypercerts-relay repository](https://github.com/hypercerts-org/hypercerts-relay). Running your own instance is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services) and [Running services](/reference/services#running-services)
- [Certified PDSs](/reference/services/certified-pdss)
- [Hypercerts API](/reference/services/hypercerts-api)
- [Finding and Reusing Information](/architecture/portability-and-scaling)
- [Data flow and lifecycle](/architecture/data-flow-and-lifecycle)
- [Hypercerts lexicons](/lexicons/hypercerts-lexicons)
