---
title: Creating Your First Hypercert
description: A step-by-step guide to creating a complete hypercert with contributions and attachments.
---

# Creating Your First Hypercert

The [Quickstart](/getting-started/quickstart) shows how to create a minimal hypercert in one code block. This tutorial goes deeper — you'll create a complete hypercert with contributions and attachments.

We'll document a real scenario: a team that wrote documentation for the Hypercerts Protocol in Q1 2026.

## Set up

Assumes you've completed the [Quickstart](/getting-started/quickstart). You need an authenticated ATProto session:

```typescript
import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({ service: "https://bsky.social" });
await agent.login({
  identifier: "your-handle.certified.app",
  password: "your-app-password",
});
```

## Create the activity claim

The activity claim is the core record — it describes what work was done, when, and in what scope. Here's how each field maps to the [activity lexicon](/lexicons/hypercerts-lexicons/activity-claim):

- **Contributors** can be identified inline with a DID or by referencing a [`contributorInformation`](/lexicons/hypercerts-lexicons/activity-claim) record that includes a display name and image. Each contributor can also have a weight and role.
- **Work scopes** can be a simple free-form string (`{ scope: "Documentation" }`) or a structured [CEL expression](/core-concepts/work-scopes) for machine-evaluable queries across the network.
- **Time** is expressed as `startDate` and `endDate` in ISO 8601 format.
- **Locations** are separate [`app.certified.location`](/lexicons/hypercerts-lexicons/activity-claim) records referenced from the activity claim. They support coordinates, GeoJSON, and other formats.

```typescript
const result = await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.activity",
  record: {
    title: "Hypercerts Protocol documentation, Q1 2026",
    shortDescription: "Wrote getting started guides, tutorials, and lexicon reference pages.",
    description: "Created 12 new documentation pages covering quickstart, use cases, evaluations, and architecture. Migrated from GitBook to a custom Next.js + Markdoc site.",
    workScope: { $type: "org.hypercerts.claim.activity#workScopeString", scope: "Documentation, Hypercerts Protocol" },
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    $type: "org.hypercerts.claim.activity",
    createdAt: new Date().toISOString(),
  },
});

console.log(result.data.uri);
// → at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

Save the `uri` and `cid` from the response — you'll need them to link other records to this hypercert.

## Add contributions

You can include contributors directly in the `create()` call. Here's the same hypercert, now with two contributors:

```typescript
const result = await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.activity",
  record: {
    title: "Hypercerts Protocol documentation, Q1 2026",
    shortDescription: "Wrote getting started guides, tutorials, and lexicon reference pages.",
    description: "Created 12 new documentation pages covering quickstart, use cases, evaluations, and architecture.",
    workScope: { $type: "org.hypercerts.claim.activity#workScopeString", scope: "Documentation, Hypercerts Protocol" },
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    $type: "org.hypercerts.claim.activity",
    createdAt: new Date().toISOString(),
  },
});

// Add contributions as separate records
await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.contribution",
  record: {
    subject: { uri: result.data.uri, cid: result.data.cid },
    contributors: ["did:plc:alice123"],
    contributionDetails: "Lead author",
    weight: "70",
    $type: "org.hypercerts.claim.contribution",
    createdAt: new Date().toISOString(),
  },
});

await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.contribution",
  record: {
    subject: { uri: result.data.uri, cid: result.data.cid },
    contributors: ["did:plc:bob456"],
    contributionDetails: "Technical reviewer",
    weight: "30",
    $type: "org.hypercerts.claim.contribution",
    createdAt: new Date().toISOString(),
  },
});
```

Each contribution has:
- `contributors` — an array of DIDs
- `contributionDetails` — a role description string
- `weight` — relative weight of this contribution (weights don't need to sum to 100)

You can also add contributors to an existing hypercert after creation:

```typescript
await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.contribution",
  record: {
    subject: { uri: result.data.uri, cid: result.data.cid },
    contributors: ["did:plc:carol789"],
    contributionDetails: "Editor",
    weight: "20",
    $type: "org.hypercerts.claim.contribution",
    createdAt: new Date().toISOString(),
  },
});
```

## Attach supporting documentation

Attachments link supporting documents, reports, or URLs to any record. Create an attachment record that references the hypercert:

```typescript
await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.attachment",
  record: {
    subjects: [{ uri: result.data.uri, cid: result.data.cid }],
    title: "Documentation site repository",
    content: "https://github.com/hypercerts-org/hypercerts-atproto-documentation",
    shortDescription: "Source code and content for the Hypercerts Protocol documentation.",
    $type: "org.hypercerts.claim.attachment",
    createdAt: new Date().toISOString(),
  },
});
```

The `subjects` field is an array of strong references (AT-URI + CID). The `content` field accepts a URL string or a blob reference.

You can create multiple attachment records — one for the repo, one for the deployed site, one for the migration plan, etc.

## What you've built

Your hypercert now has a complete structure:

```text
Activity Claim (the core record)
├── Contributor 1
│   ├── ContributorInformation: Alice
│   └── ContributionDetails: Lead author
├── Contributor 2
│   ├── ContributorInformation: Bob
│   └── ContributionDetails: Technical reviewer
├── Attachment: GitHub repository link
├── Measurement: 12 pages written
├── Measurement: 8,500 words
└── Evaluation: "High-quality documentation" (by Carol)
```

Every arrow in this tree is a **strong reference** (AT-URI + CID). The CID is a content hash — if a referenced record changes, the hash won't match, making the entire structure tamper-evident. Anyone can verify the chain and discover the contributions and attachments linked to your hypercert by following these references.

This is the same pattern described in the [Core Data Model](/core-concepts/hypercerts-core-data-model#how-records-connect). As the hypercert grows over time, third parties can add measurements, evaluations, and more attachments — each as a separate record referencing your activity claim.

## Next steps

Third parties can now [evaluate your hypercert](/getting-started/working-with-evaluations) by creating evaluation records and measurements on their own PDS.
