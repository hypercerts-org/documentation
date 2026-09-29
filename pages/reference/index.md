---
title: Reference
description: Exact schemas, interfaces, services, environments, and implementation sources for the Hypercerts Protocol.
---

# Reference

The Reference contains exact, source-backed contracts. Use the [Guide](/guide) when you need the meaning of a concept or the common convention around it.

{% card-grid %}
{% card-link title="Lexicons" href="/lexicons/introduction-to-lexicons" %}
Browse Hypercerts and Certified record schemas and shared definitions.
{% /card-link %}
{% card-link title="Lexicon inventory" href="/reference/lexicon-inventory" %}
See every Hypercerts and Certified schema released in package version 1.4.0 and the current reference coverage.
{% /card-link %}
{% card-link title="Architecture" href="/architecture/overview" %}
Understand how PDSs, relays, APIs, indexers, and supporting services connect.
{% /card-link %}
{% card-link title="Services" href="/reference/certified-services" %}
Find current environments, endpoints, service identities, and status pages.
{% /card-link %}
{% card-link title="Lexicon releases" href="/reference/releases" %}
Read the source-backed Lexicon package changelog.
{% /card-link %}
{% /card-grid %}

## API and SDK

The XRPC API and SDK reference will be added from their canonical implementation sources as those contracts stabilize. Method pages must identify authentication, inputs, outputs, failure behavior, service version, and source schema. This documentation does not infer API methods from record Lexicons.

## Imported changelogs

Component changelogs are imported from their owning repositories during the documentation build:

| Source | Owning repository | Local route |
|---|---|---|
| Hypercerts Lexicon changelog | `hypercerts-org/hypercerts-lexicon` | [Lexicon releases](/reference/releases) |
| Certified Group Service changelog | `hypercerts-org/certified-group-service` | [CGS releases](/changes/cgs) |
| Hypercerts Relay changelog | `hypercerts-org/hypercerts-relay` | [Relay releases](/changes/relay) |
| Hypercerts Feed Service changelog | `hypercerts-org/hypercerts-feed-service` | [Feed Service releases](/changes/feed-service) |

These imports follow each repository's `main` branch. [Changes](/changes) combines the protocol release history with the published component versions. All other Reference pages are maintained in the documentation repository.

Detailed API reference is not yet available for the SDK, Hypercerts XRPC API, Certified Group Service, Hypercerts Feed Service, labelers, or a versioned generated Lexicon field reference.

## Services and tooling

- [Certified Group Service](/architecture/certified-group-service)
- [Hypercerts Feed Service](/tools/hypercerts-feed-service)
- [Labelers](/tools/labelers)
- [Hypercerts Agent Skills](/tools/hypercerts-agent-skills)
