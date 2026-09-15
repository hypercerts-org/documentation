---
title: Funding Receipt
description: Lexicon reference for the Funding Receipt record type in Hypercerts.
---

# Funding Receipt

`org.hypercerts.funding.receipt`

A funding receipt records an assertion about a funding payment. It can be published by a facilitator, platform, sender, recipient, or another party.

The required fields are `to`, `amount`, `currency`, and `createdAt`. The sender, funded subject, payment rail, payment date, and transaction identifier are optional. Sender and recipient values can use free text, a DID, or a strong reference.

The optional `for` strong reference can connect a receipt to an activity, project collection, organization record, or another subject. A structurally valid receipt does not itself prove settlement, authorization, uniqueness, or acknowledgement by either party.

For the full released schema, see [`org.hypercerts.funding.receipt` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/funding/receipt.json).
