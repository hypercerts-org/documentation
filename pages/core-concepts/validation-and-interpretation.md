---
title: Building on Shared Records
description: Bring the Guide together and prepare to build an application that others can understand and build on.
---

# Building on Shared Records

We've followed a piece of work from its initial description through evidence, assessments, recognition, and funding. We've also seen how different people can contribute through different apps, while keeping their own records connected.

Now the question is where your application joins that story.

## Put the pieces together

The system has three complementary parts:

- **AT Protocol** gives people accounts and repositories for publishing and linking records.
- **Hypercerts** gives those records shared formats and meaning: activities, projects, evidence, evaluations, and funding history.
- **Applications and services** help people publish, find, interpret, and act on that information.

An indexer can bring records into a queryable view. Your interface can help a user understand that view or add a new contribution. That contribution can, in turn, become useful in someone else's app.

## Write information others can understand

Use the existing Lexicons where they fit your purpose. Their fields give other applications a recognizable starting point. Validation checks that a record has the expected structure, such as required fields and correctly formed links.

Meaning needs attention too. A project should use the shared project convention. A measurement needs an understandable metric and unit. An evaluation should link to the work it assesses and make its reasoning accessible.

A record passing a schema check doesn't establish whether its claims are true. Your app can help readers judge them by showing who published the information and what supports it.

## Build for a network with different tools

Other applications may use newer fields, unfamiliar categories, or extensions you haven't implemented. Show what your app understands, retain unfamiliar information when editing where possible, and avoid silently giving it a different meaning.

If your use case needs something the shared formats don't cover, you can define another Lexicon and publish records that link to the existing work. Other apps and indexers will need to support that extension before they can use it. This lets specialized tools develop without replacing the shared foundation.

The [Reference](/reference) links to exact schemas and service documentation. The current Guide uses the Hypercerts and Certified schemas in `@hypercerts-org/lexicon` 1.4.0; [Changes](/changes) is where to follow their evolution.

## Take the next step

Choose one useful flow for your users: publish an activity, help someone evaluate work, or bring existing project information into a funding process. Decide who publishes each piece and what a reader needs to understand it.

Then continue to [Client Integration](/client-integration) for account setup, the available walkthroughs, and the SDK and API path as it develops. The complete SDK/XRPC walkthrough is still being prepared; that section explains what is available today.

The aim is simple: make one contribution useful beyond the app where it began. Your application can help the next person start with more knowledge and less repeated work.
