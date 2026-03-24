---
title: Funding Receipt
description: Lexicon reference for the Funding Receipt record type in Hypercerts.
---

# Funding Receipt

`org.hypercerts.funding.receipt`

A funding receipt records a funding payment from one party to another. It's typically created by a facilitator or funding platform, but can be created by either the funder or recipient.

Each receipt includes the funder's DID, the recipient's DID, the amount and currency, the payment rail used (like bank transfer, crypto, or grant platform), and an optional transaction ID for verification. Receipts can reference the activity claims or collections they fund, creating a traceable link from funding to impact work.

Funding receipts enable transparent funding tracking and make it possible to see who funded what work. They're designed to be simple and flexible enough to represent everything from traditional grants to crypto payments to in-kind contributions.

For the full schema, see [`org.hypercerts.funding.receipt`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/funding/receipt.json) in the lexicon repo.
