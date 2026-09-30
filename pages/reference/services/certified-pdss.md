---
title: Certified PDSs
description: The Personal Data Servers the Hypercerts Foundation hosts, what they store, and which environment to use when.
---

# Certified PDSs

The Hypercerts Foundation hosts several Personal Data Servers (PDSs), known as the Certified PDSs. They hold the accounts that people create through [certified.app](https://certified.app) and are a large part of the infrastructure the Foundation runs for Hypercerts.

## What it does

A PDS is the server that hosts an account's repository of records and its identity. In AT Protocol, every account has a DID (a permanent identifier), and the DID document points to the PDS that currently hosts the account. Applications read and write that account's records by talking to its PDS.

Each Certified PDS stores:

- **Account repositories.** Each account's signed collection of records, including Hypercerts records (activity claims, contributions, evaluations, and so on) and Certified records such as profiles and locations. See [Certified lexicons](/lexicons/certified-lexicons).
- **Blobs.** Binary files attached to records, such as images and documents.
- **Account credentials.** The data the server needs to sign users in and authorize applications, such as sessions and app passwords.

Hypercerts records live in many PDSs, and the Certified PDSs are only some of them. Any AT Protocol PDS works with Hypercerts, including a self-hosted one or a Bluesky-hosted account. The rest of the stack reads from all of them the same way: a relay collects changes from PDSs, Jetstream turns them into a stream, and the [indexer](/reference/services/indexer) builds the Hypercerts API from that stream. The [entryway](/reference/services/entryway) handles sign-in and account hosting for Certified accounts, and the [Certified Group Service](/reference/services/certified-group-service) lets groups co-manage a repository that lives on a PDS.

## How it works

The Certified PDSs run [ePDS](https://github.com/hypercerts-org/ePDS), an extended PDS. ePDS is a standard AT Protocol PDS with an extra sign-in layer that lets users log in with their email address and a one-time code instead of a password. Each ePDS is paired with an auth service that handles the email and code step. Your application does not talk to the auth service directly: the PDS routes users through it during the OAuth flow and then returns a standard AT Protocol authorization code to your app. OAuth is the protocol an application uses to get permission to act on a user's behalf without seeing their credentials.

The Foundation runs Certified PDSs in three roles:

- **Production.** The PDS behind [certified.app](https://certified.app). Point production applications that offer "Sign in with Certified" here.
- **Staging.** The last testing step for ePDS changes before they reach production. Changes are announced ahead of time and it is generally stable, but it is not guaranteed to be as stable as production. Point your own staging environment here.
- **Test.** Instances that run the newest ePDS code. They are mainly for Hypercerts core development. Anyone can use them, but data can be wiped, instances can be unavailable, and breaking changes can ship without notice. Test instances come and go, so confirm with the Hypercerts core team that an instance is still active before relying on it.

For the current hostnames of each environment, see [Running services](/reference/services#running-services).

[certified.app](https://certified.app) is not a PDS. It is the web application where people manage their Certified account, and it talks to the production PDS.

The handle suffix of an account tells you which environment hosts it. Production accounts get handles under the production PDS domain (for example `alice.certified.one`), while staging and test accounts use their own domains.

### Checking the running version

There are two version endpoints.

**ePDS version (`/health`).** Versioned ePDS instances return the ePDS version as JSON:

```json
{"status":"ok","service":"epds","version":"<semver>+<commit>"}
```

Older instances from before versioned releases do not expose this endpoint. For what changed in each release, see the [ePDS release notes](https://github.com/hypercerts-org/ePDS/releases).

**Underlying PDS version (`/xrpc/_health`).** Every AT Protocol PDS, including ePDS instances, exposes this standard endpoint, which returns the upstream PDS version:

```json
{"version":"<version>"}
```

On some ePDS instances the version is currently missing from this response because of a known bug. An empty `{}` response means you are seeing that bug.

## Using it from your application

Your application does not need a Certified PDS to work with Hypercerts. Use one when you want to offer "Sign in with Certified", which gives your users email and one-time-code login.

| Scenario | Use |
|---|---|
| Signing up or managing your own account as an end user | [certified.app](https://certified.app) |
| Production "Sign in with Certified" in your app | The production PDS |
| Staging "Sign in with Certified" in your app | The staging PDS |
| Contributing to Hypercerts core or testing the newest ePDS changes | An active test instance |

Sign-in uses standard AT Protocol OAuth, so any AT Protocol OAuth client library works. For the integration details, see the [entryway](/reference/services/entryway) page and [Account & Identity Setup](/architecture/account-and-identity).

### Group-governed repositories

If several people need to co-manage one repository with different roles, use the [Certified Group Service](/reference/services/certified-group-service). It sits in front of a PDS, including the Certified PDSs, and adds role-based access control.

## Status

The Certified PDSs run ePDS. See the [ePDS releases](https://github.com/hypercerts-org/ePDS/releases) for version history and the `/health` endpoint of each instance for the version it runs. Operational status is published on [certified.instatus.com](https://certified.instatus.com/) (production and staging) and [test-certified.instatus.com](https://test-certified.instatus.com/) (test instances).

## Running your own

Operating your own PDS or ePDS is outside the scope of this documentation for now. See the [ePDS repository](https://github.com/hypercerts-org/ePDS) for its deployment guide.

## Related

- [Services overview](/reference/services) and [Running services](/reference/services#running-services)
- [Entryway](/reference/services/entryway)
- [Certified Group Service](/reference/services/certified-group-service)
- [Account & Identity Setup](/architecture/account-and-identity)
- [Certified identity](/core-concepts/certified-identity)
- [Why AT Protocol](/core-concepts/why-at-protocol)
