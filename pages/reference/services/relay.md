---
title: Relay and Jetstream
description: How the Hypercerts Relay and Jetstream gather Hypercerts and Certified record changes from across the network, and how an application subscribes to them.
---

# Relay and Jetstream

Hypercerts records are spread across many servers, one repository per account. The Hypercerts Relay and Jetstream gather the changes from those servers into one stream, so an application can follow new and updated records without contacting every server itself. Use them when your application reacts to changes as they happen or keeps its own copy of the records.

## Where it fits

The relay reads from PDSs (Personal Data Servers, the servers that store accounts' records), including the [Certified PDSs](/reference/services/certified-pdss). Jetstream reads from the relay and keeps only the record collections it is configured for, such as Hypercerts and Certified records. The [Hypercerts API](/reference/services/hypercerts-api) uses that stream to maintain its searchable view. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

An AT Protocol account keeps its records in a **repository** on its PDS. Whenever the account creates, updates, or deletes a record, the PDS publishes a repository event describing the change. Anyone can subscribe to a PDS's events, but there are thousands of PDSs, and an application that wanted every record of one type would have to find and follow all of them.

A **relay** solves this. It subscribes to many PDSs and merges their events into one continuous stream, called the **firehose**. Consumers connect to the relay once and receive everything. The firehose carries the signed repository data behind each change, so a consumer can verify that a change really came from the account it claims to.

Services that read the firehose build views from it, such as search indexes and feeds. This is why AT Protocol applications don't query every PDS. They read a single record from its PDS when they know its address, and they rely on a relay and an index for everything that spans accounts.

## How it works

### The Hypercerts Relay

The Hypercerts Relay is a relay with a deliberately limited set of sources. It:

- **Follows approved PDSs only.** The Hypercerts team approves a PDS before the relay connects to it.
- **Passes on everything from those PDSs.** It does not select Hypercerts records, so its firehose also carries unrelated records from the same accounts.
- **Keeps events for 72 hours.**
- **Numbers every event.** A consumer saves the latest sequence number it processed and sends it back as a **cursor**, a bookmark that tells the relay where to resume.

The firehose is the standard AT Protocol method `com.atproto.sync.subscribeRepos`, served over a WebSocket (a connection that stays open so the server can keep sending messages). Events are encoded in CBOR (Concise Binary Object Representation), a compact binary format.

### Jetstream

Jetstream reads the relay's firehose and turns it into something easier to consume. It:

- **Keeps selected collections only.** A collection is the set of an account's records of one type, named after the record's schema. Jetstream keeps the Hypercerts collections (`org.hypercerts.claim.*`, `org.hypercerts.context.*`, `org.hypercerts.collection`, `org.hypercerts.funding.receipt`, `org.hypercerts.workscope.tag`) and the Certified collections (`app.certified.actor.*`, `app.certified.badge.*`, `app.certified.graph.*`, `app.certified.location`, `app.certified.link.evm`, `app.certified.signature.proof`). The Hypercerts team adds collections on request.
- **Delivers JSON.** Each event contains the record already decoded, so you don't handle CBOR or repository structures. In exchange, you trust Jetstream's reading of the data instead of verifying signatures yourself.
- **Supports filters.** A subscriber can ask for certain collections or accounts.

Jetstream numbers its events separately from the relay, so a cursor saved from one does not work with the other. Most applications use Jetstream. Subscribe to the relay only if you need the signed data, for example to verify records yourself.

### Backfill

Backfill means catching up on events from before you connected. Jetstream keeps an archive of the collections it selects. When it starts following a PDS, or when a collection is added to its list, it reads the existing records from the PDS into the archive. A new consumer downloads the archive and then continues on the live stream without a gap. For records that existed before Jetstream followed their PDS, the archive holds their state when Jetstream read them, not every earlier edit.

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

A few things to plan for:

- **Reconnects repeat events.** The cursor is inclusive, so Jetstream replays the event you saved as well as what follows. Deduplicate, or process events so that receiving one twice gives the same result.
- **Old cursors are refused.** If your cursor is older than what the live stream still holds, the connection fails with `CursorTooOld`. Backfill from the archive, then reconnect.
- **Backfill needs an API key.** To backfill, you request a plan with the same filters as your live connection, download the archive files it lists, and then subscribe from the sequence number where the archive ends. Ask the Hypercerts team for a key. The full procedure is in the [Jetstream README](https://github.com/hypercerts-org/hypercerts-relay/blob/main/jetstream/README.md) and the [Bluesky Jetstream documentation](https://bsky.network/docs/jetstream/), which also describes the message format.
- **New PDSs need approval.** If your users' records live on a PDS the relay does not follow, ask the Hypercerts team to add it. The public `com.atproto.sync.requestCrawl` method only reconnects a PDS that is already approved.

Hostnames for production and staging are listed under [Running services](/reference/services#running-services).

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
