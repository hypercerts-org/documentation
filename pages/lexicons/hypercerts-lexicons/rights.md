---
title: Rights
description: Lexicon reference for org.hypercerts.claim.rights, the record that states the rights and terms attached to an activity claim.
---

# Rights

`org.hypercerts.claim.rights`

## Overview

A rights record states the terms that come with a hypercert: what a holder or contributor may do with it, such as whether it can be displayed, sold, or transferred, and under what conditions. It can also describe licensing terms for the material the claim covers.

The terms live in their own record so one statement can be referenced by many activities. An [activity claim](/lexicons/hypercerts-lexicons/activity-claim) points to it through its `rights` property. For how activities are described, see [Activity Claims](/core-concepts/what-is-hypercerts) in the Guide.

## How it's used

- **A publisher writes its terms once.** An organization publishes a rights record for each distinct set of terms it uses, for example a standard "display only" statement or a Creative Commons license.
- **Activities reference it.** Each activity that carries those terms sets `rights` to a strong reference to the record. An activity can reference one rights record.
- **Readers show the terms.** Funding platforms and marketplaces display the rights record alongside the activity so people know what supporting or holding the hypercert does and doesn't give them.

Four properties are required: `rightsName`, `rightsType`, `rightsDescription`, and `createdAt`. Use `attachment` to link or upload the full legal text when there is one.

## Schema

{% lexicon-schema nsid="org.hypercerts.claim.rights" /%}

## Example

The community energy project states that holding its hypercert is about recognition, not ownership of the array:

```json
{
  "$type": "org.hypercerts.claim.rights",
  "rightsName": "Public Display Only",
  "rightsType": "PDO",
  "rightsDescription": "Holders may display this hypercert and reproduce its title, description, and reported outcomes in their own reporting, with attribution to the Village Hall Energy Cooperative. Holding it gives no ownership interest in the solar array or its electricity output, and no right to resell or transfer the hypercert.",
  "attachment": {
    "$type": "org.hypercerts.defs#uri",
    "uri": "https://energy.example.org/legal/hypercert-display-terms-v1.pdf"
  },
  "createdAt": "2026-07-01T13:40:00.000Z"
}
```

The activity references it with a plain strong reference. `rights` is not a union, so the reference has no `$type`:

```json
"rights": {
  "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.rights/3lwzp8t2k3a2x",
  "cid": "bafyreiakm4qz7h3xw5nrt2vd6yjl2ofe5cgub3spk7vw4nqzx2yb5mfhoq"
}
```

## Rules and best practices

- **Put the terms in `rightsDescription`.** It is the only field meant to explain permissions, restrictions, and conditions. State them in full there rather than repeating the name or code.
- **Treat `rightsType` as the publisher's own code.** There is no shared list of codes, so two publishers can use different codes for the same license, or the same code for different terms. Don't decide eligibility or compliance from `rightsType` or `rightsName` alone; show `rightsDescription` wherever the terms matter.
- **Carry the license version in `rightsName`.** `rightsType` is limited to 10 bytes, which is too short for many license identifiers with a version (for example `CC-BY-SA-4.0`). Use a short family code there and the full, versioned name in `rightsName`.
- **Keep the attachment and description consistent.** When `attachment` holds the legal document, write a description that summarizes it faithfully, and show both to readers.
- **Publish new terms as a new record.** Activities reference a specific version of the rights record. If the terms change, publish a new rights record and update the activities that adopt it, rather than editing the old one so it no longer matches what earlier references pinned.
- **Split work with different terms.** An activity has one `rights` reference. If parts of the work carry different terms, describe them as separate activities, each with its own rights reference.
- **No reference means no stated terms.** An activity without `rights` says nothing about terms. Don't present it as public domain, openly licensed, or freely reusable. Likewise, if a rights reference can't be resolved, show the terms as unavailable rather than absent.
- **Publishing terms doesn't make them binding.** The record is the publisher's statement. Whether the terms have legal effect, and for whom, is outside what the record can establish.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): the record that references rights.
- [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt): records of support for an activity or project.
- [Shared definitions](/lexicons/hypercerts-lexicons/shared-defs): the URI and blob types used by `attachment`.
- [Signatures](/lexicons/certified-lexicons/signatures): attestations over a record's content.
- Guide: [Activity Claims](/core-concepts/what-is-hypercerts), [Funding and Value Flow](/core-concepts/funding-and-value-flow), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
