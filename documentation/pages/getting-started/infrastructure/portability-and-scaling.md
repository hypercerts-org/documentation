---
title: Portability & Scaling
---

# {% $markdoc.frontmatter.title %}

## Migration and Portability

#### Switching PDSs

Users can migrate their entire repository to a new PDS without breaking references. The migration process:

1. Export the repository from the old PDS (a signed commit history)
2. Import it to the new PDS
3. Update the DID document to point to the new PDS URL
4. Applications automatically follow the new location

AT-URIs use DIDs, not server addresses, so references remain valid after migration.

#### Switching apps

Because data is stored on PDSs, not in application databases, users can switch apps without losing data. A claim created in App A is immediately readable by App B. Evaluations, evidence, and measurements created in different apps all reference the same underlying claims.

This is fundamentally different from traditional platforms, where switching apps means starting over.

## Performance and Scalability

#### PDS scalability

A PDS stores one user's data. It doesn't need to scale to millions of users — only to one user's activity. Most users' repositories are small (hundreds or thousands of records). PDSs are lightweight and cheap to run.

#### Indexer scalability

Indexers aggregate data across the network. They need to scale to millions of records. Indexers use standard database scaling techniques: sharding, caching, read replicas. Because indexers are stateless (they derive state from the firehose), you can run multiple indexers in parallel for redundancy and load balancing.

#### On-chain scalability (planned)

The on-chain funding and tokenization layer is not yet implemented. When built, on-chain operations will be expensive, so hypercerts will minimize on-chain activity by keeping rich data on ATProto. Only frozen snapshots and funding flows will touch the blockchain. For details on the planned on-chain design, see [Planned: Funding & Tokenization](/architecture/planned-funding-and-tokenization).

## Privacy and Access Control

#### Public by default

ATProto records are public by default. Anyone can read your activity claims, evaluations, and contributions. This is intentional — impact work benefits from transparency and discoverability.

#### Private records (future)

ATProto is adding support for encrypted records. In the future, you'll be able to create private claims visible only to specific DIDs. For example, a contributor might share sensitive evidence with an evaluator without making it public.

#### Access control via smart contracts (planned)

In the planned design, on-chain tokens could have access control logic — for example, granting read access to private ATProto records only to token holders. This is a potential future feature. See [Planned: Funding & Tokenization](/architecture/planned-funding-and-tokenization) for details.
