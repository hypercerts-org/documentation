---
title: Client Integration
description: Build applications that create, store, discover, and display Hypercerts records.
---

# Client Integration

This section shows how to build an application on Hypercerts: signing users in, writing records, and reading them back.

{% callout type="info" title="Start with the API reference" %}
The Hypercerts API is available for production reads. Use the [XRPC reference](/reference/xrpc-api) and its endpoint explorer to query indexed records. The SDK and additional step-by-step integration guides are still in development; the pages below cover the integration patterns available today.
{% /callout %}

## The integration path

An application built on Hypercerts typically does the following:

1. Signs the user in with their AT Protocol account and asks for the permissions it needs.
2. Creates records with the Hypercerts SDK.
3. Stores them in the user's Personal Data Server (PDS), the server that hosts the account's records.
4. Reads and discovers records through the Hypercerts API.
5. Uses labels and feeds where they help.
6. Displays connected records, showing who published each one.

Step 2 can use the released Lexicon package and direct AT Protocol writes; the SDK remains under development. Step 4 can use the released [Hypercerts API](/reference/xrpc-api). See [Services and tooling](/reference/services) for running service endpoints.

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
