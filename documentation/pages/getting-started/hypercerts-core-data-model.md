---
title: Hypercerts Core Data Model
description: The data model behind hypercerts — record types, dimensions, and how they connect.
---

# Hypercerts Core Data Model

A hypercert is a collection of linked records that together describe a contribution. This page explains the data model — what records exist, what they contain, and how they connect.

## The core record: activity claim

Every hypercert starts with an **activity claim** — the central record that answers four questions:

| Dimension | Question | Example |
|-----------|----------|---------|
| **Contributors** | Who is doing (or did) the work? | `did:plc:alice123`, `did:plc:bob456` |
| **Work scope** | What are they doing (or what did they do)? | "Documentation", "Reforestation" |
| **Time of work** | When is it happening (or when did it happen)? | 2026-01-01 to 2026-03-31 |
| **Location** | Where is it taking (or did it take) place? | GeoJSON location data |

In addition to these core dimensions, the activity claim can define the rights that come with this claim. The basic right is just "public display", e.g. bragging rights about financial or non-financial contributions to impact. If the hypercert is tokenized, the field can define how the hypercert is allowed to be transferred.

The activity claim is what you create when you call `repo.hypercerts.create()` in the SDK. It gets a permanent AT-URI like `at://did:plc:alice123/org.hypercerts.claim.activity/3k7`.

## Additional details

To add further information to the individual contributors, separate records with their own AT-URI can be created. They can then be referenced from the activity claim.

| Record type | What it adds | Who creates it | Lexicon |
|-------------|-------------|----------------|---------|
| **Contributor Information** | Social profile, image, display name | The contributor or project lead | `org.hypercerts.claim.contributorInformation` |
| **Contribution Details** | What was the role of the contributor, what did they contribute | The contributor or project lead | `org.hypercerts.claim.contributionDetails` |

## Records that attach to a hypercert

Other records link to the activity claim to add context. Again, each is a separate record with its own AT-URI – they reference the activity claim, not the other way around.

{% figure src="/images/hypercert-erd.png" alt="Hypercert record relationships" /%}

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

Often hypercerts belong to each other in a project, e.g. in a multi-year project a hypercert might represent the work in one year, such that the full project is a collection of multiple hypercerts.

| Record type | What it adds | Who creates it | Lexicon |
|-------------|-------------|----------------|---------|
| **Collection** | Groups activity claims and/or other collections into a project or portfolio. Supports recursive nesting. | E.g. the project organizer | `org.hypercerts.claim.collection` |

## How records connect

Records reference each other using **strong references** — a combination of AT-URI + CID (content hash). The CID makes the reference tamper-evident: if the referenced record changes, the CID won't match.

```text
Activity Claim (the core record)
├── Contributor 1
│   ├── ContributorInformation: Alice
│   └── ContributionDetails: Lead author
├── Contributor 2
│   ├── ContributorInformation: Bob
│   └── ContributionDetails: Technical reviewer
├── Attachment: GitHub repository link
├── Measurement: 12 pages written
├── Measurement: 8,500 words
└── Evaluation: "High-quality documentation" (by Carol)
```

Every arrow in this tree is a strong reference. Anyone can verify the entire chain by checking CIDs.


## What happens next

Once you understand the data model, you're ready to build:

- **[Quickstart](/getting-started/quickstart)** — create your first activity claim
- **[Creating Your First Hypercert](/tutorials/creating-your-first-hypercert)** — build a complete hypercert with all record types
- **[Lexicon reference](/lexicons/hypercerts-lexicons)** — field-by-field schema for every record type
