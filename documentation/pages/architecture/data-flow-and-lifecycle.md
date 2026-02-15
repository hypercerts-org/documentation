---
title: Data Flow & Lifecycle
description: How a hypercert moves from creation through evaluation to funding.
---

# Data Flow & Lifecycle

A hypercert flows through six stages from creation to ongoing accumulation of evidence and funding.

## The Lifecycle of a Hypercert

Every hypercert follows a similar path through the system, though the timeline and participants vary.

**Creation** happens when a contributor writes an activity claim to their Personal Data Server. The claim gets a unique identifier and becomes part of the contributor's repository.

**Enrichment** adds supporting data. Contribution records link collaborators. Evidence records attach proof of work. Measurement records provide quantitative data. Rights records define what funders or stakeholders receive. These can live on the same server or different servers.

**Evaluation** brings third-party assessment. Evaluators create evaluation records on their own servers that reference the original claim. Multiple evaluators can independently assess the same work. Evaluations accumulate over time.

**Discovery** makes the hypercert findable. Relays aggregate records from many servers. Indexers build searchable databases. Platforms query indexers to surface hypercerts to users.

**Funding** connects ownership to the claim. Before a hypercert can be funded, its ATProto records will be frozen — a cryptographic snapshot taken and anchored on-chain. This ensures funders know exactly what they are paying for. The cert's core content cannot change after freezing. The specific on-chain funding mechanisms are being designed.

**Accumulation** continues indefinitely. More evaluations arrive. Additional evidence gets attached around the frozen claim. The planned on-chain ownership may transfer. The data layer and ownership layer will evolve independently.

```
Creation → Enrichment → Evaluation → Discovery → Funding → Accumulation
   ↓           ↓            ↓            ↓          ↓           ↓
  PDS      PDS/SDS      Other PDS     Indexer   On-chain (planned)   Ongoing
```

## Stage 1: Creation

A hypercert begins when a contributor creates an activity claim on their PDS.

The contributor writes an `org.hypercerts.claim.activity` record. This record includes required fields like `workScope`, `impactScope`, `timeframe`, and `contributors`. The PDS validates the record against the lexicon schema.

The record receives a unique AT-URI. The format is `at://did:plc:abc123/org.hypercerts.claim.activity/tid` where `did:plc:abc123` is the contributor's DID and `tid` is a timestamp-based identifier.

The PDS signs the record and includes it in the contributor's repository. The signature proves the contributor created this record at this time. The repository is a Merkle tree that provides tamper-evidence.

The relay picks up the new record. Within seconds, the record is available to downstream consumers. Indexers can now discover and process it.

```
Contributor → PDS → Relay → Indexers
              ↓
         (signed record)
         at://did:plc:alice/org.hypercerts.claim.activity/3k7
```

## Stage 2: Enrichment

Supporting data gets attached through additional records that reference the activity claim.

#### Contribution Records

`org.hypercerts.claim.contribution` records link collaborators to the work. Each contribution record specifies a contributor DID, their role, and a strong reference to the activity claim. Contributions can be created by the original contributor or by collaborators on their own servers.

#### Evidence Records

`org.hypercerts.claim.evidence` records attach proof of work. Evidence can be URLs, file attachments, or structured data. Each evidence record includes a strong reference to the claim it supports.

#### Measurement Records

`org.hypercerts.claim.measurement` records provide quantitative data. A measurement specifies what was measured, the value, the unit, and the methodology. Multiple measurements can track different metrics.

#### Rights Records

`org.hypercerts.claim.rights` records define what funders or stakeholders receive. Rights can include revenue sharing, governance participation, attribution, or custom terms. These records establish expectations before funding happens.

#### Location Records

`app.certified.location` records anchor work geographically. A location record can specify a point, a region, or multiple areas. This enables geographic filtering and regional funding mechanisms.

#### Cross-Server References

These records can live on different PDS instances. A contributor on PDS-A can create an activity claim. A collaborator on PDS-B can create a contribution record that references it. An evaluator on PDS-C can attach evidence. Strong references ensure the connections are tamper-evident.

```
PDS-A (Alice)                    PDS-B (Bob)                     PDS-C (Carol)
─────────────                    ───────────                     ─────────────
activity claim                   contribution record             evidence record
at://did:alice/...               at://did:bob/...                at://did:carol/...
                                 subject: at://did:alice/...     subject: at://did:alice/...
```

