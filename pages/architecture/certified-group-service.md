---
title: Certified Group Service (CGS)
description: How CGS adds role-based access control to group-governed AT Protocol repositories without modifying the underlying PDS.
---

# Certified Group Service (CGS)

In standard AT Protocol, each repository is controlled by a single identity (DID) — there's no built-in way for multiple users to collaboratively manage the same repo with different permission levels.

The [Certified Group Service](https://github.com/hypercerts-org/certified-group-service) (CGS) fills that gap. It's an AT Protocol service that sits between clients and a group's backing PDS, enforcing role-based access control, tracking record authorship, and keeping a full audit log. From the client's perspective, a group looks like any other AT Protocol repository — it just happens to be co-governed.

Certified operates a hosted CGS instance, but CGS is also designed to be **self-hostable per operator** — anyone can run their own instance and point it at whichever PDS backs the group (including, but not limited to, the [Certified-operated PDSs](/services/certified-pdss)).

Today, a given CGS deployment points at a single backing PDS (configured via the `GROUP_PDS_URL` environment variable), and every group it registers lives on that PDS. Operators who want to host groups across multiple PDSs currently run multiple CGS instances. This is a current architectural constraint rather than a fundamental one, and may evolve in the future.

## System overview

```text
Any AT Protocol client
  │
  │  atproto-proxy: did:plc:GROUP#certified_group
  ▼
User's PDS
  │
  │  Authorization: Bearer <service-auth-jwt>
  │  (signed with user's key, iss=user, aud=group)
  ▼
┌──────────────────────────────────┐
│  Certified Group Service         │
│                                  │
│  1. AuthVerifier  (JWT → DID)    │
│  2. RbacChecker   (DID → role)   │
│  3. PDS proxy     (forward)      │
│  4. AuditLogger   (record all)   │
└──────────────────────────────────┘
  │
  ▼
Group's backing PDS
```

Clients never call CGS directly. Instead they send a normal XRPC request to their own PDS with an `atproto-proxy` header pointing at the group DID and service fragment (`did:plc:GROUP#certified_group`). The user's PDS resolves the group's DID document, finds the `#certified_group` service endpoint, mints a service auth JWT signed with the user's key, and forwards the request to CGS. This is the same proxying mechanism used by Ozone labeling services.

## Integrating from an app

Apps don't call CGS directly. Your backend uses an authenticated `AtpAgent` for the user and sends XRPC requests *to the user's PDS* with an `atproto-proxy` header set to `did:plc:<groupDid>#certified_group`. The PDS handles service auth and forwards the request to CGS on your behalf. See the upstream [integration guide](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/integration-guide.md) for a worked example.

One important gotcha: CGS uses **custom NSIDs** for record operations — `app.certified.group.repo.createRecord`, `putRecord`, `deleteRecord`, `uploadBlob` — instead of the standard `com.atproto.repo.*`. This is deliberate: if your app called `com.atproto.repo.createRecord`, the user's PDS would handle it itself and write to the user's own repo, not proxy it to CGS. The custom NSIDs are unrecognized by the PDS, so it looks them up in the group's DID document and routes them to CGS. Use the custom NSIDs in your proxied calls.

## Authentication

Every request to CGS arrives with `Authorization: Bearer <JWT>`. The `AuthVerifier` runs the following checks:

1. **Signature** — verified against the issuer's DID document via `@atproto/xrpc-server`'s `verifyJwt()`.
2. **Audience** — the JWT's `aud` must match a group DID registered with this CGS instance.
3. **Lexicon method** — the JWT's `lxm` must match the requested XRPC method (from an allowlist of record and group-management operations).
4. **Token lifetime** — `exp - iat` must not exceed the nonce TTL (120 seconds), so that tokens can't outlive the replay-prevention window.
5. **Nonce (replay prevention)** — the JWT's `jti` is checked against a short-lived nonce cache. If it's been seen before, the request is rejected.

If all checks pass, the handler receives `{ iss: callerDid, aud: groupDid }` and proceeds to authorization.

## Authorization (RBAC)

Roles are strictly hierarchical and compared numerically. A higher level grants every permission of the lower levels.

```text
member (0)  <  admin (1)  <  owner (2)
```

### Permission matrix

| Operation | Minimum role |
|---|---|
| Create records, upload blobs, edit any record, list members | member |
| Delete records you authored | member |
| Delete any member's record | admin |
| Edit the group's profile | admin |
| Add / remove members | admin |
| Query the audit log | admin |
| Change a member's role | owner |

### Special rules

- **Cannot modify equal or higher roles.** An admin cannot remove another admin; only an owner can.
- **`member.add` cannot assign `owner`.** New owners must be promoted by an existing owner via `role.set`.
- **Self-removal always succeeds.** Any member can remove themselves, regardless of role.
- **Last-owner protection.** The system atomically prevents demoting or removing the only remaining owner.
- **Authorship is tracked per record.** CGS maintains a `group_record_authors` table so `deleteOwnRecord` (member) can be distinguished from `deleteAnyRecord` (admin).

## PDS proxying and credentials

Once a request is authorized, CGS forwards it to the group's backing PDS using stored credentials:

- **Credential storage.** The group's PDS app password (and, where applicable, the recovery keypair used for PLC operations) is stored encrypted with AES-256-GCM, using a 32-byte master key from the service's `ENCRYPTION_KEY` environment variable.
- **Agent pool.** An authenticated `AtpAgent` per group is cached in memory; stale sessions are refreshed automatically on `AuthenticationRequired` / `ExpiredToken` errors.
- **Blob uploads.** `uploadBlob` requests are streamed to the PDS with an enforced `MAX_BLOB_SIZE` limit (checked both upfront via `Content-Length` and incrementally during the stream).

## Audit logging

Every meaningful action — permitted or denied — is written to the per-group `group_audit_log` table. Each entry captures:

- **Who** — the caller's DID (`actor_did`)
- **What** — the operation name (e.g. `createRecord`, `member.add`)
- **Where** — collection and rkey, for record-level operations
- **Result** — `permitted` or `denied` (plus a reason for denials)
- **Tracing** — the JWT's `jti`, for correlation with auth logs
- **When** — ISO timestamp

Admins can query the audit log via `app.certified.group.audit.query`.

## Group lifecycle

Groups are created via `app.certified.group.register`, which requires a service auth JWT proving the caller controls the prospective owner DID. During registration, CGS:

1. Creates a new PDS account on the instance's configured backing PDS and receives a new group DID.
2. Generates a recovery keypair and registers a `#certified_group` service entry in the group's DID document via a PLC operation.
3. Stores the encrypted app password and recovery key in its own database.
4. Seeds the caller as the group's first owner.

From then on, the group's DID is co-governed through CGS: owners promote admins, admins manage members, and members interact with the repository subject to the permission matrix above.

## Storage

CGS uses SQLite for all persistence:

- A **global database** holds the group registry (`groups` table) and the nonce cache.
- Each group gets its **own per-group database**, named by the SHA-256 hash of the group DID. This isolates group data and keeps audit logs per-group.
- All databases use WAL mode for concurrent read performance.

## Future directions

The current RBAC model — three fixed roles (`member`, `admin`, `owner`) with a hard-coded permission matrix — is intentionally simple. It covers the common case of a small group co-managing a repository, but it is a starting point rather than an endpoint. Directions being explored as groups' governance needs mature:

- **Customizable roles.** Let each group define its own roles and permissions instead of relying on a fixed three-tier hierarchy.
- **Finer-grained permissions.** Scope permissions per collection or record type — for example, a role that can only create records in one lexicon, or only edit the group profile.
- **Group-level governance.** Move beyond unilateral admin/owner actions toward proposals, voting, or quorum-based decisions for sensitive operations.
- **Time-bound and delegated roles.** Temporary elevations — e.g. an admin grants another member `admin` for 24 hours, after which the role automatically reverts.
- **Credential-based membership.** Derive membership and roles from external signals (verifiable credentials, badges, tokens) rather than only manual `member.add` calls.
- **Multiple backing PDSs per instance.** Today, one CGS deployment is bound to a single backing PDS. Supporting multiple PDSs per instance (or per group) would let a single deployment host groups across different PDS providers.

None of the above are committed features; they're possibilities being shaped by user and developer needs and feedback.

## Further reading

- [CGS repository](https://github.com/hypercerts-org/certified-group-service)
- [Architecture doc](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/architecture.md) — full data model, startup sequence, and implementation details
- [Integration guide](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/integration-guide.md)
- [API reference](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/api-reference.md)
- [Deployment guide](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/deployment.md) — for running your own CGS instance
