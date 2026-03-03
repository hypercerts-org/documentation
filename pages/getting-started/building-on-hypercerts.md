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
- Crowdfunding campaigns where backers receive fractional rights to impact claims
- Quadratic funding mechanisms that allocate matching pools based on community support

### Evaluation Tools

Build services that help domain experts create structured, verifiable evaluations:

- Peer review systems for scientific contributions
- Impact assessment frameworks for climate projects
- Code quality analysis for open source software
- Educational outcome measurement for learning programs

```javascript
// Example: Create an evaluation
const evaluation = await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.evaluation",
  record: {
    subject: { uri: claimUri, cid: claimCid },
    evaluators: [evaluatorDid],
    summary: "Scientific rigor and reproducibility assessment",
    $type: "org.hypercerts.claim.evaluation",
    createdAt: new Date().toISOString(),
  },
});
```

### Dashboards & Explorers

Aggregate and display hypercerts across the ecosystem:

- Portfolio views showing all claims by a contributor
- Leaderboards ranking projects by evaluation scores
- Impact maps visualizing geographic distribution of work
- Timeline views tracking contribution history

Read-only integrations require only an indexer connection — no PDS needed.

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

1. **Subscribe to the relay firehose** for hypercert lexicon records
2. **Parse and validate** incoming records against lexicon schemas
3. **Store in a queryable database** (PostgreSQL, MongoDB, etc.)
4. **Expose an API** for your application to query

For relay subscription details, see the [ATProto documentation](https://atproto.com/specs/event-stream).

## Interoperability Principles

The ecosystem works because platforms follow shared conventions:

### Use Standard Lexicons

Use the standard `org.hypercerts.*` and `app.certified.*` lexicons for data that fits them — this is what makes your data interoperable across the ecosystem. Default indexers subscribe to these namespaces, so records using standard lexicons are automatically discoverable. If you need additional fields to extend the standard lexicons, create a sidecar record that references the standard record via a strong reference. Since sidecars are likely application-specific, default indexers won't see them unless explicitly configured to index your namespace.

You're also free to create new lexicons for use cases that don't fit the original schemas — ATProto is designed for this.

### Use Strong References

Always include CID when referencing records. The CID is a content hash of the record at the time you referenced it — if the record is later modified, the CID won't match, making tampering detectable.

```javascript
// Good: includes CID
{ uri: "at://did:plc:abc/org.hypercerts.claim.activity/123", cid: "bafyreiabc..." }

// Bad: URI only (no tamper-evidence)
{ uri: "at://did:plc:abc/org.hypercerts.claim.activity/123" }
```

## Next Steps

- Read the [Lexicons reference](/lexicons/introduction-to-lexicons) to understand the data model
- Explore the [Architecture overview](/architecture/overview) to see how components fit together
- Try the [Quickstart](/getting-started/quickstart) to create your first hypercert
- Join the community to discuss your integration plans
