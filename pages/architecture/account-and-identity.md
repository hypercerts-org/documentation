---
title: Account & Identity Setup
description: Understand your identity, configure custom domains, and manage credentials.
---

# Account & Identity Setup

This page explains what an AT Protocol account gives you and how to configure it: custom domain handles for organizations, app passwords for scripts, shared repositories for teams, and account recovery.

---

## Create an account

Sign up at [certified.app](https://certified.app/). You'll get:

- **Low-friction sign-in** — Sign in with just your email and a code. No passwords or protocol knowledge required.
- **A DID** — Your portable account identifier (e.g., `did:plc:z72i7hdynmk6r22z27h6tvur`), distinct from the current server address and handle.
- **A repository** — An AT Protocol repository on a Certified PDS, where Hypercerts and other supported records can be stored.
- **Application access** — A DID and repository that compatible applications can support through their own authentication and permission flows.

### Why Certified?

The Hypercerts Protocol is built on AT Protocol — the same decentralized data layer that powers Bluesky. But most Hypercerts users are not Bluesky users. They are researchers, land stewards, open-source maintainers, funders, and evaluators. Asking them to "sign in with Bluesky" to use a funding platform would be confusing — it ties a funding tool to a social media brand. This is no knock on Bluesky — it's a great platform, just not the right entry point for a funding tool.

Certified provides a Hypercerts-oriented account path without requiring users to understand Bluesky or AT Protocol internals. Each application still determines which account providers and permissions it supports.

{% callout type="note" %}
Existing Bluesky and other AT Protocol accounts can be used by Hypercerts applications that support their authentication provider and request the required permissions. Check the target application's supported account types before treating an existing identity as a complete integration path.
{% /callout %}

---

## Your DID

Your DID is your account identifier. It looks like `did:plc:z72i7hdynmk6r22z27h6tvur` and is resolved via the [PLC directory](https://plc.directory), which maps it to the current PDS, public keys, and handle.

The DID in a record's AT-URI identifies the repository that published it. An account migration that preserves the DID can preserve those AT-URIs when the PDS changes; application recognition and index freshness remain implementation concerns.

---

## Handles (your public username) and domain verification

Handles are not needed to log in to the Hypercerts ecosystem, but every user has one. They serve as human-readable names for publicly addressing others and for interacting with other applications in the AT Protocol ecosystem that haven't implemented email-based login with Certified. Your handle is a human-readable name like `alice.certified.one`. Unlike your DID, your handle can change — it's a pointer to your DID, not your identity itself.

**Organizations should use custom domain handles.** A handle like `numpy.org` demonstrates control of the domain at verification time and gives applications a recognizable name for the DID.

To set up a custom handle, add a DNS TXT record or host a file at `https://your-domain.com/.well-known/atproto-did`. See the [AT Protocol handle documentation](https://atproto.com/specs/handle) for details.

{% callout type="note" %}
If you sign up using your email on certified.app you will initially be given a random handle like `1lasdk.certified.one`. You can change your handle by going to your profile settings and clicking on "Change handle" on [certified.app](https://certified.app).
{% /callout %}
---

## Organization accounts

For teams with multiple contributors, create a dedicated organizational account on a PDS. The organization gets its own DID and repository. Team members can write to the organization's repository using app passwords or OAuth scoped to the organizational account. This is useful for open-source projects, research labs, and organizations where many people contribute to the same body of work.

{% callout type="note" %}
To set up an organizational account, create an account at [certified.app](https://certified.app) with the organization's email. Use a [custom domain handle](#handles-your-public-username-and-domain-verification) (e.g., `numpy.org`) to prove organizational identity.
{% /callout %}

### Role-based governance with CGS

Sharing a single app password across an organisation is the simplest path but has real limits: every team member ends up with the same level of access, there's no audit trail, and revoking one person's access means rotating the password for everyone.

The [Certified Group Service (CGS)](/architecture/certified-group-service) is the more principled answer. CGS sits in front of a PDS and adds **role-based access control** on top of a shared repository — multiple identities can co-manage the same ATProto repo with distinct member, admin, and owner roles, and every action is written to a per-group audit log. Members authenticate as themselves (not as the organisation), so access can be granted or revoked per-person without disturbing anyone else.

Certified operates hosted CGS instances for its environments (used by "create a group" flows on [certified.app](https://certified.app)), and CGS is also self-hostable if you want to run your own. Registered groups are created on the PDS configured for the relevant CGS deployment; imported groups remain on their existing PDS. See [Certified PDSs](/reference/certified-pdss) for the environment mapping and the [CGS architecture page](/architecture/certified-group-service) for the full model.

---

## Authentication

### OAuth (for applications)

Applications authenticate users via AT Protocol OAuth. The AT Protocol client libraries handle the full OAuth flow — authorization, token management, and session restoration. Users authorize your app through their PDS and never share credentials with your application. See [Client Integration](/client-integration) for the evolving integration guidance.

### OAuth (for ePDS)
The ePDS (extended PDS) adds email/passwordless login on top of the standard PDS, without modifying the underlying AT Protocol PDS code. When a user authenticates, the ePDS Auth Service handles the OTP flow and then issues a standard AT Protocol authorization code back to your app.

You can integrate ePDS with [`@atproto/oauth-client-node`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node). If your app already has an email field, start OAuth normally and add `login_hint=<email>` to the authorization URL before redirecting the user. If your app just has a sign-in button, redirect the user normally and let ePDS collect the email itself. You can also optionally add `epds_handle_mode` to the authorization URL to control how new users get handles.

{% callout type="note" %}
See [ePDS (extended PDS)](/architecture/epds) for integration examples, handle mode configuration, and client metadata options. A ready-made skill that implements the full ePDS OAuth flow is available at `.agents/skills/epds-login/SKILL.md` in the [ePDS repository](https://github.com/hypercerts-org/ePDS).
{% /callout %}


### App passwords (for scripts and CLI)

For scripts, CLI tools, and server-side automation, use app passwords instead of your main password. App passwords are scoped credentials that can be revoked independently.

Create one in your account settings at [certified.app](https://certified.app). Give it a descriptive name (e.g., "CI/CD pipeline" or "Local development"). If a credential is compromised, revoke just that app password — your main account stays secure.

{% callout type="warning" %}
Never commit app passwords to version control. Use environment variables or a secrets manager.
{% /callout %}

---

## The app.certified namespace

Beyond identity, Certified contributes shared data schemas to the AT Protocol ecosystem. You'll see `app.certified.*` in some lexicon names — for example, [`app.certified.location`](/lexicons/certified-lexicons/location) defines how geographic locations are represented. These are general-purpose schemas available to any application on AT Protocol, not just Hypercerts.

---

## Next steps

- [Client Integration](/client-integration) — review the target SDK and XRPC path and current gaps
- [Evaluation Lexicon](/lexicons/hypercerts-lexicons/evaluation) — inspect the evaluation record schema
