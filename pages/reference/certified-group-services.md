---
title: Certified Group Services
description: Overview of the Certified-operated CGS (Certified Group Service) instances (production, staging, and test) and which one to use in which scenario.
---

# Certified Group Services

Certified operates several [CGS](/architecture/certified-group-service) instances across production, staging, and test environments. This page explains what each one is for and which you should use in which scenario.

CGS is also **self-hostable per operator** — you don't have to use a Certified-operated instance. Anyone can run their own CGS against any AT Protocol PDS. The `GROUP_PDS_URL` setting configures where newly *registered* groups get their accounts; *imported* groups keep whatever PDS already hosts them, so one instance can span multiple PDSs (see [Group lifecycle](/architecture/certified-group-service#group-lifecycle)). The guidance below applies when you specifically want to use a Certified-hosted group service (for example, the "create a group" flow on [`certified.app`](https://certified.app)).

{% callout type="note" %}
Groups *registered* through the hosted CGS currently get their PDS accounts created on a **test PDS**, not production — the same test-instance caveats apply as for any other `*.test.certified.app` PDS. See [Certified PDSs](/reference/certified-pdss) for details.
{% /callout %}

## Quick reference

| Service | Environment | Who it's for | CGS version |
|---|---|---|---|
| [`groups.certified.app`](https://groups.certified.app) | Production CGS | Production group-governed repositories | see [`/health`](https://groups.certified.app/health) |
| [`dev.groups.certified.app`](https://dev.groups.certified.app) | Staging CGS | Staging group governance for apps under development | see [`/health`](https://dev.groups.certified.app/health) |
| [`test.groups.certified.app`](https://test.groups.certified.app) | Test CGS | Hypercerts core development; bleeding-edge testing | see [`/health`](https://test.groups.certified.app/health) |

## Production: `groups.certified.app`

`groups.certified.app` is the production CGS. It's the instance that production applications should point at when they want group-governed repositories with role-based access control.

By the nature of AT Protocol's decentralized approach, CGS is not a requirement for apps built on Hypercerts — it's the production group service to use when you specifically want co-governed repositories.

## Staging: `dev.groups.certified.app`

`dev.groups.certified.app` is a staging CGS. It's the final testing ground for CGS changes before they are promoted to the production instance at `groups.certified.app`.

- Any changes to `dev.groups.certified.app` are announced ahead of time.
- It can generally be treated as a fairly stable service.
- However, by design it is **not guaranteed** to be as stable as production.

**Recommendation:** most developers building apps that use group governance should point their staging environments at `dev.groups.certified.app`. It gives you an environment that closely tracks what will soon be in production, without exposing your users to an instance that may change without warning.

## Test: `test.groups.certified.app`

`test.groups.certified.app` is **strictly for use in testing**. It runs the latest bleeding-edge CGS code and is not suitable for production or even staging workloads.

It's mainly used by the Hypercerts core development team. However, because development happens in public, anyone else who wants to run against the latest bleeding-edge code is welcome to test on it as well — **as long as you understand the risks of doing so** (data may be wiped, services may be unavailable, breaking changes may ship without notice, etc.).

## Checking the running version

Like the [ePDS](/architecture/epds), CGS exposes its version on two health endpoints:

**`/health`** — returns the CGS version as JSON, for example:

```json
{"status":"ok","service":"group-service","version":"<semver>+<commit>"}
```

**`/xrpc/_health`** — returns the same payload. Unlike a plain AT Protocol PDS — where `/xrpc/_health` reports the upstream PDS version — CGS is its own service and is not a PDS, so both endpoints report the CGS version (`service: group-service`), not the version of the [backing PDS](/reference/certified-pdss) it proxies to. To check the backing PDS version, query that PDS's own `/xrpc/_health` directly.

All three instances — production ([`groups.certified.app`](https://groups.certified.app/health)), staging ([`dev.groups.certified.app`](https://dev.groups.certified.app/health)), and test ([`test.groups.certified.app`](https://test.groups.certified.app/health)) — report the version on these endpoints.

## Status pages

CGS instances are tracked on the same [Instatus](https://instatus.com/) pages as the rest of the Certified-operated infrastructure:

| Page | Covers |
|---|---|
| [`certified.instatus.com`](https://certified.instatus.com/) | Production and staging services |
| [`test-certified.instatus.com`](https://test-certified.instatus.com/) | Test services |

## Which one should I use?

| Scenario | Use |
|---|---|
| Production group-governed repositories in your app | `groups.certified.app` |
| Staging group governance in your app | `dev.groups.certified.app` |
| Contributing to Hypercerts core / testing bleeding-edge CGS changes | `test.groups.certified.app` |

## Related pages

- [Certified Group Service (CGS)](/architecture/certified-group-service) — how CGS works
- [Certified PDSs](/reference/certified-pdss) — the PDS instances CGS proxies to
- [Certified Services](/reference/certified-services)
