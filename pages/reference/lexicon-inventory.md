---
title: Lexicon Inventory
description: Complete inventory of Hypercerts and Certified schemas released in @hypercerts-org/lexicon 1.4.0.
---

# Lexicon Inventory

This page inventories the `org.hypercerts.*` and `app.certified.*` schemas in [`@hypercerts-org/lexicon` 1.4.0](https://www.npmjs.com/package/@hypercerts-org/lexicon/v/1.4.0). The immutable source tag is [`v1.4.0`](https://github.com/hypercerts-org/hypercerts-lexicon/tree/v1.4.0/lexicons).

The package contains 23 repository record collections, two write permission sets, and four definition-only schemas across these namespaces. It contains no Hypercerts or Certified XRPC query or procedure Lexicons. API methods and SDK behavior must therefore be documented from their own canonical sources.

## Hypercerts record collections

| NSID | Role | Local detail |
|---|---|---|
| `org.hypercerts.claim.activity` | Describes impact work | [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) |
| `org.hypercerts.claim.contribution` | Reusable contribution role and timeframe | [Contribution](/lexicons/hypercerts-lexicons/contribution) |
| `org.hypercerts.claim.contributorInformation` | Reusable contributor identity and presentation | [Contribution](/lexicons/hypercerts-lexicons/contribution) |
| `org.hypercerts.claim.rights` | Rights and licensing terms | [Rights](/lexicons/hypercerts-lexicons/rights) |
| `org.hypercerts.collection` | Weighted grouping of activities, features, or collections | [Collection](/lexicons/hypercerts-lexicons/collection) |
| `org.hypercerts.context.acknowledgement` | Acceptance or rejection of a subject or relationship | [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) |
| `org.hypercerts.context.attachment` | Documentary material, evidence, reports, or commentary | [Attachment](/lexicons/hypercerts-lexicons/attachment) |
| `org.hypercerts.context.evaluation` | Assessment with named evaluators and optional supporting data | [Evaluation](/lexicons/hypercerts-lexicons/evaluation) |
| `org.hypercerts.context.measurement` | Quantitative observation, method, and evidence links | [Measurement](/lexicons/hypercerts-lexicons/measurement) |
| `org.hypercerts.entity.feature` | Non-agent subject such as a zone, stratum, cohort, or campaign | Source schema only |
| `org.hypercerts.funding.receipt` | Assertion about a funding payment | [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt) |
| `org.hypercerts.vocab.tag` | Governed general classification term | Source schema only |
| `org.hypercerts.workscope.tag` | Reusable atom for an activity CEL work scope | Source schema only |

## Hypercerts definitions and permissions

| NSID | Kind | Role |
|---|---|---|
| `org.hypercerts.defs` | Definitions | Reusable descriptions, blobs, images, video, and URI objects |
| `org.hypercerts.workscope.cel` | Definition | CEL expression embedded inside an activity work scope; not a repository record |
| `org.hypercerts.authWrite` | Permission set | Create, update, and delete grants for the 13 Hypercerts record collections |

## Certified record collections

| NSID | Role | Local detail |
|---|---|---|
| `app.certified.actor.profile` | Singleton account profile | [Profile](/lexicons/certified-lexicons/profile) |
| `app.certified.actor.organization` | Singleton organization metadata | Source schema only |
| `app.certified.badge.definition` | Badge type definition | [Badge Definition](/lexicons/certified-lexicons/badge-definition) |
| `app.certified.badge.award` | Badge award to an account or record | [Badge Award](/lexicons/certified-lexicons/badge-award) |
| `app.certified.badge.response` | Recipient response to an award | [Badge Response](/lexicons/certified-lexicons/badge-response) |
| `app.certified.graph.follow` | Account-to-account follow | Source schema only |
| `app.certified.graph.entityFollow` | Follow of a record subject by AT-URI | Source schema only |
| `app.certified.link.evm` | DID-to-EVM-address link with an EIP-712 proof shape | Source schema only |
| `app.certified.location` | Reusable spatial representation | [Location](/lexicons/certified-lexicons/location) |
| `app.certified.signature.proof` | Remote proof containing the CID of attested content | Source schema only |

## Certified definitions and permissions

| NSID | Kind | Role |
|---|---|---|
| `app.certified.defs` | Definitions | DID object and URI-only record-subject object |
| `app.certified.signature.defs` | Definitions | Inline and remote record-content signature variants |
| `app.certified.authWrite` | Permission set | Create, update, and delete grants for the 10 Certified record collections |

## Coverage status

The human-readable pages currently cover the original activity, context, collection, funding, profile, location, and badge families. The 1.4.0 feature and vocabulary records, organization and graph records, EVM link, signature system, common definitions, and permission sets still need generated or source-owned field reference pages.

Until that reference is generated, use the versioned package or [`v1.4.0` source tree](https://github.com/hypercerts-org/hypercerts-lexicon/tree/v1.4.0/lexicons) for exact fields. Do not use mutable `main` as the production contract.

## Package boundary

The NPM package also bundles dependency schemas outside the `org.hypercerts.*` and `app.certified.*` namespaces. Package inclusion does not make every bundled namespace part of this documentation's Hypercerts Protocol surface.

See the [Core Data Model](/core-concepts/hypercerts-core-data-model) for meaning and relationships and [Validation, Extension & Interpretation](/core-concepts/validation-and-interpretation) for constraints that applications must enforce.
