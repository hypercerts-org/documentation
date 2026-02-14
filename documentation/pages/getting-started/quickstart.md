---
title: Quickstart
description: Create your first hypercert in under 5 minutes.
---

# Quickstart

Install the Hypercerts SDK and create your first hypercert. This guide uses TypeScript and Node.js v20+.

## Create an account

[Sign up at certified.app](https://certified.app). This gives you an AT Protocol identity and a PDS where your data is stored. (Already have a [Bluesky](https://bsky.app/) account? That works too.)

## Install the SDK

```bash
pnpm add @hypercerts-org/sdk-core
```

{% callout type="note" %}
Building a React app? Install `@hypercerts-org/sdk-react @hypercerts-org/sdk-core @tanstack/react-query` instead. See the [React SDK docs](https://github.com/hypercerts-org/hypercerts-sdk/tree/develop/packages/sdk-react) for usage.
{% /callout %}

## Authenticate

The SDK uses AT Protocol OAuth. Your app needs a client metadata document hosted at a public URL:

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

// Redirect the user to authorize
const authUrl = await sdk.authorize("alice.certified.app");

// Handle the callback
const session = await sdk.callback(callbackParams);
```

For returning users, restore an existing session by DID:

```typescript
const session = await sdk.restoreSession("did:plc:abc123...");
```

## Create your first hypercert

```typescript
const repo = sdk.getRepository(session);

const result = await repo.hypercerts.create({
  title: "NumPy documentation maintenance, Q1 2026",
  description: "Updated API docs and fixed 15 broken examples.",
  workScope: "Documentation",
  workTimeframeFrom: "2026-01-01",
  workTimeframeTo: "2026-03-31",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});

console.log(result);
```

The response includes an AT-URI — a permanent, globally unique identifier for this record:

```
at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

Other records (evaluations, evidence, measurements) reference your hypercert using this URI. The response also includes a CID (content hash) that makes the reference tamper-evident. See the [Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) for the complete schema.
