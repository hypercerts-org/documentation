---
title: Introduction to Lexicons
description: What Lexicons are, how the Hypercerts and Certified namespaces divide the records, and how the reference pages are organized.
---

# Introduction to Lexicons

## What is a lexicon?

A Lexicon is an AT Protocol schema. It tells software what kind of record it is reading, which fields to expect, and which constraints apply, such as required fields, maximum lengths, and accepted formats. Each Lexicon has an NSID (namespaced identifier), such as `org.hypercerts.claim.activity`, that records carry in their `$type` field.

A schema describes the shape of one record. The Hypercerts Protocol is the lexicons together with guidance on how the records are used together: which record points to which, and conventions the schema alone can't express. For example, a project is a [collection](/lexicons/hypercerts-lexicons/collection) with `type` set to `project`, and an evaluation links to the exact version of the activity it assessed. The reference pages describe both.

## Two namespaces

[**Hypercerts Lexicons**](/lexicons/hypercerts-lexicons) (`org.hypercerts.*`) describe work and the information around it: activity claims, contributors, collections, evidence, evaluations, and funding receipts.

[**Certified Lexicons**](/lexicons/certified-lexicons) (`app.certified.*`) provide shared records for identity and recognition: profiles, organizations, locations, badges, follows, and signatures. Any application can use them.

The [Lexicon inventory](/reference/lexicon-inventory) lists every schema in the current release.

## How the reference pages are organized

Each record type has a page with the same sections:

- **Overview** and **How it's used**: what the record is for, who publishes it, and how it connects to other records. For the concepts behind them, see the [Guide](/guide).
- **Schema**: generated from the released `@hypercerts-org/lexicon` package, with the record key, required and optional properties, types, constraints, and nested definitions.
- **Example**: a realistic record that validates against the schema.
- **Rules and best practices**: conventions that the schema can't enforce.
- **Related**: the records and Guide pages it connects to.

## Validate records before writing

The Hypercerts lexicons are published as the `@hypercerts-org/lexicon` package. It exports a schema and TypeScript type for every lexicon, for use with the [`@atproto/lex`](https://www.npmjs.com/package/@atproto/lex) client. Use them to type records and validate them before creating or updating them on a PDS.

```bash
pnpm add @hypercerts-org/lexicon @atproto/lex
```

```typescript
import { Client, currentDatetimeString } from "@atproto/lex";
import { org } from "@hypercerts-org/lexicon";

const client = new Client(session); // an authenticated OAuth session
const activity = org.hypercerts.claim.activity;

// validateRequest checks the record against the schema before it is sent.
await client.create(
  activity,
  {
    title: "Hypercerts documentation: lexicon validation guidance",
    shortDescription:
      "Added docs for validating Hypercerts records before writes.",
    workScope: {
      $type: "org.hypercerts.claim.activity#workScopeString",
      scope: "Documentation",
    },
    startDate: "2026-06-02T00:00:00Z",
    endDate: "2026-06-02T23:59:59Z",
    createdAt: currentDatetimeString(),
  },
  { validateRequest: true },
);

// Records from elsewhere (a form, another API) must include their $type.
const result = activity.$safeParse(input);
if (!result.success) {
  throw new Error(`Invalid ${activity.$type} record: ${String(result.error)}`);
}
```

`client.create` sets the record's `$type` from the schema. Pass the same `validateRequest` option to `client.put` when updating an existing record. A PDS can accept records that downstream indexers later ignore, so validating before writes prevents malformed records from entering your repository.

Version 2.0 of the package introduced these schemas. Code written for 1.x can keep its API by importing from `@hypercerts-org/lexicon/legacy` instead; the package README's [migration guide](https://github.com/hypercerts-org/hypercerts-lexicon#migrating-from-1x) shows how the old names map to the new ones.
