---
title: Set up your development environment
---

# Set up your development environment

Install the Hypercerts SDK and send your first API request. This guide uses TypeScript and Node.js v20+.

## Create an account

[Create a Certified account](https://certified.app) or [sign in](https://certified.app). Certified is the identity provider for the Hypercerts ecosystem — it gives you an AT Protocol identity and a Personal Data Server (PDS) where your hypercerts are stored.

Already have a [Bluesky](https://bsky.app/) account? That works too — it's the same AT Protocol identity under the hood.

## Install the SDK

The SDK is split into three packages. Most developers need the core package:

```bash
pnpm add @hypercerts-org/sdk-core
```

{% callout type="note" %}
Building a React app? Install the React SDK instead — it includes hooks, providers, and React Query integration:

```bash
pnpm add @hypercerts-org/sdk-react @hypercerts-org/sdk-core @tanstack/react-query
```

See the [React SDK docs](https://github.com/hypercerts-org/hypercerts-sdk/tree/develop/packages/sdk-react) for usage.
{% /callout %}

The full package architecture:

```
@hypercerts-org/lexicon       → Lexicon definitions + generated TypeScript types
    ↓
@hypercerts-org/sdk-core      → OAuth, repository operations, domain services
    ↓
@hypercerts-org/sdk-react     → React hooks, providers, React Query integration
```

## Authenticate

The SDK uses AT Protocol OAuth with DPoP-bound tokens. Your application needs a client metadata document hosted at a public URL — this tells the authorization server about your app.

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

// 1. Redirect the user to authorize
const authUrl = await sdk.authorize("alice.certified.app");

// 2. Handle the callback at your redirectUri
const session = await sdk.callback(callbackParams);
```

The SDK handles token management and automatic refresh for you. For returning users, restore an existing session by DID:

```typescript
const session = await sdk.restoreSession("did:plc:abc123...");
```

## Create your first hypercert

Once authenticated, get a repository handle and create a hypercert:

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

