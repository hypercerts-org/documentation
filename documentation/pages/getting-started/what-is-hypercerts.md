---
title: What is Hypercerts?
description: A protocol for recording, evaluating, and funding impact work.
---

# What is Hypercerts?

Hypercerts is an open protocol for recording who did what, when, where, and with what evidence — then connecting that record to evaluations and funding. Each record is called a **hypercert**.

A hypercert is a structured digital claim that says: *"This person or team did this work, during this time period, in this scope."* Other people can then attach evidence, measurements, and evaluations to that claim. Funders can use these enriched claims to make better decisions about what to support.

## What a hypercert contains

Every hypercert starts as an **activity claim** — the core record. It captures four dimensions:

- **Who** — the contributors who did the work
- **What** — the work scope (e.g., "documentation", "reforestation", "open-source maintenance")
- **When** — the time period the work covers
- **Where** — the geographic location, if applicable

From there, additional records can be attached:

- **Evidence** — links, files, or descriptions that back up the claim
- **Measurements** — quantitative data (e.g., "142 issues resolved", "50 hectares restored")
- **Evaluations** — third-party assessments from domain experts
- **Contributions** — details about individual contributors and their roles
- **Rights** — what rights holders have (display, transfer, etc.)

All of these records are stored on [AT Protocol](/getting-started/why-atproto), a decentralized data layer. They are cryptographically signed, publicly verifiable, and owned by the people who created them.

## How it works

1. A contributor creates a hypercert on their Personal Data Server (PDS)
2. They attach evidence and measurements to substantiate the claim
3. Independent evaluators assess the work and create evaluation records on their own PDS
4. Funders discover enriched claims through indexers and platforms
5. Optionally, the hypercert is tokenized on-chain for ownership and funding

Because the data lives on ATProto, hypercerts are **portable** (not locked into any single platform), **interoperable** (any app can read and write them using shared schemas), and **verifiable** (anyone can check the cryptographic signatures).

## Who uses hypercerts

- **Projects** create hypercerts to make their work visible and fundable
- **Evaluators** assess claims to help funders make informed decisions
- **Funders** use enriched claims to direct resources to high-impact work
- **Platforms** build tools on top of the protocol — funding platforms, dashboards, evaluation tools

## Example

A reforestation project creates a hypercert:

> **Title:** Mangrove restoration in Sundarbans, 2025
> **Work scope:** Reforestation
> **Time period:** January–December 2025
> **Measurement:** 50 hectares restored (verified by satellite imagery)
> **Evaluation:** "High-quality restoration with strong community engagement" — assessed by an independent ecologist

This hypercert lives on the project's PDS. Any platform in the ecosystem can display it. Any evaluator can add their assessment. Any funder can see the full picture — the claim, the evidence, and the evaluations — and decide whether to fund it.

{% callout type="note" %}
Hypercerts are not limited to environmental work. They can represent any contribution: open-source software, scientific research, journalism, community organizing, digital public goods, and more.
{% /callout %}
