---
title: Labelers
description: The Activity Labeler and Orglabeler publish quality labels on Hypercerts activities and Certified organizations, and applications choose how to use them.
---

# Labelers

Hypercerts runs two labelers. The Activity Labeler rates the quality of Hypercerts activity records, and the Orglabeler rates how complete and credible a Certified organization looks. Both publish their verdicts as labels that anyone can read, so your application can tell well-formed records apart from drafts, placeholders, and test data without writing its own checks.

## Where it fits

The labelers sit beside the main read path. They take in records from the relay and publish labels. The [Hypercerts API](/reference/services/hypercerts-api) includes those labels in its query results, and the [Feed Service](/reference/services/feed-service) uses Orglabeler labels to filter organizations. Your application can also read labels directly. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

A **label** is a short, signed statement that one account makes about a record or about another account, such as "high quality" or "likely test". It has a source (`src`, the account that issued it), a subject (`uri`, the labeled record or account), and a value (`val`). A label does not change the data it describes. The record stays in its owner's repository, untouched, and the label is published separately.

A **labeler** is an account, with a service behind it, that publishes labels. It declares itself and the label values it uses in a record in its own repository, and it serves its labels through two standard methods that any client can call.

Nothing in the protocol makes a label binding. Each application chooses which labelers it listens to and what a label means for it: show a badge, sort a list, hide an item, or do nothing. AT Protocol calls this composable moderation. It allows several independent labelers to judge the same records by different standards, and it leaves the decision about whom to trust with the application. For the details, see the [AT Protocol label specification](https://atproto.com/specs/label).

## How it works

### A shared pipeline

Both labelers work the same way:

1. **Ingest.** A tool called Tap follows the relay, which is the service that gathers record changes from servers across the network. Tap loads older records and then streams new ones as they are published.
2. **Score.** Each labeler applies its own criteria to the records it receives.
3. **Publish.** The labeler signs a label and serves it through the standard label methods.

Labels can change. When a record is edited, or when a slower check finishes, the labeler withdraws the earlier label and publishes a new one.

### Activity Labeler

The Activity Labeler, `activitylabeler.certified.one`, scores `org.hypercerts.claim.activity` records and labels each record with a quality tier.

| Label | Meaning |
|---|---|
| `pending` | The record was detected and is being evaluated |
| `high-quality` | A well-documented activity with comprehensive details |
| `standard` | An adequate activity with basic information filled in |
| `draft` | A minimal activity that looks like a work in progress |
| `likely-test` | The activity appears to contain test or placeholder data |

The score rewards a meaningful title, summary, and description, and the presence of an image, work scope, contributors, locations, a date range, and rights. Placeholder text, repeated content, and obvious junk lower it. A separate classification step can downgrade content that is not meaningful to `likely-test`.

### Orglabeler

The Orglabeler, `orglabeler.certified.one`, reads `app.certified.actor.profile` and `app.certified.actor.organization` records, merges the two for each account, and labels the organization's account. Its subject is the account's DID (the permanent account ID), not a single record.

| Label | Meaning |
|---|---|
| `likely-test` | Clear test evidence, such as an account on a test server or placeholder names, domains, or descriptions |
| `standard` | A non-test organization that scores below 70 |
| `high-quality` | A non-test organization that scores 70 or more |

The score is out of 100 points across 13 signals, covering the display name, description, organization type, website and other URLs, location, founded date, avatar, and banner. Accounts hosted on a trusted server, including the Certified production PDS (Personal Data Server), get a small bonus. Test detection runs first, so an obvious test account lands in `likely-test` however complete it is. Website checks run in the background, so a label can change shortly after the first score. The full scoring table is in the [Orglabeler README](https://github.com/hypercerts-org/orglabeler#scoring).

## Using it from your application

Labelers expose two standard XRPC methods. XRPC is AT Protocol's convention for HTTP APIs, where each method is called at `/xrpc/<method name>`.

- `com.atproto.label.queryLabels` returns the current labels for the subjects you ask about.
- `com.atproto.label.subscribeLabels` streams labels over a WebSocket as they are published, for applications that keep their own copy.

For example, to read the Orglabeler's label for one organization, pass the organization's DID as the subject:

```bash
curl --get https://orglabeler.hypercerts.dev/xrpc/com.atproto.label.queryLabels \
  --data-urlencode 'uriPatterns=did:plc:example'

# {
#   "labels": [
#     { "src": "did:plc:pswneepkd5lesumj7ejmkbal", "uri": "did:plc:example",
#       "val": "high-quality", "cts": "2026-08-05T22:08:58.761Z" }
#   ]
# }
```

For the Activity Labeler, send the same request to its host with the activity record's AT-URI (its `at://` address) in `uriPatterns`. Hosts and labeler DIDs are listed under [Running services](/reference/services#running-services).

When you use labels:

- **Check the source.** Compare `src` with the DID of a labeler you have chosen to trust. A label from an unknown source carries no weight on its own.
- **Treat labels as signals, not verdicts.** A `standard` organization is not a bad one. It has filled in fewer fields.
- **Handle the unlabeled case.** New records and accounts are labeled a short time after they appear, so keep a fallback for subjects with no label yet.

The [Hypercerts API](/reference/services/hypercerts-api) includes labels published by the labelers. Query a labeler directly only for special cases.

## Status and source

Both labelers are running in production and label new records as they are published. They have no changelog page in this documentation.

The Orglabeler's source code is in the [orglabeler repository](https://github.com/hypercerts-org/orglabeler). The Activity Labeler describes its scoring at [activitylabeler.hypercerts.dev/docs](https://activitylabeler.hypercerts.dev/docs). Running your own labeler is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services) and [Running services](/reference/services#running-services)
- [Hypercerts API](/reference/services/hypercerts-api)
- [Feed Service](/reference/services/feed-service)
- [Relay and Jetstream](/reference/services/relay)
- [Certified identity](/core-concepts/certified-identity)
- [AT Protocol label specification](https://atproto.com/specs/label)
