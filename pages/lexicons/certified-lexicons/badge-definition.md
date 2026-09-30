---
title: Badge Definition
description: Lexicon reference for app.certified.badge.definition, the record that describes a badge that can be awarded.
---

# Badge Definition

`app.certified.badge.definition`

## Overview

A badge definition describes a form of recognition: what the badge is called, what kind of recognition it represents, what it means, and optionally which accounts may award it. Publishing a definition gives the badge to nobody. Individual awards are separate [badge award](/lexicons/certified-lexicons/badge-award) records that point to the definition.

Badges let a network or certifier recognize an account or a record, such as a project. The definition explains the recognition being offered; the award connects it to a recipient; a [response](/lexicons/certified-lexicons/badge-response) lets the recipient accept or reject it. See [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

## How it's used

- **A network defines the badge once.** A certification network, community, or program publishes a definition for each badge it offers, such as a certification for installations that passed its review.
- **Awards point to it.** Each award references the definition with a strong reference, so one definition serves many awards and applications can show a consistent title, description, and icon.
- **The allowlist names the issuers.** `allowedIssuers` lists the DIDs whose awards count for this badge. Applications compare it with the account that published each award.

`title`, `badgeType`, and `createdAt` are required.

## Schema

{% lexicon-schema nsid="app.certified.badge.definition" /%}

## Example

A solar network defining a certification it awards to installations it has reviewed, with itself as the only allowed issuer:

```json
{
  "$type": "app.certified.badge.definition",
  "badgeType": "certification",
  "title": "Certified Community Solar Installation",
  "description": "Awarded to installations that passed the network's independent review of design, safety, and first-year production data.",
  "icon": {
    "$type": "blob",
    "ref": { "$link": "bafkreie5bykzebifztqv2qvkx36h3qsiai7j54w2ujjadjsrgjkatlu4pm" },
    "mimeType": "image/png",
    "size": 20514
  },
  "allowedIssuers": [
    { "did": "did:plc:k3nq7wz2vbx5rmt4ydh6pcsa" }
  ],
  "createdAt": "2026-05-04T09:00:00.000Z"
}
```

## Rules and best practices

- **Check issuers against `allowedIssuers`.** When the list is present, only awards published by a listed DID count as this badge. The schema doesn't enforce this: an award from any account can reference any definition, so applications compare the DID of the repository holding the award with the list. Never take the issuer from a field inside the award.
- **An omitted list means anyone may issue.** Without `allowedIssuers`, awards from any account reference the badge equally, so the badge only means something combined with who issued it. The schema doesn't say what an empty list means; omit the field rather than writing an empty array.
- **The name and icon alone tell you little.** Anyone can publish a definition with any title, including one that copies another network's badge. Applications decide which definition publishers and issuers they recognize.
- **Pick the closest `badgeType`.** Known values are `endorsement`, `verification`, `participation`, `certification`, `affiliation`, and `recognition`. Other values are allowed, but applications may not group them with the known types.
- **Say what the badge means in `description`.** State the criteria for awarding it, so readers can judge what an award represents.
- **Don't change a badge's meaning in place.** Awards pin the version of the definition they were made against. Fix wording or an icon by editing, but if the criteria change, publish a new definition so earlier awards keep their original meaning.
- **Deleting a definition doesn't withdraw awards.** Awards that reference a deleted definition still exist in their issuers' repositories. Applications typically show them as an unidentified badge from that issuer.

## Related

- [Badge Award](/lexicons/certified-lexicons/badge-award): gives the badge to an account or record.
- [Badge Response](/lexicons/certified-lexicons/badge-response): the recipient accepts or rejects an award.
- [Shared Definitions](/lexicons/certified-lexicons/shared-defs): the DID object used in `allowedIssuers`.
- [Evaluation](/lexicons/hypercerts-lexicons/evaluation): a graded assessment, for when a yes-or-no badge isn't enough.
- Guide: [Trust and Recognition](/core-concepts/certified-identity).
