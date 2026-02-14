---
title: Collection
---

# Collection

## Description

A collection/group of hypercerts that have a specific property.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.collection`

**Key:** `tid`

| Property           | Type     | Required | Description                                                             | Comments                          |
| ------------------ | -------- | -------- | ----------------------------------------------------------------------- | --------------------------------- |
| `title`            | `string` | ✅        | The title of this collection                                            |                                   |
| `shortDescription` | `string` | ❌        | A short description of this collection                                  |                                   |
| `coverPhoto`       | `union`  | ❌        | The cover photo of this collection (either in URI format or in a blob). |                                   |
| `claims`           | `array`  | ✅        | Array of claims with their associated weights in this collection        | Each item references `#claimItem` |
| `createdAt`        | `string` | ✅        | Client-declared timestamp when this record was originally created       |                                   |

**Defs**

**claimItem**

| Property | Type     | Required | Description                                                                                                                                                                                                  | Comments |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `claim`  | `ref`    | ✅        | A strong reference to a hypercert claim record. This claim must conform to the lexicon org.hypercerts.claim.activity                                                                                         |          |
| `weight` | `string` | ✅        | The weight/importance of this hypercert claim in the collection (a percentage from 0-100, stored as a string to avoid float precision issues). The total claim weights should add up to 100. |          |

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
    // Array of claims with their associated weights
    claims: [
      {
        claim: {
          uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/tid1',
          cid: 'bafyrei...',
        },
        weight: '50',
      },
      {
        claim: {
          uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/tid2',
          cid: 'bafyrei...',
        },
        weight: '50',
      },
    ],
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
