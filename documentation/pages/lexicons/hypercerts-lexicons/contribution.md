---
title: Contribution
---

# Contribution

## Description

A contribution made toward a hypercert's impact.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.contribution`

**Key:** `any`

| Property       | Type     | Required | Description                                                                                                                                                             | Comments |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `contributors` | `array`  | ✅        | List of the contributors (names, pseudonyms, or DIDs). If multiple contributors are stored in the same hypercertContribution, then they would have the exact same role. |          |
| `createdAt`    | `string` | ✅        | Client-declared timestamp when this record was originally created                                                                                                       |          |
| `role`         | `string` | ❌        | Role or title of the contributor(s).                                                                                                                                    |          |
| `description`  | `string` | ❌        | What the contribution concretely achieved                                                                                                                               |          |
| `startDate`    | `string` | ❌        | When this contribution started. This should be a subset of the hypercert timeframe.                                                                                     |          |
| `endDate`      | `string` | ❌        | When this contribution finished. This should be a subset of the hypercert timeframe.                                                                                    |          |

***

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create a contribution record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.contribution',
  record: {
    // List of contributors (DIDs, names, or pseudonyms)
    contributors: ['did:plc:abc123'],
    // Role or title of the contributor(s)
    role: 'lead-developer',
    // What the contribution concretely achieved
    description: 'Led the development of core features',
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
