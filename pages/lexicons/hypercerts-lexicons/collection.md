---
title: Collection
description: Lexicon reference for org.hypercerts.collection, the record that groups activities, features, and other collections into projects, portfolios, and programs.
---

# Collection

`org.hypercerts.collection`

## Overview

A collection groups related records under one name and address. Its items can be [activity claims](/lexicons/hypercerts-lexicons/activity-claim), [features](/lexicons/hypercerts-lexicons/feature), and other collections, so collections can nest.

The same record type serves several purposes. A project is a collection with `type` set to `project`. A funder's portfolio, a program that brings several projects together, and a user's favorites list are collections too. For the concepts, see [Projects and Collections](/core-concepts/projects-and-collections) in the Guide.

## How it's used

- **A team publishes its project.** It publishes an activity for each phase of work, then a collection with `type: "project"` that lists them as items. Applications recognize the project by that convention.
- **The project grows over time.** When a new phase starts, the team publishes another activity and adds it to the collection's items. Earlier activities and their evaluations keep their own records.
- **Others build on it.** A funder groups projects into a `portfolio`; a program nests project collections. [Funding receipts](/lexicons/hypercerts-lexicons/funding-receipt), [evaluations](/lexicons/hypercerts-lexicons/evaluation), and [attachments](/lexicons/hypercerts-lexicons/attachment) can point at a collection to concern the project as a whole.
- **Places and subjects sit alongside the work.** A land restoration project can include feature records for its zones next to its activities, and set `location` to the area the project's activities cover.
- **Tags make it findable.** `tags` references [vocabulary tags](/lexicons/hypercerts-lexicons/vocabulary-tag) that classify the collection, so directories can group projects by subject.

Only `title` and `createdAt` are required. Each entry in `items` needs an `itemIdentifier` strong reference and can carry an `itemWeight`.

## Schema

{% lexicon-schema nsid="org.hypercerts.collection" /%}

## Example

The community energy project groups its installation and maintenance activities:

```json
{
  "$type": "org.hypercerts.collection",
  "type": "project",
  "title": "Village Hall Community Solar",
  "shortDescription": "A community-owned 40 kW solar array on the village hall roof: installation, maintenance, and energy reporting.",
  "description": {
    "$type": "org.hypercerts.defs#descriptionString",
    "value": "The project is run by a local energy cooperative. Each phase of work is published as its own activity so it can be evaluated and funded separately."
  },
  "items": [
    {
      "itemIdentifier": {
        "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lx3a2b7kq22c",
        "cid": "bafyreihx4gq5r3ptzuv6k2ymw7jl5nfbq3d2ewo6xacsyrtm4kz7vf2qdu"
      },
      "itemWeight": "3"
    },
    {
      "itemIdentifier": {
        "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lx3a4d2mr52e",
        "cid": "bafyreidq2n7wvb5xk3m4tz6ojyhl2rfe7gcua5spk3vw4nqzx6yb2mfhle"
      },
      "itemWeight": "1"
    }
  ],
  "location": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/app.certified.location/3lx2k7p4hvc2a",
    "cid": "bafyreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy"
  },
  "tags": [
    {
      "uri": "at://did:plc:vx3tq7ms2kd4nfr6wz5hbyc2/org.hypercerts.vocab.tag/sector.renewable-energy",
      "cid": "bafyreica5ft3kzm7wq2rxnd6h4ybvolj3tsg5ue2kpwmzq7x4nbdrfyv6a"
    }
  ],
  "createdAt": "2026-07-02T09:30:00.000Z"
}
```

## Rules and best practices

- **Mark projects with `type: "project"`.** There is no separate project record. Set `type` so applications can tell a project from a portfolio, program, or favorites list; a collection without it tends to be treated as a generic group. Other values are allowed, but only applications that know them will interpret them.
- **Give a project a `shortDescription` and at least one activity.** Directories and funding platforms show the short description in lists, and a project with no activities gives readers nothing to follow.
- **Including a record is the collection publisher's choice.** Items can live in other people's repositories, and adding them needs no permission. Inclusion doesn't imply endorsement or partnership. The owner of an included record can confirm it by publishing an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) that names the collection as context.
- **Weights are relative within one collection.** `itemWeight` is a positive number stored as a string. Weights don't need to sum to a total and can't be compared with weights in another collection. If you weight any item, weight all of them, so applications don't have to guess a share for the rest. Weights don't combine across nesting levels.
- **List each item once.** Duplicate entries for the same record make weights and counts ambiguous.
- **Check what an item is.** `itemIdentifier` is an untyped strong reference. Readers determine an item's type from the resolved record and skip items that aren't activities, features, or collections.
- **Limit nesting when resolving.** Collections can nest without a schema limit, and the same collection can appear in several parents. Applications that expand nested collections typically cap depth and the number of records fetched, and list each member once.
- **Tags describe this collection only.** A project's tags don't apply to its activities or features, and a nested collection doesn't inherit its parent's tags. Use tags from a published vocabulary so others can recognize them; untagged collections are hard to discover.
- **Keep items current.** When you delete or replace a record your collection references, update the collection. Editing the collection changes its CID, so records that pinned the earlier version keep pointing to it.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): the main kind of item in a collection.
- [Feature](/lexicons/hypercerts-lexicons/feature): places and subjects a project concerns.
- [Vocabulary Tag](/lexicons/hypercerts-lexicons/vocabulary-tag): terms used in `tags`.
- [Location](/lexicons/certified-lexicons/location): the record `location` points to.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): confirmation of inclusion by an item's owner.
- [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt): support recorded against a project.
- Guide: [Projects and Collections](/core-concepts/projects-and-collections), [Describing and Classifying Work](/core-concepts/cel-work-scopes), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
