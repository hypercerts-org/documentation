---
title: "Funding & Value Flow"
description: How hypercerts track the funding of activities.
---

# Funding & Value Flow

{% callout type="note" %}
Funding is under active development.
{% /callout %}

Hypercerts track the funding of activities without prescribing how funds flow — any payment method and any funding mechanism works.

What hypercerts add is a structured, verifiable record of who funded what.

## Hypercerts work with any funding mechanism

Funding can be **prospective** (before work begins) or **retroactive** (after outcomes are demonstrated). Different mechanisms suit different contexts, for example:

| Mechanism | Description |
|-----------|-------------|
| **Grant funding** | Funders award grants to support planned activities |
| **Milestone-based funding** | Funds are released as work reaches defined milestones |
| **Prize competitions** | Awards for achieving specific outcomes |
| **Quadratic funding** | Small donations amplified through matching pools |
| **Sale of impact certificates** | Funders purchase certificates representing completed work |
| **Auction of impact certificates** | Competitive bidding on verified impact claims |

Multiple mechanisms can coexist for the same activity — a project might receive a grant prospectively and sell impact certificates retroactively. Hypercerts tracks this accurately without double counting: every funding receipt references the specific activity claim it funds, making it possible to compute total funding per claim across all receipts.

## Tracking funding

{% callout type="note" %}
Funding tracking is in active development. Receipts and acknowledgements exist today.
{% /callout %}

Hypercerts separate the *tracking* of funding from the *flow* of funds. Any existing payment infrastructure can work with hypercerts — the protocol simply records the fact that funding happened.

The protocol tracks funding through the `org.hypercerts.funding.receipt` record. A funding receipt records who funded which activity, how much, and when — creating a verifiable funding trail. The receipt references the activity claim it funds, linking the funding record to the work it supports.

Funding receipts are typically created by a **facilitator** — a payment processor, grant platform, funding app, or other intermediary that processes the payment and creates the receipt. The facilitator acts as a neutral third party, giving the receipt more credibility than a self-reported claim.

| Scenario | Facilitator | Verification |
|----------|-------------|--------------|
| **Onchain funding** | A funding app verifies the transaction and creates the receipt, linking the transaction hash and chain ID | Verifiable onchain |
| **Card / bank transfer** | A payment processor settles the payment and creates the receipt | Trust in the processor |
| **Grant platform** | The grant platform records the award and creates the receipt on behalf of the funder | Trust in the platform |

The funder or the contributor can then create an **acknowledgement** — a counter-signature confirming the receipt's accuracy — to strengthen its credibility.

The protocol does not enforce that projects or funders disclose their funding — creating a receipt is voluntary. Funders can also choose to remain anonymous in the public record; a receipt can track a contribution without revealing the funder's identity.

## Tokenization

{% callout type="note" %}
Tokenization is under active development. This section describes the planned architecture.
{% /callout %}

A hypercert can optionally be wrapped in an onchain token. This gives funders a programmable proof of their contribution. Tokenization is an optional wrapper around a claim snapshot; the canonical record remains the AT Protocol data.

When locking is available, a claim can be frozen before tokenization. This gives funders a stronger guarantee — the claim they reviewed is exactly the claim they funded, and it cannot change after the fact.

| Property | Detail |
|----------|--------|
| **Token standards** | ERC-20, ERC-1155, or custom — different standards on different chains |
| **Transferability** | Ranges from non-transferable recognition to fully transferable certificates |
| **Single-wrap constraint** | Every claim can only be wrapped in a token once, preventing double counting |
| **Rights** | Optional definition of the rights of the owners, set in the hypercert's `org.hypercerts.claim.rights` record |

Tokenization enables programmable funding — smart contract logic can enforce distribution rules, matching formulas, and other mechanisms that would be difficult to coordinate offchain.

## Example: from creation to funding

There are many different flows that can be represented with hypercerts. Below is one example that follows a hypercert from creation to funding.

### Stage 1 — Creation and evaluation

Alice plants 500 trees in a reforestation project and creates an activity claim with measurements and attachments. Bob, an environmental auditor, evaluates the claim from his own PDS. See [Quickstart](/getting-started/quickstart) for a walkthrough.

### Stage 2 — Funding

Carol, a climate funder, reviews Alice's claim and Bob's evaluation. She decides to fund Alice's work through her organization's grant platform. The payment facilitator processes the payment and creates a funding receipt, recording Carol's contribution and referencing Alice's activity claim.

| Record | Owner |
|--------|-------|
| Funding receipt | Payment facilitator |
| Acknowledgement | Alice or Carol |

Either party can then create an acknowledgement — a counter-signature confirming the receipt's accuracy — to strengthen its credibility.

### Stage 3 — Locking

{% callout type="note" %}
Locking is planned but not yet implemented.
{% /callout %}

Alice locks the claim, freezing it so its contents can't change. This gives future funders a guarantee — the claim they review is exactly the claim they'll be funding.

### Stage 4 — Retroactive funding

Two years later, Eve assesses the health of Alice's trees and publishes a positive evaluation. Grace, a climate funder focused on proven outcomes, sees the original claim, both evaluations, and Carol's earlier funding. She funds the project retroactively with a new funding receipt referencing the same activity claim.


## See also

- [Architecture Overview](/architecture/overview) — how the full protocol stack fits together
- [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle) — how a hypercert moves through the system

