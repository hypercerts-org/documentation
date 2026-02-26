---
title: Shared Definitions
---

# Shared Defs

## Description

Common type definitions shared across the Hypercerts ecosystem. Defines reusable data types like URIs, blobs, and images with specific size constraints.

## Lexicon

**Lexicon ID:** `org.hypercerts.defs`

| Def          | Type     | Description                               | Comments                                |
| ------------ | -------- | ----------------------------------------- | --------------------------------------- |
| `uri`        | `object` | Object containing a URI to external data  | Has `uri` property (string, format uri) |
| `smallBlob`  | `object` | Object containing a blob to external data | Has `blob` property (blob, up to 10MB)  |
| `largeBlob`  | `object` | Object containing a blob to external data | Has `blob` property (blob, up to 100MB) |
| `smallImage` | `object` | Object containing a small image           | Has `image` property (blob, up to 5MB)  |
| `largeImage` | `object` | Object containing a large image           | Has `image` property (blob, up to 10MB) |

## Certified Definitions

**Lexicon ID:** `app.certified.defs`

| Def   | Type     | Description                          | Comments                                           |
| ----- | -------- | ------------------------------------ | -------------------------------------------------- |
| `did` | `object` | A Decentralized Identifier (DID)     | Has `did` property (string, format did, max 256 chars) |
