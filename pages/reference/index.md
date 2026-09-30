---
title: Reference
description: Exact schemas, interfaces, services, environments, and implementation sources for the Hypercerts Protocol.
---

# Reference

The Reference contains exact, source-backed details to look up while you build. Use the [Guide](/guide) when you need the meaning of a concept or the conventions around it.

{% card-grid %}
{% card-link title="Lexicons" href="/lexicons/introduction-to-lexicons" %}
Schemas, examples, and usage conventions for every Hypercerts and Certified record.
{% /card-link %}
{% card-link title="XRPC API" href="/reference/xrpc-api" %}
Queries and procedures of the Hypercerts API. Under development.
{% /card-link %}
{% card-link title="SDK" href="/reference/sdk" %}
Exports, types, and versions of the Hypercerts SDK. Under development.
{% /card-link %}
{% card-link title="Services and tooling" href="/reference/certified-services" %}
Service environments, endpoints, and supporting tools.
{% /card-link %}
{% /card-grid %}

The [Glossary](/reference/glossary) explains terms used across the documentation, and the [FAQ](/reference/faq) answers common questions.

## Imported changelogs

Component changelogs are imported from their owning repositories during the documentation build:

| Source | Owning repository | Local route |
|---|---|---|
| Hypercerts Lexicon changelog | `hypercerts-org/hypercerts-lexicon` | [Lexicon releases](/reference/releases) |
| Certified Group Service changelog | `hypercerts-org/certified-group-service` | [CGS releases](/changes/cgs) |
| Hypercerts Relay changelog | `hypercerts-org/hypercerts-relay` | [Relay releases](/changes/relay) |
| Hypercerts Feed Service changelog | `hypercerts-org/hypercerts-feed-service` | [Feed Service releases](/changes/feed-service) |

These imports follow each repository's `main` branch. [Changes](/changes) combines the protocol release history with the published component versions. All other Reference pages are maintained in the documentation repository.
