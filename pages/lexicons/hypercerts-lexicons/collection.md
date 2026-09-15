---
title: Collection
description: Lexicon reference for the Collection record type in Hypercerts.
---

# Collection

`org.hypercerts.collection`

A collection groups activity claims, feature records, and other collections into a named set. The same record can be referenced by multiple collections, such as a project, program, portfolio, or favorites list.

Each optional `items` entry is an object containing an `itemIdentifier` strong reference and an optional `itemWeight`. Collections can also reference one location and general vocabulary tags.

A project is represented by the shared convention `type: "project"`; it is not a separate record type. The `type` field is optional and open, so consumers must implement the convention.

For the full released schema, see [`org.hypercerts.collection` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/collection.json).
