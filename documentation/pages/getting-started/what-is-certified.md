---
title: What is Certified?
description: Certified is the identity provider for the Hypercerts ecosystem.
---

# What is Certified?

[Certified](https://certified.app) is the identity provider for the Hypercerts ecosystem. When you create a Certified account, you get two things: an AT Protocol identity (a DID — Decentralized Identifier) and a Personal Data Server (PDS) where your hypercerts, evaluations, and other records are stored.

Your Certified identity works across every application built on the Hypercerts Protocol. Think of it as your passport to the world of impact certificates.

## Why Certified exists

The Hypercerts Protocol is built on AT Protocol — the same decentralized data layer that powers Bluesky. But most Hypercerts users are not Bluesky users. They are researchers, land stewards, open-source maintainers, funders, and evaluators. Asking them to "sign up for Bluesky" to use a funding platform would be confusing and jarring.

Certified solves this. Users create an account at [certified.app](https://certified.app) and immediately have an identity that works across the ecosystem — no knowledge of Bluesky, ATProto, or decentralized protocols required.

## What you get

- **A DID (Decentralized Identifier)** — Your permanent, portable identity. It stays the same even if you change servers or handles.
- **A Personal Data Server** — Where your hypercerts, evaluations, and other records are stored. You own this data.
- **Ecosystem access** — Any application built on the Hypercerts Protocol recognizes your Certified identity.
- **Data portability** — You can migrate your data to another PDS at any time. No lock-in.

## Already have a Bluesky account?

{% callout type="note" %}
If you already have a Bluesky account, you don't need a Certified account. Your Bluesky identity is a valid AT Protocol identity and works with all Hypercerts applications. Log in with your Bluesky handle (e.g., `alice.bsky.social`) — everything just works.
{% /callout %}

## The app.certified namespace

You'll see `app.certified.*` in some lexicon names — for example, [`app.certified.location`](/lexicons/general-lexicons/location) defines how geographic locations are represented. These are general-purpose schemas available to any application on AT Protocol, not just Hypercerts.
