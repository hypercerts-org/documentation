---
title: Shared Definitions
description: Lexicon reference for app.certified.defs, the shared definitions for naming an account by DID and a record by URI.
---

# Shared Definitions

`app.certified.defs`

## Overview

`app.certified.defs` holds small object definitions that other Certified and Hypercerts lexicons reuse. It defines no record type: nobody publishes a record with this NSID. Its definitions appear inside other records.

It has two definitions, each a wrapper around one identifier:

- `did` names an account by its DID.
- `recordSubject` names a record by its AT-URI, without a CID, so the reference keeps pointing at the record as it is updated.

Together with `com.atproto.repo.strongRef`, which names a record and pins one version with a CID, these are the ways records refer to accounts and other records. For when to pin a version and when not to, see [Records That Change Over Time](/architecture/data-flow-and-lifecycle) in the Guide.

The signature definitions are a separate document; see [Signatures](/lexicons/certified-lexicons/signatures).

## Where the definitions are used

`did` is an object rather than a plain string so it can be one option in a union, next to a strong reference. It appears in:

- **[Badge award](/lexicons/certified-lexicons/badge-award)** `subject`: the account a badge is awarded to, as an alternative to a strong reference to a record.
- **[Funding receipt](/lexicons/hypercerts-lexicons/funding-receipt)** `from` and `to`: the sender or recipient of funds, as an alternative to free text or a strong reference.
- **[Badge definition](/lexicons/certified-lexicons/badge-definition)** `allowedIssuers`: accounts allowed to award the badge.
- **[Evaluation](/lexicons/hypercerts-lexicons/evaluation)** `evaluators`: the accounts that performed the evaluation.
- **[Measurement](/lexicons/hypercerts-lexicons/measurement)** `measurers`: the accounts that performed the measurement.

`recordSubject` appears in:

- **[Entity follow](/lexicons/certified-lexicons/follows)** `subject`: the record being followed.

## Schema

{% lexicon-schema nsid="app.certified.defs" /%}

## Examples

In a union position, such as a badge award's `subject`, a `did` object carries a `$type`:

```json
{
  "subject": {
    "$type": "app.certified.defs#did",
    "did": "did:plc:4yyb5gyoxl3sqdlqrvuxshkp"
  }
}
```

In a plain reference position, such as an evaluation's `evaluators`, there is only one possible type, so the objects carry just the DID:

```json
{
  "evaluators": [
    { "did": "did:plc:ragtjsm2j2vknwkz3zp4oxrd" },
    { "did": "did:plc:ewvi7nxzyoun6zhxrhs64oiz" }
  ]
}
```

A `recordSubject` in an entity follow, naming a project collection without pinning a version:

```json
{
  "subject": {
    "$type": "app.certified.defs#recordSubject",
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.collection/3lx2m4q7trs2b"
  }
}
```

## Rules and best practices

- **Include `$type` in union positions.** Badge award `subject` and funding receipt `from` and `to` are unions, so each value names its variant. In plain reference arrays like `evaluators`, `$type` isn't needed; readers typically accept the object with or without it.
- **A DID in a record is the author's claim.** Naming an account as an evaluator, measurer, or funding recipient doesn't mean that account agreed or took part. The schema checks DID syntax only, not that the DID resolves or that the account did anything. An [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) from the named account is how it can confirm.
- **Don't shorten a DID to fit.** `did` has a maximum length of 256. If an account's DID is longer, leave an optional property out or use another variant of the union rather than writing a truncated value.
- **Use a full, DID-form record URI in `recordSubject`.** Write `at://<did>/<collection>/<rkey>`. Handle-based and partial URIs pass schema validation, but indexers typically skip them. A URI with only a DID names an account, which belongs in a [follow](/lexicons/certified-lexicons/follows), not an entity follow.
- **Choose the reference by what it's about.** Use `recordSubject` when the relationship should follow a record across edits, as a follow does. Use a strong reference when it concerns the version seen, as an evaluation or a [like](/lexicons/certified-lexicons/likes-and-reposts) does. Use `did` when the subject is the account itself.
- **Don't treat an account and its records as the same subject.** A badge awarded to an account and a badge awarded to one of its records are different statements. Apps gathering everything said about an account check each form its records can use.

## Related

- [Signatures](/lexicons/certified-lexicons/signatures): the shared `signatures` definitions.
- [Follows](/lexicons/certified-lexicons/follows): uses `recordSubject`.
- [Badge Award](/lexicons/certified-lexicons/badge-award), [Badge Definition](/lexicons/certified-lexicons/badge-definition), [Evaluation](/lexicons/hypercerts-lexicons/evaluation), [Measurement](/lexicons/hypercerts-lexicons/measurement), and [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt): use `did`.
- [Hypercerts Shared Definitions](/lexicons/hypercerts-lexicons/shared-defs): definitions shared across Hypercerts records.
- Guide: [Records That Change Over Time](/architecture/data-flow-and-lifecycle), [A Shared Language](/core-concepts/hypercerts-core-data-model).
