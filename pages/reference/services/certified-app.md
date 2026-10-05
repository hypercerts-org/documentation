---
title: certified.app
description: The web app where people create and manage their Certified account, independent of any application that uses it.
---

# certified.app

[certified.app](https://certified.app) is the web app where people create a Certified account and manage it: their profile, the applications they have connected, the groups they belong to, and the endorsements they give and receive.

A Certified account is an account on AT Protocol, the open network that Hypercerts is built on, hosted by the Hypercerts Foundation. It gives a person or an organization one identity and one place for their records, which they can use to sign in to any Hypercerts application with just an email address. The account belongs to no single application. A user who signs in to your application with Certified manages that same account here.

## Where it fits

certified.app is the part of the stack that end users see. The account it manages lives on a [Certified PDS](/reference/services/certified-pdss). A PDS (Personal Data Server) is the server that stores an account's records. Signing in is handled by the PDS today and by the [Entryway](/reference/services/entryway), the sign-in service under development, once it is released. Group accounts created here are run by the [Certified Group Service (CGS)](/reference/services/certified-group-service), which lets several people manage one account. Your application sits beside certified.app, not behind it: both are clients of the same account. The [services overview](/reference/services) has the full diagram.

## AT Protocol background

On most platforms, an account belongs to the application you created it in. In AT Protocol, an account stands on its own. It has a DID (decentralized identifier, the account's permanent ID), a handle (its readable name), and a repository (the collection of records it has published, such as a profile or a description of a project), and it exists whether or not any particular application is in use.

Applications get access through OAuth, a standard way for a user to grant an application limited access without sharing a password. The user approves each application once, the application receives a grant for the permissions it asked for, and the user can withdraw that grant at any time.

This separation creates a practical need: somewhere to look after the account itself. Changing a display name, checking which applications have access, or leaving a group are not tasks that belong to a funding platform or an evaluation tool. certified.app is that place for Certified accounts.

## How it works

### Creating an account

A new user enters an email address and confirms it with a one-time code. There is no password to choose and no protocol knowledge needed. Behind the scenes the account gets a DID, a handle, and a repository on the production Certified PDS. From then on the same account works in every application that offers "Sign in with Certified".

### Profile and settings

The profile is a record in the user's own repository: a display name, a description, an avatar, a banner, and a website, stored as an [`app.certified.actor.profile`](/lexicons/certified-lexicons/profile) record. Organizations can add details such as their type and founding date in an [organization](/lexicons/certified-lexicons/organization) record. Because these are ordinary records, any application can read them and show the same name and picture, and an application the user has authorized can update them.

### Connected applications

certified.app lists the applications the user has signed in to and lets them disconnect any of them. Disconnecting withdraws the application's access. It does not delete records the application wrote, which stay in the user's repository.

### Groups

Users can create a group account for an organization or a project, invite members, and assign roles. The group's repository is managed through CGS, so several people can publish under one shared identity without sharing a password.

### Endorsements

Users can endorse accounts they know and see the endorsements an account has received. Endorsements are published records, so applications can show them next to a profile and use them as [trust signals](/core-concepts/certified-identity): information from others that helps someone decide whether to rely on an account or its work.

### An application like yours

certified.app has no private access to the account. It signs users in with the same AT Protocol OAuth flow as any other application and reads and writes the same records. Everything it does, another application could do with the user's permission.

## Using it from your application

There is nothing to integrate with certified.app itself. Your application adds "Sign in with Certified" through AT Protocol OAuth, as described on the [Entryway](/reference/services/entryway) page, and from then on works with the user's account directly.

Two things are worth doing:

- **Send users to certified.app for account tasks.** Link to it from your settings page, so you don't have to build screens for changing a profile, managing connected applications, or handling groups.
- **Reuse the profile.** Read the user's Certified profile to show their name and picture. If your application asked for the `app.certified.authWrite` permission, it can also update the profile, as in this example:

```ts
// After sign-in, `agent` is an @atproto/api Agent for the user's session.
// This updates the same profile record the user edits on certified.app.
await agent.com.atproto.repo.putRecord({
  repo: agent.assertDid,
  collection: 'app.certified.actor.profile',
  rkey: 'self',
  record: {
    $type: 'app.certified.actor.profile',
    displayName: 'Millbrook Community Energy',
    description: 'A community-owned solar project.',
    createdAt: new Date().toISOString(),
  },
})
```

`putRecord` replaces the whole record. To change one field, read the current record first and write it back with your change, so fields such as the avatar are not lost.

## Status and source

certified.app is running in production, and the Hypercerts Foundation is developing it further around the account, profile, endorsements, and connected applications. The address is listed with the other [running services](/reference/services#running-services).

The source code is in the [certified-app repository](https://github.com/hypercerts-org/certified-app). Running your own copy is outside the scope of this documentation for now.

## Related

- [Certified PDSs](/reference/services/certified-pdss)
- [Entryway](/reference/services/entryway)
- [Certified Group Service](/reference/services/certified-group-service)
- [Profile](/lexicons/certified-lexicons/profile) and [Organization](/lexicons/certified-lexicons/organization) lexicons
- [Account & Identity Setup](/architecture/account-and-identity)
- [Trust and Recognition](/core-concepts/certified-identity)
