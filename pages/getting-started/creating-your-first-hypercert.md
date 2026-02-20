---
title: Creating Your First Hypercert
description: A step-by-step guide to creating a complete hypercert with contributions and attachments.
---

# Creating Your First Hypercert

The [Quickstart](/getting-started/quickstart) shows how to create a minimal hypercert in one code block. This tutorial goes deeper — you'll create a complete hypercert with contributions and attachments.

We'll document a real scenario: a team that wrote documentation for the Hypercerts Protocol in Q1 2026.

## Set up

Assumes you've completed the [Quickstart](/getting-started/quickstart). You need an authenticated SDK session:

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

const session = await sdk.callback(callbackParams);
const repo = sdk.getRepository(session);
```

## Create the activity claim

The activity claim is the core record — it describes what work was done, when, and in what scope.

```typescript
const result = await repo.hypercerts.create({
  title: "Hypercerts Protocol documentation, Q1 2026",
  shortDescription: "Wrote getting started guides, tutorials, and lexicon reference pages.",
  description: "Created 12 new documentation pages covering quickstart, SDK setup, use cases, evaluations, and architecture. Migrated from GitBook to a custom Next.js + Markdoc site.",
  workScope: "Documentation, Hypercerts Protocol",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});

console.log(result.hypercertUri);
// → at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

Save the `hypercertUri` and `hypercertCid` from the response — you'll need them to link other records to this hypercert.

## Add contributions

You can include contributors directly in the `create()` call. Here's the same hypercert, now with two contributors:

```typescript
const result = await repo.hypercerts.create({
  title: "Hypercerts Protocol documentation, Q1 2026",
  shortDescription: "Wrote getting started guides, tutorials, and lexicon reference pages.",
  description: "Created 12 new documentation pages covering quickstart, SDK setup, use cases, evaluations, and architecture.",
  workScope: "Documentation, Hypercerts Protocol",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  contributions: [
    {
      contributors: ["did:plc:alice123"],
      contributionDetails: "Lead author",
      weight: "70",
    },
    {
      contributors: ["did:plc:bob456"],
      contributionDetails: "Technical reviewer",
      weight: "30",
    },
  ],
});
```

Each contribution has:
- `contributors` — an array of DIDs (or strong references to `contributorInformation` records for richer profiles)
- `contributionDetails` — a role string (or a `CreateContributionDetailsParams` object for structured details with role, description, and timeframe)
- `weight` — relative weight of this contribution (weights don't need to sum to 100)

You can also add contributors to an existing hypercert after creation:

```typescript
await repo.hypercerts.addContribution({
  hypercertUri: result.hypercertUri,
  contributors: ["did:plc:carol789"],
  contributionDetails: "Editor",
  weight: "20",
});
```

## Attach supporting documentation

Attachments link supporting documents, reports, or URLs to any record. Use `addAttachment()` on the repository:

```typescript
await repo.hypercerts.addAttachment({
  subjects: result.hypercertUri,
  title: "Documentation site repository",
  content: "https://github.com/hypercerts-org/hypercerts-atproto-documentation",
  shortDescription: "Source code and content for the Hypercerts Protocol documentation.",
});
```

The `subjects` field accepts a single AT-URI, a strong reference, or an array of either. The `content` field accepts a URL string, a `Blob` for file uploads, or an array of both.

You can create multiple attachment records — one for the repo, one for the deployed site, one for the migration plan, etc.

## What you've built

Your hypercert now has a complete structure:

```text
Activity Claim (the core record)
├── Contribution: Alice (did:plc:alice123), Lead author, weight 70
├── Contribution: Bob (did:plc:bob456), Technical reviewer, weight 30
└── Attachment: GitHub repository
```

Every arrow in this tree is a **strong reference** (AT-URI + CID). The CID is a content hash — if a referenced record changes, the hash won't match, making the entire structure tamper-evident. Anyone can verify the chain and discover the contributions and attachments linked to your hypercert by following these references.

This is the same pattern described in the [Core Data Model](/core-concepts/hypercerts-core-data-model#how-records-connect). As the hypercert grows over time, third parties can add measurements, evaluations, and more attachments — each as a separate record referencing your activity claim.

## Next steps

Third parties can now [evaluate your hypercert](/getting-started/working-with-evaluations) by creating evaluation records and measurements on their own PDS.
