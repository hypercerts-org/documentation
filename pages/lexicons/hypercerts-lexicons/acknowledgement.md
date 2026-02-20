---
title: Acknowledgement
---

# Acknowledgement

## Description

Acknowledges the inclusion of one record (subject) within another (context). Typically created in the subject owner's repo to form a bidirectional link. For example, a contributor acknowledging inclusion in an activity, or an activity owner acknowledging inclusion in a collection.

## Lexicon

**Lexicon ID:** `org.hypercerts.acknowledgement`

**Key:** `tid`

| Property | Type | Required | Description | Comments |
| --- | --- | --- | --- | --- |
| `subject` | `ref` | ✅ | The record whose inclusion is being acknowledged | Strong reference (`com.atproto.repo.strongRef`). E.g. an activity, a contributor information record. |
| `context` | `ref` | ✅ | The record that includes the subject | Strong reference (`com.atproto.repo.strongRef`). E.g. a collection that includes an activity, or an activity that includes a contributor. |
| `acknowledged` | `boolean` | ✅ | Whether inclusion is acknowledged (true) or rejected (false) | |
| `comment` | `string` | ❌ | Optional comment providing additional context or reasoning | Max 1000 characters. |
| `createdAt` | `string` | ✅ | Client-declared timestamp when this record was originally created | Format: `datetime`. |

---

## Code Example

{% callout type="note" %}
This example uses the low-level `@atproto/api` with app passwords for brevity. For production, use OAuth — see the [Quickstart](/getting-started/quickstart) and [SDK reference](/tools/sdk).
{% /callout %}

Acknowledge inclusion in an activity claim:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.acknowledgement',
  record: {
    // The record being acknowledged (e.g. your contributor information)
    subject: {
      uri: 'at://did:plc:alice123/org.hypercerts.claim.contributorInformation/tid456',
      cid: 'bafyrei...',
    },
    // The record that includes it (e.g. the activity claim)
    context: {
      uri: 'at://did:plc:bob789/org.hypercerts.claim.activity/tid123',
      cid: 'bafyrei...',
    },
    // Acknowledge inclusion
    acknowledged: true,
    // Optional comment
    comment: 'Confirming my contribution to this project.',
    // Timestamp
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
