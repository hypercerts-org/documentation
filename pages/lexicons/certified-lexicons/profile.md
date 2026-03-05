---
title: Profile
---

# Profile

`app.certified.actor.profile`

A user profile on certified.app. This is a singleton record — each account has exactly one profile, stored with the key `self`.

The profile includes display name, avatar, banner image, description, website URL, and pronouns. It's the basic identity layer for users in the certified ecosystem, providing human-readable information about an account beyond its DID.

Profiles are optional but recommended for any account that will be creating or interacting with hypercerts, badges, or other social records. They make it easier for others to recognize and understand who is behind an account.

For the full schema, see [`app.certified.actor.profile`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/app/certified/actor/profile.json) in the lexicon repo.