## Stage 3: Evaluation

Third parties assess the work by creating evaluation records on their own servers.

An evaluator creates an `org.hypercerts.claim.evaluation` record on their PDS. The evaluation includes a `subject` field with a strong reference to the activity claim. Strong references include both the AT-URI and the CID (content hash), ensuring the evaluation references a specific version of the claim.

The evaluation record includes the evaluator's assessment. This can be a score, a category, structured feedback, or a link to a detailed report. The lexicon allows flexible evaluation formats.

Multiple evaluators can independently assess the same claim. Each evaluation is a separate record on the evaluator's server. There's no central registry or coordination required.

Evaluations accumulate over time. A claim created in January might receive its first evaluation in March, another in June, and more years later. Evaluations are never "final" — new assessments can always arrive.

The evaluator's reputation matters. Applications can weight evaluations based on the evaluator's DID, their history, or their credentials. The protocol doesn't enforce any particular trust model.

```
Activity Claim (Alice's PDS)
at://did:alice/org.hypercerts.claim.activity/3k7
         ↑                    ↑                    ↑
         │                    │                    │
    Evaluation 1         Evaluation 2         Evaluation 3
    (Eve's PDS)          (Frank's PDS)        (Grace's PDS)
```

## Stage 4: Discovery & Indexing

Relays and indexers make hypercerts findable across the network.

#### Relays

Relays aggregate records from many PDS instances. When a user writes a new record, the relay picks it up and adds it to the firehose. Relays provide a complete stream of network activity.

#### Indexers (App Views)

Indexers read from relays and build queryable databases. An indexer might filter for hypercerts-related records, resolve references between claims and evaluations, and compute derived data like total evaluation scores.

Different indexers can build different views. One indexer might focus on climate-related hypercerts. Another might specialize in open-source contributions. A third might aggregate all evaluations from trusted evaluators.

#### Platform Queries

Applications query indexers to surface hypercerts to users. A funding platform might query for "all hypercerts in the climate category with at least two evaluations." A dashboard might query for "all hypercerts created by this DID."

Indexers expose APIs that applications consume. The protocol doesn't mandate a specific API format, but common patterns include GraphQL and REST endpoints.

#### The Discovery Flow

A typical discovery flow: a user creates a claim → the relay picks it up → indexers process it and update their databases → applications query indexers → users discover the claim on platforms.

```
Many PDS Instances
       ↓
     Relay (firehose)
       ↓
   Indexers (filtered views)
       ↓
  Applications (queries)
       ↓
     Users
```

## Stage 5: Funding & Ownership

The planned on-chain layer will connect ownership to the claim.

#### Anchoring

The planned approach: when a hypercert is ready for funding, its current ATProto state will be frozen. A cryptographic snapshot of the activity claim and its associated records is taken, producing a content identifier (CID). This snapshot CID will be anchored on-chain.

The reason for freezing is critical: a funder must know exactly what they are funding. If the core claim could change after funding, funders would face uncertainty about what they paid for. Freezing ensures the funded claim is immutable.

The on-chain anchor will store the AT-URI and the frozen snapshot CID, creating a verifiable link back to the data layer. The specific smart contract design is being developed.

#### Freezing and Immutability

Once frozen, the core activity claim cannot be modified. The snapshot represents the state of the hypercert at the moment of freezing. This protects funders and creates a stable reference point.

Evidence and evaluations can still accumulate after freezing. These supporting records reference the frozen claim but don't modify it. The claim's reputation can evolve while its core content remains fixed.

The tokenization layer is not yet implemented. The planned design includes representing ownership through on-chain tokens — either full ownership or fractional shares. A hypercert might be divided into shares, allowing multiple funders to participate. The specific token standard and contract architecture are being designed.

Token holders will have rights defined in the `org.hypercerts.claim.rights` record. Tokens will be transferable, allowing ownership to change hands without modifying the ATProto records. The data layer and ownership layer will evolve independently.

#### Funding Mechanisms

Various funding models are intended for the ownership layer. Planned mechanisms include direct funding (funders acquire shares directly), retroactive funding (rewarding past work), impact certificates (creating markets for outcomes), and quadratic funding (amplifying small donations).

