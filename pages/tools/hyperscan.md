---
title: Hyperscan
description: Explorer for Hypercerts and related ATProto data across the Hypersphere network.
---

# Hyperscan

Hyperscan is the public explorer for Hypercerts and related ATProto data in the Hypersphere ecosystem. Use it to see what is being published, inspect accounts and records, monitor the network, and understand the live infrastructure around Hypercerts.

Live at [hyperscan.dev](https://www.hyperscan.dev).

## What it is for

Hyperscan gives builders and reviewers a practical view into the public state of the network. It is useful when you want to:

- Browse recent hypercert activity without writing a query
- Check whether a record was published and indexed correctly
- Inspect a DID, handle, AT-URI, collection, or PDS host
- See which collections and record types are active across the ecosystem
- Monitor indexers, labelers, and live event streams
- Give scripts or AI agents markdown endpoints for reading ecosystem state

## Feed

The [Feed](https://www.hyperscan.dev/feed) is the quickest way to see recent Hypercerts activity. It shows recently indexed records with links back into the underlying accounts and record details.

Use the feed when you want to answer questions like:

- What hypercerts were published recently?
- Which accounts are publishing activity or contributor records?
- Did my newly created record appear in the public index?
- What records are available for review, comments, or presentation in Hyperboards?

The feed supports source and type filtering. For example, you can focus on Hypercerts records or a custom source, then narrow the list by record type such as activity or contributor records.

Each feed item links to the account and the indexed record in the Data Explorer. Hypercert activity cards can also link to a Hyperboard when one is available. Review and comment links take you to the review flow for that record.

### Feed views

The feed includes multiple ways to inspect activity:

| View | Use it for |
|---|---|
| Feed | Reading recent records as cards in chronological order |
| Map | Seeing geographic context when records include location data |
| Events | Watching indexed events in a more event-oriented format |

For most workflows, start with the Feed view. Switch to Map when location matters, or Events when you are checking indexing behavior and record arrival order.

## Data Explorer

The [Data Explorer](https://www.hyperscan.dev/data) is the main inspection tool. It lets you look up public ATProto data by DID, handle, AT-URI, or PDS host.

The Data Explorer is heavily inspired by [pdsls.dev](https://pdsls.dev), adapted for exploring Hypercerts and related Hypersphere records.

Use the Data Explorer when you need to validate or debug records:

- Paste a DID or handle to inspect an account's public repo data
- Paste an AT-URI to jump directly to one record
- Check which collections are present for an account
- Compare a rendered feed card with the underlying record fields
- Confirm that linked records, such as contributors or context records, exist publicly
- Inspect example accounts before building your own publishing flow

This is especially helpful after creating data with the Scaffold app, the Hypercerts CLI, or a custom ATProto client. If the record appears in the Data Explorer, it has been published to the account's repo and can be discovered by the broader ecosystem.

## Infrastructure Views

Hyperscan also gives a compact overview of the infrastructure around Hypercerts. These pages are useful for understanding network health and data coverage without running your own monitoring stack.

| Page | What it shows |
|---|---|
| [Stats](https://www.hyperscan.dev/stats) | Network-level counts, collection breakdowns, participants, and indexed record totals |
| [Stream](https://www.hyperscan.dev/stream) | Live network events as they arrive from the indexed stream |
| [Indexers](https://www.hyperscan.dev/indexers) | Curated ATProto indexers and their status context |
| [Labeler](https://www.hyperscan.dev/labeler) | Labeling services that evaluate records and publish reusable ATProto labels |

Together, these views help explain what infrastructure is present around Hypercerts: indexers gather and normalize public records, stats summarize the indexed network, streams show live ingestion, and labelers publish quality or trust signals that other apps can consume.

## Agent API

Hyperscan includes markdown endpoints designed for scripts and AI agents. These endpoints avoid HTML parsing and return readable summaries of the network, records, schemas, and write guides.

Start with the capabilities manifest:

```bash
curl https://www.hyperscan.dev/agents
```

Common read endpoints:

| Endpoint | What it returns |
|---|---|
| `/agents` | Capabilities manifest and endpoint index |
| `/agents/stats` | Network snapshot with record counts, collections, and recent hypercerts |
| `/agents/feed` | Recent Hypercerts records |
| `/agents/profile/{handle-or-did}` | Account profile, collections, and recent records |
| `/agents/lexicon` | Index of curated lexicon schemas |
| `/agents/lexicon/{nsid}` | Detail for one lexicon schema |
| `/agents/guides` | Index of write guides and common record-creation patterns |

Examples:

```bash
# Current network snapshot
curl https://www.hyperscan.dev/agents/stats

# Recent activity
curl https://www.hyperscan.dev/agents/feed

# Inspect one account
curl https://www.hyperscan.dev/agents/profile/daviddao.org

# Read the activity claim schema
curl https://www.hyperscan.dev/agents/lexicon/org.hypercerts.claim.activity

# Find write guides for creating records
curl https://www.hyperscan.dev/agents/guides
```

Use the Agent API when you want a tool, bot, or coding agent to understand the current network state before deciding what to query, inspect, or create next.

## See also

- [Hyperindex](/tools/hyperindex) — indexer used to query and serve indexed Hypercerts data
- [Labelers](/tools/labelers) — ATProto label services used for quality and trust signals
- [Hypercerts CLI](/tools/hypercerts-cli) — command-line tool for creating and inspecting Hypercerts records
- [Introduction to Lexicons](/lexicons/introduction-to-lexicons) — schemas behind the records shown in Hyperscan
