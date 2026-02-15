---
title: Blockchain Integration
---

# {% $markdoc.frontmatter.title %}

## Blockchain Integration Patterns

#### Pattern 1: Mint-on-create

When a user creates an activity claim, the app immediately mints an NFT pointing to the claim's AT-URI. The token is created in the same transaction flow. This pattern is simple but requires users to pay gas fees upfront.

#### Pattern 2: Lazy minting

The activity claim exists on ATProto. Tokenization happens later, when a funder expresses interest. This defers gas costs until there's economic value. The claim can accumulate evaluations and evidence before tokenization.

#### Pattern 3: Batch anchoring

Multiple claims are created on ATProto over time. Periodically, a smart contract anchors a Merkle root of all recent claims on-chain. Individual claims can be verified against the root without minting separate tokens. This is gas-efficient for high-volume use cases.

#### Pattern 4: Hybrid ownership

Some rights are tokenized (e.g., revenue rights), while others remain off-chain (e.g., attribution rights). The token represents fractional ownership of specific rights, not the entire claim. The rights structure is defined in the claim's `rights` field (see the [Rights lexicon](/lexicons/hypercerts-lexicons/rights)).
