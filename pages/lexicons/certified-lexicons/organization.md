---
title: Organization
description: Lexicon reference for the Organization actor record in Certified.
---

# Organization

`app.certified.actor.organization`

Extended metadata for an organization actor. This is a singleton record — each organization account has exactly one, stored with the key `self` — that complements the base [profile](/lexicons/certified-lexicons/profile) with organization-specific fields like legal structure, founded date, a base [location](/lexicons/certified-lexicons/location), and reference URLs.

Organizations can attach a long-form description as either an inline string, an embedded Leaflet linear document, or a strong reference to an existing document record. A `visibility` field lets clients mark the organization as `public` or `unlisted` on platforms that honor the setting.

For the full schema, see [`app.certified.actor.organization`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/app/certified/actor/organization.json) in the lexicon repo.
