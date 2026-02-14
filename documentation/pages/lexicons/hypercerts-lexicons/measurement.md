---
title: Measurement
---

# Measurement

## Description

A measurement is a quantitative observation that can be attached to any claim in the hypercerts graph—an activity, outcome, evaluation, or even another measurement. Measurements are designed to make structured data reusable across actors and applications, while not implying causality, attribution, or a single "true" interpretation.

At their core, measurements capture what was measured, the value, the unit, and the time range of the observation. They can optionally include who produced the data (contributors), how it was produced (method type + URI), supporting resources, and location information.

Measurements provide inputs for analysis and later evaluation. They help ground discussion in observable signals, but leave judgment—how to interpret the data, what it means, and what it implies for funding or recognition—to plural evaluations and domain-specific frameworks.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.measurement`

**Description:**

**Key:** `tid`

| Property                | Type     | Required | Description                                                                   | Comments                                                                            |
| ----------------------- | -------- | -------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `activity`              | `ref`    | ❌        | A strong reference to the activity that this measurement is for               | The record referenced must conform with the lexicon `org.hypercerts.claim.activity` |
| `measurers`             | `array`  | ✅        | DIDs of the entity (or entities) that measured this data                      |                                                                                     |
| `metric`                | `string` | ✅        | The metric being measured                                                     |                                                                                     |
| `value`                 | `string` | ✅        | The measured value                                                            |                                                                                     |
| `measurementMethodType` | `string` | ❌        | Short identifier for the measurement methodology                              |                                                                                     |
| `measurementMethodURI`  | `string` | ❌        | URI to methodology documentation, standard protocol, or measurement procedure |                                                                                     |
| `evidenceURI`           | `array`  | ❌        | URIs to supporting evidence or data                                           |                                                                                     |
| `location`              | `ref`    | ❌        | A strong reference to the location where the measurement was taken            | References must conform to `app.certified.location`                                 |
| `createdAt`             | `string` | ✅        | Client-declared timestamp when this record was originally created             |                                                                                     |

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
    // DIDs of the entity that measured this data
    measurers: ['did:plc:measurer1'],
    // The metric being measured
    metric: 'issues-resolved',
    // The measured value
    value: '142',
    // Short identifier for the measurement methodology
    measurementMethodType: 'automated-count',
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
