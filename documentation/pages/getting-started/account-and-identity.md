---
title: Account & Identity Setup
description: Understand your identity, configure custom domains, and manage credentials.
---

# Account & Identity Setup

If you followed the [Quickstart](/getting-started/quickstart), you already have an account. This page explains what that account gives you and how to configure it — custom domain handles for organizations, app passwords for scripts, shared repositories for teams, and account recovery.

---

## Create an account

Sign up at [certified.app](https://certified.app). You'll get:

- **Low-friction sign-in** — No usernames, handles, or passwords to remember. Sign in with just your email and a code.
- **A DID** — Your permanent, portable identifier (e.g., `did:plc:z72i7hdynmk6r22z27h6tvur`). It never changes, even if you switch servers or handles.
- **A PDS** — Your Personal Data Server, where your hypercerts, evaluations, and other records are stored. You own this data.
- **An embedded wallet** — Add your existing EVM wallet or get a new one.
- **Ecosystem access** — Your identity works across every Hypercerts application.

### Why Certified?

The Hypercerts Protocol is built on AT Protocol — the same decentralized data layer that powers Bluesky. But most Hypercerts users are not Bluesky users. They are researchers, land stewards, open-source maintainers, funders, and evaluators. Asking them to "sign in with Bluesky" to use a funding platform would be confusing — it ties a funding tool to a social media brand. This is no knock on Bluesky — it's a great platform, just not the right entry point for a funding tool.

Certified is a neutral identity provider that isn't tied to any single application. You create an account and immediately have an identity that works across the entire ecosystem — no knowledge of Bluesky, ATProto, or decentralized protocols required.

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

For teams with multiple contributors, create a dedicated organizational account on a PDS. The organization gets its own DID and repository. Team members can write to the organization's repository using app passwords or OAuth scoped to the organizational account. This is useful for open-source projects, research labs, and organizations where many people contribute to the same body of work.

{% callout type="note" %}
To set up an organizational account, create an account at [certified.app](https://certified.app) with the organization's email. Use a [custom domain handle](#handles-and-domain-verification) (e.g., `numpy.org`) to prove organizational identity.
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

## The app.certified namespace

Beyond identity, Certified contributes shared data schemas to the AT Protocol ecosystem. You'll see `app.certified.*` in some lexicon names — for example, [`app.certified.location`](/lexicons/general-lexicons/location) defines how geographic locations are represented. These are general-purpose schemas available to any application on AT Protocol, not just Hypercerts.

---

## Next steps

- [Creating Your First Hypercert](/tutorials/creating-your-first-hypercert) — build a complete hypercert with contributions, attachments, and measurements
- [Working with Evaluations](/tutorials/working-with-evaluations) — create evaluations of other people's work
