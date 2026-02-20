---
title: "Funding & Value Flow"
description: How hypercerts track funding of activities and optionally wrap claims in onchain tokens.
---

# Funding & Value Flow

Hypercerts track the funding of activities without prescribing how funds flow. Any payment technology works — credit cards, PayPal, bank transfers, onchain payments. Any funding mechanism works — grants, crowdfunding, retroactive funding, and more.

What hypercerts add is a structured, verifiable record of who funded what. Optionally, a hypercert can be wrapped in an onchain token, enabling programmable funding and transferable proof of contribution.

{% callout type="note" %}
Funding tracking is available today. The tokenization layer is under active development. For what exists today, see [Architecture Overview](/architecture/overview).
{% /callout %}

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

Multiple mechanisms can coexist for the same activity — a project might receive a grant prospectively and sell impact certificates retroactively. Hypercerts allows us to track it accurately without double counting.

## Tracking funding

Hypercerts separate the *tracking* of funding from the *flow* of funds. Any existing payment infrastructure can work with hypercerts — the protocol simply records the fact that funding happened.

The protocol tracks funding through the `org.hypercerts.funding.receipt` record. A funding receipt records who funded which activity, how much, and when — creating a verifiable funding trail on ATProto.

The receipt references the activity claim it funds, linking the funding record to the work it supports.

The protocol does not enforce that projects or funders disclose their funding — creating a receipt is voluntary. Funders can also choose to remain anonymous in the public record; a receipt can track a contribution without revealing the funder's identity.

### Who creates the receipt

How a funding receipt gets created depends on where the funding happens:

| Scenario | Who creates the receipt | Verification |
|----------|------------------------|--------------|
| **Onchain funding** | The funding transaction is linked directly in the receipt (transaction hash, chain ID) | Verifiable onchain |
| **Third-party oracle** | An intermediary — a payment processor, grant platform, or fiscal sponsor — creates the receipt on behalf of the funder | Trust in the oracle |
| **Self-reported** | The project or funder creates the receipt themselves | Ideally verified by the counterparty |

Self-reported receipts are the most accessible option — anyone can create one. But they carry less weight without independent verification. When a funder reports their own contribution, the project can confirm it (and vice versa), strengthening the credibility of the record.

## Tokenization

{% callout type="note" %}
Tokenization is under active development. This section describes the planned architecture.
{% /callout %}

A hypercert can optionally be wrapped in an onchain token. This gives funders a programmable proof of their contribution.

A token can represent either a mutable or a locked claim. If the underlying hypercert is locked before tokenization, funders get a stronger guarantee — the claim they reviewed is exactly the claim they funded, and it cannot change after the fact. If the claim is not locked (which can make sense for prospective funding, where the work hasn't happened yet), funders should be clearly informed that the data behind their token may still evolve.

| Property | Detail |
|----------|--------|
| **Token standards** | ERC-20, ERC-1155, or custom — different standards on different chains |
| **Transferability** | Ranges from non-transferable recognition to fully transferable certificates |
| **Single-wrap constraint** | Every claim can only be wrapped in a token once, preventing double counting |
| **Rights** | Optional definition of the rights of the owners, set in the hypercert's `org.hypercerts.claim.rights` record |

Tokenization enables programmable funding — smart contract logic can enforce distribution rules, matching formulas, and other mechanisms that would be difficult to coordinate offchain.

## Example: from creation to funding

There are many different flows that can be represented with hypercerts. Below is one example that follows a hypercert through its lifecycle — from creation to funding, with optional tokenization.

### Stage 1 — Creation and first evaluation

Alice plants 500 trees in a reforestation project and creates an activity claim on her PDS, along with measurements and attachments. Bob, an environmental auditor, evaluates the activity claim and its attached measurements of the new trees and attachments from his own PDS.

| Record | Owner | Location |
|--------|-------|----------|
| Activity claim | Alice | `at://did:plc:alice/org.hypercerts.claim.activity/3k7` |
| Measurement | Alice | `at://did:plc:alice/org.hypercerts.claim.measurement/5m1` |
| Attachment | Alice | `at://did:plc:alice/org.hypercerts.claim.attachment/7e4` |
| Evaluation | Bob | `at://did:plc:bob/org.hypercerts.claim.evaluation/9x2` |

At this point, all records are mutable ATProto data. Alice can still update her claim, and Bob can revise his evaluation.

### Stage 2 — Funding

Carol, a climate funder, reviews Alice's claim and Bob's evaluation. She decides to fund Alice's work through her organization's grant program. A funding receipt is created on ATProto, recording Carol's contribution and referencing Alice's activity claim.

| Record | Owner | Location |
|--------|-------|----------|
| Funding receipt | Carol | `at://did:plc:carol/org.hypercerts.funding.receipt/2f8` |
| Verification | Alice | `at://did:plc:alice/org.hypercerts.acknowledgement/3f2` |

The receipt links to Alice's activity claim, creating a verifiable record that Carol funded this work. The actual payment — whether by bank transfer, credit card, or any other method — happens outside the protocol. Alice verifies the funding receipt.

### Stage 3 — Lock and tokenize

Alice can lock the hypercert by wrapping it in an onchain token or anchoring it onchain without a token. This can happen at any time; a good time to do so is when the actual work is completed.

If she creates a token, for instance on Ethereum Mainnet, she can distribute some to Carol in recognition of her earlier funding. Another funder, Dave, can then fund the activity by acquiring tokens — directly receiving proof of his contribution.

| Record | Owner | Location |
|--------|-------|----------|
| ERC-1155 Token (75%) | Alice | `0xAa01…1111` |
| ERC-1155 Token (15%) | Carol | `0xCc03…3333` |
| ERC-1155 Token (10%) | Dave | `0xDd04…4444` |

### Stage 4 — Retroactive funding

Two years later, a second evaluator, Eve, assesses the health of Alice's trees and publishes a positive evaluation. Faythe, a climate funder focused on proven outcomes, sees the original claim, both evaluations, and Carol's earlier funding. She decides to fund the project retroactively — either through any classic payment flow with a new funding receipt referencing the same activity claim, or by acquiring tokens if the hypercert was tokenized.

| Record | Owner | Location |
|--------|-------|----------|
| Measurement | Eve | `at://did:plc:eve/org.hypercerts.claim.measurement/2x1` |
| Evaluation | Eve | `at://did:plc:eve/org.hypercerts.claim.evaluation/2f2` |
| ERC-1155 Token (50%) | Alice | `0xAa01…1111` |
| ERC-1155 Token (25%) | Faythe | `0xFf06…6666` |
| ERC-1155 Token (15%) | Carol | `0xCc03…3333` |
| ERC-1155 Token (10%) | Dave | `0xDd04…4444` |

## What this enables

| Capability | Description |
|------------|-------------|
| **Works with any payment technology** | Credit cards, bank transfers, onchain payments — the protocol tracks the funding, not the payment |
| **Works with any funding mechanism** | Grants, prizes, quadratic funding, impact certificates — any mechanism can create funding receipts |
| **Prospective and retroactive funding** | Fund planned work or reward demonstrated outcomes |
| **Composable mechanisms** | Different funding models operate on the same underlying data |
| **Portable proof of funding** | Funders can prove what they funded, whether onchain or offchain |
| **Independent evolution** | Data and ownership layers evolve separately — evaluations accumulate on ATProto while potential ownership transfers onchain |

## See also

- [Architecture Overview](/architecture/overview) — how the full protocol stack fits together
- [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle) — how a hypercert moves through the system
- [Roadmap](/roadmap) — current build priorities and development phases
