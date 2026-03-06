---
title: Creating Your First Hypercert
description: Create a hypercert using TypeScript and the ATProto API.
---

# Creating Your First Hypercert

This guide walks through creating a complete hypercert using code. Make sure you've completed the [setup steps](/getting-started/quickstart) first. Prefer a UI? See [Using the Scaffold App](/getting-started/using-the-scaffold-app).

## Create the activity claim

The activity claim is the core record — it describes what work was done, when, and in what scope. Here's how each field maps to the [activity lexicon](/lexicons/hypercerts-lexicons/activity-claim):

- **Contributors** are embedded directly in the activity claim as a `contributors` array. Each entry has a `contributorIdentity` (inline DID string, or a strong reference to a [`contributorInformation`](/lexicons/hypercerts-lexicons/contribution) record), an optional `contributionWeight`, and an optional `contributionDetails` (inline role string, or a strong reference to an [`org.hypercerts.claim.contribution`](/lexicons/hypercerts-lexicons/contribution) record for richer detail).
- **Work scopes** can be a simple free-form string (`{ scope: "Documentation" }`) or a structured [CEL expression](/core-concepts/work-scopes) for machine-evaluable queries across the network.
- **Time** is expressed as `startDate` and `endDate` in ISO 8601 format.
- **Locations** are separate [`app.certified.location`](/lexicons/certified-lexicons/location) records referenced from the activity claim. They support coordinates, GeoJSON, and other formats.

```typescript
const result = await agent.com.atproto.repo.createRecord({
  repo: agent.did,
  collection: "org.hypercerts.claim.activity",
  record: {
    $type: "org.hypercerts.claim.activity",
    title: "NumPy documentation maintenance, Q1 2026",
    shortDescription: "Updated API docs and fixed 15 broken examples.",
    description: "Created 12 new documentation pages covering quickstart, use cases, evaluations, and architecture. Migrated from GitBook to a custom Next.js + Markdoc site.",
    workScope: {
      $type: "org.hypercerts.claim.activity#workScopeString",
      scope: "Documentation",
    },
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    createdAt: new Date().toISOString(),
  },
});

console.log(result.data.uri);
// → at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a

console.log(result.data.cid);
// → bafyreiabc123...
```

Each AT-URI is a permanent, globally unique identifier. Other records (evaluations, attachments, measurements) reference your hypercert using its URI. The CID is a content hash that makes references tamper-evident. Save both — you'll need them to link other records to this hypercert. See the [Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) for the complete schema.

## Add contributions

Contributors are embedded directly in the activity claim's `contributors` array. Each entry uses inline identity and role objects:

```typescript
const result = await agent.com.atproto.repo.createRecord({
  repo: agent.did,
  collection: "org.hypercerts.claim.activity",
  record: {
    $type: "org.hypercerts.claim.activity",
    title: "NumPy documentation maintenance, Q1 2026",
    shortDescription: "Updated API docs and fixed 15 broken examples.",
    workScope: {
      $type: "org.hypercerts.claim.activity#workScopeString",
      scope: "Documentation",
    },
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    contributors: [
      {
        contributorIdentity: {
          $type: "org.hypercerts.claim.activity#contributorIdentity",
          identity: "did:plc:alice123",
        },
        contributionWeight: "70",
        contributionDetails: {
          $type: "org.hypercerts.claim.activity#contributorRole",
          role: "Lead author",
        },
      },
      {
        contributorIdentity: {
          $type: "org.hypercerts.claim.activity#contributorIdentity",
          identity: "did:plc:bob456",
        },
        contributionWeight: "30",
        contributionDetails: {
          $type: "org.hypercerts.claim.activity#contributorRole",
          role: "Technical reviewer",
        },
      },
    ],
    createdAt: new Date().toISOString(),
  },
});
```

