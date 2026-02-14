---
title: Testing & Security
description: How to test your integration and understand the security model.
---

# {% $markdoc.frontmatter.title %}

Test your hypercerts integration locally before going live, and understand the cryptographic guarantees that protect your data.

---

## Testing Your Integration

### Local Development

Run a local PDS for testing to avoid polluting production data.

{% callout %}
**Recommended approach**: Self-host a test PDS using the [ATProto PDS distribution](https://github.com/bluesky-social/pds). This gives you full control over test data and allows offline development.
{% /callout %}

Follow the [ATProto self-hosting guide](https://atproto.com/guides/self-hosting) to spin up a local instance. Point your client to `http://localhost:2583` (default PDS port) instead of `https://bsky.social`.

### Test Identities

Create throwaway DIDs for testing—never use production identities.

When running a local PDS, you can create test accounts with any handle. For testing against public infrastructure, create a dedicated test account with a handle like `yourname-test.bsky.social`.

Each test identity gets its own DID and repository. This isolation prevents test records from appearing in your production feed.

### Sandbox Pattern

Tag test records so they're easily identifiable and can be cleaned up later.

Add a `workScope` tag like `"test"` or `"sandbox"` to activity claims created during testing:

```typescript
const record = {
  $type: 'org.hypercerts.activityClaim',
  workScope: ['test', 'carbon-offset'],
  impactScope: ['climate'],
  // ... other fields
};
```

This makes it trivial to filter test data from production queries.

### Verifying Records

Read back records after creation to confirm they match expectations.

```typescript
import { BskyAgent } from '@atproto/api';

const agent = new BskyAgent({ service: 'https://bsky.social' });
await agent.login({ identifier: 'alice.bsky.social', password: 'app-password' });

// Create a record
const { uri, cid } = await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.activityClaim',
  record: {
    $type: 'org.hypercerts.activityClaim',
    workScope: ['test'],
    impactScope: ['education'],
    workTimeframe: { start: '2024-01-01T00:00:00Z', end: '2024-12-31T23:59:59Z' },
    createdAt: new Date().toISOString(),
  },
});

// Read it back
const { data } = await agent.com.atproto.repo.getRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.activityClaim',
  rkey: uri.split('/').pop(),
});

// Verify fields
console.assert(data.value.workScope.includes('test'), 'workScope mismatch');
console.assert(data.value.impactScope.includes('education'), 'impactScope mismatch');
console.assert(data.cid === cid, 'CID mismatch');
```

The returned `cid` is a content hash—if the record changes, the CID changes too.

### Cleanup

Delete test records when you're done to keep your repository clean.

```typescript
await agent.com.atproto.repo.deleteRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.activityClaim',
  rkey: uri.split('/').pop(),
});
```

Deletion is permanent. The record disappears from your PDS and won't appear in future queries. Cached copies may persist in indexers temporarily.

---

## Security Model

### Signed Repositories

Every PDS repository is a signed Merkle tree, making records tamper-evident.

Your DID's signing key cryptographically signs the repository root. Any modification to a record changes the Merkle root, invalidating the signature. This means:

- You can verify a record came from a specific DID
- You can detect if a record was altered after creation
- Third parties can audit the entire history of a repository

### Strong References

References include a CID (content hash), so you can verify the referenced record hasn't changed.

When an evaluation references an activity claim, it stores both the AT URI and the CID:

```typescript
{
  $type: 'org.hypercerts.evaluation',
  subject: {
    uri: 'at://did:plc:abc123/org.hypercerts.activityClaim/xyz789',
    cid: 'bafyreiabc...'
  },
  // ...
}
```

If someone modifies the activity claim, its CID changes. Your evaluation still points to the original version, and you can detect the mismatch.

### Identity Verification

DIDs are cryptographically verifiable, and handles can be verified via DNS or the PLC directory.

- **did:plc**: Resolved via the [PLC directory](https://plc.directory). The DID document contains the public key for signature verification.
- **did:web**: Resolved via HTTPS from your domain (e.g., `did:web:example.com`). You control the DID document by hosting it at `https://example.com/.well-known/did.json`.

Always verify the DID matches the expected identity before trusting a record.

### Data Integrity

Signed repos + CID references create an auditable chain of claims and evaluations.

Example flow:

1. Alice creates an activity claim. Her PDS signs the repo, producing CID `bafyA`.
2. Bob evaluates Alice's claim, referencing `{ uri: "at://alice/...", cid: "bafyA" }`.
3. Anyone can verify:
   - Alice's signature proves she created the claim
   - Bob's signature proves he created the evaluation
   - The CID proves Bob evaluated the exact version Alice published

This chain of cryptographic proofs makes hypercerts auditable without a central authority.

---

## Authentication Best Practices

### App Passwords

Use app passwords, never main passwords, in code.

App passwords are scoped tokens that can be revoked without changing your main password. Generate one in your Bluesky settings under "App Passwords".

```typescript
await agent.login({
  identifier: 'alice.bsky.social',
  password: process.env.BSKY_APP_PASSWORD, // App password, not main password
});
```

### Rotation

Rotate app passwords regularly—at least every 90 days.

Set a calendar reminder to generate a new app password and update your environment variables. Revoke the old password immediately after deploying the new one.

### Storage

Store credentials in environment variables, never in source code.

{% callout type="warning" %}
**Never commit credentials to version control.** Use `.env` files (added to `.gitignore`) for local development and secret management tools (AWS Secrets Manager, Vercel env vars, etc.) for production.
{% /callout %}

```bash
# .env (never commit this file)
BSKY_APP_PASSWORD=your-app-password-here
```

```typescript
// Load from environment
const password = process.env.BSKY_APP_PASSWORD;
if (!password) throw new Error('BSKY_APP_PASSWORD not set');
```

### OAuth for Production

For production applications, use OAuth instead of app passwords.

OAuth lets users authorize your app without sharing credentials. See the [ATProto OAuth guide](https://atproto.com/specs/oauth) for implementation details. This is especially important for multi-user applications.

---

## Privacy Considerations

### Public by Default

All ATProto records are public—do not store sensitive personal data in hypercert records.

{% callout type="warning" %}
**Records are public by default.** Anyone can read records from any PDS. Never include passwords, private keys, health data, financial details, or other sensitive information in hypercert fields.
{% /callout %}

### What to Include vs. What to Keep Off-Protocol

**Include in hypercert records:**
- Public work descriptions (e.g., "Planted 100 trees in Central Park")
- Aggregated impact metrics (e.g., "Reduced CO₂ by 50 tons")
- Public contributor identities (DIDs, handles)
- Links to public evidence (URLs, IPFS CIDs)

**Keep off-protocol:**
- Personal contact information (email, phone, address)
- Proprietary methodologies or trade secrets
- Participant consent forms or private agreements
- Raw data containing PII (personally identifiable information)

Store sensitive data in a private database and reference it by ID if needed.

### GDPR Considerations

Records can be deleted from your PDS, but cached copies may persist in indexers.

ATProto supports the right to deletion: you can call `deleteRecord` to remove a record from your repository. However:

- Indexers (like AppViews) may cache records and take time to update
- Other users may have already fetched and stored copies
- The deletion event itself is public (visible in your repo history)

If you accidentally publish PII, delete the record immediately and contact major indexer operators to request cache purging.

---

## Going Live Checklist

Before deploying to production, verify:

- [ ] **Verified your DID and handle are correct** — Confirm your DID resolves and your handle matches your intended identity.
- [ ] **Tested record creation and reading in a sandbox** — Created and retrieved at least one test record successfully.
- [ ] **Confirmed all required fields pass validation** — Your records conform to the lexicon schemas (use the [Hypercerts CLI](https://github.com/hypercerts-org/hypercerts-cli) validator).
- [ ] **Stored credentials securely (env vars, not source)** — No passwords or app passwords in your codebase.
- [ ] **Reviewed records for accidental PII** — Double-checked that no sensitive personal data is included.
- [ ] **Tested cross-PDS references if applicable** — If your app references records from other PDSs, verified those references resolve correctly.

Once all items are checked, you're ready to create production hypercerts.
