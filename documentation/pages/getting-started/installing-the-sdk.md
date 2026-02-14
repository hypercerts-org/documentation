---
title: Installing the SDK
---

# Installing the SDK

This page covers how to set up your development environment for working with the Hypercerts Protocol. You'll install the SDK, configure authentication, and create your first activity claim.

## Prerequisites

Before getting started, ensure you have:

#### Node.js v20 or later

The Hypercerts SDK requires Node.js version 20 or later. Check your version:

```bash
node --version
```

If you need to install or upgrade Node.js, visit [nodejs.org](https://nodejs.org/).

#### pnpm (recommended)

The SDK monorepo uses pnpm. Install it if you haven't already:

```bash
npm install -g pnpm
```

#### An AT Protocol account

You need an AT Protocol account with a DID (Decentralized Identifier). The easiest way to get one is to create a Bluesky account at [bsky.app](https://bsky.app/). Your Bluesky handle (e.g., `alice.bsky.social`) is your AT Protocol identity.

Alternatively, you can create an account on any AT Protocol PDS (Personal Data Server). See [atproto.com](https://atproto.com/) for more options.

#### A Personal Data Server (PDS)

Your hypercerts data is stored on a PDS — a server that hosts your personal repository of records. You have three options:

- **Use the Hypercerts Foundation PDS** — The foundation runs a PDS for hypercerts users. This is the recommended option for most developers.
- **Use your existing PDS** — If you already have a Bluesky account or another ATProto PDS, you can use it to store hypercerts.
- **Self-host** — Advanced users can run their own PDS. See the [ATProto PDS documentation](https://atproto.com/guides/self-hosting) for details.

{% callout type="note" %}
The Hypercerts Foundation PDS is currently in private beta. Contact the team at team@hypercerts.org to request access.
{% /callout %}

## Install the SDK

The Hypercerts SDK is a monorepo with three packages. Choose the one that fits your use case:

#### For Node.js or custom frameworks

Install the core SDK:

```bash
pnpm add @hypercerts-org/sdk-core
```

#### For React applications

Install the React SDK along with its peer dependencies:

```bash
pnpm add @hypercerts-org/sdk-react @hypercerts-org/sdk-core @tanstack/react-query
```

#### For types and validation only

If you only need the lexicon type definitions and runtime validation:

```bash
pnpm add @hypercerts-org/lexicon
```

{% callout type="note" %}
You can also use npm or yarn instead of pnpm. For example: `npm install @hypercerts-org/sdk-core`.
{% /callout %}

The packages build on each other in a layered architecture:

```
@hypercerts-org/lexicon       → Lexicon definitions + generated TypeScript types
    ↓
@hypercerts-org/sdk-core      → OAuth, repository operations, domain services
    ↓
@hypercerts-org/sdk-react     → React hooks, providers, React Query integration
```

## Authentication

The Hypercerts SDK uses AT Protocol OAuth for authentication. OAuth lets users authorize your application without sharing credentials.

#### Setting up OAuth

To use OAuth, your application needs a client metadata document hosted at a public URL. This tells the AT Protocol authorization server about your application:

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

// 1. Create an SDK instance with your OAuth configuration
const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

// 2. Start the OAuth flow — redirect the user to the returned URL
const authUrl = await sdk.authorize("alice.bsky.social");

// 3. After the user authorizes, handle the callback at your redirectUri
const session = await sdk.callback(callbackParams);
```

The SDK handles DPoP-bound token management and automatic token refresh for you.

#### Restoring sessions

For returning users, you can restore an existing session by DID:

```typescript
const session = await sdk.restoreSession("did:plc:abc123...");
```

{% callout type="warning" %}
Never store OAuth tokens or credentials in source code. Use environment variables or secure storage for any sensitive configuration.
{% /callout %}

## Your First Hypercert

Let's create your first activity claim — a record of impact work.

#### Create a hypercert using the core SDK

Once you have an authenticated session, get a repository handle and create a hypercert:

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({
  oauth: {
    clientId: "https://your-app.com/client-metadata.json",
    redirectUri: "https://your-app.com/callback",
    scope: "atproto",
  },
});

// After OAuth flow completes...
const session = await sdk.callback(callbackParams);

// Get a repository handle for the authenticated user
const repo = sdk.getRepository(session);

// Create an activity claim
const result = await repo.hypercerts.create({
  title: "Maintained NumPy documentation in Q1 2026",
  description: "Updated API docs and fixed 15 broken examples in the NumPy user guide.",
  workScope: "Documentation",
  workTimeframeFrom: "2026-01-01",
  workTimeframeTo: "2026-03-31",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this hypercert as proof of contribution",
  },
});

console.log("Hypercert created:", result);
```

#### Using the React SDK

If you're building a React application, the SDK provides hooks that handle authentication and data fetching:

```typescript
import { createATProtoReact } from "@hypercerts-org/sdk-react";
import { QueryClientProvider } from "@tanstack/react-query";

// 1. Create an ATProto React instance
const atproto = createATProtoReact({
  config: {
    oauth: {
      clientId: "https://your-app.com/client-metadata.json",
      redirectUri: "https://your-app.com/callback",
      scope: "atproto",
    },
  },
});

// 2. Export the hooks and providers
export const {
  Provider,
  queryClient,
  useAuth,
  useProfile,
  useHypercerts,
} = atproto;

// 3. Wrap your app with providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <MyApp />
      </Provider>
    </QueryClientProvider>
  );
}
```

Then use the hooks in your components:

```typescript
function CreateHypercert() {
  const { createHypercert } = useHypercerts();

  const handleCreate = async () => {
    await createHypercert({
      title: "My First Hypercert",
      description: "A test contribution to learn the protocol",
      workScope: "Testing",
      workTimeframeFrom: "2026-01-01",
      workTimeframeTo: "2026-12-31",
    });
  };

  return <button onClick={handleCreate}>Create Hypercert</button>;
}
```

#### Understanding the response

When you create a hypercert, the response includes an AT-URI — a permanent, globally unique identifier for this record:

```
at://did:plc:abc123xyz/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a
```

Other records (evaluations, measurements, evidence) can reference your hypercert using this AT-URI. The response also includes a CID (content hash) that ensures the reference is tamper-evident.

See the [Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) for the complete schema of all available fields.

## Development Tools

#### ATProto tooling

The Hypercerts SDK is built on top of `@atproto/api`, the official AT Protocol JavaScript client. You can use ATProto tools directly for lower-level operations:

```bash
pnpm add @atproto/api
```

See the [ATProto API documentation](https://atproto.com/guides/applications) for details.

#### Inspecting your PDS data

You can inspect your repository directly using ATProto methods:

- **`com.atproto.repo.listRecords`** — List all records of a given type in your repo
- **`com.atproto.repo.getRecord`** — Fetch a specific record by AT-URI
- **`com.atproto.sync.getRepo`** — Download your entire repository as a CAR file

The Hypercerts SDK provides convenience methods for these operations through the `Repository` class.

#### Getting help

- **GitHub** — Report issues and contribute at [github.com/hypercerts-org/hypercerts-sdk](https://github.com/hypercerts-org/hypercerts-sdk)
- **Community** — Join the Hypercerts community for support and discussion at [hypercerts.org](https://hypercerts.org)
- **Documentation** — Explore the [lexicon schemas](/lexicons/introduction-to-lexicons) and [work scope](/deep-dive-the-work-scope) concepts

## Next Steps

Now that you have the SDK installed and working, you can:

{% card-link title="Introduction to Lexicons" href="/lexicons/introduction-to-lexicons" %}
Understand the data schemas that define hypercert record types
{% /card-link %}

{% card-link title="Activity Claim" href="/lexicons/hypercerts-lexicons/activity-claim" %}
See all available fields for activity claims
{% /card-link %}

{% card-link title="Deep Dive: The Work Scope" href="/deep-dive-the-work-scope" %}
Learn how to precisely scope impact work using logical operators
{% /card-link %}
