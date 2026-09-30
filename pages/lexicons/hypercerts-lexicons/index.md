---
title: Hypercerts Lexicons
description: "Lexicon reference for the org.hypercerts namespace: activity claims, contributions, collections, context records, and funding."
---

# Hypercerts Lexicons

The `org.hypercerts` Lexicons describe work and the information around it: who did it, how it is grouped, the evidence and assessments attached to it, and the funding it received. An activity claim is the record most others point to.

## Work and contributors

| Lexicon | NSID | Purpose |
|---|---|---|
| [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) | `org.hypercerts.claim.activity` | Describes a piece of work |
| [Contribution](/lexicons/hypercerts-lexicons/contribution) | `org.hypercerts.claim.contributorInformation`{% br /%}`org.hypercerts.claim.contribution` | Reusable contributor identities and contribution details |
| [Rights](/lexicons/hypercerts-lexicons/rights) | `org.hypercerts.claim.rights` | Rights and licensing terms for an activity |

## Grouping and classification

| Lexicon | NSID | Purpose |
|---|---|---|
| [Collection](/lexicons/hypercerts-lexicons/collection) | `org.hypercerts.collection` | Groups activities, features, or collections; projects are collections of type `project` |
| [Feature](/lexicons/hypercerts-lexicons/feature) | `org.hypercerts.entity.feature` | A place, cohort, or other subject the work concerns |
| [Vocabulary Tag](/lexicons/hypercerts-lexicons/vocabulary-tag) | `org.hypercerts.vocab.tag` | Classification terms for collections and features |
| [Work Scope](/lexicons/hypercerts-lexicons/work-scope) | `org.hypercerts.workscope.tag`{% br /%}`org.hypercerts.workscope.cel` | Structured descriptions of what an activity covers |

## Evidence, assessment, and funding

| Lexicon | NSID | Purpose |
|---|---|---|
| [Attachment](/lexicons/hypercerts-lexicons/attachment) | `org.hypercerts.context.attachment` | Documents, reports, and other material about the work |
| [Measurement](/lexicons/hypercerts-lexicons/measurement) | `org.hypercerts.context.measurement` | Quantitative observations |
| [Evaluation](/lexicons/hypercerts-lexicons/evaluation) | `org.hypercerts.context.evaluation` | Assessments by named evaluators |
| [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) | `org.hypercerts.context.acknowledgement` | Acceptance or rejection of a relationship |
| [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt) | `org.hypercerts.funding.receipt` | Records of funding payments |

## Shared definitions

[Shared Definitions](/lexicons/hypercerts-lexicons/shared-defs) (`org.hypercerts.defs`) covers the description, image, blob, and URI objects these records reuse. The `org.hypercerts.authWrite` permission set grants create, update, and delete access to all 13 record collections. See the complete [Lexicon inventory](/reference/lexicon-inventory).
