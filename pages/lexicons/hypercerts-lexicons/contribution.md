---
title: Contribution
---

# Contribution

This page covers two related lexicons that work together to represent contributors and their contributions.

## Contributor Information

`org.hypercerts.claim.contributorInformation`

Stores identity information for a contributor: display name, identifier (like a GitHub username or email), and an optional profile image. This record can be created once and referenced from multiple activity claims, making it easy to maintain consistent contributor identity across projects.

A contributor doesn't need a full `contributorInformation` record. The activity claim's `contributors` array accepts either a strong reference to a `contributorInformation` record or an inline identity string (typically a DID). Use the inline form for simple cases; use the record when you want a reusable profile with a display name and image.

For the full schema, see [`org.hypercerts.claim.contributorInformation`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/claim/contributorInformation.json) in the lexicon repo.

## Contribution

`org.hypercerts.claim.contribution`

Stores details about a specific contribution, including the contributor's role, a description of what they did, and the timeframe of their work. Like contributor identity, contribution details can be provided inline (as a role string) or as a strong reference to a separate record.

The activity claim's `contributors` array also supports contribution weights to indicate relative effort or impact.

For the full schema, see [`org.hypercerts.claim.contribution`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/claim/contribution.json) in the lexicon repo.