Smart contracts will enforce rules and distribute payments. A contract might hold funds in escrow until milestones are met, or distribute revenue to funders proportionally. The specific implementations are TBD.

#### Multi-Chain Support

The protocol is designed to be chain-agnostic. Different communities may use different chains — a climate hypercert might use Celo, an open-source project might use Optimism. The ATProto data layer remains the same regardless of which chain holds the token. The specific multi-chain architecture is being designed.

```
ATProto Layer                         On-chain Layer (planned)
─────────────                         ────────────────────────
Activity Claim                        Frozen Snapshot
at://did:alice/...                    CID: bafyreib2rxk3rh6kzwq7...
  ↓                                      ↓
Evidence, Evaluations              Ownership Record (TBD)
Measurements, Rights               Funder: 0xBob...
                                   Metadata: { uri: "at://did:alice/...", cid: "bafyrei..." }
```

## Stage 6: Accumulation

The hypercert continues evolving after funding.

#### Ongoing Evaluations

New evaluations arrive over time. A hypercert funded in 2024 might receive evaluations in 2025, 2026, and beyond. Each evaluation is a new record on the evaluator's PDS.

Indexers pick up new evaluations and update their databases. Applications can show the evolving assessment history. Funders can see how perceptions of the work change over time.

#### Additional Evidence

Contributors can attach more evidence as outcomes become clear. A research project might add published papers. A climate initiative might add measurement data showing carbon reduction.

Evidence records reference the original activity claim. The claim itself doesn't change — evidence accumulates around it.

#### Ownership Transfers

In the planned design, tokens will be transferable on-chain without modifying ATProto records. A funder might sell their shares. A contributor might distribute tokens to collaborators. The ownership layer will evolve independently of the data layer.

#### Long-Term Value

The separation of data and ownership enables long-term value accumulation. A hypercert's reputation can grow as evaluations accumulate. The frozen on-chain anchor will persist independently, providing a stable reference point. The data remains portable and accessible regardless of ownership changes.

```
Time →
─────────────────────────────────────────────────────────
Creation  Evaluation 1  Funding  Evaluation 2  Transfer  Evaluation 3
   ↓          ↓           ↓          ↓            ↓          ↓
  PDS      PDS-Eva1   On-chain (planned)  PDS-Eva2   On-chain (planned)  PDS-Eva3
```

## Cross-PDS References

Records on different servers reference each other through strong references.

A strong reference includes both the AT-URI and the CID (content hash). The URI identifies the record. The CID ensures the reference points to a specific version.

```json
{
  "subject": {
    "uri": "at://did:plc:alice/org.hypercerts.claim.activity/3k7",
    "cid": "bafyreib2rxk3rh6kzwq7..."
  }
}
```

If the referenced record changes, the CID won't match. This makes references tamper-evident. An evaluation that references version 1 of a claim won't silently point to version 2.

Applications can verify references by fetching the record and computing its CID. If the CID matches, the reference is valid. If not, the record was modified after the reference was created.

This enables trust across servers. A record on PDS-A can safely reference a record on PDS-B. The reference is verifiable without trusting either server.

## What This Flow Enables

The lifecycle supports use cases that span time, servers, and participants.

**Retroactive funding** works because creation and funding are separate stages. A contributor can create a claim in January, accumulate evidence and evaluations through the year, and receive funding in December. The data layer preserves the full history.

**Cross-platform collaboration** works because enrichment happens across servers. A contributor on Platform A can work with a collaborator on Platform B. Their contribution records reference the same activity claim. Indexers aggregate both records.

**Independent evaluation** works because evaluators control their own data. An evaluator doesn't need permission from the contributor or any platform. They create a record on their server that references the claim. Applications can discover and display it.

**Evolving reputation** works because accumulation is ongoing. A hypercert's value isn't fixed at creation. Evaluations arrive over time. Evidence accumulates. The full history is queryable.

## Next Steps

For the overall architecture and how layers connect, see [Architecture Overview](/architecture/overview).

For details on specific record types and their schemas, see [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

For a practical walkthrough of creating a hypercert, see [Creating Your First Hypercert](/tutorials/creating-your-first-hypercert).
