---
title: Contribution
---

# Contribution

## Description

Contributions are represented through two separate lexicons that work together with the activity claim's `contributors` array:

- **Contributor Information** (`org.hypercerts.claim.contributorInformation`) — stores identity and display details for a contributor.
- **Contribution Details** (`org.hypercerts.claim.contributionDetails`) — stores the role, description, and timeframe of a specific contribution.

The activity claim embeds contributors inline via its `contributors` array. Each entry can reference these records via strong references, or use inline strings for simpler cases. See the [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) page for the `#contributor` object structure.

---

## Contributor Information

**Lexicon ID:** `org.hypercerts.claim.contributorInformation`

**Key:** `tid`

| Property      | Type     | Required | Description                                                    | Comments                  |
| ------------- | -------- | -------- | -------------------------------------------------------------- | ------------------------- |
| `identifier`  | `string` | ❌        | DID or a URI to a social profile of the contributor            |                           |
| `displayName` | `string` | ❌        | Display name of the contributor                                | Max 100 characters.       |
| `image`       | `union`  | ❌        | The contributor's visual representation as a URI or image blob |                           |
| `createdAt`   | `string` | ✅        | Client-declared timestamp when this record was originally created |                        |

---

## Contribution Details

**Lexicon ID:** `org.hypercerts.claim.contributionDetails`

**Key:** `tid`

| Property                  | Type     | Required | Description                                                                              | Comments                          |
| ------------------------- | -------- | -------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| `role`                    | `string` | ❌        | Role or title of the contributor                                                         | Max 100 characters.               |
| `contributionDescription` | `string` | ❌        | What the contribution concretely was                                                     | Max 1000 graphemes.               |
| `startDate`               | `string` | ❌        | When this contribution started. Should be a subset of the hypercert timeframe.           | Format: `datetime` (ISO 8601).    |
| `endDate`                 | `string` | ❌        | When this contribution finished. Should be a subset of the hypercert timeframe.          | Format: `datetime` (ISO 8601).    |
| `createdAt`               | `string` | ✅        | Client-declared timestamp when this record was originally created                        |                                   |

---

## Code Example

{% callout type="note" %}
This example uses the low-level `@atproto/api` with app passwords for brevity. For production, use OAuth — see the [Quickstart](/getting-started/quickstart) and [SDK reference](/tools/sdk).
{% /callout %}

Create a contributor information record and a contribution details record, then reference them from an activity claim:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

// Create contributor information
const contributorInfo = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.contributorInformation',
  record: {
    identifier: 'did:plc:abc123',
    displayName: 'Alice',
    createdAt: new Date().toISOString(),
  },
})

// Create contribution details
const contributionDetails = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.contributionDetails',
  record: {
    role: 'Lead developer',
    contributionDescription: 'Led the development of core features',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    createdAt: new Date().toISOString(),
  },
})

// Reference both in an activity claim's contributors array
const activity = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.activity',
  record: {
    title: 'Library maintenance, 2025',
    shortDescription: 'Core library maintenance throughout 2025',
    contributors: [
      {
        contributorIdentity: {
          uri: contributorInfo.data.uri,
          cid: contributorInfo.data.cid,
        },
        contributionWeight: '100',
        contributionDetails: {
          uri: contributionDetails.data.uri,
          cid: contributionDetails.data.cid,
        },
      },
    ],
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', activity.data.uri)
```

For simple cases, you can use inline strings instead of separate records:

```typescript
contributors: [
  {
    contributorIdentity: {
      $type: 'org.hypercerts.claim.activity#contributorIdentity',
      identity: 'did:plc:abc123',
    },
    contributionDetails: {
      $type: 'org.hypercerts.claim.activity#contributorRole',
      role: 'Lead developer',
    },
  },
],
```
