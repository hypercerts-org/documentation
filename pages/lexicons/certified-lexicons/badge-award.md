---
title: Badge Award
description: Lexicon reference for the Badge Award record type in Certified.
---

# Badge Award

`app.certified.badge.award`

Awards a badge to a user, project, or activity claim. Each award references a badge definition and a subject — either an account DID (for user badges) or a strong reference to a specific record like an activity claim (for project or work badges).

Badge awards can include an optional note explaining why the badge was given. Consumers can verify which repository published the record, but must separately decide whether that publisher was authorized to award the badge.

Recipients can respond to badge awards using the badge response Lexicon, accepting or rejecting a referenced award and optionally assigning a relative weight. Applications must verify that a response was published by the award's subject before treating it as the recipient's response.

For the full released schema, see [`app.certified.badge.award` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/app/certified/badge/award.json).
