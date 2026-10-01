---
title: Certified Lexicons
description: "Lexicon reference for the app.certified namespace: profiles, organizations, locations, badges, social records, and signatures."
---

# Certified Lexicons

The `app.certified` Lexicons provide shared records for identity and recognition: who an account is, where things are, which badges have been awarded, and who follows or signs what. Certified, the identity service operated by the Hypercerts Foundation, uses them, and any application can use them too.

## Accounts and places

| Lexicon | NSID | Purpose |
|---|---|---|
| [Profile](/lexicons/certified-lexicons/profile) | `app.certified.actor.profile` | Display name, description, avatar, and banner, one per account |
| [Organization](/lexicons/certified-lexicons/organization) | `app.certified.actor.organization` | Organization details, one per account |
| [Location](/lexicons/certified-lexicons/location) | `app.certified.location` | A reusable place or area |

## Recognition

| Lexicon | NSID | Purpose |
|---|---|---|
| [Badge Definition](/lexicons/certified-lexicons/badge-definition) | `app.certified.badge.definition` | Defines a kind of recognition |
| [Badge Award](/lexicons/certified-lexicons/badge-award) | `app.certified.badge.award` | Awards a badge to an account or record |
| [Badge Response](/lexicons/certified-lexicons/badge-response) | `app.certified.badge.response` | Lets the recipient accept or reject an award |

## Social records and links

| Lexicon | NSID | Purpose |
|---|---|---|
| [Follows](/lexicons/certified-lexicons/follows) | `app.certified.graph.follow`{% br /%}`app.certified.graph.entityFollow` | Follow an account or a record |
| [Likes and Reposts](/lexicons/certified-lexicons/likes-and-reposts) | `app.certified.feed.like`{% br /%}`app.certified.feed.repost` | Social feedback on any record |
| [EVM Link](/lexicons/certified-lexicons/evm-link) | `app.certified.link.evm` | Links an account to an EVM address |
| [Signatures](/lexicons/certified-lexicons/signatures) | `app.certified.signature.proof`{% br /%}`app.certified.signature.defs` | Additional signatures over a record's content |

## Shared definitions

[Shared Definitions](/lexicons/certified-lexicons/shared-defs) (`app.certified.defs`) covers the DID and record-subject objects these records reuse. The `app.certified.authWrite` permission set grants create, update, and delete access to all of these record collections. See the complete [Lexicon inventory](/reference/lexicon-inventory).
