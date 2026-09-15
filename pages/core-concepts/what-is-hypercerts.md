---
title: What are Hypercerts?
description: Shared records for describing valuable work and connecting it to context, assessment, and funding.
---

# What are Hypercerts?

A hypercert is an `org.hypercerts.claim.activity` record that describes valuable work. Other records can connect contributors, evidence, measurements, evaluations, acknowledgements, classifications, projects, and funding history to that activity over time.

Together, these records form an open graph rather than one final certificate or document. Different people and organizations publish from their own AT Protocol repositories. Applications assemble the parts relevant to their users and preserve who published each assertion.

## The structure of a hypercert

The activity model is designed to answer four useful questions:

- **Who** is doing (or did) the work?
- **What** are they doing (or what did they do)?
- **When** is it happening (or when did it happen)?
- **Where** did it happen? (physical or digital)

These are conceptual dimensions, not all required fields in the released schema. Version 1.4.0 requires a title, short description, and creation time; richer records add the dimensions needed for their use case.

Related records can add more context:

- **Attachments:** documents, links, files, reports, or other material. An attachment may be evidence, but its existence does not verify its contents.
- **Measurements:** quantitative observations, their units, methods, measurers, and evidence links.
- **Evaluations:** assessments with named evaluators, summaries, optional scores, reports, and supporting measurements.
- **Contributions:** reusable details about who was involved, their roles, and their periods of contribution.
- **Collections:** group activities, non-agent features, and other collections into projects, programs, portfolios, or other sets.
- **Funding receipts:** record assertions about funding payments and what they supported.
- **Acknowledgements, badges, and signatures:** add independent signals about relationships, recognition, and provenance.



## What a hypercert is not

- **Not a truth certificate:** valid structure and attributable publication do not prove a claim is correct.
- **Not a payment rail:** a funding receipt describes a claimed transfer; Hypercerts does not settle the payment.
- **Not a token:** the released protocol model is based on AT Protocol records.
- **Not a single document:** related records can be published and updated independently across repositories.
- **Not a complete global view:** finding every backlink requires an indexer, and every index has a coverage policy.

## How people use them

**If you're doing the work**, you create a hypercert to make your contributions visible. Instead of writing reports that sit in a folder, you publish a verifiable record that any platform can display and build on.

**If you're evaluating work**, you publish an assessment from an AT Protocol repository and reference the record version you assessed. Applications can use your identity, evidence, and history as inputs to their own trust model.

**If you're funding work**, you can inspect attributable project information and assessments, then publish a receipt describing support. Whether that receipt proves settlement depends on its publisher and supporting data.

**If you're building a platform**, you can read and write hypercerts using shared schemas. A funding platform, a project dashboard, and an evaluation tool can all work with the same data.

## An example

Say a team runs a coastal reforestation project. They create a hypercert:

> **Coastal mangrove restoration, 2025**
>
> 50 hectares restored over 12 months (the activity claim). Satellite imagery confirms canopy coverage. An independent ecologist evaluates the work as "high-quality restoration with strong community engagement."

The activity claim is the starting record. Over the following months, the team or third parties publish measurements and attachments that refer to it. An evaluator can assess a specific version. An indexer can assemble those independently published records for a funding application, which may then record support with a funding receipt.

## Why it's built this way

Hypercerts are designed to live beyond any single platform.
This is why we built hypercerts on [AT Protocol](/core-concepts/why-at-protocol), a decentralized data layer that also powers Bluesky. This gives hypercerts some important properties:

- **Repository-controlled:** records live in an AT Protocol repository associated with the publisher's DID rather than only in one application's database.
- **Portable:** the DID and AT-URIs do not encode the current server address, so repository migration can preserve record identifiers.
- **Attributable:** signed repository commits let consumers verify which repository published a version; optional record-level attestations are a separate mechanism.
- **Interoperable by agreement:** applications can understand records when they implement the released schemas and compatible usage conventions.

## Next step

To see the full graph, including projects and adjacent Certified records, read the [Core Data Model](/core-concepts/hypercerts-core-data-model).
