---
title: Certified PDSs
description: The Personal Data Servers the Hypercerts Foundation hosts for Certified accounts, what they store, and how applications read from them.
---

# Certified PDSs

The Certified PDSs are the Personal Data Servers (PDSs) that the Hypercerts Foundation hosts for Certified accounts, which people manage at [certified.app](https://certified.app). A PDS is the server that stores an account's records and serves them to any application that asks. If your users sign in with Certified, their Hypercerts records live here. If they use another AT Protocol account, their records live on another PDS and work the same way.

## Where it fits

PDSs are the first layer of the stack: every Hypercerts record is written to a PDS before anything else happens to it. People create and manage their accounts at [certified.app](/reference/services/certified-app), and the [Certified Group Service (CGS)](/reference/services/certified-group-service) writes records to a PDS for accounts that a group manages together. Downstream, the [Hypercerts Relay](/reference/services/relay) collects the changes that PDSs publish. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

In AT Protocol, each account has a **repository**: a collection of **records**, which are JSON documents such as a profile or a Hypercerts activity claim. Records of the same type sit together in a collection named after their schema, for example `org.hypercerts.claim.activity`, and each record has a record key. A record's address, called an AT-URI, has the form `at://<account>/<collection>/<record key>`. The repository is signed with the account's key, so anyone can check who published a record.

An account is identified by a **DID** (decentralized identifier), a permanent ID such as `did:plc:z72i7hdynmk6r22z27h6tvur`. The DID resolves to a DID document, which lists the account's public keys and the PDS that currently hosts it. A **handle**, such as `alice.certified.one`, is a readable name that points to the DID. The handle can change. The DID does not.

Hosting an account means the PDS stores its repository, serves its records, keeps its credentials, and publishes its changes to the network. Because the DID document only points at the current PDS, an account can move to another PDS and keep its DID, its records, and the links others have made to them.

## How it works

### A standard PDS with email sign-in

The Certified PDSs run [ePDS](https://github.com/hypercerts-org/ePDS), an extended PDS. ePDS is a standard AT Protocol PDS wrapped with an extra sign-in layer: users log in with their email address and a one-time code, with no password. A new user gets a DID, a handle, and a repository on first login, without needing to know what any of those are. Each PDS is paired with an auth service that handles the email step. Applications don't call the auth service. In every other respect, a Certified PDS behaves like any AT Protocol PDS, so standard AT Protocol sign-in with a handle and password also works.

Sign-in is moving to the [Entryway](/reference/services/entryway), which will take over the email step from ePDS. Until it is released, ePDS is how users sign in to a Certified PDS.

### What a Certified PDS stores

- **Repositories.** Each account's records: Hypercerts records (activity claims, contributions, evaluations, and so on) and Certified records such as profiles and locations. See [Hypercerts lexicons](/lexicons/hypercerts-lexicons) and [Certified lexicons](/lexicons/certified-lexicons).
- **Blobs.** Binary files attached to records, such as images and documents.
- **Account credentials.** What the server needs to sign users in and authorize applications, such as sessions and app passwords.

### Environments

The Foundation runs Certified PDSs in three roles:

- **Production** is the PDS behind [certified.app](https://certified.app). Live applications use it.
- **Staging** is the last testing step before a change reaches production. Changes are announced ahead of time. Point your own staging environment here.
- **Test** instances run the newest code for Hypercerts core development. Data can be wiped and instances can change without notice.

The handle suffix tells you which environment hosts an account: production handles look like `alice.certified.one`, while staging and test accounts use their own domains. [certified.app](https://certified.app) itself is not a PDS. It is the web application where people manage their Certified account. Hostnames for every environment are listed under [Running services](/reference/services#running-services).

### Certified PDSs are some of many

Hypercerts records live on many PDSs. A Bluesky-hosted account or a self-hosted PDS can publish Hypercerts records too, and the rest of the stack reads from all of them the same way. Your application does not need a Certified PDS to work with Hypercerts. It uses one when its users have Certified accounts.

## Using it from your application

Applications read from a PDS without authentication and write to it with the user's permission.

**Reading.** PDSs expose an XRPC API. XRPC is AT Protocol's convention for HTTP APIs: each method has a namespaced name and is called at `/xrpc/<method name>`. The example resolves a handle to its DID with `com.atproto.identity.resolveHandle`, then reads one record with `com.atproto.repo.getRecord`:

```bash
# Resolve a handle to the account's DID
curl 'https://certified.one/xrpc/com.atproto.identity.resolveHandle?handle=alice.certified.one'
# {"did":"did:plc:..."}

# Read one record from that account's repository
curl --get https://certified.one/xrpc/com.atproto.repo.getRecord \
  --data-urlencode 'repo=did:plc:...' \
  --data-urlencode 'collection=app.certified.actor.profile' \
  --data-urlencode 'rkey=self'
# {"uri":"at://did:plc:.../app.certified.actor.profile/self","cid":"...","value":{...}}
```

The response contains the record's AT-URI, its CID (a hash of its content), and the record itself in `value`. To list every record in a collection, call `com.atproto.repo.listRecords` with the same `repo` and `collection`. Send these requests to the PDS named in the account's DID document, which is a Certified PDS only for Certified accounts. To read records across many accounts, use [Jetstream](/reference/services/relay) or the [Hypercerts API](/reference/services/indexer) instead of calling each PDS.

**Writing.** Your application first signs the user in with AT Protocol OAuth. The [Entryway](/reference/services/entryway) page shows how, both today and after the Entryway is released. With the resulting session it calls `com.atproto.repo.createRecord`, `putRecord`, or `deleteRecord` on the user's PDS. Once the [SDK](/reference/sdk) is released, most applications will make these calls through it. Use the production PDS for live applications and the staging PDS for your own staging environment.

**Checking an instance.** `/health` returns the ePDS version an instance runs, and the standard `/xrpc/_health` returns the version of the underlying PDS.

## Status and source

The Certified PDSs are running in production, staging, and test. They run ePDS, whose versions and release notes are on the [ePDS releases page](https://github.com/hypercerts-org/ePDS/releases). Operational status is published on [certified.instatus.com](https://certified.instatus.com/) for production and staging, and on [test-certified.instatus.com](https://test-certified.instatus.com/) for test instances.

The source code is in the [ePDS repository](https://github.com/hypercerts-org/ePDS). Running your own PDS or ePDS is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services) and [Running services](/reference/services#running-services)
- [Entryway](/reference/services/entryway)
- [Certified Group Service](/reference/services/certified-group-service)
- [Relay and Jetstream](/reference/services/relay)
- [Account & Identity Setup](/architecture/account-and-identity)
- [Why AT Protocol](/core-concepts/why-at-protocol)
