---
title: PDS Credible Exit
description: How to migrate an AT Protocol account from one PDS to another while preserving its DID.
---

# PDS Credible Exit

A **credible exit** is the ability to move an AT Protocol account from one Personal Data Server (PDS) to another while preserving the account's DID. The DID is the stable identity; the PDS is only the current host for the repository, blobs, and account state.

For Hypercerts and Certified, this means an organization can move away from a source PDS, such as `climateai.org`, to a Certified-operated PDS, such as [`dev.certified.app`](/reference/certified-pdss#staging-devcertifiedapp) or [`certified.one`](/reference/certified-pdss#production-certifiedone), without creating a new identity.

{% callout type="note" %}
A PDS migration preserves the **source DID**. It does not merge two accounts. Do not pre-create the destination handle manually; the migration creates the destination account using the existing DID.
{% /callout %}

{% callout type="warning" %}
Account migration updates the account's DID document and deactivates the old PDS account. Test on staging first, keep backups, and never include passwords, invite codes, or PLC tokens in documentation or tickets.
{% /callout %}

## Tested migration

We validated this flow with a dummy organization account:

| Field | Before | After |
|---|---|---|
| DID | `did:plc:epqx4a7yizbtayyxrk7vsu2j` | unchanged |
| Handle | `169ft6.climateai.org` | `169ft6.dev.certified.app` |
| PDS | `https://climateai.org` | `https://dev.certified.app` |
| Status | active before migration | deactivated after migration |

After migration, the DID document pointed to `https://dev.certified.app`, the new account was active, the old account was deactivated, all records and blobs were present, and `goat account check-auth` returned `validDid: true`.

## Prerequisites

Install:

- [`goat`](https://github.com/bluesky-social/goat)
- `curl`
- `jq`

You also need:

- admin access to the source PDS if accounts do not have reusable passwords;
- an invite code or admin access on the destination PDS;
- access to the source account's PLC-signing email token;
- a fresh, unused destination handle under the destination PDS handle domain.

Example destination handle domains:

| PDS | Handle suffix |
|---|---|
| `https://dev.certified.app` | `.dev.certified.app` |
| `https://certified.one` | `.certified.one` |

## Single-account migration

Set the migration variables:

```bash
export OLD_PDS="https://climateai.org"
export NEW_PDS="https://dev.certified.app"

export OLD_DID="did:plc:example"
export OLD_HANDLE="example.climateai.org"
export NEW_HANDLE="example.dev.certified.app"

export NEW_EMAIL="migration+example@example.com"
export NEW_PASSWORD="choose-a-new-password"
export NEW_INVITE="destination-pds-invite-code"
```

Create a backup before changing identity state:

```bash
mkdir -p backup
goat repo export "$OLD_DID" --output "backup/${OLD_DID}.car"
goat blob export "$OLD_DID"
```

If the source account does not have a password, reset it with source PDS admin access:

```bash
export OLD_ADMIN_PASSWORD="source-pds-admin-password"

export OLD_PASSWORD="$(
  goat pds admin \
    --pds-host "$OLD_PDS" \
    --admin-password "$OLD_ADMIN_PASSWORD" \
    account reset-password "$OLD_HANDLE" \
    | awk -F': ' '/new password/ {print $2}'
)"
```

Log in to the source account and request the PLC token:

```bash
goat account logout

goat account login \
  --pds-host "$OLD_PDS" \
  -u "$OLD_HANDLE" \
  -p "$OLD_PASSWORD"

goat account plc request-token
```

Paste the emailed token:

```bash
export PLC_TOKEN="paste-email-token-here"
```

Run the migration:

```bash
goat account migrate \
  --pds-host "$NEW_PDS" \
  --new-handle "$NEW_HANDLE" \
  --new-email "$NEW_EMAIL" \
  --new-password "$NEW_PASSWORD" \
  --invite-code "$NEW_INVITE" \
  --plc-token "$PLC_TOKEN"
```

## Verification checklist

The migration is complete when all of the following pass:

```bash
curl -s "https://plc.directory/$OLD_DID" | jq '.alsoKnownAs, .service'

curl -s "$NEW_PDS/xrpc/com.atproto.identity.resolveHandle?handle=$NEW_HANDLE" | jq
curl -s "$NEW_PDS/xrpc/com.atproto.sync.getRepoStatus?did=$OLD_DID" | jq
curl -s "$OLD_PDS/xrpc/com.atproto.sync.getRepoStatus?did=$OLD_DID" | jq
```

Expected results:

- the PLC DID document points to the new PDS;
- the new handle resolves to the original DID;
- the new PDS account is `active: true`;
- the old PDS account is inactive or deactivated.

Finally, log into the migrated account and check for missing blobs:

```bash
goat account logout

goat account login \
  --pds-host "$NEW_PDS" \
  -u "$OLD_DID" \
  -p "$NEW_PASSWORD"

goat account check-auth
goat account missing-blobs
```

`goat account check-auth` should report `validDid: true`, and `goat account missing-blobs` should return no missing blobs.

## Bulk migrations

For many organization accounts, use the same flow with a CSV manifest containing:

```csv
old_handle,did,new_handle,new_email
example.climateai.org,did:plc:example,example.dev.certified.app,migration+example@example.com
```

Run migrations serially, not in parallel, unless each worker has an isolated `goat` configuration directory. `goat` stores one active session locally, so concurrent migrations can overwrite each other's auth state.

The PLC email token is the main manual step. For large batches, route source account emails to controlled aliases and automate token retrieval from the mailbox or mail provider logs.
