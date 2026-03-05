---
title: Quickstart
description: Create your first hypercert in under 5 minutes.
---

# Quickstart

Create your first hypercert. This guide uses TypeScript and Node.js v20+.

## Create an account

[Sign up at certified.app](https://certified-app-hypercerts-foundation.vercel.app). This gives you an AT Protocol identity and a PDS where your data is stored. (Already have a Bluesky or other ATProto account? That works too.)

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

## Create a hypercert without code

If you don't want to write code, the [Scaffold app](https://hypercerts-scaffold.vercel.app) lets you create a full hypercert through a guided wizard. Visit [hypercerts-scaffold.vercel.app](https://hypercerts-scaffold.vercel.app) to get started.

### Step 1 — Sign in

Enter your ATProto handle (e.g. `yourname.certified.app` or `yourname.bsky.social`) on the sign-in screen. You'll be redirected to your PDS to authorize the app. Once you approve, you'll land on the home screen with your DID and display name visible.

![Scaffold sign-in screen showing handle input field](/images/scaffold/sign-in.png)
*Enter your ATProto handle to authenticate via OAuth.*

### Step 2 — Basic info

Click **"Create a new hypercert"** on the home screen (or go directly to [hypercerts-scaffold.vercel.app/hypercerts/create](https://hypercerts-scaffold.vercel.app/hypercerts/create)). This opens a multi-step wizard. The first step collects the core fields that form the `org.hypercerts.claim.activity` record on your PDS.

![Hypercert creation form showing title, description, work scope, and date fields](/images/scaffold/create-cert.png)
*Step 1: Define the basic claim — what work was done, when, and in what scope.*

| Field | Description |
|---|---|
| **Title** | A specific name for this piece of work. Be verbose — a project may have many hypercerts over time. Max 256 characters. Example: `NumPy documentation maintenance, Q1 2026`. |
| **Short description** | A 1–3 sentence summary suitable for card previews and list views. Max 300 characters. |
| **Description** | A longer narrative of what was done, by whom, and how. Supports rich text. Max 3,000 characters. |
| **Work scope** | One or more tags that precisely define what work is included. Multiple tags are conjunctive — e.g. `Trees` + `Germany` means only tree-planting in Germany. Leave empty for an unconstrained scope. |
| **Start date** | When the work began (ISO 8601). |
| **End date** | When the work ended (ISO 8601). |
| **Cover image** | An optional image for the hypercert card — URL or file upload. |
| **Rights Information** | Required information about the rights to this hypercert |
| **Contributors** *(optional)* | The people or organizations that did the work. Each contributor has an identity (DID or name), an optional relative weight, and an optional role description. You can add multiple contributors here or leave this empty. |

### Step 3 — Add attachments

Attach supporting documentation that backs up the claim — reports, URLs, files, or other references. Each attachment becomes an `org.hypercerts.context.attachment` record linked to your hypercert.

![Evidence form for attaching supporting documentation](/images/scaffold/add-evidence.png)
*Step 2: Attach supporting documentation to back up the claim.*

| Field | Description |
|---|---|
| **Title** | A label for this attachment. Max 256 characters. Example: `GitHub repository`. |
| **Attachment type** | The kind of attachment: `report`, `audit`, `evidence`, `testimonial`, `methodology`, etc. Max 64 characters. |
| **Short description** | A brief summary of what this attachment contains. Max 300 characters. |
| **Detailed description** | A detailed summary of what this attachment contains. (optional) |
| **Content** | One or more URLs or file uploads that make up the attachment. Max 100 items. |

### Step 4 — Add location *(optional)*

Optionally anchor the work geographically. This creates an `app.certified.location` record referenced from your hypercert.

![Location form for adding geographic context](/images/scaffold/add-location.png)
*Step 3: Add location data to anchor the work geographically.*

| Field | Description |
|---|---|
| **Name** | A human-readable place name. Example: `Amazon Basin, Brazil`. Max 100 characters. |
| **Location type** | The format of the location data: `coordinate-decimal`, `geojson`, `address`, `h3`, `geohash`, `wkt`, etc. |
| **Location Data** | The location data in the chosen format. Example for `coordinate-decimal`: `-3.47, -62.21`. |
| **Location Description** | Optional context about the location. Max 500 characters. |

### Step 5 — Add measurements *(optional)*

Add quantitative data that makes the impact concrete — metrics, values, units, and measurement methods. Each entry becomes an `org.hypercerts.context.measurement` record.

![Measurement form for adding quantitative impact data](/images/scaffold/add-measurement.png)
*Step 4: Add measurements to quantify the impact.*

| Field | Description |
|---|---|
| **Metric** | What is being measured. Example: `pages written`, `CO₂e avoided`, `users reached`. Max 500 characters. |
| **Value** | The measured numeric value. Example: `12`. |
| **Unit** | The unit of measurement. Example: `pages`, `kg CO₂e`, `hectares`, `count`. Max 50 characters. |
| **Start / end date** | The period during which this measurement was taken. |
| **Method type** | A short identifier for how it was measured. Example: `automated-count`, `manual-survey`. Max 30 characters. |
| **Method URI** | A link to the methodology documentation or standard protocol. |

### Step 6 — Add evaluations *(optional)*

Add third-party assessments of the work. Evaluations are authored by evaluators and can reference measurements. Each entry becomes an `org.hypercerts.context.evaluation` record.

![Evaluation form for adding third-party assessments](/images/scaffold/add-evaluation.png)
*Step 5: Add evaluations from third-party assessors.*

| Field | Description |
|---|---|
| **Evaluators** | DIDS or handles of the users who contributed to this evaluation |
| **Summary** | A brief written assessment of the work. Max 1,000 characters. Example: `High-quality documentation with clear examples and thorough coverage.` |
| **Score** *(optional)* | A numeric score on a defined scale. Set a minimum, maximum, and value — e.g. min 1, max 5, value 4. |
| **Content** *(optional)* | Links to detailed evaluation reports or methodology documents — URLs or file uploads. |
| **Measurement** *(optional)* | URI to the measurement that is tied to this evaluation. Could be a normal url as well |

### Step 7 — Done

Your hypercert is now created and stored on your PDS. The completion screen shows the finalized record — copy the AT-URI to reference it from other records (attachments, measurements, evaluations) or to share it.

![Completion screen showing the finished hypercert](/images/scaffold/finalized-cert.png)
*The hypercert is created and stored on your PDS.*

For full details on the Scaffold app — including self-hosting, environment setup, and extending the codebase — see the [Scaffold app documentation](/tools/scaffold).
