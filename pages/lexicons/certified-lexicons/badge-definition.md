---
title: Badge Definition
---

# Badge Definition

`app.certified.badge.definition`

Defines a badge that can be awarded to users, projects, or activity claims. Each badge definition includes a title, description, icon, and badge type (like endorsement, participation, or affiliation).

Badge definitions can optionally specify an allowlist of DIDs that are permitted to issue the badge. If no allowlist is provided, anyone can create badge awards using this definition. This enables both open badges (where anyone can award them) and restricted badges (where only specific issuers are authorized).

Once created, a badge definition can be referenced by multiple badge award records. This separation allows the badge's visual identity and meaning to be defined once and reused many times.

For the full schema, see [`app.certified.badge.definition`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/app/certified/badge/definition.json) in the lexicon repo.
