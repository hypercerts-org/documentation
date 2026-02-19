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
const hypercert = await repo.hypercerts.create({
  title: "Hypercerts Protocol documentation, Q1 2026",
  shortDescription: "Wrote getting started guides, tutorials, and lexicon reference pages.",
  description: "Created 12 new documentation pages covering quickstart, SDK setup, use cases, evaluations, and architecture. Migrated from GitBook to a custom Next.js + Markdoc site.",
  workScope: "Documentation, Hypercerts Protocol",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T23:59:59Z",
  rights: {
    rightsName: "Public Display",
    rightsType: "display",
    rightsDescription: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});

console.log(hypercert.uri);
// → at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

Save the `uri` and `cid` from the response — you'll need them to link other records to this hypercert.

## Add contributions

Contributors are embedded directly in the activity claim's `contributors` array. Here's the same create call from above, now with contributors included (in practice you'd include contributors in a single create call — we split it here for readability):

```typescript
const hypercert = await repo.hypercerts.create({
  title: "Hypercerts Protocol documentation, Q1 2026",
  shortDescription: "Wrote getting started guides, tutorials, and lexicon reference pages.",
  workScope: "Documentation, Hypercerts Protocol",
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
  rights: {
    rightsName: "Public Display",
    rightsType: "display",
    rightsDescription: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

For richer contributor profiles, create separate `contributorInformation` and `contributionDetails` records and reference them via strong references. See the [Contribution lexicon](/lexicons/hypercerts-lexicons/contribution) for details.

## Attach additional information

Attachment records link additional information to any record. The `subjects` field is an array of strong references (URI + CID):

```typescript
const attachment = await repo.attachments.create({
  subjects: [
    {
      uri: hypercert.uri,
      cid: hypercert.cid,
    },
  ],
  title: "Documentation site repository",
  shortDescription: "Source code and content for the Hypercerts Protocol documentation.",
  content: [
    {
      $type: "org.hypercerts.defs#uri",
      uri: "https://github.com/hypercerts-org/hypercerts-atproto-documentation",
    },
  ],
  createdAt: new Date().toISOString(),
});
```

You can create multiple attachment records — one for the repo, one for the deployed site, one for the migration plan, etc.

## What you've built

Your hypercert now has a complete structure:

```
Activity Claim (the core record)
├── Contribution: Lead author (Alice)
├── Contribution: Technical reviewer (Bob)
└── Attachment: GitHub repository
```

All of these records are linked via strong references (URI + CID), making the entire structure tamper-evident and verifiable. Anyone can discover the contributions and attachments attached to your hypercert by following these references.

## Next steps

Third parties can now [evaluate your hypercert](/tutorials/working-with-evaluations) by creating evaluation records and measurements on their own PDS.
