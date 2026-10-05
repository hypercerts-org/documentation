---
title: Shared Definitions
description: Lexicon reference for org.hypercerts.defs, the shared objects for descriptions, links, files, images, and video used across Hypercerts and Certified records.
---

# Shared Definitions

`org.hypercerts.defs`

## Overview

`org.hypercerts.defs` is not a record. It holds small object definitions that other lexicons reuse, so that a long-form description, a link, or an uploaded file looks the same wherever it appears. There are seven:

- **`descriptionString`**: an inline long-form description, as plain text or markdown, with optional rich-text facets.
- **`uri`**: a link to content held outside the network.
- **`smallBlob`** and **`largeBlob`**: an uploaded file of any type.
- **`smallImage`** and **`largeImage`**: an uploaded JPEG, PNG, or WebP image.
- **`smallVideo`**: an uploaded MP4 or WebM video.

Most file-valued fields are a union of `uri` and one of the blob definitions, so the publisher chooses between linking to content and uploading it. See [A Shared Language](/core-concepts/hypercerts-core-data-model) in the Guide for how records fit together.

## Where each definition is used

| Definition | Used by |
|---|---|
| `descriptionString` | `description` on [activity](/lexicons/hypercerts-lexicons/activity-claim), [collection](/lexicons/hypercerts-lexicons/collection), [feature](/lexicons/hypercerts-lexicons/feature), and [attachment](/lexicons/hypercerts-lexicons/attachment); `longDescription` on [organization](/lexicons/certified-lexicons/organization) |
| `uri` | Paired with a blob definition in every file-valued field listed in this table. Also `context` on [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement), where it is the alternative to a strong reference. |
| `smallBlob` | `content` items on [attachment](/lexicons/hypercerts-lexicons/attachment) and [evaluation](/lexicons/hypercerts-lexicons/evaluation); `attachment` on [rights](/lexicons/hypercerts-lexicons/rights); `location` on [location](/lexicons/certified-lexicons/location); `referenceDocument` on [vocabulary tag](/lexicons/hypercerts-lexicons/vocabulary-tag) and [work-scope tag](/lexicons/hypercerts-lexicons/work-scope) |
| `smallImage` | `image` on [activity](/lexicons/hypercerts-lexicons/activity-claim) and [contributor information](/lexicons/hypercerts-lexicons/contribution); `avatar` on [collection](/lexicons/hypercerts-lexicons/collection) and [profile](/lexicons/certified-lexicons/profile) |
| `largeImage` | `banner` on [collection](/lexicons/hypercerts-lexicons/collection) and [profile](/lexicons/certified-lexicons/profile) |
| `smallVideo` | Not currently used by the Hypercerts or Certified lexicons |
| `largeBlob` | Not currently used by any lexicon |

## Schema

{% lexicon-schema nsid="org.hypercerts.defs" /%}

## Examples

When one of these objects appears as a union member, it carries `$type` set to `org.hypercerts.defs#` followed by the definition name. The examples below show the object as it appears inside a record.

### Inline description

A `descriptionString` with a link facet. Facet offsets are byte positions in the UTF-8 encoding of `value`, here covering the words "maintenance plan":

```json
{
  "$type": "org.hypercerts.defs#descriptionString",
  "value": "Phase 1 covers design, permits, and installation. Ongoing upkeep is described in the maintenance plan.",
  "facets": [
    {
      "index": { "byteStart": 85, "byteEnd": 101 },
      "features": [
        {
          "$type": "app.bsky.richtext.facet#link",
          "uri": "https://villagehallsolar.example.org/maintenance-plan"
        }
      ]
    }
  ]
}
```

### External link

A `uri` pointing to a report hosted elsewhere:

```json
{
  "$type": "org.hypercerts.defs#uri",
  "uri": "https://villagehallsolar.example.org/reports/phase-1.pdf"
}
```

### Uploaded file

A `smallBlob` holding a PDF uploaded to the publisher's repository. The `blob` value is the reference returned when the file was uploaded:

```json
{
  "$type": "org.hypercerts.defs#smallBlob",
  "blob": {
    "$type": "blob",
    "ref": { "$link": "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku" },
    "mimeType": "application/pdf",
    "size": 2418762
  }
}
```

### Uploaded image

A `smallImage`, as used for an activity's `image` or a collection's `avatar`. The property is named `image`, not `blob`:

```json
{
  "$type": "org.hypercerts.defs#smallImage",
  "image": {
    "$type": "blob",
    "ref": { "$link": "bafkreibme22gw2h7y2h7tg2fhqotaqjucnbc24deqo72b6mkl2egezxhvy" },
    "mimeType": "image/jpeg",
    "size": 842113
  }
}
```

## Rules and best practices

- **Include `$type` on every union member.** Readers use it to tell which definition a value follows. A union value without it fails validation.
- **Upload when content must stay fixed; link when it can't be uploaded.** A blob is stored in the publisher's repository and addressed by its content hash, so the record's CID commits to the exact bytes. A `uri` can point anywhere, and the content there can change or disappear without the record changing. Applications can show readers which kind they are looking at.
- **Check the size limits before uploading.** `smallImage` accepts up to 5 MB, `smallBlob` and `largeImage` up to 10 MB, and `smallVideo` up to 20 MB. "Small" and "large" are relative within each family: a large image has the same limit as a small generic blob. For bigger files, use a `uri`.
- **Use one of the accepted image types.** The image definitions accept JPEG, PNG, and WebP. SVG is not accepted. Both `image/jpeg` and `image/jpg` appear in the accept list; use `image/jpeg` when uploading, and treat the two as the same type when reading.
- **Don't trust the declared MIME type.** `mimeType` is what the uploader declared, not a property of the bytes. Applications typically check content before rendering it.
- **Write descriptions that read well as plain text or markdown.** `descriptionString` allows plain text or markdown, and nothing in the record says which. Keep markup light so the text reads well either way, or follow the convention of the applications you publish for.
- **Compute facet offsets in bytes.** Facet ranges are UTF-8 byte offsets, not character or UTF-16 positions. Offsets computed from native string indices drift as soon as the text contains non-ASCII characters such as accented letters or emoji.
- **Prefer the inline description.** In the description unions, `descriptionString` needs no external lexicon and no extra fetch, so it is the variant applications are most likely to display. Keep a short description on the record as well where the record type has one.

## Related

- [Attachment](/lexicons/hypercerts-lexicons/attachment): the main user of `uri` and `smallBlob` for evidence.
- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) and [Collection](/lexicons/hypercerts-lexicons/collection): users of `descriptionString` and the image definitions.
- [Certified shared definitions](/lexicons/certified-lexicons/shared-defs): the equivalent shared definitions for `app.certified` lexicons.
- Guide: [A Shared Language](/core-concepts/hypercerts-core-data-model), [Evidence and Measurements](/core-concepts/evidence-and-measurements).
