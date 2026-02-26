---
title: Attachment
---

# Attachment

## Description

An attachment providing commentary, context, evidence, or documentary material related to a hypercert record (e.g. an activity, project, claim, or evaluation).

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.attachment`

| Property                  | Type     | Required | Description                                                                                              | Comments                                                                                            |
| ------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `subjects`                | `array`  | ❌        | References to the record(s) this attachment relates to — activity claims, measurements, evaluations, etc. | Each entry is a strong reference (AT-URI + CID). Optional because the attachment can exist before the subject is recorded. Max 100. |
| `contentType`             | `string` | ❌        | The type of attachment, e.g. `report`, `audit`, `evidence`, `testimonial`, `methodology`.                | Max 64 characters.                                                                                  |
| `content`                 | `array`  | ✅        | The files, documents, or external references included in this attachment.                                 | Each item is a URI or blob. Max 100.                                                                |
| `title`                   | `string` | ✅        | Title of this attachment.                                                                                | Max 256 characters.                                                                                 |
| `shortDescription`        | `string` | ❌        | Short summary, suitable for previews and list views.                                                     | Max 300 graphemes. Rich text annotations via `shortDescriptionFacets`.                              |
| `shortDescriptionFacets`  | `array`  | ❌        | Rich text annotations for `shortDescription` (mentions, URLs, hashtags).                                 | Each item is an `app.bsky.richtext.facet`.                                                          |
| `description`             | `string` | ❌        | Optional longer description including context or interpretation.                                         | Max 3000 graphemes. Rich text annotations via `descriptionFacets`.                                  |
| `descriptionFacets`       | `array`  | ❌        | Rich text annotations for `description` (mentions, URLs, hashtags).                                      | Each item is an `app.bsky.richtext.facet`.                                                          |
| `location`                | `ref`    | ❌        | A strong reference to the location where this attachment's subject matter occurred.                       | The referenced record must conform with `app.certified.location`.                                   |
| `createdAt`               | `string` | ✅        | Client-declared timestamp when this record was originally created.                                       | Format: `datetime`.                                                                                 |

## Code Example

{% callout type="note" %}
This example uses the low-level `@atproto/api` with app passwords for brevity. For production, use OAuth — see the [Quickstart](/getting-started/quickstart) and [SDK reference](/tools/sdk).
{% /callout %}

Create an attachment record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.attachment',
  record: {
    // References to the records this attachment relates to
    subjects: [
      {
        uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/3k7',
        cid: 'bafyreib2rxk3rh6kzwq7...',
      },
    ],
    // Type of attachment
    contentType: 'evidence',
    // Title of the attachment
    title: 'GitHub Repository',
    // Short summary
    shortDescription: 'Source code repository for the maintained library',
    // Files or external references (array of URIs or blobs)
    content: [
      {
        $type: 'org.hypercerts.defs#uri',
        uri: 'https://github.com/example/library',
      },
    ],
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
