---
title: Labelers
description: The Activity Labeler and Orglabeler publish quality labels on Hypercerts activities and Certified organizations.
---

# Labelers

A label is a short, signed tag that one account publishes about a record or another account, such as "high quality" or "likely test". A labeler is the AT Protocol account and service that publishes those labels. Labels do not change the labeled data. Apps and indexers decide which labelers to trust and what to do with their labels: show a badge, filter a list, or ignore them.

Hypercerts runs two labelers: the **Activity Labeler**, which labels Hypercert activity records, and the **Orglabeler**, which labels Certified organizations. For the underlying protocol, see the [AT Protocol label specification](https://atproto.com/specs/label).

## What it does

Hypercerts records live in many personal data servers (PDSs). The [relay](/reference/services/relay) collects changes from those servers, Jetstream filters them, and the [indexer](/reference/services/indexer) serves the Hypercerts API that applications use through the SDK or API. Around that path, the [entryway](/reference/services/entryway) handles sign-in, the [Certified Group Service](/reference/services/certified-group-service) handles group accounts, and the [feed service](/reference/services/feed-service) builds feeds on its own.

The labelers sit beside this path. They read records from the network, judge their quality, and publish labels. Anyone can read those labels, so they work as shared quality signals rather than private scores inside one app:

- The new Hypercerts indexer picks up labels from these labelers. The indexer is under development.
- The feed service can filter organizations by Orglabeler labels. See [Feed Service](/reference/services/feed-service).
- Your application can read the labels directly.

Labels help an application tell well-formed records apart from drafts, placeholders, and test data. They are one input for deciding what to show. For how quality signals relate to trust and recognition more broadly, see [Certified identity](/core-concepts/certified-identity).

## How it works

Both labelers follow the same pipeline:

```text
AT Protocol relay → Tap ingestion and backfill → scoring or classification → signed AT Protocol labels
```

1. **Tap ingests records.** Tap is an AT Protocol tool that discovers repositories, backfills older records, and streams new ones as they are published.
2. **Each labeler applies its own criteria** to the records it receives.
3. **The labeler signs and publishes labels** through the standard AT Protocol labeler interface, so any AT Protocol client can query them or subscribe to them.

The pipeline is shared. Each labeler watches different record types and applies different criteria.

### Activity Labeler

| | |
|---|---|
| Handle | `activitylabeler.certified.one` |
| DID | `did:plc:antf7bsm6f4ohkqfdckefyt7` |
| Labeler service record | [`app.bsky.labeler.service/self` on PDSls](https://pds.ls/at://did:plc:antf7bsm6f4ohkqfdckefyt7/app.bsky.labeler.service/self) |

The Activity Labeler scores the quality of Hypercert activity records and publishes a label for each record's quality tier.

**What it labels:** `org.hypercerts.claim.activity` records.

**Labels:** these are the values defined in the labeler's service record.

| Label | Meaning |
|---|---|
| `pending` (Pending) | The record was detected and evaluation is in progress |
| `high-quality` (High Quality) | A well-documented activity with comprehensive details |
| `standard` (Standard) | An adequate activity with basic information filled in |
| `draft` (Draft) | A minimal activity that looks like a work in progress |
| `likely-test` (Likely Test) | The activity appears to contain test or placeholder data |

**Criteria:**

- Title quality
- Summary quality
- Description quality
- Image present
- Work scope present
- Contributors present and detailed
- Locations present
- Date range present
- Rights present

It also applies penalties and test-detection checks for low-quality patterns such as placeholder text, repeated content, or obvious junk records. A separate classification step, using a Hugging Face model, runs after scoring and can downgrade content that is not meaningful to a likely-test label.

### Orglabeler

| | |
|---|---|
| Handle | `orglabeler.certified.one` |
| DID | `did:plc:pswneepkd5lesumj7ejmkbal` |
| Labeler service record | [`app.bsky.labeler.service/self` on PDSls](https://pds.ls/at://did:plc:pswneepkd5lesumj7ejmkbal/app.bsky.labeler.service/self) |

The Orglabeler scores how complete and credible a Certified organization looks and labels the organization's account.

**What it reads:** `app.certified.actor.profile` and `app.certified.actor.organization` records. It merges the two by DID, so the profile adds context when the organization is scored.

**What it labels:** the organization's account DID.

**Labels:**

| Label | Meaning |
|---|---|
| `likely-test` (Likely Test) | Clear test evidence, such as an account on a PDS configured as a test host, or obvious placeholder names, domains, or descriptions |
| `standard` (Standard) | A non-test organization that scores below 70 |
| `high-quality` (High Quality) | A non-test organization that scores 70 or more |

**Criteria:** the score is out of 100 points across 13 signals:

- Display name
- Description
- Organization type
- Profile website present
- Profile website resolves
- Profile website matches name
- Organization URLs present
- Organization URLs resolve
- Location valid
- Founded date valid
- Founded date at least one year old
- Avatar present
- Banner present

Accounts hosted on a trusted PDS (by default `certified.one` and `gainforest.id`) get a bonus of 10 points. Test detection runs before completeness scoring: obvious junk, placeholder, or test values place the organization in the likely-test tier even when other fields are filled in. Website and URL checks run later in the background, so a label can change after the first score once those checks finish.

## Using it from your application

Labelers expose the standard AT Protocol label procedures:

- `com.atproto.label.queryLabels` returns the current labels for the records or accounts you ask about.
- `com.atproto.label.subscribeLabels` streams labels over a WebSocket as they are published.

For example, to read the Orglabeler's label for one organization:

```bash
curl --get https://orglabeler.hypercerts.dev/xrpc/com.atproto.label.queryLabels \
  --data-urlencode 'uriPatterns=did:plc:example'
```

Each returned label names its source (`src`, the labeler's DID), its subject (`uri`, the labeled record or account), and its value (`val`). Check `src` against the labeler DIDs above before you rely on a label.

When deciding how to use labels:

- Choose which labelers your application trusts. Labels from an unknown source carry no weight on their own.
- Treat labels as signals, not verdicts. A `standard` organization is not a bad one; it has filled in fewer fields.
- Keep your own fallback for records that have no label yet. New records and new accounts may be labeled a short time after they appear.

Running service URLs are listed under [Running services](/reference/services#running-services).

## Status

Both labelers are running in production and labeling new records as they are published.

## Running your own

Operating your own labeler is outside the scope of this documentation for now. The Orglabeler source is public at [hypercerts-org/orglabeler](https://github.com/hypercerts-org/orglabeler).

## Related

- [Services overview](/reference/services)
- [Indexer](/reference/services/indexer)
- [Feed Service](/reference/services/feed-service)
- [Certified lexicons](/lexicons/certified-lexicons)
- [Hypercerts lexicons](/lexicons/hypercerts-lexicons)
- [Certified identity](/core-concepts/certified-identity)
- [AT Protocol label specification](https://atproto.com/specs/label)
