---
title: Certified Identity
description: How identity works in the Hypercerts ecosystem — DIDs, signing, portability, and wallet linkage.
---

# Certified Identity

Every hypercert record has an author. Every evaluation carries a signature. Every funding receipt traces back to a DID. Identity is a core primitive of the protocol — it determines who owns records, who can be trusted, and who receives funding.

## Identity in the Hypercerts Protocol

The Hypercerts Protocol uses AT Protocol's identity system. Every participant — whether an individual contributor, an evaluator, or an organization — is identified by a **DID (Decentralized Identifier)**.

A DID like `did:plc:z72i7hdynmk6r22z27h6tvur` is:

- **Permanent** — it never changes, even if you switch servers or handles
- **Portable** — your records, reputation, and history follow your DID across platforms
- **Cryptographically verifiable** — every record you create is signed by your DID's key pair, and anyone can verify the signature

Your DID resolves via the [PLC directory](https://plc.directory) to a DID document containing your current PDS, public signing keys, and handle.

## How identity connects to the protocol

| Layer | How identity is used |
|-------|---------------------|
| **Data** | Every record (activity claims, evaluations, measurements) carries the author's DID. The PDS signs records into a Merkle tree, making authorship tamper-evident. |
| **Trust** | Evaluators build reputation tied to their DID. Applications can weight evaluations based on the evaluator's history and credentials. |
| **Funding** | Funding receipts link funder DIDs to the work they support. Wallet linkage (via [IdentityLink](https://identitylink.vercel.app)) connects DIDs to EVM addresses for onchain payments. |
| **Portability** | Switching PDS providers doesn't change your DID. Your entire history — claims, evaluations, contributions — migrates with you. |

## Certified: the reference identity provider

[Certified](https://certified.app) is the identity provider built for the Hypercerts ecosystem. It provisions the full identity stack in a single sign-up:

- **A DID** — your permanent identifier
- **A PDS** — your Personal Data Server, where records are stored
- **An embedded wallet** — EVM wallet linked to your DID for onchain funding
- **Low-friction sign-in** — email and code, no passwords or protocol knowledge required

Certified exists because most Hypercerts users are not Bluesky users. Researchers, land stewards, open-source maintainers, and funders need an entry point that doesn't require knowledge of ATProto or decentralized protocols. Certified provides that — a neutral identity provider that isn't tied to any single application.

### Handles and organizational identity

Your handle (e.g., `alice.certified.app`) is human-readable but not permanent — it's a pointer to your DID. Organizations can use **custom domain handles** (e.g., `numpy.org`) to prove organizational identity through DNS verification.

For setup details, see [Account & Identity Setup](/getting-started/account-and-identity).

## You don't need Certified

{% callout type="note" %}
Any AT Protocol identity works with all Hypercerts applications. If you already have a Bluesky account or another ATProto account, log in with your existing handle (e.g., `alice.bsky.social`) — everything just works. Certified is one provider among many.
{% /callout %}

## Wallet linkage

To receive onchain funding, a DID needs to be linked to an EVM wallet address. This is handled by **IdentityLink** — a cryptographic attestation system that:

1. Authenticates the user via ATProto OAuth
2. Connects an EVM wallet (EOA, Smart Wallet, or Safe)
3. Signs an EIP-712 typed message proving ownership
4. Stores the attestation in the user's PDS

The attestation is self-sovereign (stored in your PDS, not a central database) and verifiable by anyone. See the [Roadmap](/roadmap) for current IdentityLink status.

## Next steps

- [Account & Identity Setup](/getting-started/account-and-identity) — create an account, configure custom domains, manage app passwords, and set up organization accounts
- [Architecture Overview](/architecture/overview) — how identity fits into the protocol stack
- [Quickstart](/getting-started/quickstart) — create your first hypercert
