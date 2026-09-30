---
title: Measurement
description: Lexicon reference for org.hypercerts.context.measurement, the record that captures one quantitative observation about a piece of work.
---

# Measurement

`org.hypercerts.context.measurement`

## Overview

A measurement records one quantitative observation: what was measured (the metric), the unit, and the value. It can also say which records it concerns, when and where the observation was made, which method was used, who took the measurement, and where the underlying data lives.

"The installation produced 4,200 kWh during August" is easier to reuse as a measurement than as a number in a report. Another application can recognize the metric and unit, show it alongside earlier readings, and let a reviewer follow the method and evidence links. A measurement states what the publisher observed. It does not establish that the value is correct or what the observation means for the work's wider benefit; that interpretation belongs in an [evaluation](/lexicons/hypercerts-lexicons/evaluation). For the concepts, see [Evidence and Measurements](/core-concepts/evidence-and-measurements) in the Guide.

## How it's used

- **A team reports its own data.** A project publishes readings such as energy generated, trees planted, or workshop attendance, and links them to the activity with `subjects`.
- **A third party measures the work.** An auditor or monitoring service publishes a measurement from its own account. It needs no write access to the project's repository, and the project cannot alter the result.
- **Evaluations cite measurements.** An [evaluation](/lexicons/hypercerts-lexicons/evaluation) lists the measurements it relied on in its `measurements` array, so readers can see the data behind a judgment.
- **Evidence backs the number.** `evidenceURI` points to the raw data or supporting material, often an [attachment](/lexicons/hypercerts-lexicons/attachment) record holding a meter export or survey report.

Only `metric`, `unit`, `value`, and `createdAt` are required, but a measurement with no subject, period, or measurer is hard for anyone else to use.

## Schema

{% lexicon-schema nsid="org.hypercerts.context.measurement" /%}

## Example

The community energy project reporting August generation from its solar array, measured from the export meter:

```json
{
  "$type": "org.hypercerts.context.measurement",
  "subjects": [
    {
      "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lxa4m2vbqk2s",
      "cid": "bafyreif3kq7xmzd2vhw5l4yjn6rb2pc7tsgoe4ua5xi3qhk6wzdmfv2nle"
    }
  ],
  "metric": "Electricity generated",
  "unit": "kWh",
  "value": "4200",
  "startDate": "2026-08-01T00:00:00.000Z",
  "endDate": "2026-08-31T23:59:59.000Z",
  "locations": [
    {
      "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/app.certified.location/3lx2k7p4hvc2a",
      "cid": "bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy"
    }
  ],
  "methodType": "meter-reading",
  "methodURI": "https://example.org/village-energy/methods/generation-meter-v1",
  "evidenceURI": [
    "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.context.attachment/3lxb7r5tmcn2d"
  ],
  "measurers": [
    { "did": "did:plc:4yyb5gyoxl3sqdlqrvuxshkp" }
  ],
  "comment": "Net generation from the export meter, read on 1 August and 1 September.",
  "createdAt": "2026-09-02T08:30:00.000Z"
}
```

## Rules and best practices

- **Link the measurement to its subject.** `subjects` is optional in the schema, but a measurement without one says something was measured without saying what. Point it at the activity, or at a project [collection](/lexicons/hypercerts-lexicons/collection), that the observation concerns.
- **Prefer one subject per measurement.** The schema doesn't say how one value relates to several subjects: it could apply to each, be their combined total, or be split between them. If you list several, make the intended reading clear in `comment`, and treat the value as a combined figure rather than attributing it in full to each subject.
- **Write `value` as a plain number.** It is a string so that decimals are exact, and validation does not check that it is numeric. Use digits with an optional decimal point (`"4200"`, `"12.5"`) and put the unit in `unit`, not in `value`.
- **State the period.** Set `startDate` and `endDate` for observations over a period. For a one-time observation, set both to the same time. Say in `comment` whether the value is the change over the period or a running total, because the schema can't distinguish the two and readers who add up overlapping periods will double count.
- **Be consistent with metric and unit strings.** There is no shared vocabulary of metrics or units. Use one spelling for one unit across all your records (`kWh`, not sometimes `kwh`), and don't rely on a scale factor your platform implies but the record doesn't state.
- **Describe the method.** `methodType` is a short identifier; `methodURI` links to documentation of the procedure. Supplying both, with a versioned method document, lets a reviewer see how the value was produced and whether two measurements are comparable.
- **Point evidence at attachments where you can.** `evidenceURI` entries are plain URIs with no content hash, so what they point to can change. An AT-URI of an [attachment](/lexicons/hypercerts-lexicons/attachment) record keeps the evidence inside the network and attributable to its publisher.
- **The publisher and the measurers are separate.** `measurers` lists who performed the observation, as stated by the publisher. Naming someone does not show they took part or agree. Their confirmation comes from a [signature](/lexicons/certified-lexicons/signatures) in `signatures` or an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) from their own account.
- **Self-reported and independent measurements look the same.** Nothing in the record marks the difference. Applications presenting measurements as evidence can compare the publishing account with the owner of the subject record and show readers which is which.
- **Combine measurements with care.** Two records with the same metric and unit string are not necessarily comparable. Only sum or compare values whose metric, unit, method, and periods you know to be compatible, and show readers which records a total includes.
- **Correct rather than delete.** Evaluations and other records may reference a measurement by its exact version. If a value turns out to be wrong, update the record and explain the change in `comment`, so that readers of an older reference can see what happened. Deleting leaves those references pointing at nothing; see [Records That Change Over Time](/architecture/data-flow-and-lifecycle).

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) and [Collection](/lexicons/hypercerts-lexicons/collection): the usual subjects of a measurement.
- [Attachment](/lexicons/hypercerts-lexicons/attachment): documents and datasets that support a measurement.
- [Evaluation](/lexicons/hypercerts-lexicons/evaluation): assessments that cite measurements.
- [Location](/lexicons/certified-lexicons/location): where the observation was made.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) and [Signatures](/lexicons/certified-lexicons/signatures): confirmation from named measurers.
- Guide: [Evidence and Measurements](/core-concepts/evidence-and-measurements), [Trust and Recognition](/core-concepts/certified-identity).
