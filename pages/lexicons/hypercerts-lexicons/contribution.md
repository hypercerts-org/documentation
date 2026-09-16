---
title: Contribution
description: Lexicon reference for the Contribution record type in Hypercerts.
---

# Contribution

This page covers two related lexicons that work together to represent contributors and their contributions.

## Contributor Information

`org.hypercerts.claim.contributorInformation`

Stores presentation and identifier information for a contributor: display name, an optional identifier described as a DID or social-profile URI, and an optional image. The schema does not validate the identifier as a DID or URI.

A contributor does not need a separate `contributorInformation` record. The activity claim's contributor entry accepts either a strong reference to that record or an inline `contributorIdentity` object containing an `identity` string. The inline value is an object, not a bare string.

For the full released schema, see [`org.hypercerts.claim.contributorInformation` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/claim/contributorInformation.json).

## Contribution

`org.hypercerts.claim.contribution`

Stores details about a contribution, including an optional role, description, and timeframe. Contribution details in an activity can be an inline `contributorRole` object containing a `role` string or a strong reference to this separate record. The inline value is not a bare string.

The activity claim's `contributors` array also supports contribution weights to indicate relative effort or impact.

## Choosing contribution weights

Weights are intended as positive relative values. The protocol stores them as strings and does not enforce numeric syntax, normalization, or a calculation method. The following are application-policy examples, not protocol requirements.

### Equal split

Every contributor gets weight `"1"`. Works well for collaborative work where contributions are hard to separate, or small teams where everyone contributed roughly equally.

Example: 4 contributors each with `contributionWeight: "1"`

### Role-based multipliers

Assign a base multiplier per role:

| Role | Weight |
|------|--------|
| Lead/Creator | 6 |
| Core contributor | 4 |
| Reviewer/Advisor | 2 |
| Minor contributor | 1 |

Example: Lead author `"6"`, two core contributors `"4"` each, one reviewer `"2"`, one minor contributor `"1"`

### Activity-based (git signals)

Derive weights from repository data: commits, lines changed, PRs merged, issues closed.

Caveat: biased toward code-heavy contributions; does not capture design, coordination, or review work well.

Example: Alice (450 commits) `"45"`, Bob (350 commits) `"35"`, Carol (200 commits) `"20"`

### Peer assessment

Each contributor receives a fixed budget of points (e.g. 100) to distribute among peers (not themselves). Final weight = total points received.

Caveat: requires active participation from all contributors.

Example: After a round, Alice receives 140 points → `"140"`, Bob receives 90 → `"90"`, Carol receives 70 → `"70"`

### Outcome-based

Weight by measurable deliverables: features shipped, milestones hit, KPIs moved.

Caveat: hardest to quantify fairly; risk of rewarding easily-measured work over important-but-hard-to-measure work.

Example: Alice delivered 3 milestones → `"3"`, Bob delivered 1 → `"1"`

### Composite

Combine multiple signals — for example, mix role-based multipliers with peer assessment scores. Weight each signal by how much it should matter, then add them up.

Example: A team weights roles at 40% and peer scores at 60%. Alice (lead, peer score 140) gets `"57"`, Bob (core, peer score 90) gets `"55"`, Carol (core, peer score 70) gets `"43"`.

{% callout type="note" %}
Weights are stored as strings and do not need to sum to any particular value. These examples all produce relative values — what matters is the ratio between contributors, not the absolute numbers.
{% /callout %}

For the full released schema, see [`org.hypercerts.claim.contribution` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/claim/contribution.json).
