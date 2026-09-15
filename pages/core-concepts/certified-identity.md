---
title: Identity, Authorship & Trust
description: How repository publishers, named actors, signatures, acknowledgements, and application trust policies differ.
---

# Identity, Authorship & Trust

Every Hypercerts record is addressed inside an AT Protocol repository identified by a DID. This makes its publication attributable, but attribution is only one input to trust.

## Four claims to keep separate

| Claim | What it means |
|---|---|
| **Repository publisher** | The DID in the AT-URI identifies the repository that published the record. Signed repository commits make unauthorized changes detectable. |
| **Named actor** | A record can name contributors, evaluators, senders, recipients, issuers, or subjects. Those fields are assertions and may not identify the repository publisher. |
| **Record-content attestation** | Many released records optionally carry inline signatures or references to remote proof records. These are separate from AT Protocol repository signatures. |
| **Application trust** | A client decides which publishers, evidence, attestations, and corroborating records it accepts for a purpose. The protocol does not calculate one global trust score. |

## DIDs and repositories

A DID such as `did:plc:z72i7hdynmk6r22z27h6tvur` identifies an AT Protocol account independently of its current handle or PDS host. DID resolution provides the service location and verification methods needed by AT Protocol clients.

AT-URIs include this DID. For example, `at://did:plc:example/org.hypercerts.claim.activity/3k7` attributes the record slot to that repository. A CID identifies one version of the record contents.

Do not describe every actor-like field as a DID:

- Activity contributor identities can contain a DID or another identifier string.
- Contributor information can identify a person through a DID or social-profile URI by convention.
- Evaluation `evaluators` are DID objects, but the schema does not require one of them to be the repository publisher.
- Receipt parties can be text, a DID, or a strong reference to another record.

## Organization records

An organization can use an AT Protocol account containing two singleton records:

- `app.certified.actor.profile/self` for general profile information.
- `app.certified.actor.organization/self` for organization-specific metadata.

Their association is the shared repository identity and `self` key. The released schemas do not define members, administrators, ownership, or links from an organization to its projects. Multi-user repository governance is an infrastructure concern described in the [Certified Group Service](/architecture/certified-group-service) Reference.

## Corroboration records

The graph can accumulate independent responses without changing the original assertion:

- An acknowledgement accepts or rejects a subject or relationship from another repository.
- A badge response records a response to a badge award separately from the award itself.
- An evaluation can cite measurements and publish its own assessment of a subject.
- Optional signatures can attest to record content through a verification method or proof record.

None of these relationships is automatically reciprocal. An award does not imply acceptance, a contributor mention does not prove participation, and an evaluation does not prove independence merely because it is stored separately.

## From provenance to trust

A compatible application should show or preserve:

1. The source AT-URI and version CID.
2. The repository DID that published the record.
3. Actors named inside the record.
4. Acknowledgements, responses, signatures, and evidence that corroborate or challenge it.
5. The application's own inclusion, ranking, and authority policy.

This supports plural trust models. A community, certifier, funder, and automated agent can evaluate the same graph differently while working from attributable source records.

## Certified as one access path

[Certified](https://certified.app) provides Hypercerts-oriented accounts and organization tooling. It is one provider and application surface, not the identity layer of the protocol itself. Existing AT Protocol identities may be usable where an application supports their authentication and the required permissions.

For account creation, OAuth, service environments, and organization-managed writes, use [Account & Identity Setup](/architecture/account-and-identity) and [Client Integration](/client-integration).

Next: [Work Scopes & Classification](/core-concepts/cel-work-scopes).
