---
title: Roadmap
description: Development priorities, infrastructure components, and phased delivery plan for Hypercerts v0.2.
---

# Roadmap

This page outlines the infrastructure components, build priorities, and phased delivery plan for Hypercerts v0.2 — a decentralized system for tracking, evaluating, and funding impactful work on the open internet.

{% callout type="note" %}
This roadmap reflects the current plan and is subject to change as we gather feedback from real users and contributors. Status labels indicate where each component stands today.
{% /callout %}

---

## Infrastructure overview

The Hypercerts infrastructure divides into six functional areas. Each area has a different ownership model:

| Color | Meaning |
|-------|---------|
| 🔵 Blue | Hypercerts Infrastructure — core protocol components this roadmap covers |
| 🟢 Green | Hypercerts Collective Infrastructure — community-governed components |
| ⬜ Grey | Third-party Infrastructure — leverage existing services, don't rebuild |

---

## Build priorities

| Component | Priority | Status | Owner |
|-----------|----------|--------|-------|
| Lexicons | 🔴 Critical | Active | Hypercerts Foundation |
| Hypercerts SDK | 🔴 Critical | In Progress | Community |
| Hypergoat AppView | 🔴 Critical | Active | GainForest → Foundation |
| IdentityLink | 🟠 High | Live | GainForest → Foundation |
| EVM Indexer | 🟠 High | Planned | TBD |
| Evaluators | 🟠 High | Active | Hypercerts Collective |
| Hypercerts Labeller | 🟠 High | Active | Hypercerts Collective |
| AI-Ready Docs | 🟠 High | In Progress | All |
| StorageLink | 🟡 Medium | Planned | TBD |
| Hypercerts PDS | ⚪ Low | Optional | — |
| Hypercerts Relayer / Firehose / Jetstream | ⚪ Low | Future | — |

---

## Lexicons & SDK 🔵

### Lexicons

**Priority:** 🔴 Critical · **Status:** Active · **Owner:** Hypercerts Foundation

Lexicons are the schema definitions that specify the structure of all Hypercerts records on ATProto. They are the "contracts" that define how data is structured, validated, and referenced across the network. Without standardized schemas, interoperability between applications would be impossible.

**`app.certified.*` — Certified application lexicons**

| Lexicon | Purpose |
|---------|---------|
| `app.certified.badge.definition` | Badge type definitions |
| `app.certified.badge.award` | Badge awards to users |
| `app.certified.location` | Georeferenced location data |
| `app.certified.link.*` | Identity attestations (DID to EVM) |

**`org.hypercerts.*` — Hypercerts protocol lexicons**

| Lexicon | Purpose |
|---------|---------|
| `org.hypercerts.claim.activity` | Core hypercert records tracking impact work |
| `org.hypercerts.claim.evaluation` | Evaluations of activities by third parties |
| `org.hypercerts.claim.measurement` | Quantitative data attached to claims |
| `org.hypercerts.claim.collection` | Projects/portfolios grouping multiple activities |
| `org.hypercerts.claim.attachment` | Evidence, reports, documentation |
| `org.hypercerts.funding.receipt` | Funding flow records |

{% callout type="note" %}
**Migration:** `org.impactindexer.link.attestation` will migrate to `app.certified.link.*`.
{% /callout %}

