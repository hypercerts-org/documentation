---
title: Funding Receipt
description: Lexicon reference for org.hypercerts.funding.receipt, the record that describes a funding payment and the work it supported.
---

# Funding Receipt

`org.hypercerts.funding.receipt`

## Overview

A funding receipt describes a payment: who received it, and optionally how much, who sent it, what kind of payment it was, which intermediary handled it, when it happened, how it was transferred, and which activity, project, or organization it supported.

Receipts connect support to the work it funded, so a later reader can see who backed a project alongside its evidence and assessments. That history is also a trust signal for the next funder. A receipt describes a payment; it doesn't move money or prove that money arrived. Funds move through whatever payment system the platform or funder uses, and the receipt records it afterwards. For the concepts, see [Funding and Learning](/core-concepts/funding-and-value-flow) in the Guide.

## How it's used

- **A platform records payments it facilitated.** A crowdfunding or grants platform publishes a receipt from its own account for each payment, naming the funder in `from` and the project in `to`.
- **Funders and recipients record their own.** A funder can publish receipts for grants it made, or a recipient for support it received.
- **Receipts point to the work.** `for` links the payment to the [activity](/lexicons/hypercerts-lexicons/activity-claim), project [collection](/lexicons/hypercerts-lexicons/collection), or [organization](/lexicons/certified-lexicons/organization) it supported.
- **Named parties confirm.** The funder or recipient can publish an [acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement) of a receipt someone else wrote, adding their own confirmation.
- **Applications show funding history.** Receipts don't appear on the activity itself. An application finds them through an indexer, by looking for receipts whose `for` points to the activity.

Only `to` and `createdAt` are required. `amount` and `currency` are optional, so a receipt can still be written when only the amount received is known. Parties can be named by DID, by a strong reference to a record, or by free text, so receipts work even when a party has no account.

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
  "via": {
    "$type": "app.certified.defs#did",
    "did": "did:plc:ragtjsm2j2vknwkz3zp4oxrd"
  },
  "type": "match",
  "amount": "2500.00",
  "currency": "EUR",
  "netAmount": "2475.00",
  "netCurrency": "EUR",
  "paymentRail": "bank_transfer",
  "paymentNetwork": "sepa",
  "transactionId": "SEPA-TX-7Q4K9M2X8P",
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
- **Omit `from` for anonymous senders.** Leave the property out entirely rather than writing a placeholder such as "anonymous". Omitting it hides the sender only when someone other than the sender publishes the receipt, and an onchain `transactionId` still reveals the sending wallet.
- **Name a sender only if they chose to be named.** `from` can be added later by updating the receipt. Removing it later hides the name only from the current version: readers and indexers that kept an earlier version still have it.
- **Separate gross from net.** `amount` is the gross the sender paid, before fees. `netAmount` is what the recipient received after fees and conversion, in `netCurrency`. Set whichever you know. If only the received amount is known, omit `amount` and set `netAmount`. Always set the matching currency.
- **Say what kind of payment it is.** `type` is `donation` (a gift from the sender), `match` (funds a matching pool allocated because of other gifts), or `grant` (funds awarded through a selection process). Other values are allowed; omit it if unknown.
- **Name the intermediary in `via`.** `via` is the funding platform, payment servicer, or broker that facilitated or processed the payment. It is separate from the publisher: a platform can be named in `via` on a receipt someone else publishes.
- **Record payments through intermediaries by who chose the recipient.** If the sender chose the recipient, publish one receipt from sender to final recipient, even when platforms or fiscal hosts passed the funds on. If the intermediary chose the recipient (regranting), publish one receipt for the payment into the intermediary and a separate receipt for each onward payment.
- **Write amounts in the currency's normal unit.** Use a plain decimal string such as `"2500.00"` for `amount` and `netAmount`, in euros rather than cents and in ETH rather than wei. There is no field for scale, so a value in the smallest unit is indistinguishable from one many times larger.
- **Be precise about currency.** `currency` has no fixed vocabulary. For fiat money, the ISO 4217 code (`EUR`, `USD`) is the clearest choice. For digital assets, give the token ticker (such as `USDC`) and set `paymentNetwork`, because one ticker can mean different assets on different networks.
- **Describe how and where it was paid.** `paymentRail` says how the sender paid. Known values are `onchain`, `bank_transfer`, `card`, `direct_debit`, `mobile_money`, `payment_processor`, `cash`, and `check`; use `payment_processor` only when the underlying method is unknown. `paymentNetwork` says where `transactionId` can be looked up: for onchain payments, the chain, preferably as a CAIP-2 ID such as `eip155:1`; otherwise the processor or scheme, such as `stripe` or `sepa`.
- **Treat `transactionId` as public.** Use the ID of the sender's payment, not of a platform's later payout. Prefer opaque processor IDs to bank references, and remember that an onchain hash reveals the sender's wallet even when `from` is omitted.
- **Set `occurredAt`.** `createdAt` is when the record was written, which can be days or months after the payment. Use `occurredAt` to place a payment in a reporting period.
- **Link to the work with `for`.** It is the only property connecting a receipt to what it funded. Don't infer the funded work from `notes` or from the publisher's other records. `for` holds one reference, so a payment split across several activities is recorded as one receipt per activity, each with its share as `amount` and the same `transactionId`.
- **Correct in place, and don't duplicate.** Fix a mistake or add details by updating the existing receipt under the same record key, not by publishing a corrected copy alongside it. References by URI keep resolving, but strong references (such as likes and reposts) still pin the earlier version, and signatures must be renewed because they bind to the content. When another party has already recorded a payment, acknowledging their receipt adds confirmation without creating a second record that could be double counted.
- **Aggregate totals honestly.** One payment can have several receipts from different publishers, and anyone can publish receipts. Before summing, deduplicate receipts that describe the same payment allocation: the same `transactionId` and `paymentNetwork` and the same `for` target. Keep receipts with distinct `for` targets, since one payment split across several activities shares a `transactionId`. Also don't assume every receipt has an `amount`, don't mix gross `amount` with `netAmount`, don't add amounts in different currencies without stating the conversion rate and date, and decide which publishers to include. Show readers which receipts a total covers, and don't present it as all the funding a project received: no application can see every receipt on the network.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim), [Collection](/lexicons/hypercerts-lexicons/collection), and [Organization](/lexicons/certified-lexicons/organization): what a receipt's `for` typically points to.
- [Acknowledgement](/lexicons/hypercerts-lexicons/acknowledgement): confirmation or rejection of a receipt by a named party.
- [Signatures](/lexicons/certified-lexicons/signatures) and [Certified shared definitions](/lexicons/certified-lexicons/shared-defs): the DID and signature types a receipt uses.
- Guide: [Funding and Learning](/core-concepts/funding-and-value-flow), [Trust and Recognition](/core-concepts/certified-identity).
