---
title: Client Integration
description: Build applications that create, store, discover, and display Hypercerts records.
---

# Client Integration

Client integration documentation is being rebuilt around the Hypercerts SDK and XRPC APIs. The target path is a tested end-to-end flow rather than the previous GraphQL-first quickstart.

## Recommended path

1. Authenticate an AT Protocol account and request the required permissions.
2. Create compatible records with the Hypercerts SDK.
3. Store records in the appropriate Personal Data Server (PDS).
4. Read and discover records through supported XRPC APIs.
5. Apply labels or feeds when the application needs them.
6. Display connected records and preserve authorship and reference state.

Detailed code will be published only after this complete path is tested against supported SDK, API, and service versions.

## Available integration material

{% card-grid %}
{% card-link title="Building on Hypercerts" href="/getting-started/building-on-hypercerts" %}
Review application patterns and interoperability principles.
{% /card-link %}
{% card-link title="Account & Identity Setup" href="/architecture/account-and-identity" %}
Understand accounts, OAuth, handles, and organization-managed records.
{% /card-link %}
{% card-link title="Integrate with ePDS" href="/tutorials/epds" %}
Use the source-backed ePDS authentication walkthrough.
{% /card-link %}
{% card-link title="Testing & Deployment" href="/getting-started/testing-and-deployment" %}
Validate records, test safely, and prepare an integration for production.
{% /card-link %}
{% /card-grid %}

Use the [Reference](/reference) for Lexicons and current service details. Hyperindex remains documented as legacy GraphQL infrastructure, not as the target protocol API.
