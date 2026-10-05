---
title: Attachment
description: Lexicon reference for org.hypercerts.context.attachment, the record that connects documents, files, and links to the records they concern.
---

# Attachment

`org.hypercerts.context.attachment`

## Overview

An attachment connects material such as reports, photos, datasets, audits, or links to the records it concerns. It is a record of its own, so anyone can publish one about an activity, collection, measurement, evaluation, or another attachment, without editing the record it points to.

An attachment gives readers something to inspect. It does not by itself prove anything about its subjects: a plan explains intent, a progress report describes work, and an audit is one party's review. For the concepts behind it, see [Evidence and Measurements](/core-concepts/evidence-and-measurements) in the Guide.

## How it's used

- **A project documents its work.** The team publishes an installation report, progress photos, or a dataset and lists the activity in `subjects`.
- **Third parties add material.** An auditor, partner, or community member publishes an attachment in their own repository pointing at someone else's activity. It stays associated with its publisher, not with the owner of the activity.
- **One attachment, several subjects.** The same report can give context to several activities, or to an activity and the evaluation that relied on it.
- **Material can come first.** `subjects` is optional, so a file can be published before the record it will support exists.
- **Applications find attachments by indexing.** Records don't list their attachments. An indexer finds attachments by looking for records whose `subjects` point to a given record.

Only `title` and `createdAt` are required. Add `subjects`, `content`, and a description when they help readers understand what they are looking at.

## Schema

{% lexicon-schema nsid="org.hypercerts.context.attachment" /%}

## Example

A community energy project attaching its installation report and a photo album to the phase 1 activity:

```json
{
  "$type": "org.hypercerts.context.attachment",
  "title": "Installation and commissioning report, phase 1",
  "contentType": "report",
  "subjects": [
    {
      "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lx2k9q7mfd2c",
      "cid": "bafyreie6mq3tzkxv7hnw4dlpc2ysrb5fja7geo3wuxzm6ntkc2hdv4pqye"
    }
  ],
  "content": [
    {
      "$type": "org.hypercerts.defs#smallBlob",
      "blob": {
        "$type": "blob",
        "ref": {
          "$link": "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"
        },
        "mimeType": "application/pdf",
        "size": 2418762
      }
    },
    {
      "$type": "org.hypercerts.defs#uri",
      "uri": "https://photos.example.org/village-hall-solar/phase-1"
    }
  ],
  "shortDescription": "Installer's report covering panel layout, inverter setup, and the grid connection test.",
  "description": {
    "$type": "org.hypercerts.defs#descriptionString",
    "value": "Prepared by the electrical contractor after commissioning on 28 June 2026. The PDF includes the as-built drawings and the signed grid connection certificate. The linked album has progress photos from each week of installation."
  },
  "location": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/app.certified.location/3lx2k7p4hvc2a",
    "cid": "bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy"
  },
  "createdAt": "2026-07-04T13:40:00.000Z"
}
```

## Rules and best practices

- **Title and describe the material.** Readers often see only the title and short description in a list. Say what the material is and who prepared it, so a plan isn't mistaken for a report of completed work.
- **Use `contentType` to say what kind of material it is.** The known values are `report`, `audit`, `evidence`, `testimonial`, and `methodology`; other values are allowed. The label describes the material but doesn't verify it: an attachment labelled `audit` does not make its subject audited.
- **Prefer uploaded files for material that must not change.** A `smallBlob` item is stored in the publisher's repository and addressed by its content hash, so the record's CID commits to those exact bytes. A `uri` item points somewhere else, and the content there can change or disappear. Applications can show readers which kind each item is.
- **Mind the size limit.** Each blob item is limited to 10 MB (the `smallBlob` definition). Link to larger files with a `uri` item instead.
- **Strong references pin a version.** Each entry in `subjects` points to a specific version of the subject. If the subject is edited, the attachment still refers to the version it was written about.
- **Don't edit an attachment to swap its material.** Other records may point to a specific version of the attachment. To publish revised material, create a new attachment.
- **Link material that came first.** If you published an attachment before its subject existed, publish a new attachment naming the subject once it does, rather than editing the original.
- **Use `location` for where the subject matter happened.** It points to an [`app.certified.location`](/lexicons/certified-lexicons/location) record, for example the site where photos were taken.
- **Render any attachment from its title.** Applications can display an attachment from `title` and `createdAt` alone. Don't hide it because a subject can't be resolved or its content can't be fetched.
- **Use the inline description unless you need structure.** `descriptionString` is the simplest variant and the one applications are most likely to render. The Leaflet document and strong-reference variants are for rich or externally maintained descriptions.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): the most common subject of an attachment.
- [Measurement](/lexicons/hypercerts-lexicons/measurement): quantitative observations, when the material is a number with a unit.
- [Evaluation](/lexicons/hypercerts-lexicons/evaluation): assessments that often rely on attachments.
- [Shared Definitions](/lexicons/hypercerts-lexicons/shared-defs): the `uri`, `smallBlob`, and `descriptionString` objects.
- [Location](/lexicons/certified-lexicons/location): the record `location` points to.
- Guide: [Evidence and Measurements](/core-concepts/evidence-and-measurements), [Records That Change Over Time](/architecture/data-flow-and-lifecycle), [Validation and Interpretation](/core-concepts/validation-and-interpretation).
