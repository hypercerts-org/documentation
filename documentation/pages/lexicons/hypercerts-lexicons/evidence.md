---
title: Evidence
---

# Evidence

## Description

A piece of evidence supporting a hypercert claim.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.evidence`

| Property           | Type     | Required | Description                                                                | Comments                                                                            |
| ------------------ | -------- | -------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `activity`         | `ref`    | ❌        | A strong reference to the activity this evidence is for                    | The record referenced must conform with the lexicon `org.hypercerts.claim.activity` |
| `content`          | `union`  | ✅        | A piece of evidence (URI or blobs) supporting a hypercert claim            |                                                                                     |
| `title`            | `string` | ✅        | Title to describe the nature of the evidence                               |                                                                                     |
| `shortDescription` | `string` | ❌        | Short description explaining what this evidence demonstrates or proves     |                                                                                     |
| `description`      | `string` | ❌        | Optional longer description describing the impact claim evidence.          |                                                                                     |
| `createdAt`        | `string` | ✅        | Client-declared timestamp when this hypercert claim was originally created |                                                                                     |

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create an evidence record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.evidence',
  record: {
    // Title describing the nature of the evidence
    title: 'GitHub Repository',
    // Short description of what this evidence demonstrates
    shortDescription: 'Source code repository for the maintained library',
    // Evidence content (URI or blob)
    content: {
      $type: 'org.hypercerts.defs#uri',
      uri: 'https://github.com/example/library',
    },
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
