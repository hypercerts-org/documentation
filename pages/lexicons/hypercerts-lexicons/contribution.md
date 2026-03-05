---
title: Contribution
---

# Contribution

This page covers two related lexicons that work together to represent contributors and their contributions.

## Contributor Information

`org.hypercerts.claim.contributorInformation`

Stores identity information for a contributor: display name, identifier (like a GitHub username or email), and an optional profile image. This record can be created once and referenced from multiple activity claims, making it easy to maintain consistent contributor identity across projects.

For the full schema, see [`org.hypercerts.claim.contributorInformation`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/claim/contributorInformation.json) in the lexicon repo.

## Contribution Details

`org.hypercerts.claim.contributionDetails`

Stores details about a specific contribution, including the contributor's role, a description of what they did, and the timeframe of their work. Like contributor information, this can be created as a separate record and referenced from an activity claim's contributors array.

Together, these lexicons allow you to represent contributors either inline (with simple strings) or as rich, referenceable records with detailed metadata. Contributors are referenced from the activity claim's `contributors` array, which also supports contribution weights to indicate relative effort or impact.

For the full schema, see [`org.hypercerts.claim.contributionDetails`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/claim/contribution.json) in the lexicon repo.
