---
title: Account & Identity Setup
description: Create your account and configure your identity for building with Hypercerts.
---

# Account & Identity Setup

To build with Hypercerts, you need an AT Protocol account. This gives you a DID (your permanent identity), a PDS (where your data is stored), and access to every application in the ecosystem.

---

## Create an account

Sign up at [certified.app](https://certified.app). You'll get:

- **A DID** — Your permanent, portable identifier (e.g., `did:plc:z72i7hdynmk6r22z27h6tvur`). It never changes, even if you switch servers or handles.
- **A PDS** — Your Personal Data Server, where your hypercerts, evaluations, and other records are stored. You own this data.
- **An embedded wallet** — Add your existing EVM wallet or get a new one.
- **Ecosystem access** — Your identity works across every Hypercerts application.

Sign-in is email-based — no usernames or passwords to remember.

{% callout type="note" %}
Already have a Bluesky account or another AT Protocol account? You don't need a Certified account. Any AT Protocol identity works with all Hypercerts applications. Log in with your existing handle (e.g., `alice.bsky.social`) — everything just works.
{% /callout %}

---

## Your DID

Your DID is your permanent identity. It looks like `did:plc:z72i7hdynmk6r22z27h6tvur` and is resolved via the [PLC directory](https://plc.directory), which maps it to your current PDS, public keys, and handle.

Every record you create carries your DID as the author. If you change PDS providers, your DID stays the same — other applications continue to recognize you and your data migrates with you.

---

## Handles and domain verification

Your handle is a human-readable name like `alice.certified.app`. Unlike your DID, your handle can change — it's a pointer to your DID, not your identity itself.

**Organizations should use custom domain handles.** A handle like `numpy.org` proves organizational identity — anyone can verify that the DID behind `numpy.org` is controlled by whoever controls the domain.

To set up a custom handle, add a DNS TXT record or host a file at `https://your-domain.com/.well-known/atproto-did`. See the [AT Protocol handle documentation](https://atproto.com/specs/handle) for details.

---

## Organization accounts

For teams with multiple contributors, consider a Shared Data Server (SDS). Multiple people can write to the same repository using their own credentials. This is useful for open-source projects, research labs, and organizations where many people contribute to the same body of work.

{% callout type="note" %}
Shared Data Servers are an emerging pattern in the AT Protocol ecosystem. Contact the Hypercerts team if you need multi-contributor access for your organization.
{% /callout %}

---

## App passwords

For scripts, CLI tools, and server-side applications, use app passwords instead of your main password. App passwords are scoped credentials that can be revoked independently.

Create one in your account settings at [certified.app](https://certified.app). Give it a descriptive name (e.g., "CI/CD pipeline" or "Local development"). If a credential is compromised, revoke just that app password — your main account stays secure.

{% callout type="warning" %}
Never commit app passwords to version control. Use environment variables or a secrets manager.
{% /callout %}

---

## Account recovery

Your `did:plc` identity includes a recovery key. If you lose access to your account, you can use this key to prove ownership and regain control.

When you create an account, you'll be prompted to save your recovery key. Store it somewhere safe — a password manager, encrypted backup, or physical paper in a secure location.

{% callout type="warning" %}
Without your recovery key, account recovery is difficult or impossible. Save it when prompted.
{% /callout %}

---

## Next steps

- [Quickstart](/getting-started/quickstart) — install the SDK and create your first hypercert
- [Creating Your First Hypercert](/tutorials/creating-your-first-hypercert) — build a complete hypercert with contributions, evidence, and measurements
