---
title: Hypercerts SDK
description: TypeScript SDK for building applications on the Hypercerts protocol with ATProto authentication, repository operations, and React integration.
---

# Hypercerts SDK

The Hypercerts SDK is a TypeScript toolkit for building applications on the Hypercerts protocol. It handles ATProto OAuth authentication, repository operations (creating and managing hypercerts, collections, evaluations, and more), and provides React hooks for frontend integration.

For a step-by-step introduction, see the [Quickstart](/getting-started/quickstart). This page is a reference for the SDK's packages, API surface, and configuration options.

Source: [github.com/hypercerts-org/hypercerts-sdk](https://github.com/hypercerts-org/hypercerts-sdk).

## Packages

The SDK is a monorepo with three packages:

| Package | Description |
|---------|-------------|
| `@hypercerts-org/sdk-core` | Framework-agnostic core — OAuth, repository operations, and domain services |
| `@hypercerts-org/sdk-react` | React hooks and components with React Query integration |
| `@hypercerts-org/lexicon` | ATProto lexicon definitions and generated TypeScript types (published separately from [hypercerts-lexicon](https://github.com/hypercerts-org/hypercerts-lexicon)) |

```
┌─────────────────────────────────────────────────┐
│              Your Application                    │
├─────────────────────────────────────────────────┤
│  @hypercerts-org/sdk-react                      │
│  React hooks, Provider, React Query integration │
├─────────────────────────────────────────────────┤
│  @hypercerts-org/sdk-core                       │
│  OAuth, Repository, domain services             │
├─────────────────────────────────────────────────┤
│  @hypercerts-org/lexicon                        │
│  Lexicon JSON definitions, generated TS types   │
└─────────────────────────────────────────────────┘
```

Types flow from `@hypercerts-org/lexicon` through `sdk-core` (which re-exports them with friendly aliases like `HypercertClaim`, `HypercertRights`) to `sdk-react`.

## Install

```bash
# Core SDK only (Node.js, any framework)
pnpm add @hypercerts-org/sdk-core

# React integration (includes sdk-core as peer dependency)
pnpm add @hypercerts-org/sdk-react @hypercerts-org/sdk-core @tanstack/react-query
```

## React hooks

The React package uses a factory pattern. Call `createATProtoReact()` once to get a `Provider` and a set of hooks scoped to your OAuth configuration:

```typescript
import { createATProtoReact } from "@hypercerts-org/sdk-react";

const atproto = createATProtoReact({
  config: {
    oauth: {
      clientId: "https://your-app.com/client-metadata.json",
      redirectUri: "https://your-app.com/callback",
      scope: "atproto",
    },
  },
});

export const {
  Provider,
  queryClient,
  useAuth,
  useProfile,
  useHypercerts,
} = atproto;
```

Wrap your app with both `QueryClientProvider` and the exported `Provider`:

```typescript
import { QueryClientProvider } from "@tanstack/react-query";

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

### Available hooks

| Hook | Returns |
|------|---------|
| `useAuth()` | `session`, `status`, `login`, `logout`, `refresh` |
| `useProfile(did?)` | `profile`, `save`, `isSaving`, `isLoading` |
| `useHypercerts(did?)` | `hypercerts`, `create`, `fetchNextPage` |
| `useHypercert(uri)` | `hypercert`, `update`, `remove` |
| `useRepository(opts?)` | `repository`, `serverUrl` |
| `useOrganizations()` | `organizations`, `create` |

### Query key management

For manual cache invalidation:

```typescript
import { atprotoKeys } from "@hypercerts-org/sdk-react";

queryClient.invalidateQueries({ queryKey: atprotoKeys.allHypercerts() });
queryClient.invalidateQueries({ queryKey: atprotoKeys.profile(did) });
```

### Wagmi integration

If your app also uses Wagmi for onchain operations, share a single `QueryClient`:

```tsx
const queryClient = new QueryClient();
const atproto = createATProtoReact({ config, queryClient });

function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <atproto.Provider>
          <App />
        </atproto.Provider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
```

## Repository API

Once authenticated (see [Quickstart](/getting-started/quickstart)), all operations go through a `Repository` object:

```typescript
const repo = sdk.getRepository(session);
```

### Hypercerts

```typescript
repo.hypercerts.create({ title, shortDescription, workScope, startDate, endDate, rights, ... })
repo.hypercerts.get(uri)
repo.hypercerts.list({ limit?, cursor? })
repo.hypercerts.update(uri, { ... })
repo.hypercerts.delete(uri)
```

### Contributions and measurements

```typescript
repo.hypercerts.addContribution({ claim, contributor, description, contributionType, percentage })
repo.hypercerts.addMeasurement({ claim, type, value, unit, verifiedBy, verificationMethod, measuredAt })
```

### Collections and projects

Collections organize multiple hypercerts into logical groupings. Projects are collections with `type="project"`.

```typescript
// Create a collection with weighted items
const collection = await repo.hypercerts.createCollection({
  title: "Climate Projects 2024",
  shortDescription: "Our climate impact portfolio",
  items: [
    { itemIdentifier: { uri: cert1Uri, cid: cert1Cid }, itemWeight: "0.6" },
    { itemIdentifier: { uri: cert2Uri, cid: cert2Cid }, itemWeight: "0.4" },
  ],
});

// Projects use the same shape
const project = await repo.hypercerts.createProject({ title, shortDescription, items });

// Attach location data
await repo.hypercerts.attachLocationToProject(project.uri, {
  lpVersion: "1.0",
  srs: "EPSG:4326",
  locationType: "coordinate-decimal",
  location: "https://example.com/location.geojson",
  name: "Project Site",
});
```

Both also support `get`, `list`, `update`, `delete`, and `removeLocation` variants.

### Profiles

The SDK supports two profile types:

- **Bluesky Profile** (`app.bsky.actor.profile`) — standard AT Protocol profiles with CDN-hosted avatars
- **Certified Profile** (`app.certified.actor.profile`) — extended profiles with pronouns and website fields

```typescript
// Certified profile (returns null if it doesn't exist)
const profile = await repo.profile.getCertifiedProfile();
await repo.profile.upsertCertifiedProfile({
  displayName: "Alice",
  description: "Climate researcher",
  pronouns: "she/her",
  website: "https://alice.com",
});

// Bluesky profile
const bskyProfile = await repo.profile.getBskyProfile();
await repo.profile.upsertBskyProfile({
  displayName: "Alice",
  description: "Impact researcher",
});
```

Use `upsert*()` when you don't know whether a profile already exists. Use `create*()` / `update*()` when you do.

### Blobs

```typescript
const blobResult = await repo.blobs.upload(imageFile);
const blobData = await repo.blobs.get(did, cid);
```

### Generic records

For working with any ATProto record type directly:

```typescript
repo.records.create({ collection, record })
repo.records.get({ collection, rkey })
repo.records.update({ collection, rkey, record })
repo.records.delete({ collection, rkey })
repo.records.list({ collection, limit?, cursor? })
```

## OAuth configuration

### Scopes and permissions

Control what your app can access using permission builders:

```typescript
import { PermissionBuilder, ScopePresets, buildScope } from "@hypercerts-org/sdk-core";

// Use a preset
const scope = ScopePresets.EMAIL_AND_PROFILE;

// Or build custom permissions
const scope = buildScope(
  new PermissionBuilder()
    .accountEmail("read")
    .repoWrite("app.bsky.feed.post")
    .blob(["image/*", "video/*"])
    .build()
);
```

Available presets: `EMAIL_READ`, `PROFILE_READ`, `PROFILE_WRITE`, `POST_WRITE`, `SOCIAL_WRITE`, `MEDIA_UPLOAD`, `POSTING_APP`, `EMAIL_AND_PROFILE`.

### Local development

ATProto OAuth supports HTTP loopback URLs for local development:

```typescript
const sdk = createATProtoSDK({
  oauth: {
    clientId: "http://localhost/",
    redirectUri: "http://127.0.0.1:3000/api/auth/callback",
    scope: "atproto",
    jwksUri: "http://127.0.0.1:3000/.well-known/jwks.json",
    jwkPrivate: process.env.ATPROTO_JWK_PRIVATE!,
    developmentMode: true,
  },
});
```

{% callout type="note" %}
Use `http://localhost/` for `clientId` and `http://127.0.0.1:<port>` for `redirectUri` and `jwksUri`. This is the recommended pattern per the AT Protocol spec. Never use HTTP loopback URLs in production.
{% /callout %}

## Type system

Types are generated from ATProto lexicon definitions and exported with friendly aliases:

```typescript
import type {
  HypercertClaim,
  HypercertRights,
  HypercertContribution,
  HypercertMeasurement,
  HypercertEvaluation,
  HypercertCollection,
} from "@hypercerts-org/sdk-core";
```

For runtime validation:

```typescript
import { OrgHypercertsClaim } from "@hypercerts-org/sdk-core";

if (OrgHypercertsClaim.isRecord(data)) {
  // data is typed as HypercertClaim
}
```

| Lexicon type | SDK alias |
|-------------|-----------|
| `OrgHypercertsClaim.Main` | `HypercertClaim` |
| `OrgHypercertsClaimRights.Main` | `HypercertRights` |
| `OrgHypercertsClaimContribution.Main` | `HypercertContribution` |
| `OrgHypercertsClaimMeasurement.Main` | `HypercertMeasurement` |
| `OrgHypercertsClaimEvaluation.Main` | `HypercertEvaluation` |
| `OrgHypercertsCollection.Main` | `HypercertCollection` |
| `AppCertifiedLocation.Main` | `HypercertLocation` |

## Testing

The React package includes testing utilities:

```typescript
import { TestProvider, createMockSession } from "@hypercerts-org/sdk-react/testing";

test("renders profile", () => {
  render(
    <TestProvider mockSession={createMockSession({ handle: "test.bsky.social" })}>
      <ProfileComponent />
    </TestProvider>
  );
});
```

## See also

- [Quickstart](/getting-started/quickstart) — create your first hypercert in 5 minutes
- [Scaffold Starter App](/tools/scaffold) — a working Next.js app built with the SDK
- [Hypercerts Lexicons](/lexicons/introduction-to-lexicons) — the ATProto record schemas the SDK operates on
- [Core Data Model](/core-concepts/hypercerts-core-data-model) — how hypercert records relate to each other
