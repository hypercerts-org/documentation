---
title: What are Hypercerts?
description: Living digital records of impact that help you track, share, and get recognized for the work you do.
---

# What are Hypercerts?

A hypercert is a living record of impact work — a verifiable claim that grows as the creator and others add measurements, evaluations, and supporting evidence.

Think of it like this: you do meaningful work — restoring a forest, maintaining open-source software, running a community program, publishing research. A hypercert captures that work in a structured, verifiable record. Over time, others enrich it with measurements and evaluations — making it more trustworthy and more useful for recognition and funding.

## The structure of a hypercert

At its core, a hypercert answers four questions:

- **Who** is doing (or did) the work?
- **What** are they doing (or what did they do)?
- **When** is it happening (or when did it happen)?
- **Where** did it happen? (physical or digital)

That's the starting point. From there, the record grows as people add more context:

- **Attachments** — photos, links, datasets, documents, or descriptions that substantiate the work
- **Measurements** — quantitative indicators that make the impact concrete ("142 issues resolved", "50 hectares restored"), which can be outputs or outcomes depending on the domain
- **Evaluations** — independent qualitative or quantitative assessments from domain experts, community members, beneficiaries, etc.
- **Contributions** — additional information about who was involved and what they contributed
- **Rights** — what rights are attached to the hypercert (e.g. public display)



## What a hypercert is not

- **Not a grant application** — it records work that has been done or is in progress, not a request for funding
- **Not a token** — it's a data record, though onchain tokenization for funding is planned
- **Not a single document** — it’s a collection of linked records that can grow over time

## How people use them

**If you're doing the work**, you create a hypercert to make your contributions visible. Instead of writing reports that sit in a folder, you publish a verifiable record that any platform can display and build on.

**If you're evaluating work**, you add your assessment to someone else's hypercert. Your evaluation lives on your own data server linking to their work. You build up reputation over time based on your assessments.

**If you're funding work**, you can see the full picture before deciding: the original claim, the attachments behind it, and what independent evaluators think. Funding decisions can be based on verifiable records — not just narratives, wordy applications, and guessing.

**If you're building a platform**, you can read and write hypercerts using shared schemas. A funding platform, a project dashboard, and an evaluation tool can all work with the same data.

## An example

Say a team runs a coastal reforestation project. They create a hypercert:

> **Coastal mangrove restoration, 2025**
>
> 50 hectares restored over 12 months (the activity claim). Satellite imagery confirms canopy coverage. An independent ecologist evaluates the work as "high-quality restoration with strong community engagement."

The activity claim is the starting record. Over the following months, the team adds measurement data as new satellite imagery comes in. An independent evaluator reviews the project and attaches their assessment. A funder browsing the ecosystem sees the full picture — the claim, the evidence, and the evaluation — and decides to support the next phase.

## Why it's built this way

Hypercerts are designed to live beyond any single platform.
This is why we built hypercerts on [AT Protocol](/core-concepts/why-at-protocol), a decentralized data layer that also powers Bluesky. This gives hypercerts some important properties:

- **You own your data.** Your hypercerts live on your [Personal Data Server (PDS)](/architecture/overview) or on a hosted PDS of your choice, not on a single platform.
- **It's portable.** You can move your data to a different server anytime. No lock-in.
- **It's verifiable.** Every record is cryptographically signed. Anyone can check that it hasn't been tampered with.
- **It works everywhere.** Any app that speaks the Hypercerts protocol can read and display your records. Learn more in the [Architecture Overview](/architecture/overview).

## Next step

To see the records that make this work, read the [Core Data Model](/core-concepts/hypercerts-core-data-model).
