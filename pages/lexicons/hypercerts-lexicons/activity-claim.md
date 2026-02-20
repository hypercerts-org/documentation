---
title: Activity Claim
---

# Activity Claim

## Description

The main lexicon where everything is connected to. This is the hypercert record that tracks impact work.

An activity claim is the atomic record in the hypercerts data model: a durable, referenceable statement that a clearly bounded piece of work is planned, ongoing, or completed.

It defines the work using four core dimensions:

* Who performed (or will perform) the work
* What was done (or will be done)
* When it happened (or will happen)
* Where it took place (or will take place)

By making work _precisely scoped and inspectable_, activity claims become stable reference points that others can build on: they can be linked to outcome claims, supported with measurements and attachments, and assessed through plural evaluations.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.activity`

**Key:** `any`

**Properties**

| Property                 | Type     | Required | Description                                                                                                                                              | Comments                                                                              |
| ------------------------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `title`                  | `string` | ✅        | Title of the hypercert                                                                                                                                   | Max 256 characters.                                                                   |
| `shortDescription`       | `string` | ✅        | Short summary of this activity claim, suitable for previews and list views.                                                                              | Max 300 graphemes. Rich text annotations via `shortDescriptionFacets`.                |
| `shortDescriptionFacets` | `array`  | ❌        | Rich text annotations for `shortDescription` (mentions, URLs, hashtags).                                                                                 | Each item is an `app.bsky.richtext.facet`.                                            |
| `description`            | `string` | ❌        | Optional longer description of the impact work done.                                                                                                     | Max 3000 graphemes. Rich text annotations via `descriptionFacets`.                    |
| `descriptionFacets`      | `array`  | ❌        | Rich text annotations for `description` (mentions, URLs, hashtags).                                                                                      | Each item is an `app.bsky.richtext.facet`.                                            |
| `image`                  | `union`  | ❌        | The cover photo of the hypercert as a URI or image blob                                                                                                  |                                                                                       |
| `workScope`              | `union`  | ❌        | Defines the scope of work covered by this activity claim. May be a strong reference to a `workScopeExpr` or `ops` record, or an inline `#workScopeString`. | See [Work Scope](#work-scope) below.                                                  |
| `startDate`              | `string` | ❌        | When the work began                                                                                                                                      | Format: `datetime` (ISO 8601).                                                        |
| `endDate`                | `string` | ❌        | When the work ended                                                                                                                                      | Format: `datetime` (ISO 8601).                                                        |
| `contributors`           | `array`  | ❌        | An array of contributor objects, each containing contributor identity, weight, and contribution details.                                                  | Each item is a `#contributor` object. See [Contributor](#contributor-object) below.    |
| `rights`                 | `ref`    | ❌        | A strong reference to the rights that this hypercert has                                                                                                 | References must conform to `org.hypercerts.claim.rights`. The SDK accepts inline rights objects (e.g., `{ rightsName, rightsType, rightsDescription }`) and handles creating the separate rights record internally. |
| `locations`              | `array`  | ❌        | Strong references to the locations where the work was performed                                                                                          | Each item is a strong reference. Referenced records must conform to `app.certified.location`. |
| `createdAt`              | `string` | ✅        | Client-declared timestamp when this record was originally created                                                                                        | Format: `datetime`.                                                                   |

### Contributor object

Each entry in the `contributors` array has this structure:

| Property               | Type    | Required | Description                                                                                                                                                     |
| ---------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contributorIdentity`  | `union` | ✅        | Contributor identity — either an inline `#contributorIdentity` (with an `identity` string field) or a strong reference to a `contributorInformation` record.    |
| `contributionWeight`   | `string`| ❌        | Relative weight of this contribution (positive numeric value, stored as string). Weights don't need to sum to a specific total — normalization is up to the app. |
| `contributionDetails`  | `union` | ❌        | Contribution details — either an inline `#contributorRole` (with a `role` string field) or a strong reference to a `contributionDetails` record.                |

### Work scope

The `workScope` field is a union type. It can be:

- **Inline string** — a `#workScopeString` object with a `scope` field for simple descriptions.
- **Strong reference** — pointing to a `org.hypercerts.helper.workScopeExpr` record (flat boolean expression with `allOf`/`anyOf`/`noneOf`) or a `org.hypercerts.helper.ops` record (nested boolean logic tree).

If no work scope is defined, the scope is treated as unconstrained.

***

## Notes

* All timestamps use the `datetime` format (ISO 8601)
* Strong references (`com.atproto.repo.strongRef`) include both the URI and CID of the referenced record
* Union types allow multiple possible formats (e.g., URI or blob)
* Array items may have constraints like `maxLength` to limit the number of elements
* String fields may have both `maxLength` (bytes) and `maxGraphemes` (Unicode grapheme clusters) constraints

## Examples

1. A group of software developers maintained the open-source library NumPy in 2025.
2. An organization stewarded a forest from 2020 to 2025 in location X.

In the first example, the _where_ dimension is irrelevant — and therefore can be left empty. It means that no matter where the work was performed, it is included in the hypercert. Similarly, the _what_ dimension could be empty for the forest stewards. It would mean that any activity that this organization did in that location is included in the hypercert.

In both cases, each component can be precisely identified:

* _**Who**_**:**
  1. the software developers (e.g., each identified by a DID or Github user account)
  2. the stewardship organization (e.g., a DID representing the organization)
* _**What**_**:**
  1. maintaining the NumPy library (referenced via its GitHub repository → [https://github.com/numpy/numpy](https://github.com/numpy/numpy))
  2. stewarding a specific forest area
* _**When**_**:**
  1. the calendar year 2025
  2. the period 2020–2025
* _**Where**_**:**
  1. _empty_ for software maintenance
  2. geographic coordinates identifying the specific forest location

## Code Example

{% callout %}
The SDK is in active development. Package names and API methods may change.
{% /callout %}

Create an activity claim record:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://pds.example.com' })
await agent.login({ identifier: 'your-handle', password: 'your-app-password' })

const response = await agent.api.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: 'org.hypercerts.claim.activity',
  record: {
    // Title of the hypercert
    title: 'Open Source Library Maintenance',
    // Short description of the impact work
    shortDescription: 'Maintained and improved the core library throughout 2025',
    // Scope of the work (inline string form)
    workScope: {
      $type: 'org.hypercerts.claim.activity#workScopeString',
      scope: 'library-maintenance',
    },
    // When the work began
    startDate: '2025-01-01T00:00:00Z',
    // When the work ended
    endDate: '2025-12-31T23:59:59Z',
    // Timestamp when this record was created
    createdAt: new Date().toISOString(),
  },
})

console.log('Created:', response.data.uri)
```
