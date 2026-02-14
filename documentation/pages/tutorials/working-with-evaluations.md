---
title: Working with Evaluations
description: Learn how to evaluate hypercerts and build trust in the ecosystem.
---

# Working with Evaluations

Evaluations are third-party assessments of hypercerts and other claims. They live on the evaluator's own PDS, not embedded in the original claim, and accumulate over time as different actors provide their perspectives.

## Create an evaluation

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

const session = await sdk.restoreSession("did:plc:abc123...");
const repo = sdk.getRepository(session);

// Create an evaluation of an activity claim
const evaluation = await repo.evaluations.create({
  subject: {
    uri: "at://did:plc:xyz789/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a",
    cid: "bafyreib2rxk3rh6kzwq...",
  },
  evaluators: ["did:plc:evaluator123"],
  summary: "Verified documentation updates. All 15 examples tested and working. High quality contribution with clear impact on developer experience.",
  createdAt: new Date().toISOString(),
});

console.log(evaluation);
```

The `subject` field is a strong reference (URI + CID) to the claim being evaluated. The `evaluators` array contains DIDs of those conducting the assessment.

## Add measurements

Measurements provide quantitative data that supports your evaluation:

```typescript
const measurement = await repo.measurements.create({
  activity: {
    uri: "at://did:plc:xyz789/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a",
    cid: "bafyreib2rxk3rh6kzwq...",
  },
  measurers: ["did:plc:evaluator123"],
  metric: "Documentation page views",
  value: "12500",
  measurementMethodType: "analytics",
  measurementMethodURI: "https://example.com/analytics-methodology",
  evidenceURI: ["https://example.com/analytics-report.pdf"],
  createdAt: new Date().toISOString(),
});
```

You can then reference this measurement in your evaluation's `evaluations` array to link quantitative evidence to your assessment.

## Evaluation patterns

**Expert review:** Domain experts assess technical quality, methodology, and impact. Their DID becomes a portable credential—other projects can discover and trust evaluations from recognized experts.

**Community assessment:** Multiple stakeholders provide independent evaluations. The diversity of evaluator DIDs creates a richer signal than any single assessment.

**Automated evaluation:** Scripts and bots can publish evaluations based on on-chain data, API metrics, or other programmatic checks. The evaluator DID identifies the automation system and its operator.

## Trust and reputation

Every evaluation is signed by its creator's DID, creating accountability. Unlike anonymous reviews, evaluators build portable reputation across the ecosystem. A DID with a history of rigorous, accurate evaluations becomes a trusted signal. Projects can filter evaluations by evaluator identity, weight them differently, or build custom trust graphs based on their values and domain expertise.

{% callout type="note" %}
Evaluations are append-only. You can't delete someone else's evaluation of your work, and they can't delete yours. This creates a permanent, multi-perspective record of how claims are assessed over time.
{% /callout %}
