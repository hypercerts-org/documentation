---
title: Location
---

# Location

## Introduction

For location claims, we follow the [Astral Location Protocol](https://github.com/DecentralizedGeo/location-protocol-spec/blob/v0.2-draft/docs/spec-page/introduction/core-concepts.md).

Astral is a standardized framework and set of rules for creating, sharing, and verifying location information in a decentralized and cryptographically secure manner. It is a specification, not a single piece of software, and is designed to be implementation-agnostic.

The lexicon listed below is the _ATProto implementation_ of this protocol.

## Terminology

### Spatial Reference Systems

A Spatial Reference System (SRS), also known as a Coordinate Reference System (CRS), is a framework used to precisely define locations on Earth's surface (or other celestial bodies).

Every Location Payload must include an `srs` URI. The protocol follows OGC standards, using URIs like `http://www.opengis.net/def/crs/OGC/1.3/CRS84` (for WGS 84 with longitude/latitude order) or `http://www.opengis.net/def/crs/EPSG/0/4326` (for WGS 84 with latitude/longitude order).

This field is mandatory to prevent ambiguity about coordinate systems and axis order, ensuring that coordinate values are interpreted correctly by any application consuming the data.

### Location Type

| locationType property  | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `coordinate-decimal`   | Decimal coordinates (e.g. `10.42, -84.10`)                                 |
| `geojson-point`        | A point saved in GeoJSON format                                            |
| `geojson`              | A GeoJSON geometry (polygon, multipolygon, etc.)                           |
| `h3`                   | An H3 hexagonal hierarchical index                                         |
| `geohash`              | A geohash string                                                           |
| `wkt`                  | Well-Known Text geometry representation                                    |
| `address`              | A street address or place name                                             |
| `scaledCoordinates`    | Coordinates with explicit scale factor                                     |

See the [Location Protocol spec](https://spec.decentralizedgeo.org/specification/location-types/#location-type-registry) for the full registry.

## Lexicon

**Lexicon ID:** `app.certified.location`

**Description:** A location reference for use across AT Protocol applications.

**Key:** `tid`

### Properties

| Property       | Type     | Required | Description                                                                                             | Comments                                       |
| -------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `lpVersion`    | `string` | ✅        | The version of the Location Protocol                                                                    | Max 10 characters.                             |
| `srs`          | `string` | ✅        | The [Spatial Reference System](#spatial-reference-systems) URI that defines the coordinate system        | e.g. `http://www.opengis.net/def/crs/OGC/1.3/CRS84` |
| `locationType` | `string` | ✅        | An identifier for the [format](#location-type) of the location data                                    | See table above for known values.              |
| `location`     | `union`  | ✅        | The location data as a URI, blob, or inline string                                                      |                                                |
| `name`         | `string` | ❌        | Optional name for this location                                                                         | Max 100 graphemes.                             |
| `description`  | `string` | ❌        | Optional description for this location                                                                  | Max 500 graphemes.                             |
| `createdAt`    | `string` | ✅        | Client-declared timestamp when this record was originally created                                       |                                                |
