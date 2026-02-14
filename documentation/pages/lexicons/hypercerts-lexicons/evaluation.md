---
title: Evaluation
---

# Evaluation

## Description

An evaluation of a hypercert or other claim.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.evaluation`

**Key:** `tid`

| Property      | Type     | Required | Description                                                                | Comments                                            |
| ------------- | -------- | -------- | -------------------------------------------------------------------------- | --------------------------------------------------- |
| `subject`     | `ref`    | ✅        | A strong reference to the evaluated claim                                  | (e.g measurement, hypercert, contribution, etc)     |
| `evaluators`  | `array`  | ✅        | DIDs of the evaluators                                                     |                                                     |
| `evaluations` | `array`  | ❌        | Evaluation data (URIs or blobs) containing detailed reports or methodology |                                                     |
| `summary`     | `string` | ✅        | Brief evaluation summary                                                   |                                                     |
| `location`    | `ref`    | ❌        | An optional reference for georeferenced evaluations                        | References must conform to `app.certified.location` |
| `createdAt`   | `string` | ✅        | Client-declared timestamp when this record was originally created          |                                                     |

***

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create an evaluation record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.evaluation',
  record: {
    // Strong reference to the evaluated claim
    subject: {
      uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/tid123',
      cid: 'bafyrei...',
    },
    // DIDs of the evaluators
    evaluators: ['did:plc:evaluator1'],
    // Brief evaluation summary
    summary: 'High-quality maintenance work with consistent release cadence',
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
