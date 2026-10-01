---
title: Certified Group Service
description: How the Certified Group Service lets several people manage one AT Protocol repository with roles, and how an application writes to a group.
---

# Certified Group Service

The Certified Group Service (CGS) lets several people manage one AT Protocol account together, each signed in as themselves and each with their own role. An organization, lab, or project can publish Hypercerts records from a shared account without sharing a password. Use it when your application has teams that publish under one name.

## Where it fits

CGS sits between your application and the PDS (Personal Data Server, the server that stores an account's records) that hosts a group's account. Members sign in to their own accounts through the [Entryway](/reference/services/entryway), and CGS writes to the group's account on a [Certified PDS](/reference/services/certified-pdss) or any other PDS. To everything downstream, a group looks like any other account. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

In AT Protocol, an account's records live in its repository, and a repository has a single owner. Records are signed with the account's key, and every write is authorized with the account's credentials. The protocol has no notion of a second person with partial rights: whoever holds the credentials can do everything. Sharing one password across a team gives everyone full access and leaves no trace of who did what.

Two protocol features make a better answer possible. A **service auth token** is a short-lived JWT (JSON Web Token, a signed JSON document) that a user's PDS issues on request. It states who the caller is, which service the token is for (`aud`), and which method it allows (`lxm`). Any service can check it against the public key in the caller's DID document, the public description of an account that its DID (permanent account ID) resolves to. Users can therefore prove who they are to a third-party service without a separate login. **Service proxying** builds on this: an application sends a request to the user's PDS with an `atproto-proxy` header naming another service, and the PDS forwards it with a service auth token attached.

## How it works

A group is an ordinary account whose credentials CGS holds, encrypted, so that no member needs them. For each request, CGS:

1. Authenticates the caller and works out which group the request targets.
2. Checks the caller's role in that group.
3. Forwards an authorized write or file upload to the group's PDS.
4. Records the operation, or the denial, in the group's audit log.

Reads don't go through CGS. The group's PDS serves them, as for any account.

### Roles and permissions

There are three roles. Each has every permission of the one before it.

| Role | Can do |
|---|---|
| member | Create records, edit or delete records they authored, upload blobs (files), list members, manage their own API keys |
| admin | Edit or delete any member's records, edit the group's profile, add or remove members, read the audit log |
| owner | Change members' roles, propose an ownership transfer, remove the group from CGS |

CGS tracks who authored each record, which is how it tells "edit your own record" from "edit any record". Nobody can act on someone with an equal or higher role, so an admin cannot remove another admin. Ownership changes hands only through a transfer that the owner proposes and the new owner accepts. The [API reference](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/api-reference.md) has the full rules.

### Authentication

Members authenticate with a service auth token. The token's `aud` is the service DID of the CGS instance, which has the form `did:web:<cgs-host>`, and its `lxm` is the method being called. A token works once and for at most 120 seconds. The request names the group in a `repo` parameter, as a DID or handle.

For backend jobs, a member can create an API key for one group, sent in the `X-API-Key` header. A key is limited by its scopes and by its creator's current role.

### How a group is created

`app.certified.group.register` creates a new account for the group and makes the caller its first owner. `app.certified.group.import` brings an existing account under CGS, on whichever PDS already hosts it, using an app password that the account's holder supplies and can revoke. The owner role governs membership inside CGS, which is not the same as controlling the underlying account. `app.certified.group.destroy` removes the group from CGS and leaves the account and its records on the PDS.

## Using it from your application

The recommended path is a direct call from your backend:

1. With the user's signed-in session, ask the user's PDS for a service auth token addressed to CGS, using the standard method `com.atproto.server.getServiceAuth`.
2. Send the write to CGS with that token and the group in `repo`.

```ts
const CGS = 'https://groups.certified.app'

// 1. Ask the user's PDS for a token addressed to CGS
const { data } = await agent.com.atproto.server.getServiceAuth({
  aud: 'did:web:groups.certified.app',
  lxm: 'app.certified.group.repo.createRecord',
})

// 2. Call CGS directly, naming the group in `repo`
const res = await fetch(`${CGS}/xrpc/app.certified.group.repo.createRecord`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  },
  body: JSON.stringify({
    repo: groupDid,
    collection: 'org.hypercerts.claim.activity',
    record: activityRecord,
  }),
})
```

The same pattern works for `putRecord`, `deleteRecord`, and `uploadBlob`, with a new token for each request. Uploads are limited to 5 MB by default.

To use service proxying instead, send the request to the user's PDS with the header `atproto-proxy: did:web:<cgs-host>#certified_group_service` and the group in `repo`. Proxied writes need the `app.certified.group.repo.*` names shown above, because a PDS treats the standard `com.atproto.repo.*` names as writes to the user's own repository. Direct calls accept either set of names. Imported groups can only be reached with direct calls.

To show a user their groups, call `app.certified.groups.membership.list`, which returns every group the signed-in user belongs to on that CGS instance, with their role in each. It spans groups, so it takes no `repo`. Admins read the audit log with `app.certified.group.audit.query`.

Use the production instance for live applications and the staging instance for your own staging environment. Hostnames and service DIDs are listed under [Running services](/reference/services#running-services). The [integration guide](https://github.com/hypercerts-org/certified-group-service/blob/main/docs/integration-guide.md) walks through registering a group, adding members, and writing records.

## Status and source

CGS is released and running in production, staging, and test. See the [CGS changelog](/changes/cgs) for the current version and release history. An instance reports its version at `/health`.

The source code is in the [certified-group-service repository](https://github.com/hypercerts-org/certified-group-service). Running your own instance is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services) and [Running services](/reference/services#running-services)
- [Certified PDSs](/reference/services/certified-pdss)
- [Entryway](/reference/services/entryway)
- [Account & Identity Setup](/architecture/account-and-identity)
- [CGS changelog](/changes/cgs)
