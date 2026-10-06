---
title: Glossary
description: Short definitions of the terms used across the Hypercerts documentation.
---

# Glossary

Terms are listed alphabetically. Each entry links to the page that explains it in full.

#### Acknowledgement

A record in which an account accepts or rejects a relationship that someone else stated, such as being named as a contributor or having an activity included in a collection. See [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement).

#### Activity claim

The record that describes a piece of work: what is being done or was done, by whom, when, and where. Also called a hypercert. Evidence, evaluations, and funding receipts point to it. See [Activity Claims](/core-concepts/what-is-hypercerts).

#### AT Protocol

The open network technology that Hypercerts is built on, also used by Bluesky. It gives every account an identity and a repository for its records, and lets any application read them. See [Why AT Protocol?](/core-concepts/why-at-protocol).

#### AT-URI

The address of a record on the network, such as `at://did:plc:abc123/org.hypercerts.claim.activity/3k7`. It names the account, the record type, and the record's key. The record at that address can change; a [CID](#cid) identifies one exact version.

#### Attachment

A record that connects material such as a document, photo, dataset, or link to the records it concerns. See [Evidence and Measurements](/core-concepts/evidence-and-measurements).

#### Backfill

Catching up on records that were published before you started listening. [Jetstream](#jetstream) keeps an archive so a new consumer can load past records before following the live stream.

#### Badge

A way for a network or certifier to recognize an account or a record. A badge definition describes the recognition, a badge award gives it to a recipient, and a badge response lets the recipient accept or reject it. See [Trust and Recognition](/core-concepts/certified-identity).

#### Blob

A file stored alongside an account's records, such as an image or a PDF. Records refer to blobs; the PDS stores them.

#### CBOR

Concise Binary Object Representation, the compact binary format AT Protocol uses to store and transmit records. Most applications work with JSON instead, through [Jetstream](#jetstream) or an API.

#### Certified

The identity service operated by the Hypercerts Foundation: accounts, sign-in, group accounts, and the `app.certified` record types for profiles, organizations, locations, and badges. Applications don't have to use Certified to use Hypercerts.

#### Certified account

An AT Protocol account hosted by the Hypercerts Foundation. It gives a person or organization one identity and one place for their records, and lets them sign in to Hypercerts applications with an email address. See [certified.app](/reference/services/certified-app).

#### certified.app

The web app where people create a Certified account and manage it: profile, connected applications, groups, and endorsements. See [certified.app](/reference/services/certified-app).

#### Certified Group Service (CGS)

The service that lets several people manage one account together, with member, admin, and owner roles. Used for organizations and projects. See [Certified Group Service](/reference/services/certified-group-service).

#### Certified PDS

A [PDS](#pds-personal-data-server) hosted by the Hypercerts Foundation for Certified accounts. See [Certified PDSs](/reference/services/certified-pdss).

#### CID

Content identifier: a hash of a record's contents. Changing the record changes its CID, so a CID identifies one exact version. See [Records That Change Over Time](/architecture/data-flow-and-lifecycle).

#### Collection

Two meanings. In Hypercerts, a collection is a record that groups activities, features, or other collections; a [project](#project) is a collection of type `project`. See [Projects and Collections](/core-concepts/projects-and-collections). In AT Protocol, a collection is also the set of an account's records of one type, named by an [NSID](#nsid).

#### Contribution

Information about who took part in an activity and what they did. It can be written inline on the activity or kept in reusable contributor and contribution records. See [Contribution](/lexicons/hypercerts-lexicons/contribution).

#### Cursor

A bookmark in a stream of events. A consumer saves the position of the last event it processed and sends it when reconnecting, so it resumes where it left off.

#### DID (decentralized identifier)

The permanent identifier of an AT Protocol account, such as `did:plc:abc123xyz`. It stays the same when the account changes its [handle](#handle) or moves to another server.

#### Endorsement

A public statement by one account that it vouches for another account or its work. Endorsements are published records, so applications can show them and use them as [trust signals](#trust-signal).

#### Entryway

The service that signs users in to their Certified accounts and connects them to the PDS that stores their records. It is under development and will take over sign-in from [ePDS](#epds-extended-pds). See [Entryway](/reference/services/entryway).

#### ePDS (extended PDS)

A standard PDS with an added sign-in layer: users log in with an email address and a one-time code. The Certified PDSs run ePDS today. The [Entryway](#entryway) will replace this role.

#### Evaluation

A record containing an assessment of work, published by the evaluator from their own account and linked to what it assesses. See [Evaluations](/core-concepts/evaluations).

#### Feature

A record describing something the work concerns that is not a person or organization, such as a land zone or a participant cohort. See [Feature](/lexicons/hypercerts-lexicons/feature).

#### Feed

An ordered list of recent activity, such as new projects or evaluations from accounts a user follows. The [Feed Service](/reference/services/feed-service) provides ready-made feeds.

#### Firehose

The continuous stream of every record change that a [relay](#relay) publishes. Events are in [CBOR](#cbor) and include the signed data needed to verify them.

#### Funding receipt

A record describing a funding payment: who paid whom, how much, and for which work. It describes a payment; it does not move money or prove that payment arrived. See [Funding and Learning](/core-concepts/funding-and-value-flow).

#### Handle

An account's readable name, such as `alice.certified.one`. A handle can change; the account's [DID](#did-decentralized-identifier) does not.

#### Hypercert

Another name for an [activity claim](#activity-claim): a record describing a piece of work, which evidence, evaluations, and funding records can attach to.

#### Hypercerts API

The XRPC service applications use to query Hypercerts and Certified records across the network, served at [`api.hypercerts.dev`](https://api.hypercerts.dev). See [Hypercerts API](/reference/services/hypercerts-api) and [XRPC API](/reference/xrpc-api).

#### Hypercerts Protocol

The Hypercerts and Certified [Lexicons](#lexicon) together with the conventions for using them. It defines how work, evidence, evaluations, and funding are described so that different applications understand the same records.

#### Indexer

A service that collects records from many accounts and organizes them into a searchable view. The Hypercerts API provides this kind of view for Hypercerts and Certified records. See [Hypercerts API](/reference/services/hypercerts-api).

#### Jetstream

A service that turns the [firehose](#firehose) into a filtered stream of record changes in plain JSON. The Hypercerts Jetstream keeps only the record collections it is configured for, such as Hypercerts and Certified records. See [Relay and Jetstream](/reference/services/relay).

#### Label

A short tag that a [labeler](#labeler) attaches to a record or an account, such as `likely-test` or `high-quality`.

#### Labeler

An account that publishes [labels](#label) about records or accounts. Applications choose which labelers to trust. See [Labelers](/reference/services/labelers).

#### Lexicon

A schema that defines one type of record or API method: its fields, their types, and their constraints. See [Introduction to Lexicons](/lexicons/introduction-to-lexicons).

#### Location

A record describing a place or area, which activities, collections, and features can refer to. See [Location](/lexicons/certified-lexicons/location).

#### Measurement

A record of a quantitative observation: what was measured, the value, the unit, and optionally the method. See [Evidence and Measurements](/core-concepts/evidence-and-measurements).

#### NSID

Namespaced identifier: the name of a Lexicon, such as `org.hypercerts.claim.activity`. Records carry it in their `$type` field.

#### OAuth

The standard way a user grants an application limited access to their account without sharing a password. AT Protocol applications sign users in with OAuth.

#### Organization

A record with details about an organization, such as its type and founding date, kept alongside its [profile](#profile). See [Organization](/lexicons/certified-lexicons/organization).

#### PDS (Personal Data Server)

The server that hosts an account's repository and serves its records to applications. Accounts can move between PDSs without changing identity. See [Certified PDSs](/reference/services/certified-pdss).

#### Permission set

A named group of permissions that an application requests during sign-in. `org.hypercerts.authWrite` and `app.certified.authWrite` allow an application to create, update, and delete Hypercerts and Certified records.

#### Profile

A record with an account's display name, description, avatar, and banner. See [Profile](/lexicons/certified-lexicons/profile).

#### Project

A group of related activities followed as a whole. In Hypercerts, a project is a [collection](#collection) with its type set to `project`. See [Projects and Collections](/core-concepts/projects-and-collections).

#### Record

A small structured document published by an account, such as an activity claim or an evaluation. Every record has a type, defined by a [Lexicon](#lexicon), and an address, its [AT-URI](#at-uri).

#### Record key

The last part of a record's address, which identifies it among the account's records of the same type.

#### Relay

A service that connects to many PDSs and merges the changes they publish into one stream, the [firehose](#firehose). See [Relay and Jetstream](/reference/services/relay).

#### Repository

The collection of all records an account has published. It lives on the account's PDS and is signed, so anyone can check that a record came from that account.

#### Rights

A record stating the rights or licensing terms attached to an activity. See [Rights](/lexicons/hypercerts-lexicons/rights).

#### SDK

The Hypercerts library for creating, reading, and validating records from an application. It is under development. See [SDK](/reference/sdk).

#### Service auth token

A short-lived token that a user's PDS issues so a service can confirm who is calling it. Used when calling the Certified Group Service and the Feed Service.

#### Strong reference

A link to another record that includes both its [AT-URI](#at-uri) and its [CID](#cid), so it points to one exact version. An evaluation uses a strong reference to say which version of an activity it assessed.

#### Trust signal

Information that helps someone decide whether to rely on a project or its work: project updates, endorsements, evaluations, certifications, and funding records, each attributed to whoever provided it. See [Trust and Recognition](/core-concepts/certified-identity).

#### Vocabulary tag

A reusable term for classifying Hypercerts records. Today collections and features refer to it, so directories can group projects by subject. See [Vocabulary Tag](/lexicons/hypercerts-lexicons/vocabulary-tag).

#### Work scope

The description of what an activity covers. It can be plain text or a structured expression that software can compare. See [Describing and Classifying Work](/core-concepts/cel-work-scopes).

#### XRPC

The way AT Protocol services expose their APIs: HTTP requests to named methods, each defined by a [Lexicon](#lexicon). Queries read data and procedures change it.
