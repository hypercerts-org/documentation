---
title: Hypercerts Lexicons
description: Lexicon reference for Hypercerts record types — activity claims, contributions, evaluations, and more.
---

# Hypercerts Lexicons

These Lexicons define work, context, grouping, feature, funding, and classification records in the `org.hypercerts` namespace. An activity claim is the central work record, but not every record type attaches to an activity.

| Lexicon | NSID | Description |
|---------|------|-------------|
| **[Activity Claim](/lexicons/hypercerts-lexicons/activity-claim)** | `org.hypercerts.claim.activity` | The core record describing work; contributor, scope, time, and location detail is optional |
| **[Contribution](/lexicons/hypercerts-lexicons/contribution)** | `org.hypercerts.claim.contributorInformation`{% br /%}`org.hypercerts.claim.contribution` | Contributor identity and contribution details (two lexicons) |
| **[Attachment](/lexicons/hypercerts-lexicons/attachment)** | `org.hypercerts.context.attachment` | Supporting documentation — URLs, files, IPFS links |
| **[Measurement](/lexicons/hypercerts-lexicons/measurement)** | `org.hypercerts.context.measurement` | Quantitative data attached to a claim |
| **[Evaluation](/lexicons/hypercerts-lexicons/evaluation)** | `org.hypercerts.context.evaluation` | Third-party assessment of a claim |
| **[Collection](/lexicons/hypercerts-lexicons/collection)** | `org.hypercerts.collection` | Groups activity claims and/or other collections into a project |
| **[Rights](/lexicons/hypercerts-lexicons/rights)** | `org.hypercerts.claim.rights` | Rights associated with a hypercert |
| **[Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt)** | `org.hypercerts.funding.receipt` | Records an assertion about a funding payment |
| **[Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement)** | `org.hypercerts.context.acknowledgement` | Acceptance or rejection of a relationship |
| **Feature** | `org.hypercerts.entity.feature` | Non-agent subject such as a zone, stratum, cohort, or campaign |
| **Vocabulary Tag** | `org.hypercerts.vocab.tag` | General classification for collections and features |
| **Work-scope Tag** | `org.hypercerts.workscope.tag` | Reusable atom for an activity CEL work-scope expression |

The package also includes the definition-only `org.hypercerts.defs` and `org.hypercerts.workscope.cel` schemas plus the `org.hypercerts.authWrite` permission set. See the complete [Lexicon inventory](/reference/lexicon-inventory). Use the released package for exact field constraints until all field pages are generated.
