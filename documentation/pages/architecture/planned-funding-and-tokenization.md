---
title: "Planned: Funding & Tokenization"
description: How hypercerts will be frozen, anchored on-chain, and funded. This layer is not yet implemented.
---

# Planned: Funding & Tokenization

The on-chain funding and tokenization layer is not yet implemented. This page describes the planned design. The theory and architecture are sound — the implementation is in progress. For what exists today (the ATProto data layer), see [Architecture Overview](/architecture/overview).

## The Freeze-Then-Fund Model

The core concept: before a hypercert can be funded, its ATProto records must be frozen. Freezing means taking a cryptographic snapshot (CID) of the activity claim and all its associated records at a point in time. This snapshot is then anchored on-chain.

Why freezing is necessary: a funder must know exactly what they are funding. If the cert's contents could change after funding, the funder might end up paying for a different cert than what they committed to. A hypercert cannot be funded if its contents are still changing.

What freezing preserves: the core activity claim — who did what, when, where. The frozen state is what funders commit to.

What continues after freezing: evaluations and evidence can still accumulate. These are separate records that reference the frozen claim. The claim's reputation can evolve while its core content remains fixed.

## On-Chain Anchoring

When a hypercert is frozen, its snapshot CID will be anchored on-chain via a smart contract. The contract stores the AT-URI and the frozen snapshot CID, creating a verifiable link between the data layer and the ownership layer.

This creates an immutable reference point. Anyone can verify that the on-chain record matches the ATProto data by comparing CIDs.

## Tokenization

Once frozen and anchored, the hypercert can be represented as a transferable token on-chain. A token could represent full ownership or fractional shares. Token holders would have rights defined in the hypercert's org.hypercerts.claim.rights record.

The specific token standard (ERC-1155, ERC-721, or a custom standard) is being designed. The protocol intends to support multiple token standards for different use cases — from non-transferable recognition to fully tradable certificates.

## Funding Mechanisms

Once frozen and anchored, various funding models can operate on the ownership layer:
- Direct funding — funders acquire shares directly from the contributor
- Retroactive funding — rewarding past work based on demonstrated outcomes
- Impact certificates — creating markets for outcomes
- Quadratic funding — amplifying small donations through matching pools
- Milestone-based payouts — releasing funds as work progresses

Smart contracts will enforce rules and distribute payments. The specific implementations are being designed.

## Funding Readiness Patterns

Different applications may use different patterns for when to freeze:

Pattern 1: Freeze-on-create — the claim is frozen immediately upon creation. Simple but means the claim can't be enriched before funding.

Pattern 2: Freeze-when-ready — the claim exists on ATProto, accumulates evidence and evaluations, and is frozen only when a funder expresses interest or the contributor decides it's ready. This is the expected default pattern.

Pattern 3: Batch freezing — multiple claims are frozen and anchored together periodically. Cost-efficient for high-volume use cases.

Pattern 4: Partial freezing — some aspects of the claim are frozen (e.g., the core activity and rights) while others remain mutable (e.g., ongoing measurements). The frozen portion is what funders commit to.

## Multi-Chain Support

The protocol is designed to be chain-agnostic. Different communities may use different chains. The ATProto data layer remains the same regardless of which chain anchors the frozen snapshot. The specific multi-chain architecture is being designed.

## Cross-Layer Example

Walk through the full planned flow:
1. Alice creates an activity claim on her PDS → gets AT-URI
2. Bob evaluates Alice's claim from his PDS
3. Alice decides the claim is ready for funding → freezes it
4. An application anchors the frozen snapshot on-chain → gets token ID
5. Carol funds the frozen cert on-chain
6. New evaluations continue accumulating on ATProto, referencing the frozen claim
7. Carol can verify her funded cert matches the frozen snapshot by comparing CIDs

Include the ASCII diagram:
```
ATProto (exists today)              On-chain (planned)
──────────────────────              ──────────────────
Activity Claim                      Frozen Snapshot
at://did:alice/...                  CID: bafyrei...
  ↓                                    ↓
Evidence, Evaluations               Ownership Record
Measurements, Rights                Funder: 0xCarol...
                                    Metadata: { uri, cid }
```

## What This Will Enable

- Retroactive funding of past contributions
- Composable funding mechanisms across platforms
- Portable proof of funding (funders can prove what they funded)
- Independent evolution of data and ownership layers

## Next Steps

For the current architecture (what exists today), see [Architecture Overview](/architecture/overview). For the data lifecycle, see [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle).
