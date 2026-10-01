---
title: Feature
description: Lexicon reference for org.hypercerts.entity.feature, the record for a place or other non-agent subject that work, measurements, and evaluations can concern.
---

# Feature

`org.hypercerts.entity.feature`

## Overview

A feature describes a subject that isn't a person or organization but that other records can be about: a managed land zone, an ecological stratum, a participant cohort. It gives that subject a title, a coarse kind, classification tags, links to published geometry, and identifiers from external registers.

Features exist because such subjects have no account or DID of their own. A feature record gives them an address, so a measurement or evaluation can point at "the north meadow zone" rather than at the whole project. For the concepts, see [Projects and Collections](/core-concepts/projects-and-collections) in the Guide.

## How it's used

- **A steward describes its sites.** A land restoration team publishes a feature for each zone it manages, with `type: "zone"`, a `locations` reference to the zone's boundary, and tags such as land cover.
- **A collection groups features with the work.** The project [collection](/lexicons/hypercerts-lexicons/collection) lists the zone features as items alongside the activities, so an application can show both the work and the places it concerns. The feature itself has no membership or parent property.
- **Evidence and assessments point at a feature.** [Measurements](/lexicons/hypercerts-lexicons/measurement), [evaluations](/lexicons/hypercerts-lexicons/evaluation), and [attachments](/lexicons/hypercerts-lexicons/attachment) reference their subjects with strong references, so they can name a feature as the thing observed or assessed.
- **External registers link in.** `sameAs` records identifiers for the same subject elsewhere, such as a cadastral parcel or a gazetteer entry, so the feature can be joined with data outside Hypercerts.

Only `title` and `createdAt` are required. A feature with no locations and no tags is still valid.

## Schema

{% lexicon-schema nsid="org.hypercerts.entity.feature" /%}

## Example

A land restoration project describing one of its zones:

```json
{
  "$type": "org.hypercerts.entity.feature",
  "type": "zone",
  "title": "North meadow restoration zone",
  "description": {
    "$type": "org.hypercerts.defs#descriptionString",
    "value": "A 12 hectare former pasture being restored to wet meadow. Managed as one unit for planting and monitoring."
  },
  "locations": [
    {
      "uri": "at://did:plc:r3kz7vqm2xa5nd4tw6hbyf2c/app.certified.location/3lx4p2q6nd72f",
      "cid": "bafyreib7mw3kq2zxr5tvn6h4yojd2lfe3cgua7spk5vw2nqzx4yb6mfhka"
    }
  ],
  "tags": [
    {
      "uri": "at://did:plc:vx3tq7ms2kd4nfr6wz5hbyc2/org.hypercerts.vocab.tag/land-cover.wet-meadow",
      "cid": "bafyreie4gz2kq7xm3wr5tnd6h2ybvolj5tsg3ue7kpwmzq2x6nbdrfyc4a"
    }
  ],
  "sameAs": [
    "urn:example:cadastre:parcel:NM-2204-11"
  ],
  "createdAt": "2026-05-12T08:00:00.000Z"
}
```

## Rules and best practices

- **Use a meaningful record key when it helps.** The record key type is `any`, so you can choose a stable key such as `north-meadow` instead of a generated one. Re-running an import then updates the same record instead of creating a duplicate. A key can't be renamed later without breaking references to the old address.
- **Use `type` for the coarse kind and tags for the rest.** `zone` is an area a steward defines and manages; `stratum` is an analytical unit derived from a model or method. The feature's role and detailed classification belong in `tags`, using [vocabulary tags](/lexicons/hypercerts-lexicons/vocabulary-tag).
- **Multiple locations are alternatives, not multiple places.** Each entry in `locations` is another representation of the same subject, for example a precise polygon and a coarse area, listed most preferred first. Several separate places are either one multi-part geometry in a single [location](/lexicons/certified-lexicons/location) record or separate features.
- **Published geometry is public.** For sensitive sites, reference only a coarse location and keep exact geometry unpublished. An empty or missing `locations` array means the geometry isn't published or doesn't apply, not that the subject has no place.
- **Publish locations before the feature.** Write the location records first so the feature never references something that doesn't exist yet.
- **A feature is the publisher's description.** It can't sign, assert, or acknowledge anything itself. Two publishers can describe the same real-world site with different titles and geometry; readers shouldn't merge features because their titles match or their shapes overlap. A shared `sameAs` value is a reasonable hint that they concern the same subject, and applications that join on it keep track of each source record.
- **Use `sameAs` for identity only.** Point it at an identifier for the subject in the external register, preferably a stable identifier rather than a web page about it. Mappings between classification terms belong on vocabulary tags.
- **Co-membership is not a location claim.** An activity and a feature in the same collection are grouped, nothing more. Don't infer that the activity took place at the feature's location unless the activity says so, for example through its own `locations`.
- **Check the subject's type.** Measurement and evaluation subjects are untyped strong references, so an application reading them determines from the resolved record whether it is an activity, a feature, or something else.

## Related

- [Collection](/lexicons/hypercerts-lexicons/collection): groups features with activities.
- [Location](/lexicons/certified-lexicons/location): the geometry a feature references.
- [Vocabulary Tag](/lexicons/hypercerts-lexicons/vocabulary-tag): classification terms used in `tags`.
- [Measurement](/lexicons/hypercerts-lexicons/measurement) and [Evaluation](/lexicons/hypercerts-lexicons/evaluation): records that can be about a feature.
- Guide: [Projects and Collections](/core-concepts/projects-and-collections), [Describing and Classifying Work](/core-concepts/cel-work-scopes).
