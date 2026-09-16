---
title: Certified Lexicons
description: Lexicon reference for Certified identity records — profiles, locations, and badges.
---

# Certified Lexicons

These Lexicons live in the `app.certified` namespace. They provide shared records for profiles, organizations, badges, follows, locations, EVM links, and record-content attestations.

| Lexicon | NSID | Description |
|---------|------|-------------|
| **[Shared Definitions](/lexicons/certified-lexicons/shared-defs)** | `app.certified.defs` | Embedded DID and URI-only record-subject definitions |
| **[Location](/lexicons/certified-lexicons/location)** | `app.certified.location` | Geographic location representation using the Astral Location Protocol |
| **[Profile](/lexicons/certified-lexicons/profile)** | `app.certified.actor.profile` | Account profile with display name, description, avatar, and banner |
| **[Badge Definition](/lexicons/certified-lexicons/badge-definition)** | `app.certified.badge.definition` | Defines a badge type with title, icon, and optional issuer allowlist |
| **[Badge Award](/lexicons/certified-lexicons/badge-award)** | `app.certified.badge.award` | Awards a badge to a user, project, or activity claim |
| **[Badge Response](/lexicons/certified-lexicons/badge-response)** | `app.certified.badge.response` | Recipient accepts or rejects a badge award |
| **Organization** | `app.certified.actor.organization` | Organization metadata in the account's singleton record |
| **Follow** | `app.certified.graph.follow` | Account-to-account follow |
| **Entity Follow** | `app.certified.graph.entityFollow` | Follow of a record subject by AT-URI |
| **EVM Link** | `app.certified.link.evm` | DID-to-EVM-address link with proof data |
| **Signature Proof** | `app.certified.signature.proof` | Remote proof containing an attested content CID |

The package also includes `app.certified.signature.defs` and the `app.certified.authWrite` permission set. See the complete [Lexicon inventory](/reference/lexicon-inventory). Use the released package for exact field constraints until all field pages are generated.
