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

```javascript
// Example: Query hypercerts for a funding round
const claims = await indexer.query({
  collection: 'at://did:plc:round123/cert.collection/round-1',
  status: 'completed'
});
```

### Evaluation Tools

Build services that help domain experts create structured, verifiable evaluations:

- Peer review systems for scientific contributions
- Impact assessment frameworks for climate projects
- Code quality analysis for open source software
- Educational outcome measurement for learning programs

```javascript
// Example: Create an evaluation
await agent.cert.evaluation.create({
  repo: userDid,
  record: {
    subject: { uri: claimUri, cid: claimCid },
    criteria: 'Scientific rigor and reproducibility',
    score: { value: 8.5, scale: 10 },
    evaluator: evaluatorDid
  }
});
```

### Dashboards & Explorers

Aggregate and display hypercerts across the ecosystem:

- Portfolio views showing all claims by a contributor
- Leaderboards ranking projects by evaluation scores
- Impact maps visualizing geographic distribution of work
- Timeline views tracking contribution history

Read-only integrations require only an indexer connection—no PDS needed.

### Impact Portfolios

Help funders track their investments:

- Aggregate all hypercerts a funder has supported
- Monitor evaluation updates for funded work
- Calculate portfolio-level impact metrics
- Generate reports for stakeholders

### Automated Agents

Build AI systems that participate in the ecosystem:

- Measurement bots that extract metrics from evidence
- Consistency checkers that flag suspicious claims
- Evaluation assistants that help experts assess work
- Discovery agents that match funders with relevant projects

## Integration Patterns

### Read-Only Integration

Query an indexer to display hypercerts without writing data.

**When to use:** Dashboards, explorers, analytics tools that only need to read existing data.

```javascript
// Subscribe to new claims
indexer.subscribe('cert.activityClaim', (claim) => {
  dashboard.addClaim(claim);
});

// Query by criteria
const claims = await indexer.query({
  workScope: { contains: 'climate' },
  createdAfter: '2025-01-01'
});
```

No authentication required. Simplest integration path.

### Write via User PDS

Authenticate users via OAuth and write records to their PDS on their behalf.

**When to use:** Tools where users create their own hypercerts, evaluations, or measurements through your interface.

```javascript
// OAuth flow
const session = await oauthClient.authorize(userDid);
const agent = new Agent(session);

// Write to user's PDS
await agent.cert.activityClaim.create({
  repo: userDid,
  record: {
    workScope: 'Developed open source library',
    impactScope: 'Software developers worldwide',
    // ... other fields
  }
});
```

Records are owned by the user's DID. Your platform acts as an interface.

### Write via Platform SDS

Run your own Shared Data Server and create records under your platform's DID.

**When to use:** Platforms that issue hypercerts on behalf of others, or evaluation services that publish assessments under the platform's authority.

```javascript
// Platform creates claim on behalf of contributor
await platformAgent.cert.activityClaim.create({
  repo: platformDid,
  record: {
    workScope: 'Completed bounty #123',
    contributors: [contributorDid],
    issuedBy: platformDid,
    // ... other fields
  }
});
```

Your platform owns the records. Useful for curated or verified claims.

## Running an Indexer

To query hypercerts efficiently, run your own indexer:

1. **Subscribe to the relay firehose** for hypercert lexicon records (`cert.*`)
2. **Parse and validate** incoming records against lexicon schemas
3. **Store in a queryable database** (PostgreSQL, MongoDB, etc.)
4. **Expose an API** for your application to query

```javascript
// Pseudocode: Firehose subscription
relay.subscribe({
  collections: ['cert.activityClaim', 'cert.evaluation'],
  handler: async (event) => {
    const record = event.record;
    await db.insert('claims', {
      uri: event.uri,
      cid: event.cid,
      did: event.did,
      data: record
    });
  }
});
```

For relay subscription details, see the [ATProto documentation](https://atproto.com/specs/event-stream).

## Interoperability Principles

The ecosystem works because platforms follow shared conventions:

### Use Standard Lexicons

Do not create custom record types for data that fits existing schemas. If you need to extend a lexicon, propose changes to the standard rather than forking.

### Use Strong References

Always include CID when referencing records. This ensures tamper-evidence and allows verification.

```javascript
// Good: includes CID
{ uri: 'at://did:plc:abc/cert.activityClaim/123', cid: 'bafyreiabc...' }

// Bad: URI only (no tamper-evidence)
{ uri: 'at://did:plc:abc/cert.activityClaim/123' }
```

### Respect Data Ownership

Records belong to the DID that created them. Do not modify or delete records you do not own. If you disagree with a claim, create an evaluation or measurement that references it.

### Build for Federation

Do not assume all data lives on one PDS. Your indexer should aggregate from multiple sources. Your queries should work across the entire network.

## Contributing to the Protocol

The Hypercerts Protocol evolves through community contribution.

### Lexicon Evolution

Propose changes to lexicons through the standard process:

1. **Propose:** Open an issue describing the change and use case
2. **Discuss:** Community reviews and refines the proposal
3. **Implement:** Create a pull request with lexicon updates and tests

{% callout type="note" %}
The GitHub repository for lexicon proposals will be available soon. Check the [community page](/community) for updates.
{% /callout %}

### SDK Contributions

The Hypercerts SDK is open source. Contributions welcome:

- Bug fixes and performance improvements
- New helper functions for common operations
- Better TypeScript types and documentation
- Examples and tutorials

### Running a Relay

Help decentralize the network by running a relay node. Relays aggregate events from PDSs and make them available to indexers.

## Next Steps

- Read the [Lexicons reference](/lexicons/introduction-to-lexicons) to understand the data model
- Explore the [Architecture overview](/architecture/overview) to see how components fit together
- Try the [Quickstart](/getting-started/quickstart) to create your first hypercert
- Join the community to discuss your integration plans
