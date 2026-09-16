---
title: Building on Hypercerts
description: A guide for platforms and tools that want to integrate the Hypercerts Protocol.
---

# {% $markdoc.frontmatter.title %}

The Hypercerts Protocol is designed for third-party platforms, tools, and services to build on.

## Who This Is For

This guide is for:

- **Funding platform developers** building crowdfunding, retroactive funding, or milestone-based payout systems
- **Evaluation service providers** creating tools for domain experts to assess impact
- **Dashboard and explorer builders** aggregating and visualizing hypercert data across the ecosystem
- **Impact portfolio managers** tracking funded contributions and their outcomes
- **AI and automation developers** building agents that create measurements, flag inconsistencies, or assist evaluators

## What You Can Build

### Funding Platforms

Create platforms that use hypercerts to structure contributions and distribute funding. Examples include:

- Retroactive funding rounds where evaluators assess completed work
- Milestone-based grant systems that release funds as work progresses
- Crowdfunding campaigns that connect project information, partner review, and funding receipts
- Quadratic funding mechanisms that allocate matching pools based on community support

### Evaluation Tools

Build services that help domain experts create structured, verifiable evaluations:

- Peer review systems for scientific contributions
- Impact assessment frameworks for climate projects
- Code quality analysis for open source software
- Educational outcome measurement for learning programs

### Dashboards & Explorers

Aggregate and display hypercerts across the ecosystem:

- Portfolio views showing all claims by a contributor
- Leaderboards ranking projects by evaluation scores
- Impact maps visualizing geographic distribution of work
- Timeline views tracking contribution history

Read-only integrations can fetch known source records without an authenticated PDS session. Cross-repository search and backlinks normally require an indexer, whose coverage and API contract must be evaluated separately.

### Impact Portfolios

Help funders track their contributions:

- Aggregate all hypercerts a funder has supported
- Monitor evaluation updates for funded work
- Calculate portfolio-level impact metrics
- Generate reports for stakeholders

### Automated Agents

Build AI systems that participate in the ecosystem:

- Measurement bots that extract metrics from attachments
- Consistency checkers that flag suspicious claims
- Evaluation assistants that help experts assess work
- Discovery agents that match funders with relevant projects

## Running an Indexer

To query hypercerts efficiently, run your own indexer:

1. **Choose a relay or repository ingestion scope** for the Hypercerts and Certified record collections you support
2. **Parse and validate** incoming records against lexicon schemas
3. **Store in a queryable database** (PostgreSQL, MongoDB, etc.)
4. **Expose an API** for your application to query

For relay subscription details, see the [ATProto documentation](https://atproto.com/specs/event-stream).

## Interoperability Principles

The ecosystem works because platforms follow shared conventions:

### Use Standard Lexicons

Use the standard `org.hypercerts.*` and `app.certified.*` Lexicons for data that fits them. This gives other applications a public shape to implement, but discovery still depends on relay and indexer coverage. If you need data outside the standard schemas, create a [sidecar record](https://atproto.com/guides/lexicon-style-guide#design-patterns) in your own namespace and reference the standard subject with the relationship form appropriate to its lifecycle. Indexers must explicitly choose to ingest application-specific namespaces.

You're also free to create new lexicons for use cases that don't fit the original schemas — ATProto is designed for this.

### Use the declared relationship shape

Use a strong reference when the field requires an AT-URI and CID for one content version. Use DID fields for accounts and URI-only record subjects where the Lexicon deliberately models a relationship that survives updates. Do not substitute one reference form for another.

See [Records That Change Over Time](/architecture/data-flow-and-lifecycle) and [Building on Shared Records](/core-concepts/validation-and-interpretation) before publishing an extension.


## Next Steps

- Read the [Lexicons reference](/lexicons/introduction-to-lexicons) to understand the data model
- Explore the [Architecture overview](/architecture/overview) to see how components fit together
- Follow the evolving [Client Integration](/client-integration) path for supported SDK and XRPC guidance
- Join the community to discuss your integration plans
