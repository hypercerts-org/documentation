---
title: Entryway
description: The service that will sign users in to their Certified accounts, and how applications sign users in with AT Protocol OAuth today.
---

# Entryway

The Entryway is the service that signs users in to their Certified accounts and connects them to the server that stores their records. It is under development. Today the Certified PDSs handle sign-in themselves, and your application integrates with them through AT Protocol OAuth, the same protocol the Entryway uses. This page explains how sign-in works and what to build now.

## Where it fits

The Entryway sits in front of the [Certified PDSs](/reference/services/certified-pdss). A PDS (Personal Data Server) stores an account's records, and the Entryway is where the user proves who they are before an application can write to that PDS. Beside it, the [Certified Group Service (CGS)](/reference/services/certified-group-service) handles accounts that several signed-in users manage together. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

AT Protocol uses OAuth for sign-in. OAuth is a standard that lets an application get permission to act for a user without ever seeing the user's credentials.

What is unusual in AT Protocol is that there is no central login provider. Each account is hosted on a PDS, and that PDS, or an entryway in front of it, is the authorization server for the account. Sign-in goes like this:

1. The application works out which server hosts the user's account, from the user's handle (a readable name such as `alice.certified.one`) or from a server address.
2. It redirects the user's browser to that server.
3. The user logs in there and approves the permissions the application asked for.
4. The server redirects back to the application with a one-time authorization code.
5. The application exchanges the code for tokens and uses them to call the user's PDS.

The application never sees a password or a login code. It also needs no prior registration: it identifies itself with a small JSON file, the client metadata, hosted at a public URL.

## How it works

### Sign-in today

"Sign in with Certified" currently runs on [ePDS](https://github.com/hypercerts-org/ePDS), the extended PDS software on the Certified PDSs. ePDS adds email login to the standard OAuth flow. When your application redirects the user, ePDS asks for their email address, sends a one-time code, and checks the code the user enters. A first-time user gets an account created on the spot and picks a handle. ePDS then returns a standard authorization code to your application. Because a Certified PDS is otherwise a standard PDS, users who have set a password can also sign in the standard AT Protocol way, with their handle and password.

Nothing in this is specific to Certified from your application's side. It runs a normal AT Protocol OAuth flow, and any AT Protocol OAuth client library can do it.

### What the Entryway changes

In AT Protocol, an entryway is a single front door for a group of PDSs. Users sign in and manage their account at one address, and the entryway routes each account to the PDS that stores its repository (the account's collection of records). The Hypercerts Entryway takes over the sign-in role that ePDS has today, including email and one-time-code login, so that the PDSs behind it can be standard AT Protocol PDSs.

Applications keep using AT Protocol OAuth. The details of the Entryway, and anything an existing integration has to change, will be documented here when it is released.

### Permissions

During sign-in the application requests scopes, the permissions it wants. Hypercerts applications ask for `atproto`, the base scope every AT Protocol application needs, plus two permission sets: `include:org.hypercerts.authWrite` to write Hypercerts records and `include:app.certified.authWrite` to write Certified records such as profiles. The user sees and approves these on the sign-in screen.

### Tokens and sessions

The tokens the application receives are bound to a key that the application holds, a mechanism called DPoP, so a stolen token is of no use to another party. Client libraries handle this, along with refreshing tokens and restoring a session when the user returns. The session identifies the user by their DID (decentralized identifier), the permanent ID of their account.

## Using it from your application

Until the Entryway is released, sign users in by running AT Protocol OAuth against the Certified PDS:

1. **Publish client metadata.** Host a JSON file at a public HTTPS URL that names your application, its callback URL, and the scopes it requests. The URL of that file is your client ID.
2. **Create an OAuth client.** Use an AT Protocol OAuth library such as [`@atproto/oauth-client-node`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node), giving it the same metadata, a signing key, and somewhere to store state and sessions.
3. **Start sign-in.** Call `authorize` with the PDS address for a plain sign-in button, or with a handle or DID if you already know the user.
4. **Handle the callback.** Exchange the redirect for a session, then use that session for authenticated requests.

```ts
import { NodeOAuthClient } from '@atproto/oauth-client-node'

const client = new NodeOAuthClient({
  clientMetadata: {
    client_id: 'https://yourapp.example.com/client-metadata.json',
    redirect_uris: ['https://yourapp.example.com/api/oauth/callback'],
    scope: 'atproto include:org.hypercerts.authWrite include:app.certified.authWrite',
    // ...remaining fields as listed in the ePDS tutorial
  },
  keyset, stateStore, sessionStore, // your signing key and storage
})

// Sign-in button: send the user's browser to this URL
const authUrl = await client.authorize('https://certified.one')

// Callback route: exchange the redirect for a session
const { session } = await client.callback(new URLSearchParams(callbackQuery))
console.log(session.did) // the signed-in account
```

If your application has its own email field, it can pass the address as `login_hint` so the user goes straight to the code screen. The library's `authorize` method does not accept an email address, so this variant builds the authorization request by hand. The [ePDS tutorial](https://github.com/hypercerts-org/ePDS/blob/main/docs/tutorial.md) covers both variants, the full client metadata, and key setup.

Point production applications at the production Certified PDS and your staging environment at the staging one. Hostnames are listed under [Running services](/reference/services#running-services). Users with other AT Protocol accounts, such as Bluesky accounts, sign in through the same client with their own handle.

## Status and source

The Entryway is under development and has no published release. Follow its progress on [Entryway releases](/releases/entryway). Its source code is not public yet. The sign-in layer in use today is in the public [ePDS repository](https://github.com/hypercerts-org/ePDS). Running your own instance is outside the scope of this documentation for now.

## Related

- [Services overview](/reference/services)
- [Certified PDSs](/reference/services/certified-pdss)
- [Certified Group Service](/reference/services/certified-group-service)
- [Account & Identity Setup](/architecture/account-and-identity)
- [Certified identity](/core-concepts/certified-identity)
- [Entryway releases](/releases/entryway)
