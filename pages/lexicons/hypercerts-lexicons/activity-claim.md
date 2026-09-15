---
title: Activity Claim
description: Lexicon reference for the Activity Claim record type — the core record of a hypercert.
---

# Activity Claim

`org.hypercerts.claim.activity`

The activity claim is the core hypercert work record. It represents a referenceable statement about work that is planned, ongoing, or completed.

Who, what, when, and where are useful conceptual dimensions, but contributors, work scope, dates, and locations are optional in the released schema. Other records can reference an activity, while contributor information, contribution details, rights, and locations are referenced from the activity.

The activity claim supports rich descriptions with text formatting, cover images, contributor lists with weights and roles, work scope definitions, time ranges, location references, and rights declarations. It's designed to be flexible enough to represent everything from open-source software maintenance to forest stewardship to research projects.

For the full released schema, see [`org.hypercerts.claim.activity` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/claim/activity.json).
