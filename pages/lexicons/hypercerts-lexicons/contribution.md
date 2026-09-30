---
title: Contribution
description: Lexicon reference for org.hypercerts.claim.contributorInformation and org.hypercerts.claim.contribution, reusable records that describe who contributed to an activity and what they did.
---

# Contribution

`org.hypercerts.claim.contributorInformation` and `org.hypercerts.claim.contribution`

## Overview

An [activity claim](/lexicons/hypercerts-lexicons/activity-claim) names its contributors in the `contributors` array. Each entry says who contributed and, optionally, what they did. Both parts can be written inline in the activity or as a strong reference to a separate record:

- A **contributor information** record describes *who*: an identifier (a DID or a profile URI), a display name, and an image.
- A **contribution** record describes *what*: a role, a description of the work, and the period it covers.

These records exist so contributor details can carry more than a single string and can be reused across activities. For the concepts, see [Activity Claims](/core-concepts/what-is-hypercerts) in the Guide.

## How it's used

- **Inline for simple cases.** An activity's contributor entry can hold an inline identity string and an inline role string. That needs no extra records and is often enough.
- **Referenced for reuse and detail.** A team that credits the same person on many activities publishes one contributor information record and references it from each. A contribution record is useful when a role needs a description or its own dates.
- **The activity ties them together.** A contributor entry pairs `contributorIdentity` (inline or a reference to a contributor information record) with optional `contributionDetails` (inline or a reference to a contribution record) and an optional `contributionWeight`. Neither record points back to the activity, so the association exists only through the activity's references.
- **Contributors can confirm.** Naming someone is the publisher's statement. The named person can confirm their involvement by publishing an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) in their own repository; see [Trust and Recognition](/core-concepts/certified-identity).

Both records require only `createdAt`. In practice, write at least an `identifier` or `displayName` on a contributor information record, and at least a `role` or `contributionDescription` on a contribution record, so the reference says something.

## Contributor information schema

Who a contributor is, for display and linking.

{% lexicon-schema nsid="org.hypercerts.claim.contributorInformation" /%}

## Contribution schema

What a contributor did on a piece of work.

{% lexicon-schema nsid="org.hypercerts.claim.contribution" /%}

## Example

The community energy project credits its electrician with a contributor information record:

```json
{
  "$type": "org.hypercerts.claim.contributorInformation",
  "identifier": "did:plc:ewvi7nxzyoun6zhxrhs64oiz",
  "displayName": "Maja Lindqvist",
  "image": {
    "$type": "org.hypercerts.defs#uri",
    "uri": "https://cdn.example.org/contributors/maja-lindqvist.jpg"
  },
  "createdAt": "2026-07-01T14:02:00.000Z"
}
```

A contribution record describing her part of the solar installation:

```json
{
  "$type": "org.hypercerts.claim.contribution",
  "role": "Electrical installation",
  "contributionDescription": "Designed the inverter and wiring layout, installed the 40 kW array's electrical system, and completed the grid connection inspection with the utility.",
  "startDate": "2026-04-15T00:00:00.000Z",
  "endDate": "2026-06-20T00:00:00.000Z",
  "createdAt": "2026-07-01T14:05:00.000Z"
}
```

The activity's `contributors` array then references both records. Each reference is a union member, so it carries `$type`:

```json
{
  "contributorIdentity": {
    "$type": "com.atproto.repo.strongRef",
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.contributorInformation/3lwzq2r6k4c2b",
    "cid": "bafyreibm3yqk5k7ruhlxwjzr2sxyqkqvfdyjgn6a7n5wrzntnzb4m6wqfe"
  },
  "contributionWeight": "1",
  "contributionDetails": {
    "$type": "com.atproto.repo.strongRef",
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.contribution/3lwzq3a7m5d2c",
    "cid": "bafyreif6y3h4qmxw2nqk7o5ztjq3vbl4c2rjrk5e7gdmxyw6ut2hzpq3ka"
  }
}
```

## Rules and best practices

- **Choose inline or referenced by need.** Use inline objects when a contributor is a single identity string with a short role label. Use records when the contributor appears on several activities, needs a name or image, or when the contribution needs a description or timeframe.
- **Publish one contributor information record per person and reuse it.** Writing a new record for every activity creates copies that drift apart when details change.
- **Use a DID as the identifier where possible.** A DID lets applications resolve the contributor's own profile. The schema accepts any string, so readers can't assume an identifier resolves, and a non-DID value is best shown as an unlinked name. When the contributor has their own profile, applications typically prefer it for display over another party's record about them.
- **A contributor information record is the publisher's description.** Unless the record lives in the contributor's own repository or carries their signature, its name and image are what the publisher says about that person, not the person's own statement.
- **Keep identity out of contribution records.** A contribution record has no identity field. Who made the contribution comes from `contributorIdentity` on the same contributor entry.
- **Keep contribution dates inside the activity's timeframe.** The schema describes this but can't check it, because the record doesn't name its activity. One contribution record may be referenced from activities with different dates, so readers shouldn't reject either record when dates don't line up.
- **Weights belong to the activity.** `contributionWeight` sits on the activity's contributor entry, not on these records. It is a relative value within that one activity; see the [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) page.
- **Mind the length limits when converting inline roles.** The inline role allows up to 100 graphemes (1,000 bytes), while a contribution record's `role` is limited to 100 bytes, so some inline roles won't fit. Put longer text in `contributionDescription` rather than truncating it.
- **References pin a version.** Correcting a referenced record changes its CID. Activities that referenced the earlier version keep pointing to it until they are updated.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): the record whose `contributors` array uses these records.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): how a contributor confirms their inclusion.
- [Profile](/lexicons/certified-lexicons/profile): a contributor's own profile, when they have an account.
- [Signatures](/lexicons/certified-lexicons/signatures): attestations over a record's content.
- Guide: [Activity Claims](/core-concepts/what-is-hypercerts), [Trust and Recognition](/core-concepts/certified-identity).
