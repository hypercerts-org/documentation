---
title: Funding Receipt
description: Lexicon reference for org.hypercerts.funding.receipt, the record that describes a funding payment and the work it supported.
---

# Funding Receipt

`org.hypercerts.funding.receipt`

## Overview

A funding receipt describes a payment: who received it, how much, in which currency, and optionally who sent it, when it happened, how it was transferred, and which activity, project, or organization it supported.

Receipts connect support to the work it funded, so a later reader can see who backed a project alongside its evidence and assessments. That history is also a trust signal for the next funder. A receipt describes a payment; it doesn't move money or prove that money arrived. Funds move through whatever payment system the platform or funder uses, and the receipt records it afterwards. For the concepts, see [Funding and Learning](/core-concepts/funding-and-value-flow) in the Guide.

## How it's used

- **A platform records payments it facilitated.** A crowdfunding or grants platform publishes a receipt from its own account for each payment, naming the funder in `from` and the project in `to`.
- **Funders and recipients record their own.** A funder can publish receipts for grants it made, or a recipient for support it received.
- **Receipts point to the work.** `for` links the payment to the [activity](/lexicons/hypercerts-lexicons/activity-claim), project [collection](/lexicons/hypercerts-lexicons/collection), or [organization](/lexicons/certified-lexicons/organization) it supported.
- **Named parties confirm.** The funder or recipient can publish an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) of a receipt someone else wrote, adding their own confirmation.
- **Applications show funding history.** Receipts don't appear on the activity itself. An application finds them through an indexer, by looking for receipts whose `for` points to the activity.

Only `to`, `amount`, `currency`, and `createdAt` are required. Parties can be named by DID, by a strong reference to a record, or by free text, so receipts work even when a party has no account.

## Schema

{% lexicon-schema nsid="org.hypercerts.funding.receipt" /%}

## Example

A funding platform records a matched contribution from a funder to the community energy project's installation phase. The platform publishes the receipt from its own account, so the funder and the project are named parties, not the publisher:

```json
{
  "$type": "org.hypercerts.funding.receipt",
  "from": {
    "$type": "app.certified.defs#did",
    "did": "did:plc:t6hz3bqk7wmx2nrv5ydc4lpe"
  },
  "to": {
    "$type": "app.certified.defs#did",
    "did": "did:plc:4yyb5gyoxl3sqdlqrvuxshkp"
  },
  "amount": "2500.00",
  "currency": "EUR",
  "paymentRail": "bank_transfer",
  "paymentNetwork": "sepa",
  "transactionId": "RF18539007547034",
  "for": {
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lxa4m2vbqk2s",
    "cid": "bafyreif3kq7xmzd2vhw5l4yjn6rb2pc7tsgoe4ua5xi3qhk6wzdmfv2nle"
  },
  "notes": "Matched contribution from the summer community energy round.",
  "occurredAt": "2026-07-20T10:05:00.000Z",
  "createdAt": "2026-07-20T10:12:00.000Z"
}
```

## Rules and best practices

- **The publisher and the named parties are different things.** A receipt is the statement of the account that published it. Naming a funder in `from` and a recipient in `to` doesn't show that either agrees. Applications show who published a receipt alongside the parties it names, and treat an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) from a named party as additional confirmation.
- **A receipt doesn't prove payment.** Validation checks structure, not whether the payment happened. `transactionId` with `paymentRail` and `paymentNetwork` lets someone check the payment against the rail's own records. A signature attests to the record's content, not to the transfer of funds.
- **Name parties by DID when you can.** Use the DID variant for any party with an AT Protocol account, so readers can look for that party's acknowledgement. Use free text (`#text`) only for parties without an account, such as a wallet address or an organization's name, and don't write a DID or handle into a free-text value.
- **Omit `from` for anonymous senders.** Leave the property out entirely rather than writing a placeholder such as "anonymous". Omitting it hides the sender only when someone other than the sender publishes the receipt.
- **Write `amount` in the currency's normal unit.** Use a plain decimal string such as `"2500.00"`, in euros rather than cents and in ETH rather than wei. There is no field for scale, so a value in the smallest unit is indistinguishable from one many times larger.
- **Be precise about currency.** `currency` has no fixed vocabulary. For fiat money, the ISO 4217 code (`EUR`, `USD`) is the clearest choice. For digital assets, give the symbol and set `paymentNetwork`, because one symbol can mean different assets on different networks.
- **Set `occurredAt`.** `createdAt` is when the record was written, which can be days or months after the payment. Use `occurredAt` to place a payment in a reporting period.
- **Link to the work with `for`.** It is the only property connecting a receipt to what it funded. Don't infer the funded work from `notes` or from the publisher's other records. `for` holds one reference, so a payment split across several activities is recorded as one receipt per activity, each with its share as `amount` and the same `transactionId`.
- **Correct in place, and don't duplicate.** Fix a mistake by updating the existing receipt, not by publishing a corrected copy alongside it. When another party has already recorded a payment, acknowledging their receipt adds confirmation without creating a second record that could be double counted.
- **Aggregate totals honestly.** One payment can have several receipts from different publishers, and anyone can publish receipts. Before summing, deduplicate receipts that share a `transactionId` and `paymentNetwork`, don't add amounts in different currencies without stating the conversion rate and date, and decide which publishers to include. Show readers which receipts a total covers, and don't present it as all the funding a project received: no application can see every receipt on the network.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim), [Collection](/lexicons/hypercerts-lexicons/collection), and [Organization](/lexicons/certified-lexicons/organization): what a receipt's `for` typically points to.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): confirmation or rejection of a receipt by a named party.
- [Signatures](/lexicons/certified-lexicons/signatures) and [Certified shared definitions](/lexicons/certified-lexicons/shared-defs): the DID and signature types a receipt uses.
- Guide: [Funding and Learning](/core-concepts/funding-and-value-flow), [Trust and Recognition](/core-concepts/certified-identity).
