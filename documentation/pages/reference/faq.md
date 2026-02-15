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

The new protocol is built on AT Protocol instead of purely on-chain. This gives data portability, richer schemas, and lower costs, while planning to use on-chain anchoring to freeze hypercerts before funding. The tokenization layer is not yet implemented, but the architecture is designed for it. The data layer is now decentralized through ATProto, making hypercerts more accessible and flexible.

## Do I need a blockchain wallet?

Not to create or evaluate hypercerts — you only need an ATProto account (DID). A blockchain wallet will eventually be needed to fund hypercerts on-chain, but the tokenization layer is not yet implemented. The on-chain mechanisms are being designed.

## Is my data public?

Yes. All ATProto records are public by default. Do not store sensitive personal information in hypercert records. Anyone can read the data you publish to your PDS.

## Can I delete a hypercert?

You can delete records from your PDS. However, cached copies may persist in indexers and relays. Once data is published to the network, it should be considered permanent.

## Who can evaluate my hypercert?

Anyone with an ATProto account. Evaluations are separate records on the evaluator's PDS, linked via strong references. You don't control who evaluates your work, but you can choose which evaluations to display or acknowledge.

## How do I fund a hypercert?

The planned approach: before a hypercert can be funded, its ATProto records must be frozen — a cryptographic snapshot is taken and anchored on-chain. This ensures funders know exactly what they are paying for, since the cert's contents cannot change after freezing. The specific on-chain funding mechanisms are being designed. The hypercert data itself lives on ATProto, while the frozen snapshot and funding state will live on-chain. The tokenization layer is not yet implemented.

## Can I use my Bluesky account?

Yes. Bluesky accounts are ATProto accounts. Your existing DID works with Hypercerts. You can use the same identity across all ATProto applications.

## What chains are supported?

The protocol intends to be chain-agnostic for on-chain anchoring and funding. The tokenization layer is not yet implemented, so specific chain support has not been determined. The data layer (ATProto) is independent of any particular blockchain.

## How do I get help?

{% callout type="note" %}
For technical support, visit the [GitHub repository](https://github.com/hypercerts-org) or join our community channels. Documentation and examples are available throughout this site.
{% /callout %}
