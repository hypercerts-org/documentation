---
title: Badge Definition
---

# Badge Definition

## Description

Defines a badge that can be awarded via [badge award](/lexicons/certified-lexicons/badge-award) records to users, projects, or activity claims.

## Lexicon

**Lexicon ID:** `app.certified.badge.definition`

**Key:** `tid`

| Property | Type | Required | Description | Comments |
| --- | --- | --- | --- | --- |
| `title` | `string` | ✅ | Human-readable title of the badge | |
| `badgeType` | `string` | ✅ | Category of the badge | E.g. `endorsement`, `participation`, `affiliation`. |
| `icon` | `blob` | ✅ | Icon representing the badge | Accepts `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`. Max 1 MB. |
| `description` | `string` | ❌ | Short statement describing what the badge represents | |
| `allowedIssuers` | `array` | ❌ | Allowlist of DIDs allowed to issue this badge | Each item references `app.certified.defs#did`. If omitted, anyone may issue it. |
| `createdAt` | `string` | ✅ | Client-declared timestamp when this record was originally created | Format: `datetime`. |
