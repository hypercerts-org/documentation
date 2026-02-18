---
title: Evaluation
---

# Evaluation

## Description

An evaluation of a hypercert or other claim.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.evaluation`

**Key:** `tid`

| Property       | Type     | Required | Description                                                                         | Comments                                                                                           |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `subject`      | `ref`    | ❌        | A strong reference to what is being evaluated (e.g. activity, measurement, contribution) |                                                                                                    |
| `evaluators`   | `array`  | ✅        | DIDs of the evaluators                                                              | Max 1000 items.                                                                                    |
| `content`      | `array`  | ❌        | Evaluation data (URIs or blobs) containing detailed reports or methodology          | Each item is a URI or blob. Max 100.                                                               |
| `measurements` | `array`  | ❌        | References to measurements that contributed to this evaluation                      | Each item is a strong reference. Referenced records must conform to `org.hypercerts.claim.measurement`. Max 100. |
| `summary`      | `string` | ✅        | Brief evaluation summary                                                            | Max 1000 graphemes.                                                                                |
| `score`        | `ref`    | ❌        | Optional overall score for this evaluation on a numeric scale                       | See [Score](#score-object) below.                                                                  |
| `location`     | `ref`    | ❌        | An optional reference for georeferenced evaluations                                 | Referenced record must conform to `app.certified.location`.                                        |
| `createdAt`    | `string` | ✅        | Client-declared timestamp when this record was originally created                   |                                                                                                    |

### Score object

| Property | Type      | Required | Description                                          |
| -------- | --------- | -------- | ---------------------------------------------------- |
| `min`    | `integer` | ✅        | Minimum value of the scale, e.g. 0 or 1              |
| `max`    | `integer` | ✅        | Maximum value of the scale, e.g. 5 or 10             |
| `value`  | `integer` | ✅        | Score within the inclusive range [`min`, `max`]       |

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
    // Optional numeric score
    score: {
      min: 1,
      max: 5,
      value: 4,
    },
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
