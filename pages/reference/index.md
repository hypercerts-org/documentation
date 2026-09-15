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

## Source-owned documentation

Four detailed documents are currently imported from their owning repositories during the documentation build:

| Source | Owning repository | Local route |
|---|---|---|
| ePDS architecture | `hypercerts-org/ePDS` | [ePDS Architecture](/architecture/epds) |
| ePDS integration tutorial | `hypercerts-org/ePDS` | [Integrate with ePDS](/tutorials/epds) |
| Hyperindex documentation | `gainforest/hyperindex` | [Hyperindex](/tools/hyperindex) |
| Hypercerts Lexicon changelog | `hypercerts-org/hypercerts-lexicon` | [Lexicon releases](/reference/releases) |

The build stores the resolved source commit and content hash. These imports currently follow each repository's `main` branch. Release contracts should prefer immutable package versions, tags, or commits where available.

Canonical external imports are not yet configured for the SDK, Hypercerts XRPC API, Certified Group Service, Hypercerts Feed Service, labelers, or a versioned generated Lexicon field reference. Their local overview pages should not be read as complete API contracts.

## Services and tooling

- [ePDS Architecture](/architecture/epds) and [ePDS integration](/tutorials/epds)
- [Certified Group Service](/architecture/certified-group-service)
- [Hypercerts Feed Service](/tools/hypercerts-feed-service)
- [Labelers](/tools/labelers)
- [Hyperindex](/tools/hyperindex), retained as legacy GraphQL infrastructure
- [Hypercerts Agent Skills](/tools/hypercerts-agent-skills)

Service overview pages can be maintained locally while detailed subpages continue to be imported from each service repository. See the repository maintainer documentation for the source ownership pattern.
