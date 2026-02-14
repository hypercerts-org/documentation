---
title: The Hypercerts Infrastructure
---

# The Hypercerts Infrastructure

The Hypercerts protocol is built on top of the AT Protocol (ATProto), a decentralized social networking framework. This page explains the infrastructure choices and how they enable the hypercerts system.

## Why ATProto?

The AT Protocol provides several properties that make it ideal for hypercerts:

- **Decentralized identity**: Users control their own identity through DIDs (Decentralized Identifiers), ensuring that impact claims are tied to verifiable actors
- **Lexicon-based schemas**: ATProto uses Lexicons to define data schemas, providing a structured and extensible way to represent hypercerts data
- **Federation**: Data is stored across federated servers (Personal Data Servers), giving users data sovereignty while maintaining interoperability
- **Content addressing**: Records are content-addressed, making hypercerts tamper-evident and auditable

## Architecture Overview

The hypercerts infrastructure consists of:

1. **Personal Data Servers (PDS)**: Store user data including hypercert records, evaluations, and contributions
2. **Lexicon schemas**: Define the structure of all hypercert-related records (see [Lexicons](/lexicons/introduction-to-lexicons))
3. **Record types**: Activity claims, contributions, evaluations, measurements, evidence, rights, and collections

## Data Flow

When a user creates a hypercert:

1. The claim is structured according to the relevant lexicon schema
2. The record is stored on the user's PDS
3. Other users can reference, evaluate, or contribute to the claim using linked records
4. All records maintain cryptographic integrity through ATProto's content addressing