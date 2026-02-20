---
title: Collection
---

# Collection

## Description

A collection groups multiple items — activity claims and/or other collections — into a project or portfolio. Collections support recursive nesting, so a collection can contain other collections.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.collection`

**Key:** `tid`

| Property           | Type     | Required | Description                                                                      | Comments                                                                                      |
| ------------------ | -------- | -------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `type`             | `string` | ❌        | The type of this collection (e.g. `favorites`, `project`, or any other type)     |                                                                                               |
| `title`            | `string` | ✅        | The title of this collection                                                     | Max 80 graphemes.                                                                             |
| `shortDescription` | `string` | ❌        | Short summary of this collection, suitable for previews and list views           | Max 300 graphemes.                                                                            |
| `description`      | `ref`    | ❌        | Rich-text description, represented as a Leaflet linear document                  | References `pub.leaflet.pages.linearDocument#main`.                                           |
| `avatar`           | `union`  | ❌        | The collection's avatar/profile image as a URI or image blob                     |                                                                                               |
| `banner`           | `union`  | ❌        | Larger horizontal image to display behind the collection view                    |                                                                                               |
| `items`            | `array`  | ✅        | Array of items in this collection with optional weights                          | Each item is an `#item` object. See [Item](#item-object) below.                               |
| `location`         | `ref`    | ❌        | A strong reference to the location where the collection's activities were performed | Referenced record must conform to `app.certified.location`.                                |
| `createdAt`        | `string` | ✅        | Client-declared timestamp when this record was originally created                |                                                                                               |

### Item object

Each entry in the `items` array has this structure:

| Property         | Type     | Required | Description                                                                                                                                                   |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `itemIdentifier` | `ref`    | ✅        | Strong reference to an item in this collection. Items can be activity claims (`org.hypercerts.claim.activity`) or other collections (`org.hypercerts.claim.collection`). |
| `itemWeight`     | `string` | ❌        | Optional weight for this item (positive numeric value stored as string). Weights don't need to sum to a specific total — normalization is up to the consuming app. |

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create a collection record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.collection',
  record: {
    // Title of the collection
    title: 'Q1 2025 Open Source Contributions',
    // Short description of the collection
    shortDescription: 'All open source maintenance work in Q1 2025',
    // Array of items with optional weights
    items: [
      {
        itemIdentifier: {
          uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/tid1',
          cid: 'bafyrei...',
        },
        itemWeight: '50',
      },
      {
        itemIdentifier: {
          uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/tid2',
          cid: 'bafyrei...',
        },
        itemWeight: '50',
      },
    ],
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
