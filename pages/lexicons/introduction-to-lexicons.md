---
title: Introduction to Lexicons
description: Understand lexicons — the shared schemas that define record types in the Hypercerts Protocol.
---

# Introduction to Lexicons

## What is a lexicon?

An ATProto lexicon is essentially a schema or template that defines what data can be stored and how it should be structured. Think of it like a form with specific fields - it tells you what information is required, what's optional, and what format each piece of data should follow.

## Lexicon Categories

All lexicons follow the principle that "everything is a claim" - whether it's a hypercert, a measurement, or an attachment, each represents a verifiable assertion stored on the ATProto network. This creates a composable system where claims can reference and build upon each other while maintaining clear data structures and relationships.

[**Certified Lexicons**](certified-lexicons/) provide foundational building blocks that can be shared across multiple protocols. These include common data types, standardized location references, profiles, badges, and other universal concepts that extend beyond hypercerts alone.

[**Hypercerts Lexicons**](hypercerts-lexicons/) contain the core claim types specific to impact tracking. These lexicons define how to structure and relate different types of impact claims. The central record is the activity claim (the hypercert itself), which lives in the `org.hypercerts.claim` namespace. Supporting records like measurements, attachments, evaluations, and acknowledgements live in the `org.hypercerts.context` namespace, enabling anyone to add context to existing claims.
