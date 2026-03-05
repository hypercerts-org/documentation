---
title: Core Data Model
description: The data model behind hypercerts — record types, dimensions, and how they connect.
---

# Core Data Model

A hypercert is an [activity claim](/lexicons/hypercerts-lexicons/activity-claim) with linked records that describe work done. The activity claim is the anchor — contributions, attachments, measurements, and evaluations reference it to add context.

This page explains what records exist, what they contain, and how they connect.

## The core record: activity claim

Every hypercert starts with an **activity claim** — the central record that answers four questions:

| Dimension | Question | Example |
|-----------|----------|---------|
| **Contributors** | Who is doing (or did) the work? | Alice, Bob |
| **Work scope** | What are they doing (or what did they do)? | Documentation, Reforestation |
| **Time of work** | When is it happening (or when did it happen)? | January – March 2026 |
| **Location** | Where is it taking (or did it take) place? | Coastal Kenya |

The activity claim gets a permanent AT-URI like `at://did:plc:alice123/org.hypercerts.claim.activity/3k7`.

## Additional details

The activity claim has a `contributors` array. Each entry is a contributor object with three fields:

- **`contributorIdentity`** — either an inline identity string (a DID) or a strong reference to a `org.hypercerts.claim.contributorInformation` record with a full social profile
- **`contributionWeight`** — an optional relative weight string (e.g. `"1"`, `"0.5"`)
- **`contributionDetails`** — either an inline role string or a strong reference to a `org.hypercerts.claim.contribution` record with structured contribution data

Simple cases use inline strings directly in the activity claim. Richer profiles use separate records that the contributor or project lead creates independently.

| Record type | What it adds | Who creates it | Lexicon |
|-------------|-------------|----------------|---------|
| **Contributor Information** | Social profile, image, display name | The contributor or project lead | `org.hypercerts.claim.contributorInformation` |
| **Contribution** | Structured role and contribution data | The contributor or project lead | `org.hypercerts.claim.contribution` |

## Records that attach to a hypercert

Other records link to the activity claim to add context. Again, each is a separate record with its own AT-URI – they reference the activity claim, not the other way around.

The following diagram shows record types and how they reference the activity claim. Records can be created by different people and live in different repositories.

{% figure src="/images/hypercert-erd.svg" alt="Hypercert record relationships" /%}

The diagram includes a **token** entity — tokenization (anchoring a hypercert onchain) is not yet implemented.

| Record type | What it adds | Who creates it | Lexicon |
|-------------|-------------|----------------|---------|
| **Attachment** | Supporting documentation — URLs, uploaded files, IPFS links. Can link to any record type, not only activity claims. | Anyone with additional data | `org.hypercerts.claim.attachment` |
| **Measurement** | Quantitative data — "12 pages written", "50 tons CO₂ reduced" | E.g. a third-party measurer or the project (self-reported) | `org.hypercerts.claim.measurement` |
| **Evaluation** | An (independent) assessment of the work | E.g. a third-party evaluator, community members, beneficiaries | `org.hypercerts.claim.evaluation` |

### Additional notes

- Records don't have to be created together. Users can create a measurement first and link it to an activity claim later. 
- A record can also be linked to multiple other records, e.g. a measurement in a bioregion is linked to multiple activity claims.
- An evaluator creates an evaluation from their own account — it references an activity claim but lives in their personal data server.

This means a hypercert grows over time – it is a living record. The core claim stays the same, but attachments, measurements, and evaluations accumulate around it.

## Grouping hypercerts

Hypercerts can be grouped into **collections**. A multi-year project might have one hypercert per year, with a collection representing the full project. But collections are flexible — anyone can create one for any purpose. Someone might curate a personal collection of hypercerts they find interesting, or an organization might group all their hypercerts together. A hypercert can belong to many collections.

| Record type | What it adds | Who creates it | Lexicon |
|-------------|-------------|----------------|---------|
| **Collection** | Groups activity claims and/or other collections into a project or portfolio. Supports recursive nesting. | E.g. the project organizer | `org.hypercerts.collection` |

## How records connect

Records reference each other using [strong references](/reference/glossary#strong-reference) — if a referenced record is modified after the reference was created, the change is detectable.

```text
Activity Claim (the core record)
├── contributors[0]
│   ├── contributorIdentity: Alice (inline DID or ref to ContributorInformation)
│   ├── contributionWeight: "1"
│   └── contributionDetails: Lead author (inline role or ref to Contribution)
├── contributors[1]
│   ├── contributorIdentity: → ContributorInformation record (Bob)
│   └── contributionDetails: → Contribution record (Technical reviewer, Jan-Mar)
├── Attachment: GitHub repository link
├── Measurement: 12 pages written
├── Measurement: 8,500 words
└── Evaluation: "High-quality documentation" (by Carol)
```



## Mutability

Activity claims and their linked records are currently immutable once created. Record versioning and edit history will be supported in a future release, along with the ability to lock a hypercert at a specific version for funding.


## What happens next

Once you understand the data model, you're ready to build:

- **[Quickstart](/getting-started/quickstart)** — create your first activity claim
- **[Quickstart](/getting-started/quickstart)** — build a complete hypercert with all record types
- **[Lexicon reference](/lexicons/hypercerts-lexicons)** — field-by-field schema for every record type

Next: [Certified Identity](/core-concepts/certified-identity) — who authors records and how signatures work.
