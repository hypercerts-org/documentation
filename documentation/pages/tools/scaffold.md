---
title: Scaffold Starter App
description: A Next.js starter app for building on ATProto with the Hypercerts SDK.
---

# Scaffold Starter App

The Hypercerts Scaffold is a working Next.js app that demonstrates how to build on ATProto with the Hypercerts SDK. It handles OAuth authentication, profile management, and the full hypercert creation workflow — from basic claims through evidence, locations, measurements, and evaluations.

Live at [hypercerts-scaffold.vercel.app](https://hypercerts-scaffold.vercel.app). Source: [github.com/hypercerts-org/hypercerts-scaffold-atproto](https://github.com/hypercerts-org/hypercerts-scaffold-atproto).

## What the app does

### Sign in with ATProto

Enter your handle (e.g. `yourname.certified.app` or `yourname.bsky.social`) and the app redirects you to your PDS for OAuth authorization. Once approved, you're signed in with a session tied to your DID.

{% figure src="/images/scaffold/sign-in.png" alt="Scaffold sign-in screen showing handle input field" caption="The sign-in screen. Enter your ATProto handle to authenticate via OAuth." /%}

### Home screen

After signing in, the home screen shows your active session — your DID, display name, and handle. From here you can create a new hypercert or view your existing ones.

{% figure src="/images/scaffold/home-authenticated.png" alt="Scaffold home screen showing session info and action buttons" caption="The authenticated home screen with session details and quick actions." /%}

### Create a hypercert

The creation flow is a 6-step wizard with a sidebar stepper that tracks your progress:

**Step 1 — Basic info.** Title, description, work scope tags, start and end dates, and an optional cover image. This creates the core `org.hypercerts.claim.activity` record on your PDS.

{% figure src="/images/scaffold/create-step1.png" alt="Hypercert creation form showing title, description, work scope, and date fields" caption="Step 1: Define the basic claim — what work was done, when, and in what scope." /%}

**Step 2 — Evidence.** Attach supporting documentation — URLs, files, or descriptions that back up the claim.

{% figure src="/images/scaffold/create-step2-evidence.png" alt="Evidence form for attaching supporting documentation" caption="Step 2: Attach evidence to support the claim." /%}

**Step 3 — Location.** Add geographic context to the work — where it happened.

{% figure src="/images/scaffold/create-step3-location.png" alt="Location form for adding geographic context" caption="Step 3: Add location data to anchor the work geographically." /%}

**Step 4 — Measurements.** Add quantitative data — metrics, values, and measurement methods that make the impact concrete.

{% figure src="/images/scaffold/create-step4-measurement.png" alt="Measurement form for adding quantitative impact data" caption="Step 4: Add measurements to quantify the impact." /%}

**Step 5 — Evaluations.** Add third-party assessments of the work.

{% figure src="/images/scaffold/create-step5-evaluation.png" alt="Evaluation form for adding third-party assessments" caption="Step 5: Add evaluations from third-party assessors." /%}

**Step 6 — Done.** Review the completed hypercert and create another or view your collection.

{% figure src="/images/scaffold/create-step6-complete.png" alt="Completion screen showing the finished hypercert" caption="Step 6: The hypercert is created and stored on your PDS." /%}

### Browse your hypercerts

The hypercerts page shows all your claims in a card grid. Each card displays the title, description, creation date, work scope tags, and cover image. Click any card to view its full details.

{% figure src="/images/scaffold/hypercerts-list.png" alt="Grid of hypercert cards showing titles, descriptions, and work scope tags" caption="Your hypercerts displayed as cards with metadata and work scope tags." /%}

### Edit your profile

The profile page lets you update your Certified profile — display name, bio, pronouns, website, avatar, and banner image. Changes are written directly to your PDS.

{% figure src="/images/scaffold/profile.png" alt="Profile editing form with display name, bio, and avatar fields" caption="Edit your Certified profile. Changes are stored on your PDS." /%}

{% callout type="note" %}
Screenshots needed: To add the screenshots above, capture each screen from [hypercerts-scaffold.vercel.app](https://hypercerts-scaffold.vercel.app) and save them to `documentation/public/images/scaffold/`. Use the filenames referenced in each figure tag.
{% /callout %}

## Run it locally

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
