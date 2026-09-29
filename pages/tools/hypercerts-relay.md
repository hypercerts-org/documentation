---
title: Hypercerts Relay and Jetstream
description: Connect to the Hypercerts Relay firehose or the Jetstream record stream and archive.
---

# Hypercerts Relay and Jetstream

The Hypercerts Relay receives repository events from approved Personal Data Servers (PDSs). It publishes the full, raw AT Protocol `subscribeRepos` firehose.

Jetstream reads that firehose and keeps records from the Hypercerts and Certified lexicons selected by its policy. Use Jetstream when you need a stream of those records or an archive backfill. Use Relay when you need the raw firehose.

## URLs

| Service | URL | Use |
| --- | --- | --- |
| Relay firehose | `wss://relay.hypercerts.dev/xrpc/com.atproto.sync.subscribeRepos` | Receive raw AT Protocol repository events. Add `?cursor=<sequence>` to resume from a saved Relay cursor. |
| Relay crawl request | `https://relay.hypercerts.dev/xrpc/com.atproto.sync.requestCrawl` | Ask Relay to reconnect to an approved PDS. |
| Jetstream live stream | `wss://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.subscribeEvents` | Receive selected archived and live events in sequence order. |
| Jetstream archive plan | `https://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.planSnapshot` | Plan an archive download before connecting to the live stream. |
| Jetstream archive segments | `https://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.getSegment` | Download a segment named by an archive plan. |

The Relay firehose uses the normal `com.atproto.sync.subscribeRepos` event format. Jetstream uses the `network.bsky.jetstream.subscribeEvents` format and the `xrpc.v1.json` WebSocket subprotocol.

## Connect to Relay

Open a WebSocket connection to the Relay firehose URL. Persist the sequence number from each event. On reconnect, send it as the `cursor` query parameter.

Relay keeps raw events for 72 hours. A cursor older than that window may not be available, so consumers should be able to recover from a newer position.

## Connect to Jetstream

Open a WebSocket connection to the Jetstream live stream URL. With no parameters, the connection starts at the live tip. Add `cursor=<sequence>` to replay from a saved Jetstream sequence number.

Jetstream can filter the stream with these query parameters:

| Parameter | Meaning |
| --- | --- |
| `kinds=commit` | Receive record changes only. |
| `collections=<nsid>` | Receive commits for an exact collection NSID or a namespace pattern such as `org.hypercerts.context.*`. Use this together with `kinds=commit`. |
| `dids=<did>` | Receive events for one or more repository DIDs. |

If a saved Jetstream sequence is older than the retained stream, Jetstream returns `CursorTooOld`. Backfill from the archive, save the resulting sequence, then reconnect to the live stream.

## Backfill with Jetstream

Jetstream backfill lets a client catch up from the retained archive before it starts receiving live events.

1. Send a `POST` request to `network.bsky.jetstream.planSnapshot` with the same `kinds`, `collections`, and `dids` filters that the live client will use.
2. Download every segment or block range in the returned plan.
3. Keep requesting pages until `plannedThroughSeq` equals `sealedTipSeq`. Keep the first `sealedTipSeq` as the fixed end of this backfill.
4. Connect to `subscribeEvents` with `cursor` set to the next sequence after the archive backfill. De-duplicate the small overlap at the handoff.

The archive endpoints require a Jetstream API key. Ask the Hypercerts team for a key, then send it as `Authorization: Bearer <api-key>` on archive-plan and segment-download requests. Keep the key out of browser code, logs, and command history.

Backfill returns events that Jetstream has retained. It cannot provide data older than the available archive.

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

An operator can add exact collection NSIDs to the Jetstream policy. When the policy changes, Jetstream backfills the newly selected collections for every approved PDS.

## Request a PDS crawl

To ask Relay to reconnect to an approved PDS, send its hostname as JSON:

```bash
curl --request POST \
  --url https://relay.hypercerts.dev/xrpc/com.atproto.sync.requestCrawl \
  --header 'content-type: application/json' \
  --data '{"hostname":"pds.example.com"}'
```

This public request does not add a new PDS, change its status, or re-enable a disabled PDS. Contact the Hypercerts team to have a new PDS approved.

A newly approved PDS has a default limit of 100 active accounts. Relay's default configuration also sets a daily maximum of 50 new PDS subscriptions. Operators can set different limits for an individual PDS.

## See also

- [Certified Services](/reference/certified-services)
- [Hypercerts Lexicons](/lexicons/hypercerts-lexicons)
- [Certified Lexicons](/lexicons/certified-lexicons)
