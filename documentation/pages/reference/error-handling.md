---
title: Error Handling & Constraints
description: Common errors, validation rules, and how to handle them.
---

## Overview

When creating or updating records on a PDS, various errors can occur. This page documents common error scenarios and how to handle them.

---

## Record Validation Errors

Errors occur when a record does not match its lexicon schema.

| Error Scenario | Cause | Fix |
|----------------|-------|-----|
| Missing required field | Creating an activity claim without `title` or `startDate` | Include all required fields in the record |
| Invalid field type | Passing a number where a string is expected | Ensure field types match the lexicon definition |
| String length violation | String exceeds `maxLength` (in bytes) or `maxGraphemes` (in Unicode grapheme clusters) | Truncate or validate string length before submission |
| Array length violation | Array exceeds `maxLength` on array fields | Reduce array size to meet constraints |
| Invalid datetime format | Datetime not in ISO 8601 format | Use ISO 8601 format: `2024-01-15T10:30:00Z` |
| Invalid strong reference | Missing `uri` or `cid` in strong reference | Include both `uri` and `cid` fields |

**Example: Missing required field**

```typescript
// ❌ Error: missing required fields
const claim = {
  description: "Built a community garden",
  // Missing: title, startDate
};

// ✅ Correct
const claim = {
  title: "Community Garden Project",
  description: "Built a community garden",
  startDate: "2024-01-01T00:00:00Z",
};
```

**Example: Invalid datetime format**

```typescript
// ❌ Error: invalid format
const claim = {
  title: "Project",
  startDate: "01/15/2024", // Wrong format
};

// ✅ Correct
const claim = {
  title: "Project",
  startDate: "2024-01-15T00:00:00Z", // ISO 8601
};
```

**Example: Invalid strong reference**

```typescript
// ❌ Error: missing cid
const evidence = {
  claim: {
    uri: "at://did:plc:abc123/org.hypercerts.activityClaim/xyz",
    // Missing: cid
  },
};

// ✅ Correct
const evidence = {
  claim: {
    uri: "at://did:plc:abc123/org.hypercerts.activityClaim/xyz",
    cid: "bafyreiabc123...",
  },
};
```

---

## Blob Constraints

Size limits for uploaded blobs vary by type.

| Blob Type | Maximum Size | Used For |
|-----------|--------------|----------|
| `smallBlob` | 10 MB | General attachments |
| `largeBlob` | 100 MB | Large documents, datasets |
| `smallImage` | 5 MB | Thumbnails, icons |
| `largeImage` | 10 MB | High-resolution images |

**What happens when limits are exceeded:**
- The PDS rejects the blob upload
- You receive a validation error indicating the size limit
- The record creation/update fails

**Solution:** Compress images, split large files, or use external storage with links.

---

## Authentication Errors

Common authentication issues and resolutions.

| Error | Cause | Resolution |
|-------|-------|------------|
| Invalid credentials | Wrong username or password | Verify credentials and retry |
| Expired session | Session token has expired | Refresh the session or re-authenticate |
| Insufficient permissions | User lacks permission for the operation | Ensure user has appropriate access rights |
| Missing authentication | Request made without credentials | Include authentication token in request |

**Refreshing sessions:**

```typescript
try {
  await agent.createRecord({ /* ... */ });
} catch (error) {
  if (error.message.includes('expired')) {
    await agent.resumeSession(sessionData);
    await agent.createRecord({ /* ... */ }); // Retry
  }
}
```

---

## Reference Errors

Issues with strong references between records.

| Error | Cause | Resolution |
|-------|-------|------------|
| Referenced record does not exist | URI points to non-existent record | Verify the record exists before referencing |
| CID mismatch | Record was updated since reference was created | Fetch the latest CID and update the reference |
| Cross-PDS resolution failure | Referenced record is on an unreachable PDS | Ensure PDS is accessible or use local references |

**Example: Handling CID mismatch**

```typescript
// Fetch the latest version of the record
const latestRecord = await agent.getRecord({
  repo: 'did:plc:abc123',
  collection: 'org.hypercerts.activityClaim',
  rkey: 'xyz',
});

// Use the current CID
const evidence = {
  claim: {
    uri: latestRecord.uri,
    cid: latestRecord.cid, // Current CID
  },
};
```

---

## Rate Limits & PDS Constraints

Operational limits imposed by PDS implementations.

{% callout type="warning" %}
Specific limits depend on the PDS implementation. Always check your PDS documentation for exact values.
{% /callout %}

| Constraint | Description | Handling |
|------------|-------------|----------|
| Rate limits | Maximum requests per time window | Implement exponential backoff and retry logic |
| Repository size | Total storage per user repository | Monitor usage, archive old records |
| Concurrent operations | Maximum simultaneous requests | Queue operations, process sequentially |

**Retry with exponential backoff:**

```typescript
async function createWithRetry(agent, record, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await agent.createRecord(record);
    } catch (error) {
      if (error.message.includes('rate limit') && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

---

## Best Practices

General error handling recommendations.

**1. Validate client-side before submission**

```typescript
function validateClaim(claim) {
  if (!claim.title || claim.title.length === 0) {
    throw new Error('Title is required');
  }
  if (!claim.startDate) {
    throw new Error('Start date is required');
  }
  // Validate ISO 8601 format
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(claim.startDate)) {
    throw new Error('Start date must be in ISO 8601 format');
  }
}
```

**2. Use try/catch around all API calls**

```typescript
try {
  const result = await agent.createRecord({
    repo: agent.session.did,
    collection: 'org.hypercerts.activityClaim',
    record: claim,
  });
  console.log('Created:', result.uri);
} catch (error) {
  console.error('Failed to create claim:', error.message);
  // Handle specific error types
  if (error.message.includes('validation')) {
    // Show validation errors to user
  } else if (error.message.includes('auth')) {
    // Prompt re-authentication
  }
}
```

**3. Log errors with context**

```typescript
function logError(operation, record, error) {
  console.error({
    operation,
    collection: record.collection,
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
  });
}

try {
  await agent.createRecord(params);
} catch (error) {
  logError('createRecord', params, error);
  throw error;
}
```

**4. Provide user-friendly error messages**

```typescript
function getUserMessage(error) {
  if (error.message.includes('validation')) {
    return 'Please check that all required fields are filled correctly.';
  }
  if (error.message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (error.message.includes('auth')) {
    return 'Your session has expired. Please sign in again.';
  }
  return 'An unexpected error occurred. Please try again.';
}
```
