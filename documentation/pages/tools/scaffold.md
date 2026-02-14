---
title: Scaffold Starter App
description: A Next.js starter app for building on ATProto with the Hypercerts SDK.
---

# Scaffold Starter App

The Hypercerts Scaffold is a Next.js starter app for building on ATProto with the Hypercerts SDK. Clone it to bootstrap your own application. You get:

- OAuth authentication with ATProto (login, session management, token refresh)
- Profile management (read and update Certified profiles)
- Hypercert creation and listing
- Server-side repository access patterns with React Query on the client

Live demo at [hypercerts-scaffold.vercel.app](https://hypercerts-scaffold.vercel.app). Source: [github.com/hypercerts-org/hypercerts-scaffold-atproto](https://github.com/hypercerts-org/hypercerts-scaffold-atproto).

## Quick start

1. Clone and install:

```bash
git clone https://github.com/hypercerts-org/hypercerts-scaffold-atproto
cd hypercerts-scaffold-atproto
pnpm install
```

2. Configure environment:

```bash
cp .env.example .env.local
pnpm run generate-jwk >> .env.local
```

3. Start Redis (for session storage):

```bash
docker run -d -p 6379:6379 redis:alpine
```

4. Run the dev server:

```bash
pnpm run dev
```

Open `http://127.0.0.1:3000`. Requires Node.js 20+ and pnpm.

{% callout type="note" %}
Use `127.0.0.1` not `localhost` for local development. ATProto OAuth requires IP-based loopback addresses per RFC 8252. The app auto-redirects, but your `.env.local` must use `127.0.0.1`.
{% /callout %}

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | App URL (`http://127.0.0.1:3000` for local) |
| `ATPROTO_JWK_PRIVATE` | OAuth private key (generate with `pnpm run generate-jwk`) |
| `REDIS_HOST` | Redis hostname |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `NEXT_PUBLIC_PDS_URL` | PDS URL (e.g. `https://pds-eu-west4.test.certified.app`) |

## Architecture

The scaffold uses a layered architecture:

- **Browser**: OAuthProvider + SessionProvider + React Query manage client state
- **Next.js API routes**: Handle auth callbacks, cert operations, profile management
- **Hypercerts SDK** (`@hypercerts-org/sdk-core`): Manages OAuth sessions and repository operations
- **Redis**: Stores sessions
- **PDS**: Stores user data (profiles, hypercerts)

All user data lives on the PDS. Redis only holds session tokens.

## Key patterns

### Getting an authenticated repository

```typescript
import { getRepoContext } from "@/lib/repo-context";

export async function GET() {
  const ctx = await getRepoContext();
  if (!ctx) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const profile = await ctx.scopedRepo.profile.getCertifiedProfile();
  return Response.json(profile);
}
```

The `scopedRepo` is routed to the authenticated user's PDS and scoped to their DID. Use it for all profile and hypercert operations.

### Creating a hypercert

```typescript
await ctx.scopedRepo.hypercert.create({
  title: "My Hypercert",
  description: "A certificate of impact",
  workScope: "Documentation",
  workTimeframeFrom: "2026-01-01",
  workTimeframeTo: "2026-03-31",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});
```

### Listing hypercerts

```typescript
const hypercerts = await ctx.scopedRepo.hypercert.list();
```

## Project structure

```
app/api/auth/     # OAuth endpoints
app/api/certs/    # Hypercert CRUD
app/api/profile/  # Profile management
components/       # React components
lib/              # SDK init, repo context, server actions
providers/        # React context providers
queries/          # TanStack Query hooks
```

Key files:

- `lib/hypercerts-sdk.ts` — SDK initialization
- `lib/repo-context.ts` — Helper to get authenticated repository
- `lib/create-actions.ts` — Server actions for common operations
- `app/api/auth/callback/route.ts` — OAuth callback handler

{% callout type="note" %}
The scaffold uses a pre-release SDK version (`@hypercerts-org/sdk-core@0.10.0-beta.8`). API changes are expected before 1.0.
{% /callout %}
