---
title: Hypercerts CLI
description: A Go command-line tool for managing hypercerts on ATProto.
---

# Hypercerts CLI

The Hypercerts CLI (`hc`) is a command-line tool for managing hypercerts on ATProto. You can use it to:

- Create, read, update, and delete all Hypercerts record types (activities, measurements, evaluations, attachments, and more)
- Authenticate with any ATProto PDS
- Run interactively with a terminal UI or non-interactively with flags for CI/CD
- Resolve identities and inspect any record on the network

Built in Go on [bluesky-social/indigo](https://github.com/bluesky-social/indigo) with interactive forms powered by [Charm](https://charm.sh) libraries. Source: [github.com/GainForest/hypercerts-cli](https://github.com/GainForest/hypercerts-cli).

## Install

Choose one of three installation methods:

1. **Quick install** (recommended):

```bash
curl -sSL https://raw.githubusercontent.com/GainForest/hypercerts-cli/main/install.sh | bash
```

2. **Go install** (requires Go 1.23+):

```bash
go install github.com/GainForest/hypercerts-cli/cmd/hc@v0.1.1
```

3. **Build from source**:

```bash
git clone https://github.com/GainForest/hypercerts-cli
cd hypercerts-cli
make build
```

## Authenticate

Log in with your ATProto handle and app password:

```bash
hc account login -u yourhandle.certified.app -p your-app-password
```

Check your session status:

```bash
hc account status
```

Log out:

```bash
hc account logout
```

For CI/CD, set `HYPER_USERNAME`, `HYPER_PASSWORD`, and optionally `ATP_PDS_HOST` as environment variables.

## Core commands

All record types follow the same CRUD pattern. Here's the full workflow using activities as the primary example:

```bash
# Create interactively (launches TUI form)
hc activity create

# Create with flags
hc activity create \
  --title "Rainforest Carbon Study" \
  --description "12-month carbon sequestration measurement" \
  --start-date 2025-01-01 \
  --end-date 2025-12-31

# List
hc activity ls
hc activity ls --json

# Get details
hc activity get <rkey>

# Edit
hc activity edit <rkey> --title "Updated Title"

# Delete (cascades to linked measurements and attachments)
hc activity delete <rkey> -f
```

{% callout type="note" %}
Deleting an activity also removes all linked measurements and attachments. Use the `-f` flag to skip confirmation.
{% /callout %}

## All record types

Every record type supports `create`, `ls`, `get`, `edit`, `delete` with the same flag patterns shown above.

| Command | Record Type | Alias |
|---------|------------|-------|
| `hc activity` | `org.hypercerts.claim.activity` | — |
| `hc measurement` | `org.hypercerts.claim.measurement` | `hc meas` |
| `hc location` | `app.certified.location` | `hc loc` |
| `hc attachment` | `org.hypercerts.claim.attachment` | `hc attach` |
| `hc rights` | `org.hypercerts.claim.rights` | — |
| `hc evaluation` | `org.hypercerts.claim.evaluation` | `hc eval` |
| `hc collection` | `org.hypercerts.claim.collection` | `hc coll` |
| `hc contributor` | `org.hypercerts.claim.contributorInformation` | `hc contrib` |
| `hc funding` | `org.hypercerts.funding.receipt` | `hc fund` |
| `hc workscope` | `org.hypercerts.helper.workScopeTag` | `hc ws` |

## Generic operations

Inspect any record on the network using AT-URIs:

```bash
hc get at://did:plc:xxx/org.hypercerts.claim.activity/rkey
```

List all records for a user:

```bash
hc ls handle.example.com
```

List records filtered by collection:

```bash
hc ls handle.example.com --collection org.hypercerts.claim.activity
```

Resolve a handle to a DID:

```bash
hc resolve handle.example.com
```

## Interactive UI

When you run commands without flags, the CLI launches interactive forms with keyboard navigation, live preview cards during activity creation, multi-select for bulk deletes, and select-or-create patterns when linking records.

{% callout type="note" %}
The interactive UI requires a terminal that supports ANSI escape codes. For CI/CD environments, always use flags to run commands non-interactively.
{% /callout %}
