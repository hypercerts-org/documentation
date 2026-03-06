---
title: Agent Endpoints
description: Machine-readable reference for AI agents and developers building on hypercerts.
---

# Agent Endpoints

If you're building with hypercerts — creating records, querying the network, or integrating into an existing platform — point your agent or browser at:

```bash
curl https://www.hyperscan.dev/agents
```

The endpoint returns a self-describing markdown document with everything an agent needs to build: lexicon schemas, step-by-step write guides, example payloads, and live network data. It's also useful for developers debugging or fact-checking against the latest schemas.

From there you can drill into specific resources:

```bash
# Check a specific lexicon schema
curl https://www.hyperscan.dev/agents/lexicon/org.hypercerts.claim.activity

# Get a step-by-step guide for creating a hypercert
curl https://www.hyperscan.dev/agents/guides/create-hypercert

# See current network stats
curl https://www.hyperscan.dev/agents/stats
```

All responses are `text/markdown` — no HTML parsing needed. It's a regular HTTP endpoint, so any HTTP client, `fetch` call, or browser works.
