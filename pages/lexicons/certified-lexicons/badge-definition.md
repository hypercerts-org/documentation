---
title: Badge Definition
description: Lexicon reference for the Badge Definition record type in Certified.
---

# Badge Definition

`app.certified.badge.definition`

Defines a badge that can be awarded to accounts or records. A badge definition requires a title, badge type, and creation time; its description, icon, and issuer allowlist are optional.

Badge definitions can specify an allowlist of issuer DIDs. Applications must compare an award's repository publisher with this list; the generic repository schema does not enforce issuer authorization.

Once created, a badge definition can be referenced by multiple badge award records. This separation allows the badge's visual identity and meaning to be defined once and reused many times.

For the full released schema, see [`app.certified.badge.definition` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/app/certified/badge/definition.json).
