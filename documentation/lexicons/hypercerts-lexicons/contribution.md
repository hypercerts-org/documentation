# Contribution

## Description

A contribution made toward a hypercert's impact.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.contribution`

**Key:** `any`

| Property       | Type     | Required | Description                                                                                                                                                             | Comments |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `contributors` | `array`  | ✅        | List of the contributors (names, pseudonyms, or DIDs). If multiple contributors are stored in the same hypercertContribution, then they would have the exact same role. |          |
| `createdAt`    | `string` | ✅        | Client-declared timestamp when this record was originally created                                                                                                       |          |
| `role`         | `string` | ❌        | Role or title of the contributor(s).                                                                                                                                    |          |
| `description`  | `string` | ❌        | What the contribution concretely achieved                                                                                                                               |          |
| `startDate`    | `string` | ❌        | When this contribution started. This should be a subset of the hypercert timeframe.                                                                                     |          |
| `endDate`      | `string` | ❌        | When this contribution finished. This should be a subset of the hypercert timeframe.                                                                                    |          |

***

<br>
