---
title: Activity Claim
description: Lexicon reference for org.hypercerts.claim.activity, the record that describes a piece of work.
---

# Activity Claim

`org.hypercerts.claim.activity`

## Overview

An activity claim, also called a hypercert, describes a piece of work: what is being done or was done, by whom, when, and where. It is the record other records point to. Evidence, measurements, evaluations, funding receipts, and collections all refer to an activity to say which work they concern.

The record is the publisher's account of the work. It becomes more useful as others add evidence and assessments, but publishing it does not make its claims true. For the concepts behind it, see [Activity Claims](/core-concepts/what-is-hypercerts) in the Guide.

## How it's used

- **A project describes its work.** A team publishes an activity for each distinct piece of work, such as one installation phase or six months of library maintenance, and groups related activities into a project with a [collection](/lexicons/hypercerts-lexicons/collection).
- **Others add context.** Attachments, measurements, and evaluations published by the team or by other accounts link to the activity with a strong reference, so they stay tied to the version they concern.
- **Funders record support.** A [funding receipt](/lexicons/hypercerts-lexicons/funding-receipt) can name the activity it supported.
- **Contributors are credited.** The `contributors` array names the people or organizations involved, with optional weights and roles, either inline or through [contribution records](/lexicons/hypercerts-lexicons/contribution).

Only `title`, `shortDescription`, and `createdAt` are required. Start with those and add detail when it answers a real question for your users.

## Schema

{% lexicon-schema nsid="org.hypercerts.claim.activity" /%}

## Example

A community energy project describing the installation phase of its solar array:

```json
{
  "$type": "org.hypercerts.claim.activity",
  "title": "Solar array installation, phase 1",
  "shortDescription": "Installation of a 40 kW community-owned solar array on the village hall roof.",
  "description": {
    "$type": "org.hypercerts.defs#descriptionString",
    "value": "Phase 1 covers design, permits, and installation. Maintenance is described in a separate activity."
  },
  "contributors": [
    {
      "contributorIdentity": {
        "$type": "org.hypercerts.claim.activity#contributorIdentity",
        "identity": "did:plc:4yyb5gyoxl3sqdlqrvuxshkp"
      },
      "contributionWeight": "3",
      "contributionDetails": {
        "$type": "org.hypercerts.claim.activity#contributorRole",
        "role": "Project lead"
      }
    },
    {
      "contributorIdentity": {
        "$type": "org.hypercerts.claim.activity#contributorIdentity",
        "identity": "did:plc:ewvi7nxzyoun6zhxrhs64oiz"
      },
      "contributionWeight": "1",
      "contributionDetails": {
        "$type": "org.hypercerts.claim.activity#contributorRole",
        "role": "Electrical installation"
      }
    }
  ],
  "workScope": {
    "$type": "org.hypercerts.claim.activity#workScopeString",
    "scope": "Design, permitting, and installation of the rooftop array. Excludes ongoing maintenance."
  },
  "startDate": "2026-03-01T00:00:00.000Z",
  "endDate": "2026-06-30T00:00:00.000Z",
  "locations": [
    {
      "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/app.certified.location/3lx2k7p4hvc2a",
      "cid": "bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy"
    }
  ],
  "createdAt": "2026-07-02T09:15:00.000Z"
}
```

## Rules and best practices

- **Say whether the work is planned, ongoing, or completed.** The schema has no status field, so make it clear in the title, description, and dates. A plan and a report of completed work should not be mistaken for each other.
- **Keep one activity per distinct piece of work.** Smaller, well-scoped activities are easier to evaluate and fund than one broad claim. Use a collection to group them.
- **Contribution weights are relative.** `contributionWeight` is a positive number stored as a string. Weights don't need to sum to a total; applications normalize them if they need shares.
- **Choose inline or referenced contributor details.** Inline objects are simplest. Use a [contributor information or contribution record](/lexicons/hypercerts-lexicons/contribution) when the same contributor or role is reused across activities.
- **Use a plain-text work scope unless software needs to reason about it.** The structured CEL form is for applications that compare or combine scopes; see [Describing and Classifying Work](/core-concepts/cel-work-scopes).
- **Strong references pin a version.** `locations` and `rights` point to a specific version of the referenced record. If that record changes, update the reference to point at the new version.
- **Editing changes the CID.** Evaluations and other records that referenced the earlier version keep pointing to it. Readers should be told when an assessment concerns an older version; see [Records That Change Over Time](/architecture/data-flow-and-lifecycle).

## Related

- [Collection](/lexicons/hypercerts-lexicons/collection): group activities into a project or portfolio.
- [Contribution](/lexicons/hypercerts-lexicons/contribution): reusable contributor identity and role records.
- [Attachment](/lexicons/hypercerts-lexicons/attachment) and [Measurement](/lexicons/hypercerts-lexicons/measurement): evidence and data about the work.
- [Evaluation](/lexicons/hypercerts-lexicons/evaluation): assessments of the work.
- [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt): records of support for the work.
- [Rights](/lexicons/hypercerts-lexicons/rights) and [Location](/lexicons/certified-lexicons/location): records the activity references.
- Guide: [Activity Claims](/core-concepts/what-is-hypercerts), [A Shared Language](/core-concepts/hypercerts-core-data-model).
