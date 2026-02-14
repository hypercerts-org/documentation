---
title: The Hypercerts Infrastructure
---

# The Hypercerts Infrastructure

Hypercerts runs on a two-layer architecture: AT Protocol for data and blockchain for ownership.

For the rationale behind choosing ATProto, see [Why ATProto?](/getting-started/why-atproto).

## The Two-Layer Architecture

#### The data layer: AT Protocol

AT Protocol stores all hypercert-related data — activity claims, contributions, evaluations, measurements, evidence, and trust signals. This data lives on Personal Data Servers (PDS) controlled by users, not platforms. Contributors create claims on their PDS. Evaluators reference those claims from their own PDS. Funders query indexers that aggregate data across the network.

Because ATProto uses shared schemas (lexicons), any application can read and write hypercert data without custom integrations. A claim created in one app is immediately evaluable in another and fundable in a third. The data layer is open, portable, and interoperable by design.

#### The ownership layer: blockchain

Blockchain handles tokenization, ownership transfers, and funding flows. When a hypercert is tokenized, a smart contract mints an NFT that points to the AT-URI of the activity claim. The token represents fractional ownership of the impact rights described in that claim. Funders purchase tokens on-chain. Revenue flows through smart contracts. Immutability guarantees are enforced by the blockchain.

Blockchain is expensive and inflexible for rich data — you can't store evaluations, evidence blobs, or evolving trust signals on-chain. But it excels at ownership, scarcity, and programmable money.

#### How the layers connect

A hypercert starts as an activity claim on ATProto. The claim has an AT-URI like `at://did:plc:abc123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a`. When tokenized, the smart contract stores this URI in the token metadata. On-chain events (mints, transfers, sales) can be referenced back from ATProto records — an evaluation might note that a claim was funded by a specific address.

The two layers are loosely coupled. A claim can exist on ATProto without ever being tokenized. A token can point to a claim that continues accumulating evaluations and evidence over time. Neither layer owns the other — they complement each other.

## Key Concepts for Developers

#### DID (Decentralized Identifier)

A DID is a permanent, cryptographically verifiable identifier for a user or organization. It looks like `did:plc:abc123xyz`. When you create an account on [certified.app](https://certified.app) or [Bluesky](https://bsky.app), you get a DID. Your DID never changes, even if you switch servers or handles.

Every record you create carries your DID as the author. This enables persistent identity across platforms — your contribution history, evaluation track record, and trust signals follow you everywhere.

#### PDS (Personal Data Server)

A PDS is where your data lives. It's a server that stores your repository — the collection of all records you've created. You can host your PDS yourself, use a provider like the Hypercerts Foundation, or switch providers at any time without losing data.

Applications read from your PDS via XRPC (the API protocol ATProto uses). They don't own your data — they're views over it. If an app shuts down, your records remain on your PDS.

#### Lexicon

A lexicon is a versioned JSON schema that defines the structure of a record type. For example, `org.hypercerts.claim.activity` defines the fields for an activity claim: title, description, workScope, workTimeframe, rights, etc.

Lexicons enable interoperability. Any app that knows the `org.hypercerts.claim.activity` lexicon can parse activity claims, regardless of which app created them. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons) for details.

#### XRPC

XRPC is the HTTP-based API protocol ATProto uses. Applications call XRPC methods to read and write records. For example, `com.atproto.repo.createRecord` creates a new record on a PDS. `com.atproto.repo.getRecord` fetches an existing record by AT-URI.

The Hypercerts SDK wraps XRPC calls in a developer-friendly interface — you don't need to construct XRPC requests manually.

#### Repository

A repository is a user's collection of records, identified by their DID. It's structured as a Merkle Search Tree (MST) — a content-addressed data structure that provides cryptographic integrity and efficient syncing.

When you create a record, it's added to your repository. The repository is versioned — every change produces a new commit with a unique CID (content hash). This makes the repository tamper-evident and auditable.

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

#### 4. Ownership is anchored on-chain

Carol's funding app triggers a smart contract that mints an NFT representing fractional ownership of Alice's hypercert. The token metadata includes the AT-URI of Alice's claim. Carol purchases the token on-chain. The transaction is recorded on the blockchain.

Alice's claim continues to exist on ATProto. New evaluations, evidence, and measurements can be added over time. The on-chain token points to the claim, but the claim's data layer remains on ATProto — open, portable, and interoperable.

## Data Integrity and Trust

#### Content addressing

Every record has a CID (content hash). When you reference a record, you include both its AT-URI and its CID. This makes the reference tamper-evident — if the record is modified, its CID changes, and the reference breaks.

Repositories are Merkle trees. Every commit to a repository produces a new root CID. This enables efficient syncing and cryptographic verification of repository state.

#### Cryptographic signatures

Every record is signed by its author's DID. The signature proves that the record was created by the DID holder and hasn't been tampered with. Applications verify signatures before trusting record data.

