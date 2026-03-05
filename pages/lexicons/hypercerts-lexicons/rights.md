---
title: Rights
---

# Rights

`org.hypercerts.claim.rights`

The rights lexicon describes the rights associated with a hypercert — whether it can be sold, transferred, and under what conditions. Rights are defined as a separate record and referenced from an activity claim.

A rights record specifies whether the hypercert is transferable, whether it can be sold, and can include additional terms or conditions. This enables flexible rights management, from fully open claims that anyone can reference, to restricted claims with specific transfer or sale conditions.

Rights records are created separately from activity claims and referenced via strong reference. This allows the same rights definition to be reused across multiple claims, and makes it easy to update rights without modifying the core claim record.

For the full schema, see the [Hyperscan lexicon browser](https://www.hyperscan.dev/agents/lexicon/org.hypercerts.claim.rights).
