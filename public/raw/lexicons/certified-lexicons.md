---
title: Certified Lexicons
description: Lexicon reference for Certified identity records — profiles, locations, and badges.
---

# Certified Lexicons

These lexicons live in the `app.certified` namespace. They provide shared data structures for identity, profiles, badges, and location — building blocks that other, more specialized lexicons can reference.

| Lexicon | NSID | Description |
|---------|------|-------------|
| **[Shared Definitions](/lexicons/certified-lexicons/shared-defs)** | `app.certified.defs` | Common type definitions: the `did` type |
| **[Location](/lexicons/certified-lexicons/location)** | `app.certified.location` | Geographic location representation using the Astral Location Protocol |
| **[Profile](/lexicons/certified-lexicons/profile)** | `app.certified.actor.profile` | Account profile with display name, description, avatar, and banner |
| **[Badge Definition](/lexicons/certified-lexicons/badge-definition)** | `app.certified.badge.definition` | Defines a badge type with title, icon, and optional issuer allowlist |
| **[Badge Award](/lexicons/certified-lexicons/badge-award)** | `app.certified.badge.award` | Awards a badge to a user, project, or activity claim |
| **[Badge Response](/lexicons/certified-lexicons/badge-response)** | `app.certified.badge.response` | Recipient accepts or rejects a badge award |
