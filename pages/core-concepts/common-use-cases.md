---
title: Common Use Cases
description: See how common funding and evaluation scenarios map to the Hypercerts record graph.
---

# Common Use Cases

These examples show how domain workflows can use the same record graph. They are conceptual mappings, not tested SDK or XRPC instructions.

## Open-source software maintenance

A team publishes an activity for a year of library maintenance. Contributor entries describe maintainers and roles. Attachments link releases and reports; measurements describe issues resolved or downloads; peer evaluators publish assessments. A project collection can group annual activities, and receipts can record prospective or retroactive support.

## Regenerative land stewardship

A project collection with `type: "project"` groups restoration activities and the land areas they concern. Feature records represent zones or strata; location records provide spatial representations. Attachments link satellite imagery and reports, measurements describe observations, and community or expert evaluations assess the work. Receipts can point to the project collection or a specific activity.

## Scientific research

A research activity identifies contributors and reusable contribution details. Attachments link papers, data, and protocols. Measurements can describe outputs; evaluations record peer assessments and cite relevant measurements. A funding receipt records support but does not establish research quality or payment settlement by itself.

## Community event organization

A program collection groups workshop activities and optional cohort features. Contributor entries identify instructors and hosts. Attachments provide materials and reports; measurements record attendance or outcomes; participant or expert evaluations add assessments. Acknowledgements can confirm particular relationships without turning them into protocol-wide truth.

## Certifications and network recognition

A network or certifier publishes a badge definition and then an award whose subject is an account or project record. The recipient can publish a separate badge response. The award does not imply acceptance, and the definition's issuer list requires application-level authorization checks.

## What remains application-specific

In every scenario, applications still decide:

- Which publishers, evaluators, certifiers, and vocabularies they trust.
- Which records their index includes and how backlinks are resolved.
- How source data becomes forms, search, rankings, totals, or recommendations.
- How private operational data and payment execution stay outside public records.

For implementation status, use [Client Integration](/client-integration). For exact schemas, use the [Lexicon inventory](/reference/lexicon-inventory).
