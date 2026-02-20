---
title: Funding Receipt
---

# Funding Receipt

## Description

Records a funding receipt for a payment from one user to another. It may be recorded by the recipient, by the sender, or by a third party. The sender may remain anonymous.

## Lexicon

**Lexicon ID:** `org.hypercerts.funding.receipt`

**Key:** `tid`

| Property | Type | Required | Description | Comments |
| --- | --- | --- | --- | --- |
| `from` | `ref` | ❌ | DID of the sender who transferred the funds | References `app.certified.defs#did`. Omit if the sender wants to stay anonymous. |
| `to` | `string` | ✅ | The recipient of the funds | Can be identified by DID or a clear-text name. |
| `amount` | `string` | ✅ | Amount of funding received | |
| `currency` | `string` | ✅ | Currency of the payment | E.g. EUR, USD, ETH. |
| `paymentRail` | `string` | ❌ | How the funds were transferred | E.g. `bank_transfer`, `credit_card`, `onchain`, `cash`, `check`, `payment_processor`. |
| `paymentNetwork` | `string` | ❌ | Network within the payment rail | E.g. `arbitrum`, `ethereum`, `sepa`, `visa`, `paypal`. |
| `transactionId` | `string` | ❌ | Identifier of the underlying payment transaction | E.g. bank reference, onchain transaction hash, or processor-specific ID. Use `paymentNetwork` to specify the network where applicable. |
| `for` | `string` | ❌ | Reference to the activity, project, or organization this funding relates to | Format: `at-uri`. |
| `notes` | `string` | ❌ | Optional notes or additional context | Max 500 characters. |
| `occurredAt` | `string` | ❌ | Timestamp when the payment occurred | Format: `datetime`. |
| `createdAt` | `string` | ✅ | Client-declared timestamp when this receipt record was created | Format: `datetime`. |

---

## Code Example

{% callout type="note" %}
This example uses the low-level `@atproto/api` with app passwords for brevity. For production, use OAuth — see the [Quickstart](/getting-started/quickstart) and [SDK reference](/tools/sdk).
{% /callout %}

Create a funding receipt:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.funding.receipt',
  record: {
    // DID of the funder (omit for anonymous funding)
    from: 'did:plc:funder123',
    // Recipient — DID or clear-text name
    to: 'did:plc:recipient456',
    // Amount and currency
    amount: '5000',
    currency: 'USD',
    // How the payment was made
    paymentRail: 'bank_transfer',
    paymentNetwork: 'sepa',
    // Link to the funded activity claim
    for: 'at://did:plc:recipient456/org.hypercerts.claim.activity/tid123',
    // When the payment happened
    occurredAt: '2026-01-15T10:00:00Z',
    // When this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
