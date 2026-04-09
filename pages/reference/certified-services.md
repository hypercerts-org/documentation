---
title: Certified services
description: Overview of the Certified-operated ePDS instances (production, staging, and test) and which one to use in which scenario.
---

# Certified services

Certified operates several [ePDS](/architecture/epds) instances across production, staging, and test environments. This page explains what each one is for and which you should use in which scenario.

## Quick reference

| Service | Environment | Who it's for |
|---|---|---|
| [`certified.one`](https://certified.one) | Production ePDS | Production "Sign in with Certified" |
| [`dev.certified.app`](https://dev.certified.app) | Staging ePDS | Staging "Sign in with Certified" for apps under development |
| `*.test.certified.app` | Test ePDS instances | Hypercerts core development; bleeding-edge testing |

Note the distinction between `certified.one` (the production ePDS backend) and [`certified.app`](https://certified.app) (the frontend app for managing `certified.one` identities and other AT Protocol identities).

## Production: `certified.one`

`certified.one` **is** the production ePDS. It's the user-facing service behind the Certified frontend at [`certified.app`](https://certified.app), and the endpoint that production applications should point at when they implement "Sign in with Certified".

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

| Instance | Status |
|---|---|
| `epds1.test.certified.app` | Active |
| `pds-eu-west4.test.certified.app` | Deprecated — do not use for new work |

### Naming scheme

Hostnames under `test.certified.app` correspond to individual test ePDS instances. New instances may be spun up and old ones retired as the core team's testing needs evolve, so treat the list above as a point-in-time snapshot rather than a stable contract. If you need to run against a specific test instance, confirm with the Hypercerts core team that it is still active.

## Which one should I use?

| Scenario | Use |
|---|---|
| Signing up as an end user | [`certified.app`](https://certified.app) (frontend for `certified.one`) |
| Production "Sign in with Certified" in your app | `certified.one` |
| Staging "Sign in with Certified" in your app | `dev.certified.app` |
| Contributing to Hypercerts core / testing bleeding-edge ePDS changes | An active `*.test.certified.app` instance (currently `epds1.test.certified.app`) |
| Building an ATProto app that doesn't need Sign in with Certified | Any ATProto PDS — none of the above are required |
