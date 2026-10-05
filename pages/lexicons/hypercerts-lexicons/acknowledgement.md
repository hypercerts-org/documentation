---
title: Acknowledgement
description: Lexicon reference for org.hypercerts.context.acknowledgement, the record a party publishes to accept or reject a record or relationship that involves them.
---

# Acknowledgement

`org.hypercerts.context.acknowledgement`

## Overview

An acknowledgement records that a party accepts or rejects a record, or a relationship between two records, that someone else published. It lives in the acknowledging party's own repository and points to a specific version of the record concerned.

Anyone can publish a record that names someone else: an activity can list a contributor who never agreed, and a collection can include an activity without its owner's consent. Those records are the publisher's statement alone. An acknowledgement adds the named party's own response, which the original publisher can't create, change, or delete. Together, the two records form a link that both sides stand behind. For the concepts, see [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

## How it's used

- **A contributor confirms an attribution.** Someone listed in an [activity's](/lexicons/hypercerts-lexicons/activity-claim) `contributors` publishes an acknowledgement with the activity as `subject`. When the contributor is described by a [contributor information record](/lexicons/hypercerts-lexicons/contribution), that record can be the `subject` and the activity the `context`.
- **An activity owner confirms collection membership.** When another account includes your activity in its [collection](/lexicons/hypercerts-lexicons/collection), you publish an acknowledgement with your activity as `subject` and their collection as `context`.
- **A project responds to an evaluation.** The owner of an evaluated record acknowledges an [evaluation](/lexicons/hypercerts-lexicons/evaluation) to accept it, or rejects it and explains why in `comment`.
- **A funder or recipient confirms a receipt.** A party named in a [funding receipt](/lexicons/hypercerts-lexicons/funding-receipt) acknowledges it to confirm the details.
- **Applications check for responses.** Because the record being acknowledged doesn't point back, an application finds acknowledgements by looking in the named party's repository, or through an indexer, for records whose `subject` matches.

Every acknowledgement needs `subject`, `acknowledged`, and `createdAt`. Add `context` when the response concerns a relationship between two records rather than a single record.

## Schema

{% lexicon-schema nsid="org.hypercerts.context.acknowledgement" /%}

## Example

The electrician named as a contributor on phase 1 of the community energy project confirms the attribution from their own account. The activity lists contributors inline, so the activity itself is the subject and no `context` is needed:

```json
{
  "$type": "org.hypercerts.context.acknowledgement",
  "subject": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lxa4m2vbqk2s",
    "cid": "bafyreif3kq7xmzd2vhw5l4yjn6rb2pc7tsgoe4ua5xi3qhk6wzdmfv2nle"
  },
  "acknowledged": true,
  "comment": "Confirming I carried out the electrical installation for phase 1.",
  "createdAt": "2026-07-04T17:45:00.000Z"
}
```

## Rules and best practices

- **It only counts from the relevant account.** The acknowledging party is identified by the repository that holds the record, not by any field. An acknowledgement confirms a contributor attribution only when it comes from that contributor's DID; one published by the activity's own author confirms nothing. Applications check that the publishing account is the party whose agreement is in question.
- **Use `subject` for the included record and `context` for the container.** For a relationship between two records, set `subject` to the record being included (the activity, or the contributor information record) and `context` to the record that includes it (the collection, or the activity). Leave `context` out only when the response concerns the subject as a whole.
- **Prefer a strong reference for `context`.** The strong-reference variant pins the exact version of the container. Use the URI variant only for a context that is not a record on the network.
- **Assent is to the relationship, not the content.** A contributor acknowledging an activity agrees to being listed. That doesn't confirm the activity's title, dates, scope, or other contributors. When contributors are listed inline, an acknowledgement covers only the entry naming the acknowledging party.
- **Rejection is a real answer.** `acknowledged: false` is a published objection. Applications that show acknowledgements show rejections alongside acceptances, and never treat a rejection as if no response existed. Use `comment` to explain reservations; there is no partial or conditional value.
- **No acknowledgement is not a rejection.** A missing acknowledgement may mean the party hasn't responded, has no account, or hasn't been found by the application. Don't present it as refusal or as consent.
- **The pinned version matters.** `subject` includes a CID. If the acknowledged record is edited later, the acknowledgement still refers to the earlier version. Applications can compare CIDs and show the acknowledgement as applying to a previous version rather than to the current record.
- **Change your position with a new record, not a deletion.** To reverse an acknowledgement, update it or publish a newer one with a later `createdAt`. A deletion leaves no visible trace of the change. Applications reducing several acknowledgements from one party to a current position typically take the latest.
- **Render `comment` as plain text.** The field has no facets and is not intended for markup.
- **Use badge responses for badges.** To accept or reject a badge award, publish a [badge response](/lexicons/certified-lexicons/badge-response) instead.
- **An acknowledgement is not payment verification.** Confirming a funding receipt adds a second party's statement, but it doesn't replace evidence that money moved.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim), [Contribution](/lexicons/hypercerts-lexicons/contribution), and [Collection](/lexicons/hypercerts-lexicons/collection): relationships commonly acknowledged.
- [Evaluation](/lexicons/hypercerts-lexicons/evaluation) and [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt): third-party records a named party can confirm or dispute.
- [Badge Response](/lexicons/certified-lexicons/badge-response): the equivalent response for badge awards.
- [Signatures](/lexicons/certified-lexicons/signatures): confirmation of a record's content, as distinct from agreement to a relationship.
- Guide: [Trust and Recognition](/core-concepts/certified-identity), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