#### Decentralized trust-graph

Because DIDs are persistent and records are signed, you can trace an author's entire history across the network. An evaluator's track record — how many evaluations, in which domains, how accurate — is visible to anyone. This enables programmatic trust scoring: algorithms that weight evaluations based on author reputation, detect patterns, and surface credible assessments.

## Indexers and Discovery

#### Why indexers?

ATProto is federated — data is distributed across thousands of PDSs. To discover records, you need an indexer that crawls the network and aggregates data. Indexers subscribe to repository commits via the firehose (a real-time stream of all changes across the network).

#### What indexers do

Indexers fetch records, parse them according to their lexicons, and store them in a queryable database. They provide APIs for searching, filtering, and aggregating hypercert data. For example, an indexer might offer endpoints like:

- `GET /claims?workScope=Documentation&workTimeframeFrom=2026-01-01`
- `GET /evaluations?subject=at://did:plc:alice123/org.hypercerts.claim.activity/3k2j4h5g6f7d8s9a`
- `GET /contributors?did=did:plc:alice123`

#### Running your own indexer

You can run your own indexer if you want full control over data availability and query performance. The Hypercerts Foundation provides reference indexer implementations. You can also use third-party indexers or build custom indexing logic for your application's specific needs.

## Blockchain Integration Patterns

#### Pattern 1: Mint-on-create

When a user creates an activity claim, the app immediately mints an NFT pointing to the claim's AT-URI. The token is created in the same transaction flow. This pattern is simple but requires users to pay gas fees upfront.

#### Pattern 2: Lazy minting

The activity claim exists on ATProto. Tokenization happens later, when a funder expresses interest. This defers gas costs until there's economic value. The claim can accumulate evaluations and evidence before tokenization.

#### Pattern 3: Batch anchoring

Multiple claims are created on ATProto over time. Periodically, a smart contract anchors a Merkle root of all recent claims on-chain. Individual claims can be verified against the root without minting separate tokens. This is gas-efficient for high-volume use cases.

#### Pattern 4: Hybrid ownership

Some rights are tokenized (e.g., revenue rights), while others remain off-chain (e.g., attribution rights). The token represents fractional ownership of specific rights, not the entire claim. The rights structure is defined in the claim's `rights` field (see the [Rights lexicon](/lexicons/hypercerts-lexicons/rights)).

## Migration and Portability

#### Switching PDSs

Users can migrate their entire repository to a new PDS without breaking references. The migration process:

1. Export the repository from the old PDS (a signed commit history)
2. Import it to the new PDS
3. Update the DID document to point to the new PDS URL
4. Applications automatically follow the new location

AT-URIs use DIDs, not server addresses, so references remain valid after migration.

#### Switching apps

Because data is stored on PDSs, not in application databases, users can switch apps without losing data. A claim created in App A is immediately readable by App B. Evaluations, evidence, and measurements created in different apps all reference the same underlying claims.

This is fundamentally different from traditional platforms, where switching apps means starting over.

## Performance and Scalability

#### PDS scalability

A PDS stores one user's data. It doesn't need to scale to millions of users — only to one user's activity. Most users' repositories are small (hundreds or thousands of records). PDSs are lightweight and cheap to run.

#### Indexer scalability

Indexers aggregate data across the network. They need to scale to millions of records. Indexers use standard database scaling techniques: sharding, caching, read replicas. Because indexers are stateless (they derive state from the firehose), you can run multiple indexers in parallel for redundancy and load balancing.

#### Blockchain scalability

On-chain operations (minting, transfers, sales) are expensive. Hypercerts minimize on-chain activity by keeping rich data on ATProto. Only ownership and funding flows touch the blockchain. Layer 2 solutions (Optimism, Arbitrum, Polygon) reduce gas costs for high-volume use cases.

## Privacy and Access Control

#### Public by default

ATProto records are public by default. Anyone can read your activity claims, evaluations, and contributions. This is intentional — impact work benefits from transparency and discoverability.

#### Private records (future)

ATProto is adding support for encrypted records. In the future, you'll be able to create private claims visible only to specific DIDs. For example, a contributor might share sensitive evidence with an evaluator without making it public.

#### Access control via smart contracts

On-chain tokens can have access control logic. For example, a token might grant read access to private ATProto records only to token holders. This enables "token-gated" data — a hybrid of public ATProto data and private, permissioned access.

## Developer Resources

The Hypercerts SDK handles most infrastructure complexity for you. You don't need to manage PDSs, construct XRPC requests, or parse lexicons manually. The SDK provides high-level methods for creating claims, querying records, and handling authentication.

For advanced use cases — running your own indexer, building custom lexicons, or implementing novel blockchain integration patterns — see the [Lexicons](/lexicons/introduction-to-lexicons) section and the [Hypercerts CLI](/tools/hypercerts-cli) documentation.
