---
title: Introduction to Lexicons
description: Understand lexicons — the shared schemas that define record types in the Hypercerts Protocol.
---

# Introduction to Lexicons

## What is a lexicon?

An ATProto lexicon is essentially a schema or template that defines what data can be stored and how it should be structured. Think of it like a form with specific fields - it tells you what information is required, what's optional, and what format each piece of data should follow.

## Lexicon Categories

All lexicons follow the principle that "everything is a claim" - whether it's a hypercert, a measurement, or an attachment, each represents a verifiable assertion stored on the ATProto network. This creates a composable system where claims can reference and build upon each other while maintaining clear data structures and relationships.

[**Certified Lexicons**](certified-lexicons/) provide foundational building blocks that can be shared across multiple protocols. These include common data types, standardized location references, profiles, badges, and other universal concepts that extend beyond hypercerts alone.

[**Hypercerts Lexicons**](hypercerts-lexicons/) contain the core claim types specific to impact tracking. These lexicons define how to structure and relate different types of impact claims. The central record is the activity claim (the hypercert itself), which lives in the `org.hypercerts.claim` namespace. Supporting records like measurements, attachments, evaluations, and acknowledgements live in the `org.hypercerts.context` namespace, enabling anyone to add context to existing claims.

## Validate records before writing

The Hypercerts lexicons are published as the `@hypercerts-org/lexicon` package. Use it in TypeScript or JavaScript applications to import schema constants and validate records before creating or updating them on a PDS.

```bash
pnpm add @hypercerts-org/lexicon
```

```typescript
import {
  ACTIVITY_NSID,
  OrgHypercertsClaimActivity,
} from "@hypercerts-org/lexicon";

const record = {
  $type: ACTIVITY_NSID,
  title: "Hypercerts documentation: lexicon validation guidance",
  shortDescription: "Added docs for validating Hypercerts records before writes.",
  workScope: {
    $type: "org.hypercerts.claim.activity#workScopeString",
    scope: "Documentation",
  },
  startDate: "2026-06-02T00:00:00Z",
  endDate: "2026-06-02T23:59:59Z",
  createdAt: new Date().toISOString(),
};

const result = OrgHypercertsClaimActivity.validateRecord(record);
if (!result.success) {
  throw new Error(`Invalid ${ACTIVITY_NSID} record: ${String(result.error)}`);
}

await agent.com.atproto.repo.createRecord({
  repo: agent.did,
  collection: ACTIVITY_NSID,
  record,
  validate: true,
});
```

Use the same validation step before `putRecord` when updating an existing record. A PDS can accept records that downstream indexers later ignore, so validating before writes prevents malformed records from entering your repository.