Each contributor entry has:
- `contributorIdentity` — inline `#contributorIdentity` with a DID string, or a strong reference to an `org.hypercerts.claim.contributorInformation` record
- `contributionWeight` — relative weight as a string (weights don't need to sum to 100)
- `contributionDetails` — inline `#contributorRole` with a role string, or a strong reference to an `org.hypercerts.claim.contribution` record for richer detail

## Attach supporting documentation

Attachments link supporting documents, reports, or URLs to any record. Create an attachment record that references the hypercert:

```typescript
await agent.com.atproto.repo.createRecord({
  repo: agent.did,
  collection: "org.hypercerts.context.attachment",
  record: {
    $type: "org.hypercerts.context.attachment",
    subjects: [{ uri: result.data.uri, cid: result.data.cid }],
    title: "Documentation site repository",
    shortDescription: "Source code and content for the Hypercerts Protocol documentation.",
    content: [
      {
        $type: "org.hypercerts.defs#uri",
        uri: "https://github.com/hypercerts-org/hypercerts-atproto-documentation",
      },
    ],
    createdAt: new Date().toISOString(),
  },
});
```

The `subjects` field is an array of strong references (AT-URI + CID). The `content` field is an array of `org.hypercerts.defs#uri` objects (for URLs) or `org.hypercerts.defs#smallBlob` objects (for file uploads). You can create multiple attachment records — one for the repo, one for the deployed site, one for a methodology document, etc.

## Add a measurement

Measurements record quantitative data about the work. Create a measurement record that references the hypercert:

```typescript
await agent.com.atproto.repo.createRecord({
  repo: agent.did,
  collection: "org.hypercerts.context.measurement",
  record: {
    $type: "org.hypercerts.context.measurement",
    subjects: [{ uri: result.data.uri, cid: result.data.cid }],
    metric: "Documentation pages written",
    value: "12",
    unit: "pages",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    methodType: "manual-count",
    createdAt: new Date().toISOString(),
  },
});
```

Required fields are `metric`, `value`, and `unit`. The `subjects` array links the measurement to your hypercert via strong references. You can attach multiple measurements to the same hypercert — one per metric.

## Add an evaluation

Evaluations are third-party assessments of the work. They reference the hypercert via a single `subject` strong reference and are typically created by someone other than the hypercert author:

```typescript
await agent.com.atproto.repo.createRecord({
  repo: agent.did,
  collection: "org.hypercerts.context.evaluation",
  record: {
    $type: "org.hypercerts.context.evaluation",
    subject: { uri: result.data.uri, cid: result.data.cid },
    evaluators: [{ did: "did:plc:ragtjsm2j2vknwkz3zp4oxrd" }],
    summary: "High-quality documentation with clear examples and thorough coverage.",
    score: { min: 1, max: 5, value: 4 },
    content: [
      {
        $type: "org.hypercerts.defs#uri",
        uri: "https://example.com/evaluation-report.pdf",
      },
    ],
    createdAt: new Date().toISOString(),
  },
});
```

Required fields are `evaluators`, `summary`, and `createdAt`. Unlike attachments and measurements, `subject` is a single strong reference (not an array). The optional `score` object takes integer `min`, `max`, and `value` fields.

## What you've built

Your hypercert now has a complete structure:

```text
Activity Claim (the core record)
├── contributors[] (embedded)
│   ├── Alice — identity: did:plc:alice123, weight: 70, role: Lead author
│   └── Bob   — identity: did:plc:bob456,  weight: 30, role: Technical reviewer
├── Attachment: GitHub repository link  ← strong reference (AT-URI + CID)
├── Measurement: 12 pages written       ← strong reference (AT-URI + CID)
└── Evaluation: "High-quality documentation" (by Carol)  ← strong reference (AT-URI + CID)
```

Contributors live inside the activity claim record itself. External records — attachments, measurements, evaluations — link to the activity claim via **strong references** (AT-URI + CID). The CID is a content hash: if the referenced record changes, the hash won't match, making the entire structure tamper-evident.

This is the same pattern described in the [Core Data Model](/core-concepts/hypercerts-core-data-model#how-records-connect). As the hypercert grows over time, third parties can add measurements, evaluations, and more attachments — each as a separate record referencing your activity claim.
