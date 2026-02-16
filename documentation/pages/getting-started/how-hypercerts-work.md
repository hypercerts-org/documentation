---
title: How Hypercerts Work
description: The data model behind hypercerts — record types, dimensions, and how they connect.
---

# How Hypercerts Work

A hypercert is a collection of linked records that together describe a contribution. This page explains the data model — what records exist, what they contain, and how they connect.

---

## The core record: activity claim

Every hypercert starts with an **activity claim** — the central record that answers four questions:

| Dimension | Question | Example |
|-----------|----------|---------|
| **Contributors** | Who did the work? | `did:plc:alice123`, `did:plc:bob456` |
| **Work scope** | What was done? | "Documentation", "Reforestation" |
| **Time of work** | When was it done? | 2026-01-01 to 2026-03-31 |
| **Rights** | What rights come with this claim? | Public display, transfer |

The activity claim is what you create when you call `repo.hypercerts.create()` in the SDK. It gets a permanent AT-URI like `at://did:plc:alice123/org.hypercerts.claim.activity/3k7`.

---

## Records that attach to a hypercert

Other records link to the activity claim to add context. Each is a separate record with its own AT-URI — they reference the activity claim, not the other way around.

{% figure src="/images/hypercert-erd.png" alt="Hypercert record relationships" /%}

| Record type | What it adds | Who creates it | Lexicon |
|-------------|-------------|----------------|---------|
| **Contribution** | Who specifically was involved and what role they played | The contributor or project lead | `org.hypercerts.claim.contribution` |
| **Evidence** | Supporting documentation — URLs, uploaded files, IPFS links | Anyone with evidence | `org.hypercerts.claim.evidence` |
| **Measurement** | Quantitative data — "12 pages written", "50 tons CO₂ reduced" | The measurer | `org.hypercerts.claim.measurement` |
| **Evaluation** | An independent assessment of the work | A third-party evaluator | `org.hypercerts.claim.evaluation` |
| **Collection** | Groups multiple activity claims into a project or portfolio | The project organizer | `org.hypercerts.claim.collection` |

### Records are standalone

Records don't have to be created together. You can create a measurement first and attach it to an activity claim later. An evaluator can create an evaluation from their own account — it references your activity claim but lives on their server, not yours.

This means a hypercert grows over time. The core claim stays the same, but evidence, measurements, and evaluations accumulate around it.

---

## How records connect

Records reference each other using **strong references** — a combination of AT-URI + CID (content hash). The CID makes the reference tamper-evident: if the referenced record changes, the CID won't match.

```
Activity Claim (the core record)
├── Contribution: Lead author (Alice)
├── Contribution: Technical reviewer (Bob)
├── Evidence: GitHub repository link
├── Measurement: 12 pages written
├── Measurement: 8,500 words
└── Evaluation: "High-quality documentation" (by Carol)
```

Every arrow in this tree is a strong reference. Anyone can verify the entire chain by checking CIDs.

---

## The six dimensions

A complete hypercert defines six dimensions. The first four are in the activity claim itself. The last two come from attached records.

| Dimension | Where it lives | Required? |
|-----------|---------------|-----------|
| **Contributors** | Activity claim | Yes |
| **Work scope** | Activity claim | Yes |
| **Time of work** | Activity claim | Yes |
| **Rights** | Activity claim or separate rights record | Yes |
| **Impact scope** | Evaluations and measurements | No — accumulates over time |
| **Time of impact** | Evaluations and measurements | No — accumulates over time |

The first four dimensions are defined by the contributor at creation time. Impact scope and time of impact emerge later as evaluators and measurers assess the work's actual effects.

---

## What happens next

Once you understand the data model, you're ready to build:

- **[Quickstart](/getting-started/quickstart)** — create your first activity claim
- **[Creating Your First Hypercert](/tutorials/creating-your-first-hypercert)** — build a complete hypercert with all record types
- **[Defining Work Scopes](/getting-started/defining-work-scopes)** — learn the `allOf`/`anyOf`/`noneOf` operators for precise scoping
- **[Lexicon reference](/lexicons/hypercerts-lexicons)** — field-by-field schema for every record type
