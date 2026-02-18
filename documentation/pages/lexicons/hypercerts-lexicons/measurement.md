---
title: Measurement
---

# Measurement

## Description

A measurement is a quantitative observation that can be attached to any claim in the hypercerts graph — an activity, outcome, evaluation, or even another measurement. Measurements are designed to make structured data reusable across actors and applications, while not implying causality, attribution, or a single "true" interpretation.

At their core, measurements capture what was measured, the value, the unit, and the time range of the observation. They can optionally include who produced the data (measurers), how it was produced (method type + URI), supporting resources, and location information.

Measurements provide inputs for analysis and later evaluation. They help ground discussion in observable signals, but leave judgment — how to interpret the data, what it means, and what it implies for funding or recognition — to plural evaluations and domain-specific frameworks.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.measurement`

**Key:** `tid`

| Property        | Type     | Required | Description                                                                                    | Comments                                                                                              |
| --------------- | -------- | -------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `subject`       | `ref`    | ❌        | A strong reference to the record this measurement refers to (e.g. an activity, project, or claim) |                                                                                                       |
| `metric`        | `string` | ✅        | The metric being measured, e.g. forest area restored, number of users                          | Max 500 characters.                                                                                   |
| `unit`          | `string` | ✅        | The unit of the measured value (e.g. kg CO₂e, hectares, %, index score)                        | Max 50 characters.                                                                                    |
| `value`         | `string` | ✅        | The measured numeric value                                                                     | Max 500 characters.                                                                                   |
| `startDate`     | `string` | ❌        | When the measurement began                                                                     | Format: `datetime` (ISO 8601).                                                                        |
| `endDate`       | `string` | ❌        | When the measurement ended. If it was a one-time measurement, should equal `startDate`.        | Format: `datetime` (ISO 8601).                                                                        |
| `locations`     | `array`  | ❌        | Geographic references related to where the measurement was taken                               | Each item is a strong reference. Referenced records must conform to `app.certified.location`. Max 100. |
| `methodType`    | `string` | ❌        | Short identifier for the measurement methodology                                               | Max 30 characters.                                                                                    |
| `methodURI`     | `string` | ❌        | URI to methodology documentation, standard protocol, or measurement procedure                  | Format: `uri`.                                                                                        |
| `evidenceURI`   | `array`  | ❌        | URIs to related evidence or underlying data                                                    | Each item is a URI string. Max 50.                                                                    |
| `measurers`     | `array`  | ❌        | DIDs of the entity (or entities) that measured this data                                       | Max 100 items.                                                                                        |
| `comment`       | `string` | ❌        | Short comment, suitable for previews and list views                                            | Max 300 graphemes. Rich text annotations via `commentFacets`.                                         |
| `commentFacets` | `array`  | ❌        | Rich text annotations for `comment` (mentions, URLs, hashtags)                                 | Each item is an `app.bsky.richtext.facet`.                                                            |
| `createdAt`     | `string` | ✅        | Client-declared timestamp when this record was originally created                              |                                                                                                       |

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create a measurement record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.measurement',
  record: {
    // Strong reference to the activity this measurement is for
    subject: {
      uri: 'at://did:plc:abc123/org.hypercerts.claim.activity/tid123',
      cid: 'bafyrei...',
    },
    // The metric being measured
    metric: 'issues-resolved',
    // Unit of measurement
    unit: 'count',
    // The measured value
    value: '142',
    // Short identifier for the measurement methodology
    methodType: 'automated-count',
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
