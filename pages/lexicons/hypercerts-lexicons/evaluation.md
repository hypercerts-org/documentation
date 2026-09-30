---
title: Evaluation
description: Lexicon reference for org.hypercerts.context.evaluation, the record that publishes an assessment of work or another record.
---

# Evaluation

`org.hypercerts.context.evaluation`

## Overview

An evaluation records an assessment of a piece of work or another record. It names the evaluators, gives a summary of the conclusion, and can point to the exact version of the record assessed, the measurements relied on, a longer report, and an optional score.

Evidence shows what happened; an evaluation explains what someone with relevant experience concluded from it. Because the evaluator publishes from their own account, the assessment stays separate from the team's own description of its work, and several evaluators can publish different conclusions about the same subject. For the concepts, see [Evaluations](/core-concepts/evaluations) in the Guide.

## How it's used

- **A reviewer assesses an activity.** A specialist, community group, or funder's review panel publishes an evaluation that points to the [activity](/lexicons/hypercerts-lexicons/activity-claim) with `subject`. They need no permission from the project.
- **The judgment cites its data.** `measurements` lists the [measurements](/lexicons/hypercerts-lexicons/measurement) the evaluation relied on, and `content` links to or embeds a full report or methodology.
- **Applications gather evaluations.** The link runs from the evaluation to its subject, not the other way round. To show all evaluations of an activity, an application uses an indexer to find evaluation records whose `subject` points to it.
- **The next funder reuses the review.** A later funding decision can start from existing assessments, accept parts of them, or seek a second opinion.
- **The subject can respond.** The team can publish an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) of the evaluation to accept it or to register disagreement.

Only `evaluators`, `summary`, and `createdAt` are required. In practice, set `subject` as well, or the evaluation can't be connected to what it assesses.

## Schema

{% lexicon-schema nsid="org.hypercerts.context.evaluation" /%}

## Example

A solar specialist reviewing phase 1 of the community energy project after a site visit, citing the August generation measurement:

```json
{
  "$type": "org.hypercerts.context.evaluation",
  "subject": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lxa4m2vbqk2s",
    "cid": "bafyreif3kq7xmzd2vhw5l4yjn6rb2pc7tsgoe4ua5xi3qhk6wzdmfv2nle"
  },
  "evaluators": [
    { "did": "did:plc:q2ue7nkzx5bdhm4vtw3jcr6y" }
  ],
  "measurements": [
    {
      "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.context.measurement/3lxc2p6wsdk2f",
      "cid": "bafyreicn5wvx4lhz7mqd2ek6tay3ogrpj5sbi7fu4cxnhl2vqmdwz6kr4a"
    }
  ],
  "content": [
    {
      "$type": "org.hypercerts.defs#uri",
      "uri": "https://example.org/solar-review/village-hall-2026-09.pdf"
    }
  ],
  "summary": "Site visit and review of August meter data. Output of 4,200 kWh is within 5% of the modelled yield for a 40 kW array at this orientation. One string inverter reports intermittent faults and should be serviced before winter.",
  "score": {
    "min": "0",
    "max": "5",
    "value": "4"
  },
  "createdAt": "2026-09-15T13:20:00.000Z"
}
```

## Rules and best practices

- **Always set `subject`.** It is optional in the schema, but it is the only property that says what is being evaluated. Applications shouldn't guess the subject from the cited measurements, the location, or the publishing account.
- **The strong reference pins the reviewed version.** If the team later edits its activity, the evaluation keeps pointing to the version that was reviewed. Applications can compare the CID with the current record and tell readers when an evaluation concerns an earlier version; see [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
- **Name at least one evaluator.** The schema accepts an empty `evaluators` array, but an assessment attributed to nobody carries little weight. Applications displaying an evaluation can show both the named evaluators and the publishing account, and point out when they differ.
- **Named evaluators are the publisher's statement.** Listing a DID in `evaluators` does not show that person took part or agrees. When the publisher is not the evaluator, a [signature](/lexicons/certified-lexicons/signatures) from the named evaluator in `signatures` adds that confirmation.
- **Separate publication is not independence.** An evaluation published from a different account can still come from someone close to the project. There is no field for credentials or conflicts of interest, so state relevant relationships in `summary` or the report, and let readers judge the evaluator's standing.
- **A score only means something on its own scale.** `min`, `max`, and `value` are numeric strings declared per record. Keep `min` below `max` and `value` within them, and explain the scale and whether higher is better in `summary` or `content`. Two evaluations using 0 to 5 may not use the same method; don't average or rank scores from different evaluators as if they were comparable.
- **Make the reasoning readable.** A score is easier to interpret with the method and evidence behind it. Use `summary` for the conclusion and its main reasons, and `content` for the full report.
- **Cited measurements aren't necessarily about the subject.** A measurement listed in `measurements` may concern a different record or come from a different publisher. Applications presenting it as supporting evidence can show the measurement's own subjects.
- **`location` is the evaluation's location.** It can mark where an assessment was made, such as a sampled area. Don't treat it as the location of the subject.
- **Later evaluations don't replace earlier ones.** There is no field for superseding or withdrawing an evaluation. Two evaluations of one subject by the same evaluator are two assessments; show their `createdAt` dates so readers can see when each was made. An evaluator correcting their own assessment can update the record and say so in `summary`.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): the most common subject of an evaluation.
- [Measurement](/lexicons/hypercerts-lexicons/measurement) and [Attachment](/lexicons/hypercerts-lexicons/attachment): the data and material an evaluation draws on.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): how the subject's owner can accept or dispute an evaluation.
- [Badge Definition](/lexicons/certified-lexicons/badge-definition): for recognition awarded repeatedly under a defined category, rather than a one-off assessment.
- [Signatures](/lexicons/certified-lexicons/signatures) and [Location](/lexicons/certified-lexicons/location): records an evaluation can reference.
- Guide: [Evaluations](/core-concepts/evaluations), [Trust and Recognition](/core-concepts/certified-identity), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
