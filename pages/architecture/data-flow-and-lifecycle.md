---
title: Data Flow & Lifecycle
description: How a hypercert moves from creation through evaluation to funding.
---

# Data Flow & Lifecycle

A hypercert flows through six stages from creation to ongoing accumulation of attachments and funding.

## The Lifecycle of a Hypercert

Every hypercert follows a similar path through the system, though the timeline and participants vary.

**Creation** happens when a contributor writes an activity claim to their Personal Data Server. The claim gets a unique identifier and becomes part of the contributor's repository.

**Enrichment** adds supporting data. Contribution records link collaborators. Attachment records attach proof of work. Measurement records provide quantitative data. Rights records define the terms of the claim. Collection records group claims into projects. These can live on the same server or different servers.

**Evaluation** brings third-party assessment. Evaluators create evaluation records on their own servers that reference the original claim. Multiple evaluators can independently assess the same work. Evaluations accumulate over time.

**Discovery** makes the hypercert findable. Relays aggregate records from many servers. Indexers build searchable databases. Platforms query indexers to surface hypercerts to users.

**Funding** connects funders to the claim. Funding receipts (`org.hypercerts.funding.receipt`) record who funded what, how much, and when — this works today on AT Protocol. Optionally, the claim can be frozen and anchored on-chain for tokenized funding. The on-chain tokenization layer is [planned but not yet implemented](/core-concepts/funding-and-value-flow).

**Accumulation** continues indefinitely. More evaluations arrive. Additional attachments get attached. The data layer continues evolving.

```
Creation → Enrichment → Evaluation → Discovery → Funding → Accumulation
   ↓           ↓            ↓            ↓          ↓           ↓
  PDS        PDS        Other PDS     Indexer   On-chain*   Ongoing
```

*On-chain layer is planned. See [Funding & Value Flow](/core-concepts/funding-and-value-flow).

## Stage 1: Creation

A hypercert begins when a contributor creates an activity claim on their PDS.

The contributor writes an `org.hypercerts.claim.activity` record. This record includes fields like `workScope`, `startDate`, `endDate`, and `contributors`. The PDS validates the record against the lexicon schema.

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

Contributors are embedded in the activity claim's `contributors` array. For richer profiles, separate `org.hypercerts.claim.contributorInformation` and `org.hypercerts.claim.contributionDetails` records can be created and referenced. Contributions can be created by the original contributor or by collaborators on their own servers.

#### Attachment Records

`org.hypercerts.claim.attachment` records attach supporting documentation. Attachments can be URLs, file uploads, or structured data. Each attachment record includes a strong reference to the claim it supports.

#### Measurement Records

`org.hypercerts.claim.measurement` records provide quantitative data. A measurement specifies what was measured, the value, the unit, and the methodology. Multiple measurements can track different metrics.

#### Rights Records

`org.hypercerts.claim.rights` records define the rights associated with a hypercert — for example, public display rights, attribution licenses, or transferability terms. The activity claim references a rights record via a strong reference. Rights are defined using a name, type, and description, with an optional attached legal document.

#### Location Records

`app.certified.location` records anchor work geographically. A location record can specify a point, a region, or multiple areas. This enables geographic filtering and regional funding mechanisms.

#### Collection Records

`org.hypercerts.claim.collection` records group multiple activity claims into a project or portfolio. Each collection has weighted items (strong references to activity claims or other collections), supporting recursive nesting. A collection with `type="project"` represents a multi-year project composed of individual activity claims.

#### Funding Receipts

`org.hypercerts.funding.receipt` records track funding events. A receipt records who funded which activity, how much, through which payment rail, and when. Receipts reference the activity claim they fund. See [Funding & Value Flow](/core-concepts/funding-and-value-flow) for details.

#### Cross-Server References

These records can live on different PDS instances. A contributor on PDS-A can create an activity claim. A collaborator on PDS-B can create a contribution record that references it. A collaborator on PDS-C can create an attachment. Strong references ensure the connections are tamper-evident.

```
PDS-A (Alice)                    PDS-B (Bob)                     PDS-C (Carol)
─────────────                    ───────────                     ─────────────
activity claim                   contribution record             attachment record
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

## Stage 5: Funding & Ownership (Planned)

The on-chain funding layer is not yet implemented. The planned design: before a hypercert can be funded, its ATProto records are frozen and the snapshot is anchored on-chain. This ensures funders know exactly what they are paying for — the cert's contents cannot change after freezing.

For the full planned design — including anchoring, tokenization, funding mechanisms, and funding readiness patterns — see [Funding & Value Flow](/core-concepts/funding-and-value-flow).

## Stage 6: Accumulation

The hypercert continues evolving after funding.

#### Ongoing Evaluations

New evaluations arrive over time. A hypercert funded in 2024 might receive evaluations in 2025, 2026, and beyond. Each evaluation is a new record on the evaluator's PDS.

Indexers pick up new evaluations and update their databases. Applications can show the evolving assessment history. Funders can see how perceptions of the work change over time.

#### Additional Attachments

Contributors can attach more supporting documentation as outcomes become clear. A research project might add published papers. A climate initiative might add measurement data showing carbon reduction.

Attachment records reference the original activity claim. The claim itself doesn't change — attachments accumulate around it.

#### Long-Term Value

The separation of data and ownership enables long-term value accumulation. A hypercert's reputation can grow as evaluations accumulate. The data remains portable and accessible regardless of future ownership changes.

```
Time →
─────────────────────────────────────────────────────────
Creation  Evaluation 1  Discovery  Evaluation 2  Attachment  Evaluation 3
   ↓          ↓           ↓           ↓            ↓          ↓
  PDS      PDS-Eva1     Indexer    PDS-Eva2      PDS       PDS-Eva3
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

**Retroactive funding** works because creation and funding are separate stages. A contributor can create a claim in January, accumulate attachments and evaluations through the year, and receive funding in December. The data layer preserves the full history.

**Cross-platform collaboration** works because enrichment happens across servers. A contributor on Platform A can work with a collaborator on Platform B. Their contribution records reference the same activity claim. Indexers aggregate both records.

**Independent evaluation** works because evaluators control their own data. An evaluator doesn't need permission from the contributor or any platform. They create a record on their server that references the claim. Applications can discover and display it.

**Evolving reputation** works because accumulation is ongoing. A hypercert's value isn't fixed at creation. Evaluations arrive over time. Attachments accumulate. The full history is queryable.

## Next Steps

For the overall architecture and how layers connect, see [Architecture Overview](/architecture/overview).

For details on specific record types and their schemas, see [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

For a practical walkthrough of creating a hypercert, see [Creating Your First Hypercert](/getting-started/creating-your-first-hypercert).
