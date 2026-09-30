---
title: Entryway
description: The service that will handle sign-in and account hosting for Certified accounts. Under development.
---

# Entryway

{% callout type="info" title="Under development" %}
The entryway is not released yet. This page describes its role and what applications use today. It will be filled in when the entryway is released.
{% /callout %}

The entryway is the service that handles signing users in and hosting their Certified accounts. It will replace ePDS, the sign-in layer that Certified accounts use today.

## What it does

When someone signs in with a Certified account, the entryway is the part of the Hypercerts stack they deal with first. It authenticates the user and gives applications access to the account through AT Protocol OAuth, the protocol an application uses to get permission to act on a user's behalf without seeing their credentials.

The account's records live in a repository on a Personal Data Server (PDS), the server that hosts an account's records and identity. Hypercerts records live in many PDSs, including the [Certified PDSs](/reference/services/certified-pdss) the Foundation hosts. Around them, the [Certified Group Service](/reference/services/certified-group-service) lets groups co-manage a repository, a relay and Jetstream collect changes from PDSs so the [indexer](/reference/services/indexer) can serve the Hypercerts API, [labelers](/reference/services/labelers) attach labels to records, and the [feed service](/reference/services/feed-service) serves feeds.

## How it works

Today, "Sign in with Certified" runs on [ePDS](https://github.com/hypercerts-org/ePDS) on the Certified PDSs. ePDS is an extended PDS: a standard AT Protocol PDS with a sign-in layer that adds email and one-time-code login. It does not change the AT Protocol OAuth flow that applications use. From your application's side, you run a normal OAuth flow against the PDS; ePDS collects the user's email, sends a code, and then returns a standard authorization code to your app.

The entryway takes over this role. Details of how it works will be added here when it is released.

## Using it from your application

Until the entryway is released, integrate with "Sign in with Certified" by running AT Protocol OAuth against the Certified PDS:

- Use any AT Protocol OAuth client library, for example [`@atproto/oauth-client-node`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node).
- If your app already asks for the user's email, add `login_hint=<email>` to the authorization URL so the user goes straight to the code input.
- If your app has a plain sign-in button, redirect the user normally and let ePDS ask for the email.

For the full flow, including the authorization request, token exchange, and client metadata, see the [ePDS tutorial](https://github.com/hypercerts-org/ePDS/blob/main/docs/tutorial.md) and the [ePDS architecture document](https://github.com/hypercerts-org/ePDS/blob/main/docs/architecture.md). For which PDS to point at in production and staging, see [Certified PDSs](/reference/services/certified-pdss) and [Running services](/reference/services#running-services).

## Status

Under development. See [Entryway releases](/changes/entryway) for release status.

## Running your own

Operating your own entryway is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services)
- [Certified PDSs](/reference/services/certified-pdss)
- [Account & Identity Setup](/architecture/account-and-identity)
- [Certified identity](/core-concepts/certified-identity)
- [Entryway releases](/changes/entryway)
