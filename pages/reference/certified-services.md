---
title: Certified PDSs
description: Overview of the Certified-operated ePDS instances (production, staging, and test) and which one to use in which scenario.
---

# Certified PDSs

Certified operates several [ePDS](/architecture/epds) instances across production, staging, and test environments. This page explains what each one is for and which you should use in which scenario.

Apps built on Hypercerts don't *need* to use a Certified PDS — any AT Protocol PDS will work. The guidance below applies when you specifically want to offer "Sign in with Certified" or otherwise integrate with the ePDS extension.

{% callout type="note" %}
**Reading handles.** Accounts created via [`certified.app`](https://certified.app) get handles under `.certified.one` (e.g. `alice.certified.one`) — the same domain as the production PDS itself. Staging accounts live under `.dev.certified.app`, and test accounts under the relevant `*.test.certified.app` subdomain (e.g. `group.pds1.test.certified.app`). The handle suffix is a quick way to tell which PDS an identity is on.
{% /callout %}

## Quick reference

| Service | Environment | Who it's for | ePDS version | PDS version |
|---|---|---|---|---|
| [`certified.one`](https://certified.one) | Production ePDS | Production "Sign in with Certified" | pre-0.2.0 ([`0f72433`](https://github.com/hypercerts-org/ePDS/commit/0f72433f)) [¹][n1] | 0.4.211 [²][n2] |
| [`dev.certified.app`](https://dev.certified.app) | Staging ePDS | Staging "Sign in with Certified" for apps under development | pre-0.2.0 ([`ad7fd26`](https://github.com/hypercerts-org/ePDS/commit/ad7fd261)) [¹][n1] | 0.4.211 [²][n2] |
| `*.test.certified.app` | Test ePDS instances | Hypercerts core development; bleeding-edge testing | See [test instances](#current-test-instances) below | See [test instances](#current-test-instances) below |

[n1]: #checking-the-running-version "Pre-0.2.0: includes login-hint and initial handle picker, but not configurable OTP, epds_handle_mode, email masking, or consent screen fixes. Upgrade imminent."
[n2]: #checking-the-running-version "/xrpc/_health not yet reporting version on these instances; version from pnpm-lock.yaml at the deployed commit"

¹ Pre-0.2.0: includes the login-hint feature and initial handle picker from [0.2.0](https://github.com/hypercerts-org/ePDS/releases/tag/epds%400.2.0), but not configurable OTP, `epds_handle_mode`, email masking ([0.2.1](https://github.com/hypercerts-org/ePDS/releases/tag/epds%400.2.1)), or the consent screen fixes ([0.2.2](https://github.com/hypercerts-org/ePDS/releases/tag/ePDS%400.2.2)). Upgrade imminent.

² `/xrpc/_health` is not yet reporting the PDS version on these instances; version determined from `pnpm-lock.yaml` at the deployed commit.

Note the distinction between these ePDS backends and [`certified.app`](https://certified.app) — the frontend app that end users interact with to manage their `certified.one` identity (and other AT Protocol identities). `certified.app` is not an ePDS; it's a client that talks to one.

## Production: `certified.one`

`certified.one` **is** the production ePDS. It's the backend behind the Certified frontend at [`certified.app`](https://certified.app), and the endpoint that production applications should point at when they implement "Sign in with Certified".

By the nature of AT Protocol's decentralized approach to identity and data storage, any ATProto app can be used with any PDS — so `certified.one` is not a requirement for apps built on Hypercerts, just the production ePDS to use when you specifically want to offer Sign in with Certified (e.g. to get email/OTP login via the ePDS extension).

## Staging: `dev.certified.app`

`dev.certified.app` is a staging ePDS. It's the final testing ground for ePDS changes before they are promoted to the production instance at `certified.one`.

- Any changes to `dev.certified.app` are announced ahead of time.
- It can generally be treated as a fairly stable service.
- However, by design it is **not guaranteed** to be as stable as production.

**Recommendation:** most developers building apps that offer "Sign in with Certified" should point their staging environments at `dev.certified.app`. It gives you an environment that closely tracks what will soon be in production, without exposing your users to an instance that may change without warning. (Apps that don't use Certified for sign-in don't need to point at any Certified-operated ePDS — any ATProto PDS will do.)

## Test instances: `*.test.certified.app`

Anything under the `test.certified.app` domain is **strictly for use in testing**. These instances run the latest bleeding-edge ePDS code and are not suitable for production or even staging workloads.

These instances are mainly used by the Hypercerts core development team. However, because development happens in public, anyone else who wants to run against the latest bleeding-edge code is welcome to test on them as well — **as long as you understand the risks of doing so** (data may be wiped, services may be unavailable, breaking changes may ship without notice, etc.).

### Current test instances

| Instance | Status | ePDS version | PDS version |
|---|---|---|---|
| `epds1.test.certified.app` | Active | see [`/health`](https://epds1.test.certified.app/health) | see [`/xrpc/_health`](https://epds1.test.certified.app/xrpc/_health) |
| `pds1.test.certified.app` | Active — currently used as the backing PDS for the hosted [CGS](/architecture/certified-group-service) | n/a (vanilla PDS) | see [`/xrpc/_health`](https://pds1.test.certified.app/xrpc/_health) |
| `pds-eu-west4.test.certified.app` | Deprecated — do not use for new work | n/a (vanilla PDS) | see [`/xrpc/_health`](https://pds-eu-west4.test.certified.app/xrpc/_health) |

### Checking the running version

There are two version endpoints to be aware of:

**ePDS version (`/health`)** — ePDS instances that have been upgraded to the versioned release ([ePDS PR #74](https://github.com/hypercerts-org/ePDS/pull/74) and later) expose a `/health` endpoint that returns the ePDS version as JSON, for example:

```json
{"status":"ok","service":"epds","version":"<semver>+<commit>"}
```

Older instances that pre-date this feature are marked as "old / unversioned" in the tables above. For what changed in each ePDS release, see the [ePDS release notes on GitHub](https://github.com/hypercerts-org/ePDS/releases).

**Underlying PDS version (`/xrpc/_health`)** — every AT Protocol PDS (including ePDS instances) exposes `/xrpc/_health`, which returns the upstream PDS version:

```json
{"version":"<version>"}
```

This is a standard AT Protocol endpoint and works on vanilla PDS instances out of the box. On ePDS instances, the version may currently be missing from the response due to a known bug (imminent fix); if you see an empty `{}` response, that's why.

### Naming scheme

Hostnames under `test.certified.app` correspond to individual test ePDS instances. New instances may be spun up and old ones retired as the core team's testing needs evolve, so treat the list above as a point-in-time snapshot rather than a stable contract. If you need to run against a specific test instance, confirm with the Hypercerts core team that it is still active.

## Auth services

Each ePDS is paired with an auth service (e.g. `auth.certified.one`, `auth.dev.certified.app`) that handles the email/OTP step of the [ePDS flow](/architecture/epds). You don't talk to it directly — the PDS routes users through it during OAuth — but it shows up in status pages and logs alongside the PDS itself.

## Status pages

Operational status for the Certified-operated ePDSs is tracked on two [Instatus](https://instatus.com/) pages:

| Page | Covers |
|---|---|
| [certified.instatus.com](https://certified.instatus.com/) | Production and staging: `certified.one`, `dev.certified.app`, their respective auth services, and the `certified.app` frontend |
| [test-certified.instatus.com](https://test-certified.instatus.com/) | Test ePDS instances (currently `epds1.test.certified.app` and its auth service) |

## Group-governed PDSs

If a single repository needs to be co-managed by multiple identities with different permission levels, the [Certified Group Service](/architecture/certified-group-service) (CGS) sits in front of a PDS and adds role-based access control on top. Certified operates a hosted CGS instance, and CGS can also be self-hosted; either way it can proxy to any AT Protocol PDS, including the Certified-operated PDSs above.

{% callout type="note" %}
At the moment, groups created through the hosted CGS (e.g. when you create a group on [`certified.app`](https://certified.app)) land on a **test PDS**, not on production. Treat any group data accordingly — the same test-instance caveats apply as for any other `*.test.certified.app` PDS.
{% /callout %}

## Which one should I use?

| Scenario | Use |
|---|---|
| Signing up / managing your identity as an end user | [`certified.app`](https://certified.app) (frontend for `certified.one`) |
| Production "Sign in with Certified" in your app | `certified.one` |
| Staging "Sign in with Certified" in your app | `dev.certified.app` |
| Contributing to Hypercerts core / testing bleeding-edge ePDS changes | An active `*.test.certified.app` instance (currently `epds1.test.certified.app`) |
