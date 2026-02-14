---
title: Frequently Asked Questions
description: Common questions about the Hypercerts Protocol.
---

# {% $markdoc.frontmatter.title %}

{% $markdoc.frontmatter.description %}

---

## What is a hypercert?

A hypercert is a structured digital record of a contribution. It captures who did what, when, where, and with what evidence. Hypercerts make impact work transparent, verifiable, and fundable.

## How is this different from the previous (EVM-based) Hypercerts?

The new protocol is built on AT Protocol instead of purely on-chain. This gives data portability, richer schemas, and lower costs, while still using blockchain for ownership and funding. The data layer is now decentralized through ATProto, making hypercerts more accessible and flexible.

## Do I need a blockchain wallet?

Not to create or evaluate hypercerts. You need an ATProto account (DID). A wallet is only needed if you want to tokenize or fund hypercerts on-chain.

## Is my data public?

Yes. All ATProto records are public by default. Do not store sensitive personal information in hypercert records. Anyone can read the data you publish to your PDS.

## Can I delete a hypercert?

You can delete records from your PDS. However, cached copies may persist in indexers and relays. Once data is published to the network, it should be considered permanent.

## Who can evaluate my hypercert?

Anyone with an ATProto account. Evaluations are separate records on the evaluator's PDS, linked via strong references. You don't control who evaluates your work, but you can choose which evaluations to display or acknowledge.

## How do I fund a hypercert?

Funding happens on-chain through tokenized ownership. The specific mechanisms depend on the platform you use. The hypercert data itself lives on ATProto, while ownership and financial transactions happen on blockchain.

## Can I use my Bluesky account?

Yes. Bluesky accounts are ATProto accounts. Your existing DID works with Hypercerts. You can use the same identity across all ATProto applications.

## What chains are supported?

The protocol is chain-agnostic for the ownership layer. Specific chain support depends on the implementation. The data layer (ATProto) is independent of any particular blockchain.

## How do I get help?

{% callout type="note" %}
For technical support, visit the [GitHub repository](https://github.com/hypercerts-org) or join our community channels. Documentation and examples are available throughout this site.
{% /callout %}
