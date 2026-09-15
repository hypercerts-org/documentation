---
title: Badge Response
description: Lexicon reference for the Badge Response record type in Certified.
---

# Badge Response

`app.certified.badge.response`

A response to a badge award. The record can accept or reject a referenced award and can optionally assign a relative weight.

The schema does not require the response repository to match the award subject. Applications must perform that identity check before interpreting a response as the recipient's consent.

The weight field allows recipients to curate their badge display, emphasizing badges they consider most significant. Applications can use these weights to determine how prominently to display different badges on a user's profile.

For the full released schema, see [`app.certified.badge.response` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/app/certified/badge/response.json).
