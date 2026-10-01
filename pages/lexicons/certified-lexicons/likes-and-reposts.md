---
title: Likes and Reposts
description: Lexicon reference for app.certified.feed.like and app.certified.feed.repost, social feedback on records of any lexicon.
---

# Likes and Reposts

`app.certified.feed.like` · `app.certified.feed.repost`

## Overview

A **like** (`app.certified.feed.like`) records that an account liked a record. A **repost** (`app.certified.feed.repost`) resurfaces a record to the reposter's followers. Both can point at a record of any lexicon, such as an activity, a collection, or an evaluation, and both live in the repository of the account doing the liking or reposting.

They are social feedback only. A like is not an evaluation, an endorsement, or an acknowledgement, and it says nothing about whether the work happened or had impact. For assessments, use an [evaluation](/lexicons/hypercerts-lexicons/evaluation); for accepting a relationship, use an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement). That is also why these records live in the `app.certified` namespace rather than `org.hypercerts`.

Both records use the same shape as Bluesky's `app.bsky.feed.like` and `app.bsky.feed.repost`, so indexers that already handle those can handle these with little change. For how applications find records across repositories, see [Why AT Protocol?](/core-concepts/why-at-protocol) in the Guide.

## How it's used

- **Showing appreciation.** A user likes a project's latest activity. Apps show a like count and let people see who liked it.
- **Spreading the word.** A funder reposts a project's activity so its followers see it in their feeds.
- **Crediting discovery.** When someone likes or reposts a record they found through a repost, `via` points at that repost. AppViews use it to credit the account that surfaced the record and to trace repost chains.
- **Counting.** Indexers count likes and reposts by `subject.uri`, so all versions of a record share one count. The `subject.cid` still tells readers which version each person saw.

To undo a like or a repost, delete the record.

## Like schema

A like names the liked record with a strong reference, pinning the version the account saw.

{% lexicon-schema nsid="app.certified.feed.like" /%}

## Repost schema

A repost uses the same strong-reference subject and optional `via`.

{% lexicon-schema nsid="app.certified.feed.repost" /%}

## Example

A funder reposting a project's activity:

```json
{
  "$type": "app.certified.feed.repost",
  "subject": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lx2k9f2abc2d",
    "cid": "bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy"
  },
  "createdAt": "2026-09-13T11:20:00.000Z"
}
```

A follower of the funder liking the same activity, found through that repost:

```json
{
  "$type": "app.certified.feed.like",
  "subject": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lx2k9f2abc2d",
    "cid": "bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy"
  },
  "createdAt": "2026-09-14T17:05:00.000Z",
  "via": {
    "uri": "at://did:plc:ewvi7nxzyoun6zhxrhs64oiz/app.certified.feed.repost/3lxbq2wz7hk2c",
    "cid": "bafyreidfayvfuwqa7qlnopdjiqrxzs6blmoeu4rujcjtnci5beludirz2a"
  }
}
```

## Rules and best practices

- **Point the subject at the original record, not at a repost.** When liking something found through a repost, the subject is the reposted record and `via` is the repost.
- **Pin the version that was shown.** Set `subject.cid` to the CID of the version the user actually saw. A like or repost is about content as seen; if the record is edited later, the reference still shows what the person reacted to.
- **Count by URI, show the version when it matters.** Indexers typically group likes and reposts by `subject.uri`. If an app shows that someone liked or reposted an older version, it can say so, as it would for an evaluation of an earlier version.
- **Don't treat likes as evaluations.** Likes are free and easy to produce in volume. Don't use like or repost counts as a measure of quality, impact, or verification, and don't label a ranking based on them as anything other than attention.
- **Expect any lexicon in `subject` and `via`.** Both can reference records of any type. Keep the record and show the subject as unavailable if it can't be resolved.
- **Likes and reposts differ from follows on purpose.** An [entity follow](/lexicons/certified-lexicons/follows) uses a URI without a CID so it survives edits to the followed record. A like or repost pins a CID because it is about a specific version.

## Related

- [Follows](/lexicons/certified-lexicons/follows): following accounts and records across updates.
- [Evaluation](/lexicons/hypercerts-lexicons/evaluation) and [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): records that carry assessment or acceptance.
- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) and [Collection](/lexicons/hypercerts-lexicons/collection): records commonly liked and reposted.
- [Signatures](/lexicons/certified-lexicons/signatures): the optional `signatures` property.
- Guide: [Records That Change Over Time](/architecture/data-flow-and-lifecycle), [Why AT Protocol?](/core-concepts/why-at-protocol).
