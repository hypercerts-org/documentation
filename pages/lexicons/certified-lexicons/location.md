---
title: Location
---

# Location

`app.certified.location`

A location record implementing the [Astral Location Protocol](https://spec.decentralizedgeo.org/) — a standardized framework for creating, sharing, and verifying location information in decentralized systems. This lexicon is the ATProto implementation of that spec.

Locations can be represented in multiple formats: decimal coordinates, GeoJSON geometries, H3 hexagonal indices, geohashes, Well-Known Text, street addresses, or scaled coordinates. Each record includes a Spatial Reference System (SRS) URI so coordinate values are unambiguous. See the [location type registry](https://spec.decentralizedgeo.org/specification/location-types/#location-type-registry) for the full list of supported formats.

For the full schema, see [`app.certified.location`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/app/certified/location.json) in the lexicon repo.
