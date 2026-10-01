---
title: Organization
description: Lexicon reference for app.certified.actor.organization, the structural details an organizational account declares about itself.
---

# Organization

`app.certified.actor.organization`

## Overview

An organization record adds organization-specific details to an account: its legal or operational form, reference links, where it is based, when it was founded, and a longer description of its mission or history. It complements the [profile](/lexicons/certified-lexicons/profile), which holds the account's name, short description, and images.

Like the profile, the record is written by the account it describes. It is how an account presents itself as an organization, not evidence that the organization is registered or that the details are accurate. For how to weigh self-descriptions against other signals, see [Trust and Recognition](/core-concepts/certified-identity).

## How it's used

- **One record per account.** The record key is `literal:self`, so an account holds at most one organization record, at `at://<did>/app.certified.actor.organization/self`. It sits next to the profile at the same key in a different collection; fetching one doesn't return the other.
- **Profile plus organization.** An organizational account publishes a profile for how it appears everywhere, then an organization record for the extra details an organization page or directory shows.
- **Links to a location.** `location` is a strong reference to a [location record](/lexicons/certified-lexicons/location) describing where the organization is based.
- **Directories and discovery.** Platforms that list organizations can use `organizationType` to filter and `visibility` to decide whether to include the account in public listings.

Only `createdAt` is required. Add the fields your users will actually look at.

## Schema

{% lexicon-schema nsid="app.certified.actor.organization" /%}

## Example

The organization record for the community energy cooperative whose [profile](/lexicons/certified-lexicons/profile) shows its name and avatar:

```json
{
  "$type": "app.certified.actor.organization",
  "organizationType": ["cooperative", "social-enterprise"],
  "urls": [
    { "url": "https://millbrookenergy.example.org/join", "label": "Become a member" },
    { "url": "https://millbrookenergy.example.org/reports", "label": "Annual reports" }
  ],
  "location": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/app.certified.location/3lwq6d2nf7s2c",
    "cid": "bafyreibwbgsy3r6nexk2zvxy4hhqpzgpuqdlw6ayh3ktkhqw3nxgvcqf7i"
  },
  "foundedDate": "2019-04-01T00:00:00.000Z",
  "longDescription": {
    "$type": "org.hypercerts.defs#descriptionString",
    "value": "Millbrook Community Energy is a member-owned cooperative. It finances, installs, and maintains solar arrays on community buildings and reinvests surplus income in local energy-saving projects."
  },
  "visibility": "public",
  "createdAt": "2026-02-10T08:32:00.000Z"
}
```

## Rules and best practices

- **Keep display details on the profile.** The organization record has no name or avatar. Applications take those from the profile, so an organizational account without a profile shows up as a bare handle or DID.
- **The record only describes its own account.** There is no subject field: the record is always about the account whose repository holds it. It can't be used to describe another organization.
- **Self-declared, not registered.** Legal form, founding date, and links are easy to mistake for a registry entry. Present them as the organization's own statements. A badge from a recognized issuer is the way to show that something has been checked.
- **`organizationType` is free text.** Examples in the schema include `nonprofit`, `ngo`, `government`, `social-enterprise`, and `cooperative`, but there is no fixed list. Prefer common lowercase terms so other applications can match them, and when reading, compare case-insensitively and keep values you don't recognize.
- **Write `foundedDate` as midnight UTC.** The field is a datetime because AT Protocol has no date-only format. Use a value like `2019-04-01T00:00:00.000Z` and read only the date part, without converting time zones, so the date doesn't shift by a day.
- **`location` is where the organization is based.** It is not the site of the organization's work. Activities, collections, and other records carry their own locations. Because it is a strong reference, it points to one version of the location record; update the reference if you revise that record.
- **Link labels are chosen by the account.** A `urls` entry pairs a URL with an optional label written by the same account. Show the destination host when rendering a labeled link so people know where it goes.
- **`visibility` is a preference.** `unlisted` asks platforms that honor the setting to leave the organization out of directories and search. The record is still public and readable by anyone.
- **Pick a `longDescription` form.** Use the inline description string for plain text or markdown. Use an embedded Leaflet document for structured content, or a strong reference to an existing document record. Applications that can't render a form can fall back to the profile's description.

## Related

- [Profile](/lexicons/certified-lexicons/profile): the account's name, short description, and images.
- [Location](/lexicons/certified-lexicons/location): the record `location` points to.
- [Badge Award](/lexicons/certified-lexicons/badge-award): recognition that other accounts give the organization.
- [Account & Identity Setup](/architecture/account-and-identity): organization accounts, custom domain handles, and shared repositories.
- Guide: [Trust and Recognition](/core-concepts/certified-identity).
