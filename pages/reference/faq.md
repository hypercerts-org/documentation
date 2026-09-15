---
title: FAQ
description: Common questions about building with Hypercerts.
---

# FAQ

---

## What is a hypercert?

A structured digital record of a contribution — who did what, when, where, and with what supporting documentation. Its core is an `org.hypercerts.claim.activity` record stored in an AT Protocol repository. See [Client Integration](/client-integration) for current integration guidance and known gaps.

## How is this different from the previous (EVM-based) Hypercerts?

The current protocol stores its source records on AT Protocol rather than representing every hypercert as an onchain token. The released Lexicons do not define anchoring, freezing, token ownership, or settlement.

## Do I need a blockchain wallet?

Not for the released Hypercerts record model. A particular application or payment mechanism may separately require a wallet.

## Can I use my Bluesky account?

Bluesky accounts are AT Protocol accounts. They can use Hypercerts applications that support their authentication provider and request the required record permissions; support is an application capability, not a guarantee of the record Lexicons.

## Is my data public?

Yes. All records are public by default. Do not store sensitive personal information in hypercert records. See the privacy section in [Testing & Deployment](/getting-started/testing-and-deployment) for guidance on what to include and what to keep off-protocol.

## Can I delete a hypercert?

You can delete records from your account. However, cached copies may persist in indexers temporarily. Once data is published, treat it as potentially permanent.

## Who can evaluate my hypercert?

Anyone with an ATProto account. Evaluations are separate records created by the evaluator, linked to your hypercert via a strong reference. You don't control who evaluates your work. See the [Evaluation Lexicon](/lexicons/hypercerts-lexicons/evaluation) for the record schema.

## How do I query hypercerts across the network?

For a known AT-URI, read the record from its repository. Cross-repository discovery requires an indexing service and depends on that service's coverage. The supported Hypercerts XRPC read API is being documented as it stabilizes. [Hyperindex](/tools/hyperindex) remains available as legacy GraphQL infrastructure, but it is not the target protocol interface.

## How do I fund a hypercert?

Hypercerts does not execute payments. A platform can process funding through its chosen payment rail and publish a funding receipt that describes the payment. The receipt does not independently prove settlement. See [Funding Records & Value Flow](/core-concepts/funding-and-value-flow).

## Where do I get help?

- [GitHub](https://github.com/hypercerts-org) — source code and repository-specific issues or discussions