**Resources:**
- Repository: [github.com/hypercerts-org/hypercerts-lexicon](https://github.com/hypercerts-org/hypercerts-lexicon)
- Documentation: [impactindexer.org/lexicon](https://impactindexer.org/lexicon)

---

### Hypercerts SDK

**Priority:** 🔴 Critical · **Status:** In Progress · **Owner:** Community

A developer toolkit (TypeScript/JavaScript) for creating, reading, and managing Hypercerts records without needing deep ATProto expertise. The SDK handles authentication, record creation, validation against lexicons, and common operations.

**Primary goals:**

1. **Support AI agent coding** — Most future development will happen via AI coding assistants. The SDK must be self-documenting, predictable, and generate clear errors.
2. **Ensure lexicon quality** — Validates records against lexicons at creation time, preventing malformed data from entering the network.

**Core functions:**

- Create, update, and delete hypercert records
- Query records by collection, DID, or custom filters
- Manage contributor relationships and weights
- Handle blob uploads (images, documents, evidence)
- Validate records against lexicon schemas

**Design principles:**

- **Fully typed** — Complete TypeScript definitions for IDE hints and AI introspection
- **Self-documenting** — JSDoc comments on every public method
- **Predictable patterns** — Consistent naming, return types, error handling
- **Introspectable** — Schema information exposed programmatically

**Connects to:**

```
Hypercerts SDK
    ├── → Hypergoat AppView (queries)
    ├── → ATProto PDS (record management)
    ├── → IdentityLink (DID-wallet resolution)
    └── → EVM chains (tokenization, funding)
```

---

## Data layer

### Hypercerts PDS

**Priority:** ⚪ Low · **Status:** Optional

Personal Data Servers operated by the Hypercerts ecosystem that host user repositories containing hypercert records.

**Why we're not prioritizing this:** Users can use any ATProto PDS (Bluesky's, self-hosted, community-operated). The data layer is solved. However, dedicated Hypercerts PDSs could eventually provide guaranteed uptime for impact-critical data, support for larger blobs, federation across multiple servers, and organizational sovereignty.

| PDS | Type | Example users |
|-----|------|---------------|
| `pds.bsky.app` | Third-party (Bluesky) | General users |
| `pds1.certified.app` | Optional Hypercerts | climateai.org, daviddao.org, hyperboards.org |
| `pds2.certified.app` | Optional Hypercerts | Additional users |

---

## Network & streaming layers

### Current approach ⬜

We subscribe to Bluesky's relay and filter for `org.hypercerts.*` and `app.certified.*` collections. Bluesky's Jetstream provides filtered JSON streams by collection. This is sufficient for current needs.

### Future options 🔵

**Priority:** ⚪ Low · **Status:** Future

If needed later, dedicated Hypercerts infrastructure could include:

- **Hypercerts Relayer** — Aggregation service that crawls PDSs hosting hypercert records, validates cryptographic signatures, and provides a unified event stream.
- **Hypercerts Firehose** — WebSocket endpoint providing real-time stream of all hypercert-related commits in CBOR format.
- **Hypercerts Jetstream** — Filtered, JSON-formatted stream allowing consumers to subscribe only to specific collections with reduced bandwidth and lower resource requirements.

{% callout type="note" %}
These are not needed today. Bluesky's relay (`bsky.network`) and Jetstream handle this. We will revisit if the network outgrows third-party infrastructure.
{% /callout %}

---

## Moderation layer 🟢

Community-governed evaluation and labeling infrastructure, managed by the Hypercerts Collective.

### Evaluators

**Priority:** 🟠 High · **Status:** Active · **Owner:** Hypercerts Collective

Services producing structured evaluations for hypercert records. Types include AI-powered evaluators (automated analysis), human expert panels (domain expertise), and hybrid approaches (AI-assisted human review).

**Lexicons:** `org.hypercerts.claim.evaluation`, `app.gainforest.evaluator.*`

### Hypercerts Labeller

**Priority:** 🟠 High · **Status:** Active · **Owner:** Hypercerts Collective

Lightweight annotations using ATProto's labeler pattern. Use cases include quality indicators, verification status, category tags, and warning labels.

---

## Application layer

### Hypergoat AppView 🔵

**Priority:** 🔴 Critical · **Status:** Active · **Owner:** GainForest → Foundation

The primary AppView server that indexes hypercert records and exposes them via a GraphQL API. Name origin: **Hyper**sphere **Go** **AT**Proto AppView.

**Why it matters:** Raw ATProto data is distributed across PDSs. The AppView consumes the Firehose/Jetstream, builds queryable indexes, hydrates records with context, provides search and aggregation, and serves the `app.certified.*` and `org.hypercerts.*` API endpoints.

**Technical details:**

| Feature | Detail |
|---------|--------|
| API | GraphQL (HTTP + WebSocket subscriptions) |
| Schema | Dynamically generated from uploaded lexicons |
| Pagination | Relay-style cursor pagination |
| Real-time | WebSocket subscriptions for new records |
| Search | Full-text search across hypercert content |

**Endpoints:**
- GraphQL: `hypergoat.certified.app/graphql`
- GraphiQL: `hypergoat.certified.app/graphiql`

### Frontends 🟢

Applications built on the infrastructure, governed by the Hypercerts Collective:

| Frontend | Purpose | Status |
|----------|---------|--------|
| **Ma Earth** | Regenerative land funding, community onboarding | Active |
| **hyperboards.org** | Hypercert visualization and management | Active |
| **Other frontends** | Third-party applications | Ecosystem |

**How records flow:**

1. User creates a hypercert record via a frontend (Ma Earth, hyperboards.org, etc.)
2. Frontend writes the record to the user's PDS
3. PDS syncs to the network via the relay
4. Hypergoat indexes the record
5. Record becomes available for queries and evaluations

---

## Bridge layer 🔵

### IdentityLink

**Priority:** 🟠 High · **Status:** Live

A system for linking ATProto DIDs to Ethereum/EVM wallet addresses via cryptographic attestations. This enables contributors to receive onchain payments, verification that a DID controls a specific address, integration with onchain attestation layers (EAS), and cross-chain identity resolution.

**Flow:**

```
1. User authenticates with ATProto via OAuth
2. User connects EVM wallet
3. User signs EIP-712 typed message
4. Attestation stored in user's PDS
5. Anyone can verify cryptographically
```

**Properties:**

- **Self-sovereign** — Attestations in user's PDS, not a central database
- **Cryptographic** — EIP-712 signatures verifiable by anyone
- **Wallet-agnostic** — EOAs, Coinbase Smart Wallet, Safe, ERC-1271

**Live:** [identitylink.vercel.app](https://identitylink.vercel.app)

{% callout type="note" %}
**Migration:** Lexicon migrating from `org.impactindexer.link.attestation` to `app.certified.link.*`.
{% /callout %}

### StorageLink

**Priority:** 🟡 Medium · **Status:** Planned

A service that creates immutable backups of hypercert records on decentralized storage (Filecoin/IPFS). ATProto repositories are mutable — records can be updated or deleted. For high-stakes impact claims, immutable archival provides permanence, verifiability, and compliance with funding mechanisms that require immutable records.

```
User's PDS record → StorageLink → Filecoin Cloud (immutable backup)
```

### EVM Indexer

**Priority:** 🟠 High · **Status:** Planned

An indexer that tracks onchain events related to Hypercerts (token mints, transfers, funding distributions). Creates a unified view across ATProto records and blockchain state — indexing tokenization events, tracking funding flows, and enabling queries like "show all funded activities for this project."

```
Blockchain events → EVM Indexer → Hypergoat (unified view)
```

---

## AI agent readiness

**Priority:** 🟠 High

Most applications will be built via AI coding assistants. Infrastructure must be AI-native.

**Requirements by component:**

| Component | Requirements |
|-----------|-------------|
| Lexicons | Complete field descriptions, clear constraints, examples, consistent patterns |
| SDK | Full TypeScript types, JSDoc comments, predictable patterns, clear errors |
| AppView | GraphQL introspection, complete schema docs, consistent queries |
| Docs | OpenAPI/JSON Schema, `AGENTS.md` files, copy-pasteable examples |

**Action items:**

| Action | Priority | Status |
|--------|----------|--------|
| Add OpenAPI spec for Hypergoat | High | Todo |
| Create `AGENTS.md` in repos | High | Todo |
| Ensure all lexicon fields have descriptions | High | In Progress |
| Add JSDoc to all SDK public methods | High | Todo |
| Publish example workflows | Medium | Todo |
| Create MCP (Model Context Protocol) server | Medium | Todo |

---

## Governance: the Hypercerts Collective

**Priority:** 🟠 High

Open governance body for the ATProto impact ecosystem. Coordinates decisions about shared infrastructure (🟢 green components).

**Repository:** [tangled.org/gainforest.earth/hypercollective](https://tangled.org/gainforest.earth/hypercollective)

**What the Hypercerts Collective governs:**

- Evaluators
- Hypercerts Labeller
- Frontend applications (Ma Earth, hyperboards.org)
- Lexicon standards adoption

### Lexicon Indexing Requests (LIRs)

Formal proposals to add lexicons to Hypergoat's indexing. The community decides what becomes shared infrastructure.

| LIR | Description | Status |
|-----|-------------|--------|
| LIR-0001 | GainForest Lexicons (Darwin Core, Evaluator, Organization) | Approved |
| LIR-0002 | Impact Indexer Review System (comments, likes) | Approved |
| LIR-0003 | Hypercerts Lexicons (claims, funding, badges, locations) | Approved |

### Infrastructure transitions

| Component | Current owner | Future owner |
|-----------|--------------|--------------|
| Hypergoat AppView | GainForest | Foundation + Community |
| IdentityLink | GainForest | Foundation + Community |
| Impact Indexer | GainForest | Foundation + Community |
| Lexicon Repos | Various | Hypercerts Collective coordination |

---

## Development phases

### Phase 1: Make it work (current)

- End-to-end staging tests: create activity → evaluate → fund → distribute
- Integration tests across SDK → AppView → IdentityLink → EVM
- Basic functionality before optimization

### Phase 2: Make it right (next)

- Deploy to real users (Ma Earth, GainForest, community)
- Gather feedback on pain points and missing features
- Iterate on lexicon design based on actual usage
- Improve SDK ergonomics based on developer feedback

### Phase 3: Make it fast (future)

- Performance optimization based on real usage patterns
- Caching strategies for AppView
- Query optimization
- Only after validation and stability

---

## Next steps

1. **Finalize Lexicon v1.0** — Lock core schemas for `org.hypercerts.claim.*` to enable stable SDK development
2. **Productionize Hypergoat** — Harden for production traffic, add caching, improve query performance
3. **SDK alpha release** — Publish `@hypercerts/sdk` with core CRUD operations
4. **AI documentation sprint** — OpenAPI spec, `AGENTS.md` files, copy-pasteable examples
5. **IdentityLink integration** — Complete EIP-712 attestation flow with certified.app frontend
6. **Infrastructure transitions** — Begin handoff to Foundation stewardship

---

## Links & resources

| Resource | URL |
|----------|-----|
| Lexicon Documentation | [impactindexer.org/lexicon](https://impactindexer.org/lexicon) |
| Hypergoat API | [hypergoat.certified.app/graphql](https://hypergoat.certified.app/graphql) |
| IdentityLink | [identitylink.vercel.app](https://identitylink.vercel.app) |
| Governance Repo | [tangled.org/gainforest.earth/hypercollective](https://tangled.org/gainforest.earth/hypercollective) |
| Hypercerts Foundation | [hypercerts.org](https://hypercerts.org) |
