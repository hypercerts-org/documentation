---
title: Quickstart
description: Create your first hypercert in under 5 minutes.
---

# Quickstart

Create your first hypercert in under 5 minutes. By the end, you'll have a published activity claim on your Personal Data Server.

## 1. Create an account

[Sign up at certified.app](https://certified.app). This gives you an AT Protocol identity and a PDS where your data is stored. (Already have a [Bluesky](https://bsky.app/) account? That works too.)

## 2. Install the SDK

```bash
pnpm add @hypercerts-org/sdk-core
```

## 3. Create a hypercert

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

// Set up the SDK with your OAuth config
const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

// Authenticate
const authUrl = await sdk.authorize("alice.certified.app");
const session = await sdk.callback(callbackParams);

// Create a hypercert
const repo = sdk.getRepository(session);
const result = await repo.hypercerts.create({
  title: "My First Hypercert",
  description: "A test contribution to learn the protocol.",
  workScope: "Testing",
  workTimeframeFrom: "2026-01-01",
  workTimeframeTo: "2026-12-31",
});

console.log(result.uri);
// → at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

That's it. The `uri` in the response is a permanent, globally unique identifier for your hypercert. Other records — evaluations, evidence, measurements — reference it using this URI.

## What's next

- [Set up your development environment](/getting-started/installing-the-sdk) — OAuth setup, package architecture, React SDK
- [What is Certified?](/getting-started/what-is-certified) — How identity works in the ecosystem
- [Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) — All available fields for activity claims
- [Introduction to Impact Claims](/getting-started/introduction-to-impact-claims) — The concepts behind hypercerts
