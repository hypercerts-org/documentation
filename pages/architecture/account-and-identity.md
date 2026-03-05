---
title: Account & Identity Setup
description: Understand your identity, configure custom domains, and manage credentials.
---

# Account & Identity Setup

If you followed the [Quickstart](/getting-started/quickstart), you already have an account. This page explains what that account gives you and how to configure it — custom domain handles for organizations, app passwords for scripts, shared repositories for teams, and account recovery.

---

## Create an account

Sign up at [certified.app](https://certified-app-hypercerts-foundation.vercel.app/). You'll get:

- **Low-friction sign-in** — Sign in with just your email and a code. No passwords or protocol knowledge required.
- **A DID** — Your permanent, portable identifier (e.g., `did:plc:z72i7hdynmk6r22z27h6tvur`). It never changes, even if you switch servers or handles.
- **A Repository** — Your own collection on the certified PDS, where your hypercerts, evaluations, and other records are stored. You own this data and you can migrate it between servers.
- **An (embedded) wallet** — Add your existing EVM wallet or get a new one.
- **Ecosystem access** — Your identity works across every Hypercerts application.

### Why Certified?

The Hypercerts Protocol is built on AT Protocol — the same decentralized data layer that powers Bluesky. But most Hypercerts users are not Bluesky users. They are researchers, land stewards, open-source maintainers, funders, and evaluators. Asking them to "sign in with Bluesky" to use a funding platform would be confusing — it ties a funding tool to a social media brand. This is no knock on Bluesky — it's a great platform, just not the right entry point for a funding tool.

Certified is a neutral identity provider that isn't tied to any single application. You create an account and immediately have an identity that works across the entire ecosystem — no knowledge of Bluesky, ATProto, or decentralized protocols required.

{% callout type="note" %}
Hypercerts is fully interoperable with the AT Protocol ecosystem. If you already have a Bluesky account or any other ATProto identity, log in with your existing handle (e.g., `alice.bsky.social`) and use all Hypercerts applications — no additional account needed.
{% /callout %}

---

## Your DID

Your DID is your permanent identity. It looks like `did:plc:z72i7hdynmk6r22z27h6tvur` and is resolved via the [PLC directory](https://plc.directory), which maps it to your current PDS, public keys, and handle.

Every record you create carries your DID as the author. If you change PDS providers, your DID stays the same — other applications continue to recognize you and your data migrates with you.

---

## Handles (your public username) and domain verification

Handles are not needed to log in to the Hypercerts ecosystem, but every user has one. They serve as human-readable names for publicly addressing others and for interacting with other applications in the AT Protocol ecosystem that haven't implemented email-based login with Certified. Your handle is a human-readable name like `alice.certified.app`. Unlike your DID, your handle can change — it's a pointer to your DID, not your identity itself.

**Organizations should use custom domain handles.** A handle like `numpy.org` proves organizational identity — anyone can verify that the DID behind `numpy.org` is controlled by whoever controls the domain.

To set up a custom handle, add a DNS TXT record or host a file at `https://your-domain.com/.well-known/atproto-did`. See the [AT Protocol handle documentation](https://atproto.com/specs/handle) for details.

{% callout type="note" %}
If you sign up using your email on certified.app you will initially be given a random handle like `1lasdk.certified.app`. You can change your handle by going to your profile settings and clicking on "Change handle" on [certified.app](https://certified.app).
{% /callout %}
---

## Organization accounts

For teams with multiple contributors, create a dedicated organizational account on a PDS. The organization gets its own DID and repository. Team members can write to the organization's repository using app passwords or OAuth scoped to the organizational account. This is useful for open-source projects, research labs, and organizations where many people contribute to the same body of work.

{% callout type="note" %}
To set up an organizational account, create an account at [certified.app](https://certified-app-hypercerts-foundation.vercel.app) with the organization's email. Use a [custom domain handle](#handles-and-domain-verification) (e.g., `numpy.org`) to prove organizational identity.
{% /callout %}

---

## Authentication

### OAuth (for applications)

Applications authenticate users via AT Protocol OAuth. The AT Protocol client libraries handle the full OAuth flow — authorization, token management, and session restoration. Users authorize your app through their PDS and never share credentials with your application. See the [Quickstart](/getting-started/quickstart) for the authentication setup.

### OAuth (for ePDS)
The ePDS (extended PDS) adds email/passwordless login on top of the standard PDS, without modifying the underlying AT Protocol PDS code. When a user authenticates, the ePDS Auth Service handles the OTP flow and then issues a standard AT Protocol authorization code back to your app.

Because of this architecture, the standard ATProto OAuth client libraries won't work with ePDS — you'll need to implement [PAR](https://datatracker.ietf.org/doc/html/rfc9126), [DPoP](https://datatracker.ietf.org/doc/html/rfc9449), and [PKCE](https://datatracker.ietf.org/doc/html/rfc7636) directly. [`@atproto/oauth-client-node`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node) does not handle ePDS's email/OTP flow and cannot be used as-is. The [ePDS demo](https://github.com/hypercerts-org/ePDS/tree/main/packages/demo) is a Next.js app that implements the above and shows a complete working example.

{% callout type="note" %}
A ready-made skill that implements the full ePDS OAuth flow is available at `.agents/skills/epds-login/SKILL.md` in the [ePDS repository](https://github.com/hypercerts-org/ePDS). See the [ePDS architecture documentation](https://github.com/hypercerts-org/ePDS/blob/main/docs/architecture.md) for a full explanation.
{% /callout %}


### App passwords (for scripts and CLI)

For scripts, CLI tools, and server-side automation, use app passwords instead of your main password. App passwords are scoped credentials that can be revoked independently.

Create one in your account settings at [certified.app](https://certified-app-hypercerts-foundation.vercel.app). Give it a descriptive name (e.g., "CI/CD pipeline" or "Local development"). If a credential is compromised, revoke just that app password — your main account stays secure. The [Hypercerts CLI](/tools/hypercerts-cli) uses app passwords for authentication.

{% callout type="warning" %}
Never commit app passwords to version control. Use environment variables or a secrets manager.
{% /callout %}

---

## The app.certified namespace

Beyond identity, Certified contributes shared data schemas to the AT Protocol ecosystem. You'll see `app.certified.*` in some lexicon names — for example, [`app.certified.location`](/lexicons/certified-lexicons/location) defines how geographic locations are represented. These are general-purpose schemas available to any application on AT Protocol, not just Hypercerts.

---

## Next steps

- [Quickstart](/getting-started/quickstart) — build a complete hypercert with contributions, attachments, and measurements
- [Working with Evaluations](/getting-started/working-with-evaluations) — create evaluations of other people's work
