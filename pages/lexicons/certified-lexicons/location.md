---
title: Location
description: Lexicon reference for app.certified.location, a reusable record describing a place.
---

# Location

`app.certified.location`

## Overview

A location record describes a place: a point, an area, a grid cell, an address, or a country. It holds the place and nothing else. It doesn't say who owns it or what happened there. Other records, such as activities, collections, and features, point to a location record to say where something happened.

Keeping the place in its own record means it can be written once and reused. A project with several activities on the same site references one location record instead of repeating coordinates, and readers can tell that the activities share a place because they point to the same record.

The record implements the [Location Protocol](https://spec.decentralizedgeo.org/), which defines the location formats. The schema belongs to the `app.certified` namespace, and any AT Protocol application can use it.

## How it's used

- **Records point to it.** Activities, [features](/lexicons/hypercerts-lexicons/feature), and [measurements](/lexicons/hypercerts-lexicons/measurement) have a `locations` array; [collections](/lexicons/hypercerts-lexicons/collection), [attachments](/lexicons/hypercerts-lexicons/attachment), [evaluations](/lexicons/hypercerts-lexicons/evaluation), and [organizations](/lexicons/certified-lexicons/organization) have a single `location`. All of these are strong references to a location record.
- **Places are shared.** A team publishes a location record for its site, then references it from each activity, measurement, and evaluation concerning that site. Another account can reference the same record if it accepts that geometry.
- **Two choices describe the data.** `locationType` says how the location is encoded (for example `geojson-point`, `geojson`, `h3`, or `country-code`). The `location` union says where the data is carried: inline as a string, as a blob in the repository, or at an external URI.

Required fields are `lpVersion`, `srs`, `locationType`, `location`, and `createdAt`. Add a `name` so the place is readable wherever it appears.

## Schema

{% lexicon-schema nsid="app.certified.location" /%}

## Example

The site of the community energy project's solar array, as an inline GeoJSON point:

```json
{
  "$type": "app.certified.location",
  "lpVersion": "1.0",
  "srs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
  "locationType": "geojson-point",
  "location": {
    "$type": "app.certified.location#string",
    "string": "{\"type\":\"Point\",\"coordinates\":[-1.8904,52.4862]}"
  },
  "name": "Millbrook village hall",
  "description": "Rooftop of the village hall, site of the community solar array.",
  "createdAt": "2026-02-12T10:05:00.000Z"
}
```

## Rules and best practices

- **Locations are public.** Anything in a location record can be read by anyone, and deleting or coarsening it later doesn't recall copies others have already fetched. For sensitive places, such as private land, protected species sites, or someone's home, publish only a coarse representation (a region, a large grid cell, or a country code) and keep exact geometry unpublished. Say in `description` that the location was deliberately coarsened.
- **Match `locationType` to the payload.** Use `geojson-point` for a single GeoJSON Point and `geojson` for any other GeoJSON geometry (Polygon, MultiPolygon, FeatureCollection); the payload's own `type` carries the specifics. Use `country-code` for an uppercase ISO 3166-1 alpha-2 code such as `CH`. Nothing checks that the payload parses or matches the declared type, so validate it before publishing.
- **Prefer GeoJSON for points.** GeoJSON always lists longitude before latitude. A bare `coordinate-decimal` pair has no fixed order, so readers can't be sure which number is which.
- **Set `srs` and `lpVersion` deliberately.** For GeoJSON and longitude/latitude data, use the CRS84 URI shown in the example. `srs` is required even for `country-code`, where readers ignore it. Set `lpVersion` to the Location Protocol version whose location types you're using.
- **Choose where the data lives.** An inline string is part of the record and covered by its content hash, so it suits points, codes, and small polygons. Use a blob for larger geometry. A URI is fine for data maintained elsewhere, but its content can change or disappear without the record changing.
- **Reuse one record per place.** Once you've published a location for a site, reference it from later records rather than creating a duplicate. Readers can group records that share a location record without comparing geometries.
- **Multiple entries describe one place.** On a feature, several `locations` entries are alternative representations of the same place, most preferred first, never different places. Genuinely different places go in one MultiPolygon or in separate features. Following the same convention in other `locations` arrays keeps readers from adding up areas twice.
- **Strong references pin a version.** Records pointing to a location reference a specific version. If you refine the geometry, update the references that should follow it. If the record would describe a different place, publish a new location record instead of editing it.
- **The referenced record may live elsewhere.** A location can be in a different repository from the record that points to it, so resolve the reference rather than assuming it's local.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): where the work happened, via `locations`.
- [Feature](/lexicons/hypercerts-lexicons/feature): a named zone or area whose geometry is a location record.
- [Collection](/lexicons/hypercerts-lexicons/collection), [Measurement](/lexicons/hypercerts-lexicons/measurement), [Attachment](/lexicons/hypercerts-lexicons/attachment), [Evaluation](/lexicons/hypercerts-lexicons/evaluation), and [Organization](/lexicons/certified-lexicons/organization): other records that reference a location.
- [Location Protocol location type registry](https://spec.decentralizedgeo.org/specification/location-types/#location-type-registry): the full list of `locationType` values.
- Guide: [Projects and Collections](/core-concepts/projects-and-collections), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
