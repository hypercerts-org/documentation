---
title: EVM Link
description: Lexicon reference for app.certified.link.evm, the record that links an account's DID to an EVM wallet address with a signed proof.
---

# EVM Link

`app.certified.link.evm`

## Overview

An EVM link connects an AT Protocol account to an EVM wallet address. It lets applications show that the account and the wallet belong together, for example to connect onchain funding to the account that received it.

The link is backed by two different facts. The account side comes from where the record lives: it is published in the account's own repository. The wallet side comes from the `proof`: an EIP-712 typed-data signature made by the wallet's key over a message naming both the DID and the address. Today the proof supports externally owned accounts (EOAs); the `proof` union is open so other methods, such as smart-contract wallets, can be added later.

For how accounts work, see [Account & Identity Setup](/architecture/account-and-identity). For trust signals beyond the publishing repository, see [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

## How it's used

- **An account links its wallet.** An app asks the user to sign the typed-data message with their wallet, then writes the link record into the user's repository with the signed message and signature.
- **Apps verify and display the link.** A reader checks the proof and then shows the wallet on the account's profile, or shows the account next to activity from that wallet.
- **Funding records meet accounts.** A [funding receipt](/lexicons/hypercerts-lexicons/funding-receipt) can name a sender or recipient as free text, which may be a wallet address. A verified EVM link is what lets an app connect that address to an account; the address alone does not.

The record key type is `any`, and an account can hold several links, for one address or for many. The schema has no notion of a primary wallet.

## Schema

{% lexicon-schema nsid="app.certified.link.evm" /%}

## Example

An account linking its wallet. The record is published in the repository of `did:plc:4yyb5gyoxl3sqdlqrvuxshkp`, the DID named in the signed message. The signature is illustrative.

```json
{
  "$type": "app.certified.link.evm",
  "address": "0x3F8c2a91D4E7b6051C9A2e8f7D4B3c6a1e0f9D27",
  "proof": {
    "$type": "app.certified.link.evm#eip712Proof",
    "signature": "0x283ee30dbc15fd1ad579f79493b01bb7178d1bdb7860da53cecb511cef5057e378bbbe649c57227bb706540dddd858b26d7fca711e25baf8d4ff946f75c5a5c41b",
    "message": {
      "$type": "app.certified.link.evm#eip712Message",
      "did": "did:plc:4yyb5gyoxl3sqdlqrvuxshkp",
      "evmAddress": "0x3F8c2a91D4E7b6051C9A2e8f7D4B3c6a1e0f9D27",
      "chainId": "10",
      "timestamp": "1789203600",
      "nonce": "48213907"
    }
  },
  "createdAt": "2026-09-12T09:00:00.000Z"
}
```

## Rules and best practices

- **Verify before showing the link as confirmed.** Schema validation checks lengths, not cryptography. Before presenting the link, check that the message's `did` is the DID of the repository holding the record, that `evmAddress` matches `address` (compare without regard to letter case), and that the signature recovers to that address. Show a record that fails or wasn't checked as unverified.
- **The typed-data definition isn't in the record.** An EIP-712 digest depends on the domain, the primary type name, and the types and order of the message fields. The record carries only the field values, so verifiers need to use the same typed-data definition as the app that created the signature.
- **Write numbers as plain decimal strings.** `chainId`, `timestamp`, and `nonce` are big integers stored as strings. Use unsigned decimal digits with no `0x` prefix.
- **Use the EIP-55 checksum form.** Write `address` and `evmAddress` in mixed-case checksum form, and write them identically. The schema checks only the length.
- **One link applies across EVM chains.** For an EOA, `chainId` records which chain was used for signing, but the link applies to the same address on every EVM-compatible chain.
- **A proof shows a signature was made once, not current control.** There is no expiry or revocation field. The wallet may have changed hands since. To remove a link, delete the record.
- **An address can be linked to several accounts.** A wallet key can sign messages naming any number of DIDs. When looking up accounts for an address, treat the result as possibly many and show every verified link, not one of them as the owner.
- **Proof and signatures do different jobs.** `proof` shows the wallet holder consented to the link. The optional `signatures` property can show who produced the record, for example that a platform created it on the user's behalf. Neither replaces the other.
- **A link proves key control, nothing more.** It doesn't verify the account, the person behind it, or anything the wallet has done onchain.

## Related

- [Signatures](/lexicons/certified-lexicons/signatures): the optional `signatures` property and record-content attestations.
- [Funding Receipt](/lexicons/hypercerts-lexicons/funding-receipt): may name a wallet address as sender or recipient.
- [Profile](/lexicons/certified-lexicons/profile) and [Organization](/lexicons/certified-lexicons/organization): the account a wallet is linked to.
- Guide: [Trust and Recognition](/core-concepts/certified-identity), [Funding and Learning](/core-concepts/funding-and-value-flow).
