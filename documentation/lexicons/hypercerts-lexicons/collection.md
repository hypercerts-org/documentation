# Collection

## Description

A collection/group of hypercerts that have a specific property.



## Lexicon

**Lexicon ID:** `org.hypercerts.claim.collection`

**Key:** `tid`

| Property           | Type     | Required | Description                                                             | Comments                          |
| ------------------ | -------- | -------- | ----------------------------------------------------------------------- | --------------------------------- |
| `title`            | `string` | ✅        | The title of this collection                                            |                                   |
| `shortDescription` | `string` | ❌        | A short description of this collection                                  |                                   |
| `coverPhoto`       | `union`  | ❌        | The cover photo of this collection (either in URI format or in a blob). |                                   |
| `claims`           | `array`  | ✅        | Array of claims with their associated weights in this collection        | Each item references `#claimItem` |
| `createdAt`        | `string` | ✅        | Client-declared timestamp when this record was originally created       |                                   |

**Defs**



**claimItem**



| Property | Type     | Required | Description                                                                                                                                                                                  | Comments |
| -------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `claim`  | `ref`    | ✅        | A strong reference to a hypercert claim record. This claim must conform to the lexicon org.hypercerts.claim.activity                                                                         |          |
| `weight` | `string` | ✅        | The weight/importance of this hypercert claim in the collection (a percentage from 0-100, stored as a string to avoid float precision issues). The total claim weights should add up to 100. |          |
