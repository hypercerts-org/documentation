---
title: Account & Identity Setup
description: Set up your AT Protocol identity for use with Hypercerts.
---

# Account & Identity Setup

Understand how AT Protocol identities work and configure your account for development.

## What you'll learn

- How DIDs provide permanent, portable identity
- When to use `did:plc` vs `did:web`
- How to set up custom domain handles for organizations
- How to use app passwords for secure API access

## Your AT Protocol identity

Every participant in the Hypercerts ecosystem has a DID (Decentralized Identifier). Your DID is your permanent identity — it stays the same even if you change servers, handles, or PDS providers.

DIDs can represent individuals or organizations. When you create a Certified account or Bluesky account, you get a `did:plc` identifier managed by the PLC directory. For organizations that want full control, `did:web` identities are hosted on your own domain.

## Choosing an identity type

**did:plc (recommended for most users)**

Managed identities that support account recovery and PDS migration. Created automatically when you sign up at [certified.app](https://certified.app) or [bsky.app](https://bsky.app). Best for individuals and teams getting started.

**did:web (for organizations)**

Self-hosted identities tied to your domain (e.g., `did:web:numpy.org`). You control the DID document and cryptographic keys. Best for established organizations that want full sovereignty over their identity infrastructure.

{% callout type="note" %}
Most developers should start with `did:plc`. You can always migrate to `did:web` later as your needs evolve.
{% /callout %}

## Personal Data Servers (PDS)

Your PDS stores your hypercerts, evaluations, and other records. It's where your data lives, but not where your identity lives — your DID is separate and portable.

If you change PDS providers, your DID stays the same. Other applications continue to recognize you. Your data migrates with you. This separation is what makes AT Protocol identities portable.

The Certified PDS is recommended for getting started. Advanced users can self-host using the [AT Protocol PDS implementation](https://github.com/bluesky-social/pds).

## Handles and domain verification

Your handle is a human-readable name like `alice.certified.app` or `alice.bsky.social`. Unlike your DID, your handle can change. It's a pointer to your DID, not your identity itself.

Organizations should use custom domain handles. A handle like `numpy.org` proves organizational identity — anyone can verify that the DID behind `numpy.org` is controlled by whoever controls the `numpy.org` domain.

To set up a custom handle, add a DNS TXT record or host a file at `https://your-domain.com/.well-known/atproto-did`. See the [AT Protocol handle documentation](https://atproto.com/specs/handle) for details.

## Organization accounts

For teams and projects with multiple contributors, consider a Shared Data Server (SDS). Multiple people can write to the same repository using their own credentials.

This is useful for open-source projects, research labs, and organizations where many people contribute to the same body of work. Each contributor authenticates with their own DID, but all records are stored in the shared repository.

{% callout type="note" %}
Shared Data Servers are an emerging pattern in the AT Protocol ecosystem. Contact the Hypercerts team if you need multi-contributor access for your organization.
{% /callout %}

## App passwords

For scripts, CLI tools, and server-side applications, use app passwords instead of your main password. App passwords are scoped credentials that can be revoked independently.

Create an app password in your account settings at [certified.app](https://certified.app). Give it a descriptive name (e.g., "CI/CD pipeline" or "Local development"). If a credential is compromised, revoke just that app password — your main account stays secure.

{% callout type="warning" %}
Never commit app passwords to version control. Use environment variables or a secrets manager.
{% /callout %}

## Account recovery

Your `did:plc` identity includes a recovery key. If you lose access to your account, you can use this key to prove ownership and regain control.

When you create a Certified account, you'll be prompted to save your recovery key. Store it somewhere safe — a password manager, encrypted backup, or physical paper in a secure location.

{% callout type="warning" %}
Without your recovery key, account recovery is difficult or impossible. Save it when prompted.
{% /callout %}

## Next steps

- [Create your first hypercert](/getting-started/quickstart) using your new identity
- [Learn about the Hypercerts infrastructure](/getting-started/the-hypercerts-infrastructure) to understand how identity fits into the broader system
- [Explore the Activity Claim lexicon](/lexicons/hypercerts-lexicons/activity-claim) to see how records reference DIDs
