---
title: Testing & Deployment
description: Test your integration, understand record constraints, and go live with confidence.
---

# Testing & Deployment

This page covers how to test your Hypercerts integration locally, the validation rules and constraints your records must satisfy, privacy considerations, and a checklist for going live.

---

## Local development

### Set up a test PDS

Run a local PDS to avoid polluting production data. Self-host a test instance using the [ATProto PDS distribution](https://github.com/bluesky-social/pds) and follow the [ATProto self-hosting guide](https://atproto.com/guides/self-hosting).

Point your SDK to the local instance instead of production:

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({
  oauth: {
    clientId: "http://localhost/",
    redirectUri: "http://127.0.0.1:3000/api/auth/callback",
    scope: "atproto",
    jwksUri: "http://127.0.0.1:3000/.well-known/jwks.json",
    jwkPrivate: process.env.ATPROTO_JWK_PRIVATE!,
    developmentMode: true,
  },
  handleResolver: "http://localhost:2583", // Local PDS
});
```

### Use test identities

Create dedicated test accounts — never use production identities for testing. When running a local PDS, you can create accounts with any handle. Each test identity gets its own DID and repository, isolating test data from production.

### Create and verify a test record

Create a record with the SDK, then read it back to confirm it was stored correctly:

```typescript
const session = await sdk.callback(callbackParams);
const repo = sdk.getRepository(session);

// Create a test hypercert
const result = await repo.hypercerts.create({
  title: "Test: reforestation project Q1 2026",
  shortDescription: "Integration test — safe to delete.",
  description: "Test record for verifying SDK integration.",
  workScope: "test",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});

console.log("Created:", result.hypercertUri);
console.log("CID:", result.hypercertCid);
```

The returned `cid` is a content hash. If the record changes, the CID changes — this is how you verify data integrity.

### Clean up test data

Delete test records when you're done to keep your repository clean:

```typescript
await repo.hypercerts.delete(result.hypercertUri);
```

Deletion removes the record from your PDS. Cached copies may persist in indexers temporarily.

---

## Record constraints

When creating or updating records, the PDS validates them against the lexicon schema. Records that violate constraints are rejected.

### Required fields

Every record type has required fields. The PDS returns a validation error if any are missing.

```typescript
// ❌ Rejected — missing required fields
await repo.hypercerts.create({
  title: "Community Garden Project",
});

// ✅ Accepted
await repo.hypercerts.create({
  title: "Community Garden Project",
  shortDescription: "Built a community garden",
  description: "Established a half-acre community garden serving 30 families.",
  workScope: "Urban agriculture",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-06-30T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});
```

### Datetime format

All datetime fields must use ISO 8601 format.

```typescript
// ❌ Rejected
startDate: "01/15/2026"

// ✅ Accepted
startDate: "2026-01-15T00:00:00Z"
```

### Strong references

When one record references another (e.g., an evaluation referencing an activity claim), the reference must include both the AT-URI and the CID. This makes the reference tamper-evident.

```typescript
// ❌ Rejected — missing cid
const evaluation = {
  subject: {
    uri: "at://did:plc:abc123/org.hypercerts.claim.activity/3k7",
  },
};

// ✅ Accepted
const evaluation = {
  subject: {
    uri: "at://did:plc:abc123/org.hypercerts.claim.activity/3k7",
    cid: "bafyreiabc123...",
  },
};
```

If the referenced record is updated after you create the reference, the CID will no longer match. Fetch the latest version to get the current CID:

```typescript
const latest = await repo.hypercerts.get(
  "at://did:plc:abc123/org.hypercerts.claim.activity/3k7"
);

const evaluation = {
  subject: {
    uri: latest.uri,
    cid: latest.cid,
  },
};
```

### String and array limits

Lexicon schemas define maximum lengths for strings (in bytes and Unicode grapheme clusters) and arrays. Check the [lexicon reference](/lexicons/hypercerts-lexicons) for specific limits on each field.

### Blob uploads

Blobs (images, documents, attachment files) are uploaded to the PDS separately from records. Size limits depend on the PDS implementation — check your PDS documentation for exact values.

{% callout type="note" %}
If your attachment files are too large for blob upload, store them externally (e.g., on IPFS or a public URL) and reference them by URI in the attachment record.
{% /callout %}

### Validation error summary

| Error | Cause | Fix |
|-------|-------|-----|
| Missing required field | Record omits a field the lexicon marks as required | Include all required fields — see the [lexicon reference](/lexicons/hypercerts-lexicons) |
| Invalid datetime | Datetime not in ISO 8601 format | Use format: `2026-01-15T00:00:00Z` |
| Invalid strong reference | Reference missing `uri` or `cid` | Include both fields — fetch the latest CID if needed |
| String too long | String exceeds `maxLength` or `maxGraphemes` | Truncate or validate before submission |
| Array too long | Array exceeds `maxLength` | Reduce array size |
| Blob too large | File exceeds PDS size limit | Compress, split, or use external storage with a URI |

---

## Rate limits

PDS implementations impose rate limits on API requests. Specific limits vary by PDS — check your provider's documentation.

If you hit a rate limit, retry with exponential backoff:

```typescript
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.message?.includes("rate limit");
      const hasRetriesLeft = attempt < maxRetries - 1;
      if (isRateLimit && hasRetriesLeft) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Usage
const result = await withRetry(() =>
  repo.hypercerts.create({ /* ... */ })
);
```

---

## Privacy

### Records are public by default

{% callout type="warning" %}
All ATProto records are public. Anyone can read records from any PDS. Never store sensitive personal data in hypercert records.
{% /callout %}

**Include in records:**
- Public work descriptions (e.g., "Planted 500 trees in Borneo")
- Aggregated impact metrics (e.g., "Reduced CO₂ by 50 tons")
- Public contributor identities (DIDs, handles)
- Links to public attachments (URLs, IPFS CIDs)

**Keep off-protocol:**
- Personal contact information (email, phone, address)
- Proprietary methodologies or trade secrets
- Participant consent forms or private agreements
- Raw data containing PII (personally identifiable information)

Store sensitive data in a private database and reference it by ID if needed.

### Deletion and GDPR

You can delete records from your PDS at any time. However:

- Indexers (like Hyperindex) may cache records and take time to update
- Other users may have already fetched and stored copies
- The deletion event itself is visible in your repository history

If you accidentally publish PII, delete the record immediately and contact indexer operators to request cache purging.

---

## Authentication in production

Use OAuth for production applications. OAuth lets users authorize your app without sharing credentials. See the [Quickstart](/getting-started/quickstart) for the SDK OAuth setup and the [ATProto OAuth spec](https://atproto.com/specs/oauth) for the full protocol details.

{% callout type="warning" %}
**Never commit credentials to version control.** Use `.env` files (added to `.gitignore`) for local development and secret management tools (Vercel env vars, AWS Secrets Manager, etc.) for production.
{% /callout %}

```bash
# .env (never commit this file)
ATPROTO_JWK_PRIVATE='{"keys":[{"kty":"EC","crv":"P-256",...}]}'
```

```typescript
const jwk = process.env.ATPROTO_JWK_PRIVATE;
if (!jwk) throw new Error("ATPROTO_JWK_PRIVATE not set");
```

---

## Going live checklist

Before deploying to production:

- [ ] **Tested record creation and retrieval** — Created and read back at least one hypercert successfully in a test environment.
- [ ] **Validated records against lexicon schemas** — All required fields present, datetimes in ISO 8601, strong references include both URI and CID.
- [ ] **Verified your DID and handle** — Confirmed your DID resolves correctly and your handle matches your intended identity.
- [ ] **Stored credentials securely** — No secrets in source code. Environment variables or secret management in production.
- [ ] **Reviewed records for accidental PII** — No sensitive personal data in any record fields.
- [ ] **Tested cross-PDS references** — If your app references records from other PDSs, verified those references resolve correctly.
- [ ] **Implemented error handling** — Your app handles validation errors, rate limits, and network failures gracefully.

---

## See also

- [Quickstart](/getting-started/quickstart) — create your first hypercert
- [Lexicon reference](/lexicons/hypercerts-lexicons) — field definitions and constraints for each record type
- [Architecture Overview](/architecture/overview) — how the protocol stack fits together, including the security model
- [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle) — how records move through the system
