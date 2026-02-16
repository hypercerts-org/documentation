---
title: Defining Work Scopes
description: Use allOf, anyOf, and noneOf to precisely define what work a hypercert covers.
---

# Defining Work Scopes

The work scope defines **what work** a hypercert covers. It uses three logical operators to precisely bound which activities are included and which are excluded.

---

## The three operators

| Operator | Meaning | Logic |
|----------|---------|-------|
| **`allOf`** | All of these tags must apply | AND |
| **`anyOf`** | At least one of these tags must apply | OR |
| **`noneOf`** | None of these tags can apply | NOT |

These operators filter from a maximal scope (all work by the named contributors in the specified time period) down to exactly the work being claimed.

---

## Examples

### Simple scope: all IPFS work

```json
{
  "allOf": ["IPFS"]
}
```

Includes all activities tagged "IPFS". Nothing else.

### Excluding specific work

```json
{
  "allOf": ["IPFS"],
  "noneOf": ["library-x"]
}
```

All IPFS work **except** anything related to library-x.

### Multiple implementations

```json
{
  "allOf": ["libp2p"],
  "anyOf": ["go-libp2p", "js-libp2p"]
}
```

Work must be related to libp2p (`allOf`) **and** must be either the Go or JavaScript implementation (`anyOf`). The `anyOf` is needed because a single piece of work can't be both Go and JavaScript simultaneously — they're mutually exclusive options.

### Non-overlapping partitions

You can split a broad scope into non-overlapping hypercerts:

```json
// Hypercert A: IPFS implementation work (Go or Rust)
{
  "allOf": ["IPFS"],
  "anyOf": ["Go-Implementation", "Rust-Implementation"]
}

// Hypercert B: all other IPFS work
{
  "allOf": ["IPFS"],
  "noneOf": ["Go-Implementation", "Rust-Implementation"]
}
```

Together, these two hypercerts cover all IPFS work with no overlap. Every activity falls into exactly one.

---

## Using work scopes in the SDK

Pass the scope operators when creating a hypercert:

```typescript
const result = await repo.hypercerts.create({
  title: "libp2p Go implementation, Q1 2026",
  description: "Networking stack improvements for go-libp2p.",
  workScope: {
    allOf: ["libp2p"],
    anyOf: ["go-libp2p"],
  },
  workTimeframeFrom: "2026-01-01",
  workTimeframeTo: "2026-03-31",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});
```

For a simple scope with a single tag, you can pass a string:

```typescript
workScope: "Documentation"
```

---

## Key points

- **If work scope is empty**, the hypercert covers all work by the named contributors in the specified time period — the maximal scope.
- **Scope tags are domain-specific.** The protocol defines how tags combine, not what tags mean. Each community defines its own vocabulary.
- **Non-overlap is not enforced by the protocol.** It emerges from shared tag vocabularies and coordination between issuers. Applications can check for overlap at creation time.

---

## See also

- **[How Hypercerts Work](/getting-started/how-hypercerts-work)** — the full data model
- **[Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim)** — field-by-field schema including `workScope`
- **[Common Use Cases](/tutorials/common-use-cases)** — worked examples showing work scopes in practice
