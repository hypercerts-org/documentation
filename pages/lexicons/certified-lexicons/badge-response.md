---
title: Badge Response
description: Lexicon reference for app.certified.badge.response, the record in which a badge recipient accepts or rejects an award.
---

# Badge Response

`app.certified.badge.response`

## Overview

A badge response records what the recipient of a [badge award](/lexicons/certified-lexicons/badge-award) says about it: `accepted` or `rejected`. An award is written by the issuer alone, so it can't show whether the recipient wanted it. The response is the recipient's side, published in the recipient's own repository.

A recipient can also give an accepted badge a relative weight, for example to choose which badges to feature. See [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

## How it's used

- **The recipient answers an award.** After a network awards a badge to a project, the project's account publishes a response pointing to that award.
- **Applications combine award and response.** An application showing a project's badges looks up responses from the project's account and shows each award as accepted, rejected, or not yet answered.
- **Weights shape display.** A recipient can set `weight` on accepted badges, and an application can use it to order or highlight badges on the recipient's page.

`badgeAward`, `response`, and `createdAt` are required.

## Schema

{% lexicon-schema nsid="app.certified.badge.response" /%}

## Example

The community energy project accepting the certification awarded to its installation activity:

```json
{
  "$type": "app.certified.badge.response",
  "badgeAward": {
    "uri": "at://did:plc:k3nq7wz2vbx5rmt4ydh6pcsa/app.certified.badge.award/3lzfqk4x7dc2m",
    "cid": "bafyreiccxwqt2m3j4dq7a3ymq5wvf6ldfxr7jfbgh6i4mzte4eb6ptr4qu"
  },
  "response": "accepted",
  "weight": "10",
  "createdAt": "2026-09-23T08:45:00.000Z"
}
```

This record lives in the project's repository, while the award it references lives in the network's.

## Rules and best practices

- **Check that the response came from the subject.** The schema lets any account publish a response to any award. Treat a response as the recipient's only when the repository holding it is the award's subject: the DID itself for an account subject, or the account in the record's AT-URI for a record subject. Ignore responses from anyone else.
- **No response means unanswered.** Don't show an award without a response as accepted or rejected. Show an award as accepted only when the recipient's response says `accepted`.
- **Respect rejections.** When the recipient rejects an award, show it as rejected or leave it out of their badges. Don't show it as merely unanswered.
- **The latest response counts.** A recipient can change their mind by publishing a new response or deleting the old one. When there are several responses to the same award, use the most recent. If the recipient deletes their response, the award is unanswered again.
- **A response covers one version of the award.** `badgeAward` is a strong reference. If the issuer later edits the award, the response still refers to the earlier version, so don't carry the acceptance over automatically. Show the current version as unanswered and, if helpful, note that the recipient responded to an earlier version.
- **Weights are the recipient's own scale.** `weight` is a free-form string with no defined range. Use it to compare badges held by the same recipient, not to compare or add up weights across recipients. Ignore it on a rejection.
- **Handle unknown values.** `response` has two known values but isn't a closed list. Treat any other value as unrecognized, neither accepted nor rejected.

## Related

- [Badge Award](/lexicons/certified-lexicons/badge-award): the award being answered.
- [Badge Definition](/lexicons/certified-lexicons/badge-definition): what the badge means.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): a general-purpose way to accept or reject being named in other records.
- Guide: [Trust and Recognition](/core-concepts/certified-identity), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
