---
title: Glossary
description: Key terms used in the Hypercerts documentation.
---

# Glossary

---

#### Activity claim

The central record in the hypercerts data model. Describes the work that was done, when, and in what scope.

#### AT-URI

The stable, globally unique identifier for a record slot. It looks like `at://did:plc:abc123/org.hypercerts.claim.activity/3k7`. The record at that URI can be updated or deleted; a CID identifies one exact content version.

#### Attachment

Supporting documentation linked to one or more records — a URL, uploaded file, or IPFS link.

#### Certified

An account and application provider oriented toward Hypercerts users and organizations. A Certified account provides a DID and repository on a Certified PDS. Application compatibility still depends on supported authentication and permissions. See [Account & Identity Setup](/architecture/account-and-identity).

#### CGS (Certified Group Service)

An AT Protocol service that sits between clients and a group's backing PDS and adds role-based access control, record-authorship tracking, and an audit log. Lets multiple identities co-manage a single ATProto repository with member/admin/owner roles. See [Certified Group Service (CGS)](/architecture/certified-group-service).

#### Collection

A named group of hypercerts and/or other collections, with an optional weight per item. Each collection has a `type` (e.g., "favorites", "project") so the same hypercert can appear in different collections for different purposes.

#### Contribution

Who contributed to a hypercert. Can be as simple as a DID string, or a richer record with display name, image, role, and timeframe.

#### DID (Decentralized Identifier)

An identifier for an AT Protocol account, such as `did:plc:abc123xyz`. The DID in an AT-URI identifies the repository that published the record. It is distinct from a mutable handle and from actors named inside the record.

#### ePDS (extended PDS)

A standard AT Protocol PDS with Certified's email/OTP login extension on top, so users can sign in with just an email and a one-time code. From an app's point of view, OAuth against an ePDS still finishes with a normal AT Protocol authorization code. See [ePDS (extended PDS)](/architecture/epds) and the list of Certified-operated ePDS instances on [Certified PDSs](/reference/certified-pdss).

#### Evaluation

A third-party assessment of a hypercert. Created on the evaluator's own account, not the original author's.

#### Hypercert

A structured digital record of a contribution: who did what, when, where, and with what evidence. The core primitive of the protocol. Technically, a hypercert is an activity claim record with linked contributions, attachments, measurements, and evaluations.

#### Hyperindex

A legacy indexer that indexes Hypercerts records and exposes them through GraphQL. It is supporting infrastructure, not the target Hypercerts protocol API. See [Hyperindex](/tools/hyperindex).

#### Lexicon

A versioned schema that defines the structure of a record type. Lexicons enable interoperability — any app that knows the schema can read the record. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

#### Measurement

A quantitative observation attached to a hypercert (e.g., "12 pages written", "50 tons CO₂ reduced").

#### PDS (Personal Data Server)

The server where your records are stored. You interact with it through the ATProto API — you don't need to manage it directly. You can use a [Certified-operated PDS](/reference/certified-pdss), Bluesky's, or self-host one. Records are portable between PDS instances.

#### Strong reference

A reference to another record that includes both the AT-URI and a content hash (CID). Used when one record points to another (e.g., an evaluation referencing an activity claim). The CID makes the reference tamper-evident — if the target record changes, the hash won't match.

#### Work scope

The "what" dimension of a hypercert — what work is being claimed. Can be a simple free-text string or a structured [CEL expression](https://github.com/google/cel-spec) for machine-evaluable scopes. See [Work Scopes](/core-concepts/cel-work-scopes).
