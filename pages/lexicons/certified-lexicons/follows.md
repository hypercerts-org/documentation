---
title: Follows
description: Lexicon reference for app.certified.graph.follow and app.certified.graph.entityFollow, the records for following accounts and records.
---

# Follows

`app.certified.graph.follow` · `app.certified.graph.entityFollow`

## Overview

Follow records let an account say it wants to keep up with something. There are two kinds:

- A **follow** (`app.certified.graph.follow`) follows another account, named by its DID.
- An **entity follow** (`app.certified.graph.entityFollow`) follows something that is not an account. Today that means a specific record, such as a project collection or an activity, named by its AT-URI.

Both records live in the follower's own repository. The follower is the account whose repository holds the record; no property names it. Following is one-sided: the followed account doesn't approve it, and nothing changes in its repository.

Accounts and records are addressed differently, so they use separate collections. An app that builds an account's follower list reads follow records; an app showing who follows a project reads entity follows. For how version-pinned and URI-only references differ, see [Records That Change Over Time](/architecture/data-flow-and-lifecycle) in the Guide.

## How it's used

- **Keeping up with people and organizations.** A user follows a project team, an evaluator, or a funder so an app can show their new activities, evaluations, and awards in a feed.
- **Keeping up with a project.** A user follows a [collection](/lexicons/hypercerts-lexicons/collection) or an [activity](/lexicons/hypercerts-lexicons/activity-claim) with an entity follow. The subject has no CID, so the follow keeps pointing at the record as it is updated, and the follower sees new phases or reports.
- **Crediting discovery.** The optional `via` field is a strong reference to the record through which the follow happened, such as a curated list defined by some other lexicon. It records how the follow came about; the follow stands on its own without it.
- **Counting followers.** No record lists an account's or a record's followers. Indexers derive that from follow records held in many other repositories, so a follower count reflects that indexer's coverage.

To stop following, delete the record. Neither lexicon has a status or "unfollow" field.

## Follow schema

A follow names the account being followed by DID.

{% lexicon-schema nsid="app.certified.graph.follow" /%}

## Entity follow schema

An entity follow names the thing being followed through an open union. Its only variant is [`app.certified.defs#recordSubject`](/lexicons/certified-lexicons/shared-defs#recordsubject), an AT-URI without a CID.

{% lexicon-schema nsid="app.certified.graph.entityFollow" /%}

## Example

A user following a project team's account:

```json
{
  "$type": "app.certified.graph.follow",
  "subject": "did:plc:ewvi7nxzyoun6zhxrhs64oiz",
  "createdAt": "2026-09-12T08:30:00.000Z"
}
```

The same user following that team's project collection, so they see it as it grows:

```json
{
  "$type": "app.certified.graph.entityFollow",
  "subject": {
    "$type": "app.certified.defs#recordSubject",
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.collection/3lx2m4q7trs2b"
  },
  "createdAt": "2026-09-12T08:32:00.000Z"
}
```

## Rules and best practices

- **Follow accounts with `follow`, never with `entityFollow`.** Don't point an entity follow at a repository URI with no collection or record key, at an account's profile record, or at an `app.certified.defs#did` object. These validate, but an app reading follow records for that account won't see them.
- **Use a full record URI in the DID form.** Write an entity follow's `uri` as `at://<did>/<collection>/<rkey>`. Handle-based and partial URIs pass schema validation, but indexers typically skip them.
- **Don't write duplicates.** The record key is a TID, so nothing stops a repository from holding two follows of the same subject. Check for an existing follow before creating one. Deduplication is left to indexers: they typically treat all records naming the same subject (same DID, or same exact URI) as one follow.
- **Expect subjects in collections you don't know.** An entity follow can name a record in any lexicon. Keep the follow and show the subject as unresolved rather than dropping it. The same applies when the followed record has been deleted or the followed DID doesn't resolve.
- **A follow is attention, not endorsement.** Following costs nothing and needs no consent. Don't present a follow as approval, affiliation, or verification, and don't present a follower count as a measure of quality or impact. Evaluations, badges, and signatures are the records meant to carry those signals.
- **A followed record can change.** Because the subject carries no CID, the record's content can change after the follow was made. A follower count counts followers of a URI, not of the content shown next to it.
- **`via` pins a version.** Unlike the subject, `via` is a strong reference, because it records a fact about the past: the version of the list or record through which the follow happened.

## Related

- [Shared Definitions](/lexicons/certified-lexicons/shared-defs): the `recordSubject` definition used by entity follows.
- [Likes and Reposts](/lexicons/certified-lexicons/likes-and-reposts): social feedback on records, pinned to the version seen.
- [Profile](/lexicons/certified-lexicons/profile) and [Organization](/lexicons/certified-lexicons/organization): the accounts people follow.
- [Collection](/lexicons/hypercerts-lexicons/collection) and [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): records people commonly follow.
- [Signatures](/lexicons/certified-lexicons/signatures): the optional `signatures` property.
- Guide: [Records That Change Over Time](/architecture/data-flow-and-lifecycle), [Why AT Protocol?](/core-concepts/why-at-protocol).
