---
title: Client Integration
description: Build applications that create, store, discover, and display Hypercerts records.
---

# Client Integration

This section shows how to build an application on Hypercerts: signing users in, writing records, and reading them back.

{% callout type="info" title="More is on the way" %}
We are actively working on new versions of the Hypercerts API and SDK. As they are released, this section will grow with step-by-step guides for reading and writing records, integrating with the Feed Service, and connecting your application to certified.app. Until then, the pages below cover what you can build with today.
{% /callout %}

## The integration path

An application built on Hypercerts typically does the following:

1. Signs the user in with their AT Protocol account and asks for the permissions it needs.
2. Creates records with the Hypercerts SDK.
3. Stores them in the user's Personal Data Server (PDS), the server that hosts the account's records.
4. Reads and discovers records through the Hypercerts API.
5. Uses labels and feeds where they help.
6. Displays connected records, showing who published each one.

Steps 2 and 4 depend on the SDK and API under development. See [SDK](/reference/sdk) and [XRPC API](/reference/xrpc-api) for their status, and [Services and tooling](/reference/services) for the services that are running today.

## Available today

{% card-grid %}
{% card-link title="Building on Hypercerts" href="/getting-started/building-on-hypercerts" %}
Review application patterns and interoperability principles.
{% /card-link %}
{% card-link title="Account & Identity Setup" href="/architecture/account-and-identity" %}
Understand accounts, OAuth, handles, and organization-managed records.
{% /card-link %}
{% card-link title="Testing & Deployment" href="/getting-started/testing-and-deployment" %}
Validate records, test safely, and prepare an integration for production.
{% /card-link %}
{% /card-grid %}

Use the [Reference](/reference) for Lexicons and service details.
