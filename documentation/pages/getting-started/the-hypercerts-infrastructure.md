---
title: The Hypercerts Infrastructure
---

# The Hypercerts Infrastructure

Hypercerts runs on a two-layer architecture: AT Protocol for data and planned on-chain anchoring for ownership and funding.

For the rationale behind choosing ATProto, see [Why ATProto?](/getting-started/why-atproto).

## The Two-Layer Architecture

#### The data layer: AT Protocol

AT Protocol stores all hypercert-related data — activity claims, contributions, evaluations, measurements, evidence, and trust signals. This data lives on Personal Data Servers (PDS) controlled by users, not platforms. Contributors create claims on their PDS. Evaluators reference those claims from their own PDS. Funders query indexers that aggregate data across the network.

Because ATProto uses shared schemas (lexicons), any application can read and write hypercert data without custom integrations. A claim created in one app is immediately evaluable in another and fundable in a third. The data layer is open, portable, and interoperable by design.

#### The funding layer: on-chain anchoring (planned)

When a hypercert is ready for funding, its ATProto records will be frozen and anchored on-chain. This freeze-then-fund model protects funders: they must know exactly what they are paying for. If the claim contents could change after funding, a funder might end up paying for a different hypercert than what they committed to.

The intended design: when ready for funding, a snapshot of the claim's state is taken, its CID is anchored on-chain, and the frozen claim becomes fundable. The specific on-chain mechanisms — token standards, smart contracts, chain choices — are being designed. The tokenization layer is not yet implemented, but the theory is sound: blockchain excels at ownership, scarcity, and programmable money, while ATProto handles rich, evolving data.

#### How the layers connect

A hypercert starts as an activity claim on ATProto. The claim has an AT-URI like `at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a`. In the planned design, when the claim is ready for funding, its state will be frozen and its CID anchored on-chain. On-chain funding events can be referenced back from ATProto records — an evaluation might note that a specific frozen version of a claim was funded.

The two layers are loosely coupled. A claim can exist on ATProto without ever being frozen for funding. A frozen claim can continue accumulating new evaluations and evidence over time — those new records reference the frozen claim but don't modify it. Neither layer owns the other — they complement each other.

For definitions of DID, PDS, Lexicon, XRPC, and Repository, see the [Glossary](/reference/glossary).

## How Hypercerts Data Flows

#### 1. A contributor creates a hypercert

Alice is a software engineer who contributed to NumPy documentation in Q1 2026. She uses an app built with the Hypercerts SDK to create an activity claim. The claim is structured according to the `org.hypercerts.claim.activity` lexicon and stored on her PDS at `alice.certified.app`.

The claim gets an AT-URI: `at://did:plc:alice123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a`. This URI is permanent and globally unique.

#### 2. An evaluator references the claim

Bob is a NumPy maintainer. He runs his own PDS at `bob.example.com`. He creates an evaluation record using the `org.hypercerts.claim.evaluation` lexicon. The evaluation references Alice's claim via its AT-URI.

Bob's evaluation is stored on his PDS, not Alice's. The two records are linked by reference, not by storage location. Any app that fetches Alice's claim can discover Bob's evaluation by querying for records that reference her AT-URI.

#### 3. A funder discovers both via an indexer

Carol is a funder looking for high-quality documentation work. She uses an app that queries an indexer — a service that crawls the ATProto network and aggregates records. The indexer has already fetched Alice's claim and Bob's evaluation.

Carol's app shows her Alice's claim with Bob's evaluation attached. Because Bob's DID has a strong track record (he's authored 200+ credible evaluations), the app weights his assessment highly. Carol decides to fund Alice's work.

#### 4. The hypercert is frozen and funded (planned)

In the intended design, Carol's funding app will freeze Alice's hypercert — taking a snapshot of its current state — and anchor that snapshot on-chain. Carol then funds the frozen hypercert. Because the claim was frozen before funding, Carol knows exactly what she is paying for: the claim contents cannot change after she commits funds.

Alice's claim continues to exist on ATProto. New evaluations, evidence, and measurements can be added over time — they reference the frozen claim but don't modify it. The frozen snapshot remains immutable on-chain while the living claim evolves on ATProto — open, portable, and interoperable. This is the planned design; the tokenization layer is not yet implemented.

## Data Integrity and Trust

#### Content addressing

Every record has a CID (content hash). When you reference a record, you include both its AT-URI and its CID. This makes the reference tamper-evident — if the record is modified, its CID changes, and the reference breaks.

Repositories are Merkle trees. Every commit to a repository produces a new root CID. This enables efficient syncing and cryptographic verification of repository state.

#### Cryptographic signatures

Every record is signed by its author's DID. The signature proves that the record was created by the DID holder and hasn't been tampered with. Applications verify signatures before trusting record data.

#### Decentralized trust-graph

Because DIDs are persistent and records are signed, you can trace an author's entire history across the network. An evaluator's track record — how many evaluations, in which domains, how accurate — is visible to anyone. This enables programmatic trust scoring: algorithms that weight evaluations based on author reputation, detect patterns, and surface credible assessments.

## Keep Reading

- [Indexers & Discovery](/getting-started/infrastructure/indexers-and-discovery) — how data is aggregated and queried across the network
- [Blockchain Integration](/getting-started/infrastructure/blockchain-integration) — minting patterns and on-chain ownership
- [Portability & Scaling](/getting-started/infrastructure/portability-and-scaling) — PDS migration, performance, and privacy
