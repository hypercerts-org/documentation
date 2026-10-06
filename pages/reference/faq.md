---
title: FAQ
description: Common questions about Hypercerts and building with it.
---

# FAQ

## What is a hypercert?

A record that describes a piece of work: what was done, by whom, when, and where. Its core is an activity claim, an `org.hypercerts.claim.activity` record stored in the publisher's own repository on AT Protocol. Evidence, evaluations, and funding records published by others can link to it. See [Activity Claims](/core-concepts/what-is-hypercerts).

## What is the difference between Hypercerts and Certified?

Hypercerts is the protocol: the shared record formats for work, evidence, evaluations, and funding, and the conventions for using them. Certified is the identity service the Hypercerts Foundation operates around it: accounts, sign-in, group accounts, and record types for profiles, organizations, and badges. You can use Hypercerts without Certified, and Certified records can be used by applications that have nothing to do with funding. See [Services and tooling](/reference/services).

## How is this different from the previous (EVM-based) Hypercerts?

The current protocol stores its records on AT Protocol and does not represent each hypercert as an onchain token. The Lexicons do not define anchoring, freezing, token ownership, or settlement.

## Do I need a blockchain wallet?

No. Creating and reading Hypercerts records needs only an AT Protocol account. A particular application or payment method may separately require a wallet.

## Do my users need a Certified account?

No. Any AT Protocol account can hold Hypercerts records. A Certified account is the easiest route for people who are new to AT Protocol, because they sign in with an email address and a one-time code. Which account types an application accepts is that application's choice. See [certified.app](/reference/services/certified-app).

## Can I use my Bluesky account?

A Bluesky account is an AT Protocol account, so it can hold Hypercerts records. It works in any Hypercerts application that accepts sign-in from Bluesky's servers and asks for the permissions it needs.

## Who owns the records, and can they be moved?

The account that publishes a record owns it. Records live in that account's repository, not in the application used to create them, so any compatible application can read them. An account can move to another host and keep its identity, its records, and the links others have made to them. See [Why AT Protocol?](/core-concepts/why-at-protocol).

## Is my data public?

Yes. All records are public. Do not put sensitive personal information in them. See the privacy guidance in [Testing & Deployment](/getting-started/testing-and-deployment) for what to publish and what to keep in your own systems.

## Can I delete a hypercert?

You can delete records from your account. Copies may remain in indexes and other services that read them earlier, and links from other people's records will still point to the deleted record. Treat anything you publish as potentially permanent.

## Does publishing a record prove that the work happened?

No. A record is the publisher's own account of the work. Trust comes from what others add: evidence, endorsements, evaluations, certifications, and funding records, each attributed to whoever provided it. Each reader decides which of those signals to rely on. See [Trust and Recognition](/core-concepts/certified-identity).

## Who can evaluate my hypercert?

Anyone with an AT Protocol account. An evaluation is a separate record that the evaluator publishes from their own account and links to your activity. You don't control who evaluates your work, and readers decide which evaluators they trust. See [Evaluations](/core-concepts/evaluations).

## How do I represent a project?

Publish an activity claim for each distinct piece of work, then group them in a collection with its type set to `project`. Applications recognize the project by that convention. See [Projects and Collections](/core-concepts/projects-and-collections).

## Can several people manage one account?

Yes, through the Certified Group Service. An organization or project gets a group account, and members act on it with a member, admin, or owner role, without sharing a password. See [Certified Group Service](/reference/services/certified-group-service).

## How do I fund a hypercert?

Hypercerts does not move money. A funding platform processes the payment through its own payment method and publishes a funding receipt that describes it. The receipt records the payment; it does not prove that the money arrived. See [Funding and Learning](/core-concepts/funding-and-value-flow).

## How do I query hypercerts across the network?

If you know a record's address, read it directly from the account's repository. To find and query records across accounts, use the production [Hypercerts API](https://api.hypercerts.dev). You can also follow record changes through [Jetstream](/reference/services/relay). See [Hypercerts API](/reference/services/hypercerts-api).

## Can I build on Hypercerts today?

Yes. The record formats are released, and you can sign users in, write records to their repositories, read them back, and follow changes through Jetstream. Use the [Hypercerts API](/reference/xrpc-api) to query indexed records across accounts. The SDK is still under development. See [Client Integration](/client-integration) for integration guidance.
