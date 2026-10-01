---
title: Profile
description: Lexicon reference for app.certified.actor.profile, an account's display name, description, and images.
---

# Profile

`app.certified.actor.profile`

## Overview

A profile is how an account introduces itself to people: a display name, a short description, pronouns, a website, an avatar, and a banner. Every record in Hypercerts belongs to an account identified by a DID, and the profile gives readers a more readable way to see who stands behind it.

The profile is written by the account it describes. It tells you what the account says about itself, not that anyone has checked it. For how profiles fit into deciding what to trust, see [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

The schema belongs to the `app.certified` namespace. Certified accounts use it, and any AT Protocol application can read or write it.

## How it's used

- **One profile per account.** The record key is `literal:self`, so an account holds at most one profile, at `at://<did>/app.certified.actor.profile/self`. Applications can fetch it directly from the DID without listing records. Updating the profile replaces that record.
- **People and organizations both use it.** The schema doesn't distinguish between individual and organizational accounts. An organization publishes a profile for its name and images, and adds an [organization record](/lexicons/certified-lexicons/organization) for structural details such as legal form and founding date.
- **Applications show it next to records.** When displaying an activity, an evaluation, or a badge award, an application looks up the publisher's profile to show a name and avatar instead of a bare DID.

Only `createdAt` is required. A profile with just a display name is already useful.

## Schema

{% lexicon-schema nsid="app.certified.actor.profile" /%}

## Example

The profile of a community energy cooperative, with an uploaded avatar and a banner hosted on its website:

```json
{
  "$type": "app.certified.actor.profile",
  "displayName": "Millbrook Community Energy",
  "description": "A community-owned cooperative installing and running solar power for Millbrook village.",
  "website": "https://millbrookenergy.example.org",
  "avatar": {
    "$type": "org.hypercerts.defs#smallImage",
    "image": {
      "$type": "blob",
      "ref": { "$link": "bafkreibmbrvzxhfz5vldq37maocqy7g4xqkev7yn74giwovqpztyahtsli" },
      "mimeType": "image/png",
      "size": 48213
    }
  },
  "banner": {
    "$type": "org.hypercerts.defs#uri",
    "uri": "https://millbrookenergy.example.org/media/village-hall-roof.jpg"
  },
  "createdAt": "2026-02-10T08:30:00.000Z"
}
```

## Rules and best practices

- **Take display details from the profile.** An account's name, short description, and images belong here. The organization record deliberately has no name or avatar, so don't derive a display name from it.
- **Fall back to an identifier.** Many accounts have no profile or no `displayName`. Show the handle or DID instead, and keep treating the account's records as usable.
- **A profile is self-description, not verification.** Display names aren't unique, and anyone can choose a name that resembles another account's. Don't show a profile's name or website as if it had been confirmed. Where it matters, show the handle next to the name, and rely on badges or other signals from recognized issuers for confirmation.
- **A website is a claim.** `website` states which site the account associates with itself; it doesn't prove the account controls that site. A custom domain handle is a stronger signal; see [Account & Identity Setup](/architecture/account-and-identity).
- **Handle both image forms.** `avatar` and `banner` each accept either an uploaded image blob or a URI. Applications that display profiles need to support both. A blob is stored in the account's repository and identified by its content hash; a URI points elsewhere and its content can change without the record changing.
- **Profiles are public.** Anyone can read everything in the record. Keep personal details to what the account wants to share publicly.

## Related

- [Organization](/lexicons/certified-lexicons/organization): structural details for organizational accounts, stored alongside the profile.
- [Contribution](/lexicons/hypercerts-lexicons/contribution): contributor details used within an activity's attribution.
- [Badge Award](/lexicons/certified-lexicons/badge-award): recognition from other accounts, shown alongside a profile.
- [Signatures](/lexicons/certified-lexicons/signatures): the optional `signatures` list.
- [Account & Identity Setup](/architecture/account-and-identity): DIDs, handles, and Certified accounts.
- Guide: [Trust and Recognition](/core-concepts/certified-identity).
