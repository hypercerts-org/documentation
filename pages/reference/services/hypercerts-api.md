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

XRPC names each HTTP method with an NSID (Namespaced Identifier) at `/xrpc/<NSID>`. Queries use `GET` with URL parameters. The public read queries need no user session. Call them directly, or from TypeScript with the `@hypercerts-org/api` package below.

For example, retrieve an activity by its full AT-URI. Replace the placeholders with the DID and record key of an activity available to the API:

```bash
activity_uri='at://<author-did>/org.hypercerts.claim.activity/<record-key>'
curl --get 'https://api.hypercerts.dev/xrpc/org.hypercerts.claim.getActivity' \
  --data-urlencode "uri=$activity_uri"
```

### From TypeScript

[`@hypercerts-org/api`](https://www.npmjs.com/package/@hypercerts-org/api) provides typed definitions of every query for the [`@atproto/lex`](https://www.npmjs.com/package/@atproto/lex) client. Each query sits at its NSID path, with typed parameters and response views; the records inside the views have the types from [`@hypercerts-org/lexicon`](/lexicons/introduction-to-lexicons).

```bash
pnpm add @hypercerts-org/api @hypercerts-org/lexicon @atproto/lex
```

```typescript
import { Client } from "@atproto/lex";
import { org } from "@hypercerts-org/api";

const api = new Client("https://api.hypercerts.dev", { validateResponse: false });

const { activity } = await api.call(org.hypercerts.claim.getActivity, {
  uri: "at://<author-did>/org.hypercerts.claim.activity/<record-key>",
});
console.log(activity.record.title);
```

`Client` validates responses against the lexicons by default. The API can still return some records that fail their lexicon, and one such record fails a whole list response, so turn response validation off for now (`validateResponse: false`) and read fields defensively. See the [package README](https://github.com/hypercerts-org/api/tree/main/packages/api#response-validation). The package's versions are listed under [Hypercerts API types releases](/releases/api-types).

The API is for indexed reads, not repository writes. New or updated records may take time to appear.

Choose another read path when it better fits your use case:

- **Read a known record directly from its repository.** Use `com.atproto.repo.getRecord` when you know the record's address. See [Certified PDSs](/reference/services/certified-pdss).
- **Follow live record changes.** Use Jetstream for a custom live view or lossless change processing. See [Relay and Jetstream](/reference/services/relay).
- **Read labels directly.** Query a [labeler](/reference/services/labelers) when your application needs label data. <!-- Previously: Query a [labeler](/reference/services/labelers) for special cases; the Hypercerts API already includes labels in its query results. -->

## Status and source

Production endpoint: [`api.hypercerts.dev`](https://api.hypercerts.dev). See [Hypercerts API releases](/releases/api) for the service's changelog, [Hypercerts API types releases](/releases/api-types) for the `@hypercerts-org/api` package, and the [API repository](https://github.com/hypercerts-org/api) for source code.
