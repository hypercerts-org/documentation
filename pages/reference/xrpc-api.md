---
title: XRPC API
description: Reference for the Hypercerts API, the XRPC interface for reading and discovering Hypercerts records. Under development.
---

# XRPC API

{% callout type="info" title="Under development" %}
The Hypercerts API is being built and has no published release yet. This page will document its queries and procedures once the API is released.
{% /callout %}

The Hypercerts API is the XRPC interface applications use to read and discover Hypercerts records across the network, such as finding a project's activities or the evaluations of an activity. It follows AT Protocol conventions: each method is identified by an NSID and called over HTTP.

Once released, this section will cover each query and procedure: its parameters, output, authentication, errors, and the service version that supports it.

Until then:

- Records can be read directly from each account's repository. [Finding and Reusing Information](/architecture/portability-and-scaling) explains how applications find records across accounts.
- The [Lexicons](/lexicons/introduction-to-lexicons) describe the records the API returns.
- Follow the API's status on [Releases](/releases/api).
