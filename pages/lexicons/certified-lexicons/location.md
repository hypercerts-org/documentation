---
title: Location
---

# Location

`app.certified.location`

A location reference using the Astral Location Protocol. Locations can be represented in multiple formats: decimal coordinates, GeoJSON geometries, H3 hexagonal indices, geohashes, Well-Known Text, street addresses, or scaled coordinates.

Each location record includes a Spatial Reference System (SRS) URI to prevent ambiguity about coordinate systems and axis order. This ensures that coordinate values are interpreted correctly by any application consuming the data.

Locations can be referenced from activity claims (to indicate where work took place), measurements (to indicate where data was collected), and other records. The protocol is designed to be implementation-agnostic and follows OGC standards for spatial reference systems.

For the full schema, see [`app.certified.location`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/app/certified/location.json) in the lexicon repo.
