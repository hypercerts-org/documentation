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

If you don't want to run your own instance, you can point your staging environment at `dev.certified.app` — the Certified-operated staging ePDS. It's the usual target for app developers building on Hypercerts who want to offer "Sign in with Certified". See [Certified PDSs](/reference/certified-services) for the caveats that apply.

Point your ATProto client to the local instance instead of production:

```typescript
import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({ service: "http://localhost:2583" }); // Local PDS
await agent.login({
  identifier: "test-user.test",
  password: "test-password",
});
```

### Use test identities

Create dedicated test accounts — never use production identities for testing. When running a local PDS, you can create accounts with any handle. Each test identity gets its own DID and repository, isolating test data from production.

### Create and verify a test record

Create a record using the same `createRecord` call from the [Quickstart](/getting-started/quickstart), then read it back to confirm it was stored correctly. The returned CID is a content hash — if the record changes, the CID changes, which is how you verify data integrity.

### Clean up test data

Delete test records when you're done to keep your repository clean:

```typescript
const uri = new URL(result.data.uri);
const rkey = uri.pathname.split("/").pop();
await agent.com.atproto.repo.deleteRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.activity",
  rkey,
});
```

Deletion removes the record from your PDS. Cached copies may persist in indexers temporarily.

---

## Record constraints

The PDS itself is schema-agnostic — it will accept any record with a valid `$type`. Validation against lexicon schemas happens downstream: indexers and app views ignore or reject malformed records, and client libraries may validate before submission. To ensure your records are indexed and usable across the ecosystem, they should conform to the lexicon schemas.

### Required fields

Every record type has required fields defined in its lexicon. Records missing required fields will be accepted by the PDS but ignored by indexers. See the [lexicon reference](/lexicons/hypercerts-lexicons) for required fields per record type.

### Datetime format

All datetime fields must use ISO 8601 format (e.g., `2026-01-15T00:00:00Z`).

### Strong references

When one record references another (e.g., an evaluation referencing an activity claim), the reference must include both the AT-URI and the CID. The CID is a content hash — if the referenced record is later modified, the CID won't match, making tampering detectable. If you need the current CID, fetch the record with `getRecord` before creating the reference.

### String and array limits

Lexicon schemas define maximum lengths for strings (in bytes and Unicode grapheme clusters) and arrays. Check the [lexicon reference](/lexicons/hypercerts-lexicons) for specific limits on each field.

### Blob uploads

Blobs (images, documents, attachment files) are uploaded to the PDS separately from records. Size limits depend on the PDS implementation — check your PDS documentation for exact values.

{% callout type="note" %}
If your attachment files are too large for blob upload, store them externally (e.g., on IPFS or a public URL) and reference them by URI in the attachment record.
{% /callout %}

### Common issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Missing required field | Record omits a field the lexicon marks as required | Include all required fields — see the [lexicon reference](/lexicons/hypercerts-lexicons) |
| Invalid datetime | Datetime not in ISO 8601 format | Use format: `2026-01-15T00:00:00Z` |
| Invalid strong reference | Reference missing `uri` or `cid` | Include both fields — fetch the latest CID if needed |
| String too long | String exceeds `maxLength` or `maxGraphemes` | Truncate or validate before submission |
| Array too long | Array exceeds `maxLength` | Reduce array size |
| Blob too large | File exceeds PDS size limit | Compress, split, or use external storage with a URI |

---

## Rate limits

PDS implementations impose rate limits on API requests. Specific limits vary by PDS — check your provider's documentation. If you hit a rate limit, retry with exponential backoff.

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

Use OAuth for production applications. OAuth lets users authorize your app without sharing credentials. See the [Quickstart](/getting-started/quickstart) for the authentication setup and the [ATProto OAuth spec](https://atproto.com/specs/oauth) for the full protocol details.

Instead of using generic [transitional](https://atproto.com/specs/oauth#authorization-scopes) permission scopes like `transition:generic` use [granular scopes](https://atproto.com/specs/permission) as much as possible. Example: `repo:org.hypercerts.claim.activity?action=create&action=update`.

---

## Going live checklist

Before deploying to production:

- [ ] **Tested record creation and retrieval** — Created and read back at least one hypercert successfully in a test environment.
- [ ] **Validated records against lexicon schemas** — All required fields present, datetimes in ISO 8601, strong references include both URI and CID.
- [ ] **Verified your DID and handle** — Confirmed your DID resolves correctly and your handle matches your intended identity.
- [ ] **Stored credentials securely** — No secrets in source code. Environment variables or secret management in production.
- [ ] **Reviewed records for accidental PII** — No sensitive personal data in any record fields.
- [ ] **Tested cross-PDS references** — If your app references records from other PDSs or repositories, verified those references resolve correctly.
- [ ] **Implemented error handling** — Your app handles validation errors, rate limits, and network failures gracefully.

---

## See also

- [Quickstart](/getting-started/quickstart) — create your first hypercert
- [Lexicon reference](/lexicons/hypercerts-lexicons) — field definitions and constraints for each record type
- [Architecture Overview](/architecture/overview) — how the protocol stack fits together, including the security model
- [Data Flow & Lifecycle](/architecture/data-flow-and-lifecycle) — how records move through the system
