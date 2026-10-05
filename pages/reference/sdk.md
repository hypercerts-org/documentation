---
title: SDK
description: Reference for the Hypercerts SDK, the library for reading and writing Hypercerts records. Under development.
---

# SDK

{% callout type="info" title="Under development" %}
The Hypercerts SDK is being built and has no published release yet. This page will document its exports, types, and supported versions once the SDK is released.
{% /callout %}

The Hypercerts SDK is the library applications use to create, read, and validate Hypercerts records and to call the Hypercerts API, without handling AT Protocol requests directly.

Once released, this section will cover the SDK's exports and types, validation and error handling, and which versions work with which releases of the Lexicons and the API.

Until then:

- The [`@hypercerts-org/lexicon`](https://www.npmjs.com/package/@hypercerts-org/lexicon) package provides the schemas, TypeScript types, and record validation. [Introduction to Lexicons](/lexicons/introduction-to-lexicons) shows how to validate a record before writing it.
- [Client Integration](/client-integration) describes what is available for building today.
- Follow the SDK's status on [Releases](/releases/sdk).
