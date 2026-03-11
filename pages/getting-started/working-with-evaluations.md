---
title: Working with Evaluations
description: Learn how to evaluate hypercerts and build trust in the ecosystem.
---

# Working with Evaluations

Evaluations are third-party assessments of hypercerts. They live on the evaluator's own PDS — not embedded in the original claim — and accumulate over time as different parties provide their perspectives.

An evaluation references the claim it assesses via a strong reference (AT-URI + CID), includes the evaluator's DID, a summary, and optionally a numeric score and linked measurements. The collection is `org.hypercerts.context.evaluation`. Creating one follows the same `createRecord` pattern shown in the [Quickstart](/getting-started/quickstart).

## Measurements

Measurements provide quantitative data that can support an evaluation. A measurement records what was measured (the metric), the unit, the value, and optionally the methodology and evidence URIs. The collection is `org.hypercerts.context.measurement`.

You can link measurements to an evaluation via its `measurements` array (an array of strong references), creating a traceable chain from raw data to assessment.

## Evaluation patterns

**Expert review.** Domain experts assess technical quality, methodology, and impact. Their DID becomes a portable credential — other projects can discover and trust evaluations from recognized experts.

**Community assessment.** Multiple stakeholders provide independent evaluations. The diversity of evaluator DIDs creates a richer signal than any single assessment.

**Automated evaluation.** Scripts and bots can publish evaluations based on API metrics, external data sources, or other programmatic checks. The evaluator DID identifies the automation system and its operator.

## Trust and reputation

Every evaluation is signed by its creator's DID. Unlike anonymous reviews, evaluators build portable reputation across the ecosystem — a DID with a history of rigorous, accurate evaluations becomes a trusted signal. Applications can filter evaluations by evaluator identity, weight them differently, or build custom trust graphs.

{% callout type="note" %}
On ATProto, you control your own records but not anyone else's. You can't delete someone else's evaluation of your work, and they can't delete yours. This creates a multi-perspective record of how claims are assessed over time.
{% /callout %}
