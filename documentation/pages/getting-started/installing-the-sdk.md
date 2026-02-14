---
title: Set up your development environment
---

# Set up your development environment

Install the Hypercerts SDK and send your first API request.

## Create an account

[Create a Certified account](https://certified.app) or [sign in](https://certified.app). Already have a [Bluesky](https://bsky.app/) account? That works too — it's the same AT Protocol identity.

## Install the SDK

```bash
pnpm add @hypercerts-org/sdk-core
```

{% callout type="note" %}
Building a React app? Install `@hypercerts-org/sdk-react @hypercerts-org/sdk-core @tanstack/react-query` instead. See the [React SDK docs](https://github.com/hypercerts-org/hypercerts-sdk/tree/develop/packages/sdk-react) for details.
{% /callout %}

## Authenticate

The SDK uses AT Protocol OAuth. Your app needs a client metadata document at a public URL:

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

For returning users, restore an existing session:

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

The response includes an AT-URI — a permanent identifier for this record:

```
at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

Other records (evaluations, evidence, measurements) reference your hypercert using this URI. The response also includes a CID (content hash) that makes the reference tamper-evident.

## See also

{% card-link title="Activity Claim lexicon" href="/lexicons/hypercerts-lexicons/activity-claim" %}
Complete schema for activity claims
{% /card-link %}

{% card-link title="Introduction to Lexicons" href="/lexicons/introduction-to-lexicons" %}
How data schemas work in the Hypercerts Protocol
{% /card-link %}

{% card-link title="Deep Dive: The Work Scope" href="/deep-dive-the-work-scope" %}
Precisely scope impact work using logical operators
{% /card-link %}

{% card-link title="SDK on GitHub" href="https://github.com/hypercerts-org/hypercerts-sdk" %}
Source code, issues, and full API reference
{% /card-link %}
