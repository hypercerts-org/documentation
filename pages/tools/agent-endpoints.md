---
title: Agent Endpoints
description: Machine-readable reference for AI agents and developers building on hypercerts.
---

# Agent Endpoints

If you're building with hypercerts and need to check something — latest lexicon schemas, field names, how funding works, example code — point your agent or browser at:

```bash
curl https://www.hyperscan.dev/agents
```

The endpoint returns a self-describing markdown document listing all available endpoints, write guides, lexicon schemas, and examples. It's designed for AI agents and scripts but works just as well for developers debugging or fact-checking against the latest schemas.

From there you can drill into specific resources:

```bash
# Check a specific lexicon schema
curl https://www.hyperscan.dev/agents/lexicon/org.hypercerts.claim.activity

# Get a step-by-step guide for creating a hypercert
curl https://www.hyperscan.dev/agents/guides/create-hypercert

# See current network stats
curl https://www.hyperscan.dev/agents/stats
```

All responses are `text/markdown` — no HTML parsing needed.
