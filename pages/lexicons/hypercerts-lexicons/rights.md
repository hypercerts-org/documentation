---
title: Rights
---

# Rights

## Description

Describes the rights that a user has to the hypercert, such as whether it can be sold, transferred, and under what conditions.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.rights`

**Key:** `tid`

**Properties**

| Property            | Type     | Required | Description                                                       | Comments    |
| ------------------- | -------- | -------- | ----------------------------------------------------------------- | ----------- |
| `rightsName`        | `string` | ✅        | Full name of the rights                                           |             |
| `rightsType`        | `string` | ✅        | Short rights identifier for easier search                         |             |
| `rightsDescription` | `string` | ✅        | Description of the rights of this hypercert                       |             |
| `attachment`        | `union`  | ❌        | An attachment to define the rights further, e.g. a legal document | URI or blob |
| `createdAt`         | `string` | ✅        | Client-declared timestamp when this record was originally created |             |

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create a rights record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.rights',
  record: {
    // Full name of the rights
    rightsName: 'Public Display',
    // Short rights identifier for easier search
    rightsType: 'display',
    // Description of the rights
    rightsDescription: 'Right to publicly display this hypercert as proof of contribution',
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
