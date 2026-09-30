---
title: Relay and Jetstream
description: How the Hypercerts Relay and Jetstream deliver Hypercerts and Certified record changes from across the network, and how your application subscribes, filters, and backfills.
---

# Relay and Jetstream

Hypercerts records are not stored in one central database. Each account keeps its records on its own server, and those servers are spread across the network. The **Hypercerts Relay** and **Jetstream** are the two services that gather changes from those servers into one place, so an application can follow new and updated Hypercerts records without contacting every server itself.

The relay collects every change from the servers it watches. Jetstream keeps only the Hypercerts and Certified records, turns them into plain JSON, and lets you replay them from the past as well as follow them live. Most applications use Jetstream.

## What it does

A few AT Protocol terms first:

- An account's records live in its **repository**, a signed collection of records hosted on a **PDS** (Personal Data Server). An account is identified by a **DID**, a permanent identifier such as `did:plc:...`.
- Records of the same type sit together in a **collection**. A collection is named by an **NSID** (Namespaced Identifier), the same name as the record's Lexicon schema, such as `org.hypercerts.claim.activity`. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

Hypercerts records live in many PDSs. The relay collects changes from those servers, Jetstream filters them down to Hypercerts and Certified records, and the [indexer](/reference/services/indexer) builds a searchable view from Jetstream and serves the Hypercerts API that applications use through the [SDK](/reference/sdk) or call directly. [Labelers](/reference/services/labelers) add labels that the indexer uses. Around that path, the [entryway](/reference/services/entryway) handles sign-in, the [Certified Group Service](/reference/services/certified-group-service) handles group accounts, and the [feed service](/reference/services/feed-service) builds feeds.

Read from the relay or Jetstream when your application needs to react to changes as they happen or keep its own copy of the records. To look up or search records without running your own storage, use the Hypercerts API instead once it is released. [Finding and Reusing Information](/architecture/portability-and-scaling) explains how relays and indexers fit into the wider network.

## How it works

### The relay and its firehose

A **relay** is an AT Protocol service that connects to many PDSs and merges the changes they publish into one continuous stream. That stream is called the **firehose**. Every time an account creates, updates, or deletes a record, its PDS sends an event, and the relay passes it on.

The firehose is the standard AT Protocol method `com.atproto.sync.subscribeRepos`, served over a WebSocket (a connection that stays open so the server can keep sending messages). Its events are encoded in **CBOR** (Concise Binary Object Representation), a compact binary format, and they carry the signed repository data behind each change. That signed data lets a consumer check cryptographically that a change really came from the account's repository.

The Hypercerts Relay:

- **Connects only to approved PDSs.** A PDS has to be approved by the Hypercerts team before the relay follows it.
- **Does not filter by collection.** It passes on every change from an approved PDS, including records that have nothing to do with Hypercerts.
- **Keeps raw events for 72 hours.** Older events are no longer available from the relay.
- **Numbers every event.** Each event has a sequence number. A consumer saves the latest number it has processed and uses it as a **cursor**: a bookmark that tells the relay where to resume after a reconnect.

### Jetstream

**Jetstream** reads the relay's firehose and turns it into something easier to use. The Hypercerts deployment runs **Jetstream v2**, the version that keeps a stored archive of past events alongside the live stream. Jetstream:

