---
title: Signatures
description: Lexicon reference for app.certified.signature.defs and app.certified.signature.proof, signatures and attestations on record contents.
---

# Signatures

`app.certified.signature.defs` · `app.certified.signature.proof`

## Overview

Every AT Protocol repository signs its commits, so a record fetched from a repository is already attributed to that account. The `signatures` property adds something different: a signature on a record's contents from someone other than the repository owner. Almost every Hypercerts and Certified record has this optional property, and it references `app.certified.signature.defs#list`.

A signature list can hold two kinds of entries:

- An **inline signature** (`app.certified.signature.defs#inline`) sits inside the record. It holds signature bytes and a reference to the signing key in a DID document. This suits a party that produces the record, such as a platform writing to a user's repository on their behalf, which can sign with its own key to show it created the record.
- A **remote attestation** is a strong reference to an `app.certified.signature.proof` record. The attesting party, such as a reviewer or certifier, publishes the proof record in its own repository. It holds the CID of the attested content and no signature of its own: its authenticity comes from being published in the attestor's repository.

Unsigned records are the normal case. For how signatures fit alongside other trust signals, see [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

## How it's used

- **A platform marks records it produced.** When an app writes records into a user's repository, the commit is attributed to the user. A platform can add an inline signature made with its own key, so a reader can check which platform produced the record.
- **A third party attests to a record.** An auditor computes the CID of a project's activity and publishes a proof record naming it, with a `note` explaining what they checked. The attestor needs no write access to the project's repository.
- **The author surfaces the attestation.** The record's author adds a strong reference to the proof record in the record's `signatures` array, so readers of the record can find it.
- **Readers verify.** An app checks each entry independently and shows which signers or attestors it could verify.

Both forms sign or name the same input: the CID of the record with the `signatures` field removed and a temporary `$sig` object inserted, carrying a `$type` and the DID of the repository that holds the record. Because `signatures` is left out, entries can be added or removed without invalidating the others.

## Signature definitions schema

These definitions describe the shape of the `signatures` property that other records reference.

{% lexicon-schema nsid="app.certified.signature.defs" /%}

## Signature proof schema

A proof record lives in the attestor's repository and holds the CID of the attested content.

{% lexicon-schema nsid="app.certified.signature.proof" /%}

## Example

An auditor's proof record, published in the auditor's repository:

```json
{
  "$type": "app.certified.signature.proof",
  "cid": "bafyreif5dqzwxmvoj6l3aqsgyb4tbwnrhy2cfmj7k3u4vxe6pdzlh2q7ne",
  "note": "Reviewed against the site visit on 2026-09-10. Installed capacity matches the activity description.",
  "createdAt": "2026-09-15T13:40:00.000Z"
}
```

An activity carrying an inline signature from the platform that produced it and a reference to an auditor's proof record. In JSON, the `bytes` value is an object with the base64-encoded bytes under `$bytes`. The signature value is illustrative.

```json
{
  "$type": "org.hypercerts.claim.activity",
  "title": "Solar array installation, phase 1",
  "shortDescription": "Installation of a 40 kW community-owned solar array on the village hall roof.",
  "createdAt": "2026-07-02T09:15:00.000Z",
  "signatures": [
    {
      "$type": "app.certified.signature.defs#inline",
      "signature": {
        "$bytes": "j9gArE9UNRRCTap+fRYmjjf0lkSjuiORjp70W/fSNfF4QWrutXFlSM+IjWQBIo6UNm7XDMjWydC99d8T4o6moA"
      },
      "key": "did:web:grants.example.org#attestation"
    },
    {
      "$type": "com.atproto.repo.strongRef",
      "uri": "at://did:plc:ragtjsm2j2vknwkz3zp4oxrd/app.certified.signature.proof/3lxd7ka2mvs2e",
      "cid": "bafyreie5737gdxlw5i64vzichcalba3z2v5n6icifvx5xytvske7mr3hpm"
    }
  ]
}
```

The strong reference carries the proof record's own URI and CID. The `cid` inside the proof record is the CID computed for the activity.

## Rules and best practices

- **A signature proves key control, not truth.** A verified signature shows that the holder of a key signed this content in this repository. It doesn't say who the signer is in the real world, what they meant by signing, or whether the content is accurate. Don't present a signature as a review, audit, or approval unless the signer's own statement (such as a proof `note`) or another record says so.
- **Verify before you trust.** Schema validation accepts any bytes and any key string. To verify an inline signature, resolve `key` as a DID URL, find the verification method with that exact identifier, read the curve (P-256 or K-256) from its `publicKeyMultibase` prefix, rebuild the signed input from the record as fetched, and check the ECDSA signature (raw r and s, low-S form).
- **Use a full key reference.** Set `key` to a DID plus a fragment, such as `did:web:grants.example.org#attestation`, so it identifies one key. A bare DID doesn't say which key signed.
- **Sign with a stable, resolvable key.** Reuse a long-lived key that stays in your published DID document. A signature from a key readers can't resolve can't be verified.
- **Don't sign with the repository's own key.** The repository commit already attributes the record to its owner. Inline signatures are useful when the signer is someone else.
- **Never store `$sig`.** The `$sig` object exists only while computing the signed input. For a record written on a user's behalf, it carries the DID of the repository holding the record (the user's), not the signer's.
- **Check what a strong reference points to.** Treat a strong-reference entry as an attestation only when it resolves to an `app.certified.signature.proof` record whose CID matches the reference and whose `cid` matches the CID you computed for the record.
- **Write a new proof instead of editing one.** A proof record is referenced by its CID, so editing it, even just the `note`, breaks every reference to it. To attest to changed content, publish a new proof.
- **The list shows what the author chose to show.** Only the record's author can add entries, and a proof record has no link back to the record it attests. An attestation can exist without appearing in the list, and an author can remove entries.
- **Don't reject records over signatures.** Unsigned records are normal. If an entry can't be verified or resolved, ignore that entry and keep the record.

## Related

- [EVM Link](/lexicons/certified-lexicons/evm-link): a wallet-ownership proof, distinct from record signatures.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) and [Evaluation](/lexicons/hypercerts-lexicons/evaluation): records for stating acceptance or assessment explicitly.
- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): a typical signed record.
- [Shared Definitions](/lexicons/certified-lexicons/shared-defs): other definitions shared across Certified records.
- Guide: [Trust and Recognition](/core-concepts/certified-identity), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
