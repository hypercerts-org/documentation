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

| locationType property | Description                       |
| --------------------- | --------------------------------- |
| coordinate-decimal    |                                   |
| geojson-point         | A point saved in a geojson file.  |

## Lexicon

**Lexicon ID:** `app.certified.location`

**Description:** A location reference for use across certified protocols. For location claims, we follow the

**Key:** `any`

### **Properties**

| `lpVersion`    | `string`                                     | ✅ | The version of the Location Protocol                                                                                    |                                              |
| -------------- | -------------------------------------------- | - | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `srs`          | `string`                                     | ✅ | The [Spatial Reference System](#spatial-reference-systems) **URI** that defines the coordinate system.       | http://www.opengis.net/def/crs/OGC/1.3/CRS84 |
| `locationType` | `string`                                     | ✅ | An identifier for the [format](#location-type) of the location data (e.g., coordinate-decimal, geojson-point) | "coordinate-decimal", "geojson-point"        |
| `location`     | `union` | ✅ | The location of where the work was performed as a URI or blob.                                                          |                                              |
| `createdAt`    | `string`                                     | ✅ | Client-declared timestamp when this record was originally created                                                       |                                              |
| `name`         | `string`                                     | ❌ | Optional name for this location                                                                                         |                                              |
| `description`  | `string`                                     | ❌ | Optional description for this location                                                                                  |                                              |
