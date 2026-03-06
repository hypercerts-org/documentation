---
title: Using the Scaffold App
description: Create a hypercert using the Scaffold app — no code required.
---

# Using the Scaffold App

The [Scaffold app](https://hypercerts-scaffold.vercel.app) lets you create a full hypercert through a guided wizard — no code required. For the code-based approach, see [Creating Your First Hypercert](/getting-started/creating-your-first-hypercert).

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
| **Evaluators** | DIDs or handles of the users who contributed to this evaluation |
| **Summary** | A brief written assessment of the work. Max 1,000 characters. Example: `High-quality documentation with clear examples and thorough coverage.` |
| **Score** *(optional)* | A numeric score on a defined scale. Set a minimum, maximum, and value — e.g. min 1, max 5, value 4. |
| **Content** *(optional)* | Links to detailed evaluation reports or methodology documents — URLs or file uploads. |
| **Measurement** *(optional)* | URI to the measurement tied to this evaluation. It can also be a normal URL. |

### Step 7 — Done

Your hypercert is now created and stored on your PDS. The completion screen shows the finalized record — copy the AT-URI to reference it from other records (attachments, measurements, evaluations) or to share it.

![Completion screen showing the finished hypercert](/images/scaffold/finalized-cert.png)
*The hypercert is created and stored on your PDS.*

For full details on the Scaffold app — including self-hosting, environment setup, and extending the codebase — see the [Scaffold app documentation](/tools/scaffold).
