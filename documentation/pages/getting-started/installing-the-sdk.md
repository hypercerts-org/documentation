---
title: Installing the SDK
---

# Installing the SDK

This page covers how to set up your development environment for working with the Hypercerts protocol.

## Prerequisites

Before getting started, ensure you have:

- **Node.js** (v18 or later)
- **npm** or **yarn** package manager
- An AT Protocol account (e.g., a Bluesky account)

## Installation

Install the hypercerts SDK via npm:

```
npm install @hypercerts/sdk
```

Or with yarn:

```
yarn add @hypercerts/sdk
```

## Configuration

After installation, configure the SDK with your ATProto credentials:

```
import { HypercertsClient } from "@hypercerts/sdk";

const client = new HypercertsClient({
  service: "https://bsky.social",
  // Additional configuration options
});
```

## Next Steps

- Learn about the [lexicon schemas](/lexicons/introduction-to-lexicons) that define hypercert data structures
- Explore the [work scope](/deep-dive-the-work-scope) concept in depth