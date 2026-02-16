---
title: "Funding & Tokenization"
description: How hypercerts are frozen, anchored on-chain, tokenized, and funded.
---

# Funding & Tokenization

Hypercerts connect impact data on ATProto to funding mechanisms on-chain. The bridge between these layers is a **freeze-then-fund** model: a hypercert's ATProto records are cryptographically frozen, the snapshot is anchored on-chain, and the frozen cert becomes fundable.

{% callout type="note" %}
The tokenization layer is under active development. This page describes the planned architecture. For what exists today, see [Architecture Overview](/architecture/overview).
{% /callout %}

---

## How it works

The funding lifecycle has four stages:

| Stage | What happens | Where |
|-------|-------------|-------|
| **1. Create** | Contributor creates an activity claim with evidence, contributions, and measurements | ATProto (user's PDS) |
| **2. Freeze** | A cryptographic snapshot (CID) is taken of the claim and its associated records | ATProto → snapshot |
| **3. Anchor** | The snapshot CID is recorded on-chain, creating a verifiable link | On-chain |
| **4. Fund** | Funders commit funds to the frozen, anchored cert | On-chain |

After freezing, the core claim is immutable — funders know exactly what they are paying for. Evaluations, evidence, and measurements can still accumulate as separate records that reference the frozen claim.

---

## Freezing

Freezing means taking a content-addressed snapshot of the activity claim and all its associated records at a specific point in time.

**What freezing preserves:**
- The core activity claim — who did what, when, where
- The rights record — what funders receive
- The contributor list and weights

**What continues after freezing:**
- New evaluations referencing the frozen claim
- Additional evidence and measurements
- Labels and moderation signals

A hypercert's reputation evolves over time. Its core content does not.

### Freezing patterns

Different applications can use different strategies for when to freeze:

| Pattern | Description | Trade-off |
|---------|-------------|-----------|
| **Freeze-on-create** | Claim is frozen immediately upon creation | Simple, but the claim can't be enriched before funding |
| **Freeze-when-ready** | Claim accumulates evidence and evaluations first, then freezes when the contributor or funder is ready | Most flexible — this is the expected default |
| **Batch freezing** | Multiple claims are frozen and anchored together periodically | Cost-efficient for high-volume use cases |
| **Partial freezing** | Core activity and rights are frozen; ongoing measurements remain mutable | Useful when work is still in progress |

---

## On-chain anchoring

When a hypercert is frozen, its snapshot CID is anchored on-chain. The on-chain record stores:

- The **AT-URI** of the original record (`at://did:plc:alice/org.hypercerts.claim.activity/3k7`)
- The **frozen snapshot CID** (`bafyrei...`)

This creates a verifiable, immutable link between the ATProto data layer and the on-chain ownership layer. Anyone can verify that the on-chain record matches the ATProto data by comparing CIDs. The specific on-chain mechanism for anchoring is being designed.

---

## Tokenization

Once frozen and anchored, the hypercert can be represented as a transferable token on-chain. Tokens enable ownership, fractional shares, and programmable funding.

| Property | Detail |
|----------|--------|
| **Ownership** | Full or fractional shares of the frozen cert |
| **Rights** | Defined in the hypercert's `org.hypercerts.claim.rights` record |
| **Token standards** | ERC-1155, ERC-721, or custom — the protocol will support multiple standards |
| **Transferability** | Ranges from non-transferable recognition to fully tradable certificates |

---

## Funding mechanisms

Once a hypercert is frozen and anchored, various funding models can operate on the ownership layer:

| Mechanism | Description |
|-----------|-------------|
| **Direct funding** | Funders acquire shares directly from the contributor |
| **Retroactive funding** | Rewarding past work based on demonstrated outcomes |
| **Impact certificates** | Creating markets for verified outcomes |
| **Quadratic funding** | Amplifying small donations through matching pools |
| **Milestone-based payouts** | Releasing funds as work progresses |

On-chain logic enforces rules and distributes payments. Different funding mechanisms can coexist — they all reference the same frozen ATProto snapshots.

---

## Example: from creation to funding

This example follows a hypercert through all four stages of the funding lifecycle.

### Stage 1 — Create and evaluate

Alice plants 500 trees in a reforestation project and creates an activity claim on her PDS, along with measurements and evidence. Bob, an environmental auditor, evaluates the activity claim and its attached measurements and evidence from his own PDS.

| Record | Owner | Location |
|--------|-------|----------|
| Activity claim | Alice | `at://did:plc:alice/org.hypercerts.claim.activity/3k7` |
| Measurement | Alice | `at://did:plc:alice/org.hypercerts.claim.measurement/5m1` |
| Evidence | Alice | `at://did:plc:alice/org.hypercerts.claim.evidence/7e4` |
| Evaluation | Bob | `at://did:plc:bob/org.hypercerts.claim.evaluation/9x2` |

At this point, all records are mutable ATProto data. Alice can still update her claim, and Bob can revise his evaluation.

### Stage 2 — Freeze and anchor

Alice decides the claim is ready for funding. An application freezes the claim, producing a snapshot CID, and anchors it on-chain.

| Layer | What's stored |
|-------|--------------|
| **ATProto** | Original activity claim (now frozen) at `at://did:plc:alice/.../3k7` |
| **On-chain** | Snapshot CID `bafyrei...` + AT-URI reference → minted as token `#42` |

The core claim is now immutable. The on-chain record and the ATProto snapshot are linked by the same CID — anyone can verify they match.

### Stage 3 — Fund

Carol, a climate funder, reviews Alice's frozen claim and Bob's evaluation. She acquires token `#42` on-chain, funding Alice's work.

### After funding

The frozen claim doesn't change, but the hypercert continues to evolve:

| What | Mutable? | Example |
|------|----------|---------|
| Core activity claim | No — frozen | "Planted 500 trees in Q1 2026" |
| Evaluations | Yes — new ones can be added | A second auditor verifies survival rates |
| Evidence | Yes — new records reference the frozen claim | Satellite imagery from 6 months later |
| On-chain ownership | Yes — token can transfer | Carol sells 50% of token `#42` to Dave |

{% callout type="note" %}
The separation matters. ATProto provides data portability — users control their data and can migrate between servers. On-chain anchoring provides ownership guarantees — ownership is verifiable, transactions are irreversible, and funding rules are enforced. Neither layer can provide both properties alone.
{% /callout %}

---

## What this enables

| Capability | Description |
|------------|-------------|
| **Retroactive funding** | Fund past contributions based on demonstrated outcomes |
| **Composable mechanisms** | Different funding models operate on the same frozen data |
| **Portable proof of funding** | Funders can cryptographically prove what they funded |
| **Independent evolution** | Data and ownership layers evolve separately — evaluations accumulate on ATProto while ownership transfers on-chain |

---

## See also

- [Architecture Overview](/architecture/overview) — how the full protocol stack fits together
- [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle) — how a hypercert moves through the system
- [The Hypercerts Infrastructure](/getting-started/the-hypercerts-infrastructure) — the two-layer architecture
- [Roadmap](/roadmap) — current build priorities and development phases
