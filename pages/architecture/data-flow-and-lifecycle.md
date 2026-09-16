---
title: Records That Change Over Time
description: Understand how updates, versions, and links let a project's public record grow without losing the context of earlier assessments.
---

# Records That Change Over Time

A team updates an activity description. An evaluator has already reviewed the earlier version. How can a reader tell what the evaluation was about?

Hypercerts uses AT Protocol's record addresses and content identifiers to distinguish a record from a particular version of it.

## Give each record an address

Every repository record has an **AT-URI**, its address on the network. It identifies the publishing account, the kind of record, and the record's key within that account.

The address is separate from the website that displays the record. A project dashboard and an evaluation tool can therefore link to the same activity, even though each presents it on a different web page.

If the publisher updates the activity at that address, it is still the same record, now with different contents.

## Know which version was reviewed

A **CID**, or content identifier, identifies the record's contents. Changing the contents changes the CID.

A **strong reference** combines an AT-URI with a CID. It says both “this record” and “this version.” An evaluation that links this way keeps pointing to the version it assessed, even after the team changes its activity description.

A reading app can then tell the user that the assessment concerns an earlier version. It should not silently present that assessment as a review of the changed claim. The reference identifies the older contents, but retrieving them still depends on a service having retained that version.

Some relationships deliberately follow a record across updates. For example, following a project can use its AT-URI without a CID. The appropriate form depends on whether the relationship concerns a specific version or the ongoing record.

## Add context without editing someone else's work

An evaluation, measurement, or attachment can be published as a new record linking to an existing activity. The publisher of the activity doesn't have to add it to a list or edit the original description.

The link lives in the new record. To show “all evaluations of this activity,” an app needs to find records pointing back to it. An indexer helps answer that question across accounts.

## What if a record disappears?

Publishers can delete records from their repositories. Links to a deleted record may remain in other people's evaluations, collections, or receipts. Copies may also remain elsewhere.

A useful app keeps the link and explains that the target is unavailable. This preserves what the publisher referred to instead of substituting a different record or pretending the relationship never existed.

For a technical overview of the services involved, see [Architecture](/architecture/overview).

Next: [Finding and Reusing Information](/architecture/portability-and-scaling), where these individual links become useful project views.
