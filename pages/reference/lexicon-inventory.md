---
title: Lexicon Inventory
description: Complete inventory of Hypercerts and Certified schemas released in @hypercerts-org/lexicon 1.4.1.
---

# Lexicon Inventory

This page lists the `org.hypercerts.*` and `app.certified.*` schemas in [`@hypercerts-org/lexicon` 1.4.1](https://www.npmjs.com/package/@hypercerts-org/lexicon/v/1.4.1). The source tag is [`v1.4.1`](https://github.com/hypercerts-org/hypercerts-lexicon/tree/v1.4.1/lexicons).

The package contains 25 repository record collections, two write permission sets, and four definition-only schemas across these namespaces. It contains no XRPC query or procedure Lexicons; the Hypercerts API documents its methods separately.

Each reference page generates its schema tables from the released package, so the tables always match the version shown on the page.

## Hypercerts record collections

| NSID | Role | Reference |
|---|---|---|
| `org.hypercerts.claim.activity` | Describes a piece of work | [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) |
| `org.hypercerts.claim.contribution` | Reusable contribution role and timeframe | [Contribution](/lexicons/hypercerts-lexicons/contribution) |
| `org.hypercerts.claim.contributorInformation` | Reusable contributor identity and presentation | [Contribution](/lexicons/hypercerts-lexicons/contribution) |
| `org.hypercerts.claim.rights` | Rights and licensing terms | [Rights](/lexicons/hypercerts-lexicons/rights) |
| `org.hypercerts.collection` | Weighted grouping of activities, features, or collections; a project is a collection of type `project` | [Collection](/lexicons/hypercerts-lexicons/collection) |
| `org.hypercerts.entity.feature` | Non-agent subject such as a zone, cohort, or campaign | [Feature](/lexicons/hypercerts-lexicons/feature) |
| `org.hypercerts.vocab.tag` | Classification term for collections and features | [Vocabulary Tag](/lexicons/hypercerts-lexicons/vocabulary-tag) |
| `org.hypercerts.workscope.tag` | Reusable term in a structured work scope | [Work Scope](/lexicons/hypercerts-lexicons/work-scope) |
| `org.hypercerts.context.attachment` | Documents, evidence, reports, or commentary | [Attachment](/lexicons/hypercerts-lexicons/attachment) |
| `org.hypercerts.context.measurement` | Quantitative observation with method and evidence | [Measurement](/lexicons/hypercerts-lexicons/measurement) |
| `org.hypercerts.context.evaluation` | Assessment with named evaluators and supporting data | [Evaluation](/lexicons/hypercerts-lexicons/evaluation) |
| `org.hypercerts.context.acknowledgement` | Acceptance or rejection of a subject or relationship | [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) |
| `org.hypercerts.funding.receipt` | Record of a funding payment | [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt) |

## Hypercerts definitions and permissions

| NSID | Kind | Reference |
|---|---|---|
| `org.hypercerts.defs` | Definitions: descriptions, blobs, images, video, and URI objects | [Shared Definitions](/lexicons/hypercerts-lexicons/shared-defs) |
| `org.hypercerts.workscope.cel` | Structured work-scope expression embedded in an activity; not a repository record | [Work Scope](/lexicons/hypercerts-lexicons/work-scope) |
| `org.hypercerts.authWrite` | Permission set: create, update, and delete for the 13 Hypercerts record collections | [Schema](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.1/lexicons/org/hypercerts/authWrite.json) |

## Certified record collections

| NSID | Role | Reference |
|---|---|---|
| `app.certified.actor.profile` | Account profile, one per account | [Profile](/lexicons/certified-lexicons/profile) |
| `app.certified.actor.organization` | Organization details, one per account | [Organization](/lexicons/certified-lexicons/organization) |
| `app.certified.location` | Reusable place or area | [Location](/lexicons/certified-lexicons/location) |
| `app.certified.badge.definition` | Badge type definition | [Badge Definition](/lexicons/certified-lexicons/badge-definition) |
| `app.certified.badge.award` | Badge award to an account or record | [Badge Award](/lexicons/certified-lexicons/badge-award) |
| `app.certified.badge.response` | Recipient's response to an award | [Badge Response](/lexicons/certified-lexicons/badge-response) |
| `app.certified.graph.follow` | Account-to-account follow | [Follows](/lexicons/certified-lexicons/follows) |
| `app.certified.graph.entityFollow` | Follow of a record by AT-URI | [Follows](/lexicons/certified-lexicons/follows) |
| `app.certified.feed.like` | Like of a record | [Likes and Reposts](/lexicons/certified-lexicons/likes-and-reposts) |
| `app.certified.feed.repost` | Repost of a record | [Likes and Reposts](/lexicons/certified-lexicons/likes-and-reposts) |
| `app.certified.link.evm` | Link between an account and an EVM address | [EVM Link](/lexicons/certified-lexicons/evm-link) |
| `app.certified.signature.proof` | Remote proof over the content of another record | [Signatures](/lexicons/certified-lexicons/signatures) |

## Certified definitions and permissions

| NSID | Kind | Reference |
|---|---|---|
| `app.certified.defs` | Definitions: DID object and URI-only record subject | [Shared Definitions](/lexicons/certified-lexicons/shared-defs) |
| `app.certified.signature.defs` | Definitions: inline and remote record-content signatures | [Signatures](/lexicons/certified-lexicons/signatures) |
| `app.certified.authWrite` | Permission set: create, update, and delete for the 12 Certified record collections | [Schema](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.1/lexicons/app/certified/authWrite.json) |

## Package boundary

The npm package also bundles dependency schemas outside the `org.hypercerts.*` and `app.certified.*` namespaces, such as Leaflet documents and Bluesky rich-text facets. Including them in the package doesn't make them part of the Hypercerts Protocol.

For a conceptual introduction, read [A Shared Language](/core-concepts/hypercerts-core-data-model). [Building on Shared Records](/core-concepts/validation-and-interpretation) explains how shared formats and application choices work together.