- **Keeps only selected collections.** It stores the Hypercerts and Certified record collections listed under [Default collections](#default-collections), and drops everything else.
- **Delivers records as JSON.** Each event contains the record already decoded, so you don't need to handle CBOR or repository data structures. In exchange, you rely on Jetstream's reading of the data instead of verifying the signatures yourself.
- **Supports filters.** You can ask for only certain event kinds, collections, or accounts.
- **Keeps an archive for backfill.** **Backfill** means catching up on events from before you connected. Jetstream holds an archive of the selected collections, which you can download and then continue from the live stream without a gap.
- **Fills its archive from the PDSs directly.** When Jetstream starts following an approved PDS, or when a new collection is added to its list, it reads the current records from that PDS and adds them to the archive.

Use Jetstream unless you need the full CBOR events with their signed repository data, for example to verify records yourself. For that, subscribe to the relay's firehose.

Jetstream numbers its events with its own sequence numbers, which are separate from the relay's. A cursor saved from one does not work with the other.

### Default collections

Jetstream stores these collections by default. The relay does not filter its firehose by this list.

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

The Hypercerts team adds collections on request. When a collection is added, Jetstream backfills it from every approved PDS. For what each record type means, see [Hypercerts Lexicons](/lexicons/hypercerts-lexicons) and [Certified Lexicons](/lexicons/certified-lexicons).

## Using it from your application

The service addresses are listed on the [services overview](/reference/services#running-services). The examples below use the production hosts.

### Subscribe to Jetstream

Connect to `network.bsky.jetstream.subscribeEvents` over a WebSocket. With no parameters, the connection starts at the live tip: you receive new events from the moment you connect.

Filter the stream with these query parameters:

| Parameter | Meaning |
| --- | --- |
| `kinds=commit` | Receive record changes (a **commit** is a create, update, or delete of a record) and nothing else, such as account or identity changes. |
| `collections=<nsid>` | Receive changes to one collection, given by its exact NSID, or to a group of collections given as a pattern such as `org.hypercerts.context.*`. Use this together with `kinds=commit`. |
| `dids=<did>` | Receive events for one or more accounts, given by their DIDs. |
| `cursor=<sequence>` | Resume from a Jetstream sequence number you saved earlier. |

To pass several values, repeat the parameter, for example `collections=org.hypercerts.claim.activity&collections=org.hypercerts.context.evaluation`.

This example follows new activity and evaluation records and logs each event:

```js
const url = new URL("wss://jetstream.hypercerts.dev/xrpc/network.bsky.jetstream.subscribeEvents");
url.searchParams.append("kinds", "commit");
url.searchParams.append("collections", "org.hypercerts.claim.activity");
url.searchParams.append("collections", "org.hypercerts.context.evaluation");

const socket = new WebSocket(url);
socket.addEventListener("message", (event) => console.log(event.data));
```

For the full message format, see the [Bluesky Jetstream documentation](https://bsky.network/docs/jetstream/).

### Resume after a disconnect

Each Jetstream event carries its sequence number. Save the number of the last event you processed, and send it as `cursor` when you reconnect.

The cursor is inclusive: Jetstream replays the event with that sequence number as well as everything after it. A reconnect can therefore deliver events you have already seen. Deduplicate them, or process events in a way that gives the same result when an event arrives twice.

If the saved sequence number is older than the events Jetstream still keeps in its live stream, the connection is refused with a `CursorTooOld` error. In that case, [backfill from the archive](#backfill-from-the-archive), save the sequence number the backfill ends at, and then reconnect to the live stream from there.

### Backfill from the archive

{% callout type="note" %}
The archive endpoints require a Jetstream API key. Contact the Hypercerts team for one before you start. Send the key as `Authorization: Bearer <api-key>` on every archive-plan and download request.
{% /callout %}

Backfill lets your application catch up on the stored archive before it starts receiving live events. The archive is stored as files called **segments**, and each segment is divided into **blocks**. You first ask Jetstream for a plan listing which segments or blocks contain the events you want, then download them.

1. Send a `POST` request to `network.bsky.jetstream.planSnapshot` with the same `kinds`, `collections`, and `dids` filters that your live connection will use.
2. The plan lists whole segments or block ranges. Download a whole segment with `network.bsky.jetstream.getSegment`. For a block range, download each block with `network.bsky.jetstream.getBlock`, then decode it and apply your filters exactly, because a block can also contain events you did not ask for.
3. A plan can come in several pages. Keep requesting pages until `plannedThroughSeq` equals `sealedTipSeq`. Keep the `sealedTipSeq` from the first page as the fixed end point of this backfill, so the plan does not move while you download it.
4. Connect to `subscribeEvents` with `cursor` set to the sequence number after the end of the backfill. Deduplicate the small overlap where the archive and the live stream meet.

Backfill returns only what Jetstream has in its archive and cannot return anything older. Jetstream is expected to have backfilled every PDS it follows. For records that existed before Jetstream started following a PDS, the archive holds their state at the time Jetstream read them from the PDS, not every earlier edit. If you find gaps, contact the Hypercerts team.

### Subscribe to the relay firehose

If you need the full CBOR events, connect to `com.atproto.sync.subscribeRepos` on the relay. It uses the standard AT Protocol event format, so any AT Protocol firehose client library can read it.

Save the sequence number from each event, and send it as the `cursor` query parameter when you reconnect. The relay keeps raw events for 72 hours. A cursor older than that may no longer be available, so your application needs a way to recover from a newer position, for example by backfilling from Jetstream. As with Jetstream, a reconnect can repeat events you have already processed.

### Request a crawl of a PDS

A **crawl** is the relay connecting to a PDS and reading its events. If the relay has lost its connection to an approved PDS, you can ask it to reconnect by sending the PDS hostname to `com.atproto.sync.requestCrawl`:

```bash
curl --request POST \
  --url https://relay.hypercerts.dev/xrpc/com.atproto.sync.requestCrawl \
  --header 'content-type: application/json' \
  --data '{"hostname":"pds.example.com"}'
```

This public request only reconnects a PDS that is already approved and enabled. It does not add a new PDS, change a PDS's status, or re-enable a disabled PDS. To have a new PDS approved, contact the Hypercerts team.

A newly approved PDS can have up to 100 active accounts by default. The relay's default configuration also allows at most 50 new PDS subscriptions per day. The Hypercerts team can set different limits for an individual PDS.

## Status

The Hypercerts Relay has no published release yet. The hosted relay and Jetstream are running and can be used as described on this page. Follow releases on [Changes](/changes/relay).

## Running your own

Operating your own relay or Jetstream is outside the scope of this documentation for now. The source code, including Jetstream v2, is in the [hypercerts-relay repository](https://github.com/hypercerts-org/hypercerts-relay).

## Related

- [Services overview and running endpoints](/reference/services#running-services)
- [Indexer and Hypercerts API](/reference/services/indexer)
- [Labelers](/reference/services/labelers)
- [Finding and Reusing Information](/architecture/portability-and-scaling)
- [Data flow and lifecycle](/architecture/data-flow-and-lifecycle)
- [Why AT Protocol](/core-concepts/why-at-protocol)
- [Hypercerts Lexicons](/lexicons/hypercerts-lexicons) and [Certified Lexicons](/lexicons/certified-lexicons)
- [Bluesky Jetstream documentation](https://bsky.network/docs/jetstream/)
- [AT Protocol sync specification](https://atproto.com/specs/sync)
