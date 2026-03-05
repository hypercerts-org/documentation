---
title: Collection
---

# Collection

`org.hypercerts.claim.collection`

A collection groups activity claims and/or other collections into a project or program. Collections support recursive nesting, allowing you to build hierarchical structures like programs containing projects containing individual activities.

Each collection has a title, description, and an array of strong references to the claims or collections it contains. This makes it easy to organize related work, track multi-phase projects, or represent organizational structures.

Collections are useful for representing things like grant programs (which fund multiple projects), research initiatives (which produce multiple outputs), or organizational portfolios (which encompass multiple activities). Because collections can reference other collections, you can build arbitrarily deep hierarchies to match your organizational needs.

For the full schema, see the [Hyperscan lexicon browser](https://www.hyperscan.dev/agents/lexicon/org.hypercerts.claim.collection).
