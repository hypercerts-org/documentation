---
title: Quickstart
description: Create your first hypercert in under 5 minutes.
---

# Quickstart

Create your first hypercert. This guide uses TypeScript and Node.js v20+.

## Create an account

[Sign up at certified.app](https://certified.app). This gives you an AT Protocol identity and a PDS where your data is stored. (Already have a Bluesky or other ATProto account? That works too.)

## Install dependencies

```bash
pnpm add @atproto/api
```

{% callout type="note" %}
Building a React app? Install `@tanstack/react-query` alongside `@atproto/api` for data fetching and caching.
{% /callout %}

## Authenticate

Authentication uses AT Protocol OAuth. Your app needs a client metadata document hosted at a public URL:

```typescript
import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({ service: "https://bsky.social" });

// Log in with your credentials
await agent.login({
  identifier: "alice.certified.app",
  password: "your-app-password",
});
```

For session management in production applications, use AT Protocol OAuth. See the [AT Protocol OAuth documentation](https://atproto.com/specs/oauth) for details.

## Create your first hypercert

```typescript
const result = await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.activity",
  record: {
    title: "NumPy documentation maintenance, Q1 2026",
    shortDescription: "Updated API docs and fixed 15 broken examples.",
    description: "Rewrote 12 API reference pages, fixed 15 broken code examples, and added a new getting started guide.",
    workScope: { allOf: ["Documentation"] },
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    $type: "org.hypercerts.claim.activity",
    createdAt: new Date().toISOString(),
  },
});

console.log(result);
```

The response includes the AT-URI and CID for the created record:

```typescript
console.log(result.data.uri);
// → at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a

console.log(result.data.cid);
// → bafyreiabc123...
```

Each AT-URI is a permanent, globally unique identifier. Other records (evaluations, attachments, measurements) reference your hypercert using its URI. The CID is a content hash that makes references tamper-evident. See the [Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) for the complete schema.
