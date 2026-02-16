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

The new protocol is built on AT Protocol instead of purely on-chain. This gives data portability, richer schemas, and lower costs. On-chain anchoring for funding is [planned](/architecture/planned-funding-and-tokenization) but not yet implemented.

## Do I need a blockchain wallet?

Not to create or evaluate hypercerts — you only need an ATProto account (DID). A blockchain wallet will be needed for on-chain funding once the [tokenization layer](/architecture/planned-funding-and-tokenization) is built.

## Is my data public?

Yes. All ATProto records are public by default. Do not store sensitive personal information in hypercert records. Anyone can read the data you publish to your PDS.

## Can I delete a hypercert?

You can delete records from your PDS. However, cached copies may persist in indexers and relays. Once data is published to the network, it should be considered permanent.

## Who can evaluate my hypercert?

Anyone with an ATProto account. Evaluations are separate records on the evaluator's PDS, linked via strong references. You don't control who evaluates your work, but you can choose which evaluations to display or acknowledge.

## How do I fund a hypercert?

The on-chain funding layer is not yet implemented. The planned design freezes ATProto records before funding to ensure funders know exactly what they are paying for. See [Planned: Funding & Tokenization](/architecture/planned-funding-and-tokenization) for details.

## Can I use my Bluesky account?

Yes. Bluesky accounts are ATProto accounts. Your existing DID works with Hypercerts. You can use the same identity across all ATProto applications.

## What chains are supported?

The protocol intends to be chain-agnostic. The on-chain layer is not yet implemented — see [Planned: Funding & Tokenization](/architecture/planned-funding-and-tokenization).

## How do I get help?

{% callout type="note" %}
For technical support, visit the [GitHub repository](https://github.com/hypercerts-org) or join our community channels. Documentation and examples are available throughout this site.
{% /callout %}
