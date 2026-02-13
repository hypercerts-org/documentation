# Activity Claim

## Description <a href="#hypercerts-activity-claim" id="hypercerts-activity-claim"></a>

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

| `title`            | `string` | ✅ | Title of the hypercert                                                                                                                                                                                                   | ​                                                              |
| ------------------ | -------- | - | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `shortDescription` | `string` | ✅ | Short blurb of the impact work done.                                                                                                                                                                                     | ​                                                              |
| `description`      | `string` | ❌ | Optional longer description of the impact work done.                                                                                                                                                                     | ​                                                              |
| `image`            | `union`  | ❌ | The cover photo of the hypercert as a URI or image blob                                                                                                                                                                  | ​                                                              |
| `workScope`        | `object` | ❌ | Logical scope of the work using label-based conditions. See [work scope](https://app.gitbook.com/o/uxU8o4s6mrp88yBisLn5/s/8dkOAon1uQbyqL8RomaJ/hypercert-claim-lexicons/the-impact-and-work-space) for more information. | Object with `allOf`, `anyOf`, `noneOf` arrays of labels        |
| `startDate`        | `string` | ✅ | When the work began                                                                                                                                                                                                      | ​                                                              |
| `endDate`          | `string` | ✅ | When the work ended                                                                                                                                                                                                      | ​                                                              |
| `contributions`    | `array`  | ❌ | A strong reference to the contributions done to create the impact in the hypercerts                                                                                                                                      | References must conform to `org.hypercerts.claim.contribution` |
| `rights`           | `ref`    | ❌ | A strong reference to the rights that this hypercert has                                                                                                                                                                 | References must conform to `org.hypercerts.claim.rights`       |
| `location`         | `ref`    | ❌ | A strong reference to the location where the work for done hypercert was located                                                                                                                                         | References must conform to `app.certified.location`            |
| `createdAt`        | `string` | ✅ | Client-declared timestamp when this record was originally created                                                                                                                                                        | ​                                                              |

***

## Notes <a href="#notes" id="notes"></a>

* All timestamps use the `datetime` format (ISO 8601)
* Strong references (`com.atproto.repo.strongRef`) include both the URI and CID of the referenced record
* Union types allow multiple possible formats (e.g., URI or blob)
* Array items may have constraints like `maxLength` to limit the number of elements
* String fields may have both `maxLength` (bytes) and `maxGraphemes` (Unicode grapheme clusters) constraints

## Examples <a href="#notes" id="notes"></a>

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

<br>
