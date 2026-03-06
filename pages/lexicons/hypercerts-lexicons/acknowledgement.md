---
title: Acknowledgement
---

# Acknowledgement

`org.hypercerts.context.acknowledgement`

## Definition

An acknowledgement is a record expressing acceptance or rejection of a relationship. For example, a contributor might acknowledge their inclusion in an activity claim, or a funder might confirm a funding receipt.

Acknowledgements are created in the acknowledging actor's own repository, making them independently verifiable. Each acknowledgement references the record being acknowledged, specifies whether it's accepted or rejected, and can include an optional note explaining the decision.

This enables consent-based relationships in the hypercerts ecosystem. Rather than assuming that being listed as a contributor or funder implies agreement, acknowledgements make consent explicit and auditable. They also enable dispute resolution — if someone is incorrectly listed, they can create a rejection acknowledgement.

## Use case: contributor acknowledges inclusion in an activity

Alice creates an activity claim listing Bob as a contributor. Bob wants to confirm he actually participated.

1. Alice creates an `org.hypercerts.claim.activity` record on her PDS, listing Bob in the `contributors` array
2. Bob sees he's been listed (via an indexer or notification)
3. Bob creates an `org.hypercerts.context.acknowledgement` on **his own PDS** with:
   - `subject` → strong reference to Alice's activity claim
   - `acknowledged` → `true`
   - `comment` → `"Confirming my role as technical reviewer"`

If Bob was listed incorrectly, he'd set `acknowledged` to `false` instead — creating a visible rejection that indexers and applications can surface.

## Use case: funder confirms a funding receipt

A grant platform creates a funding receipt recording that Funder X contributed $5,000 to a project. Funder X wants to confirm the receipt is accurate.

1. The platform creates an `org.hypercerts.funding.receipt` record
2. Funder X creates an `org.hypercerts.context.acknowledgement` on their own PDS with:
   - `subject` → strong reference to the funding receipt
   - `acknowledged` → `true`
   - `comment` → `"Confirmed — payment processed via our grants program"`

If the amount or details were wrong, the funder sets `acknowledged` to `false` with a comment explaining the discrepancy.

## Use case: rejecting an evaluation

A project lead disagrees with an evaluation of their work and wants to flag it.

1. An evaluator creates an `org.hypercerts.context.evaluation` referencing the project's activity claim
2. The project lead creates an acknowledgement with:
   - `subject` → strong reference to the evaluation
   - `acknowledged` → `false`
   - `comment` → `"This evaluation references outdated data — see our updated measurements"`

The rejection doesn't delete the evaluation — it creates a counter-signal that applications can use to present both sides.

For the full schema, see [`org.hypercerts.context.acknowledgement`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/context/acknowledgement.json) in the lexicon repo.
