---
title: FAQ
description: Common questions about building with Hypercerts.
---

# FAQ

---

#### What is a hypercert?

A structured digital record of a contribution — who did what, when, where, and with what evidence. You create one with the SDK by calling `repo.hypercerts.create()`. See the [Quickstart](/getting-started/quickstart).

#### How is this different from the previous (EVM-based) Hypercerts?

The new protocol stores data on AT Protocol instead of purely on-chain. This gives you richer schemas, data portability, and lower costs. On-chain anchoring for funding is [planned](/architecture/planned-funding-and-tokenization) but not yet implemented.

#### Do I need a blockchain wallet?

Not to create or evaluate hypercerts — you only need an account on [certified.app](https://certified.app) or any ATProto provider. A wallet will be needed for on-chain funding once the [tokenization layer](/architecture/planned-funding-and-tokenization) is built.

#### Can I use my Bluesky account?

Yes. Bluesky accounts are ATProto accounts. Your existing DID and identity work with Hypercerts out of the box.

#### Is my data public?

Yes. All records are public by default. Do not store sensitive personal information in hypercert records. See the privacy section in [Testing & Deployment](/reference/testing-and-deployment) for guidance on what to include and what to keep off-protocol.

#### Can I delete a hypercert?

You can delete records from your account. However, cached copies may persist in indexers temporarily. Once data is published, treat it as potentially permanent.

#### Who can evaluate my hypercert?

Anyone with an ATProto account. Evaluations are separate records created by the evaluator, linked to your hypercert via a strong reference. You don't control who evaluates your work. See [Working with Evaluations](/tutorials/working-with-evaluations).

#### How do I query hypercerts across the network?

Use the [Hyperindex](/tools/hyperindex) GraphQL API at `hypergoat.certified.app/graphql`. It indexes all hypercert records across the network and supports filtering, search, and real-time subscriptions.

#### How do I fund a hypercert?

The on-chain funding layer is not yet implemented. The planned design freezes records before funding to ensure funders know exactly what they are paying for. See [Funding & Tokenization](/architecture/planned-funding-and-tokenization).

#### Where do I get help?

- [GitHub](https://github.com/hypercerts-org) — source code, issues, and discussions
- [Roadmap](/roadmap) — what's being built and what's next
