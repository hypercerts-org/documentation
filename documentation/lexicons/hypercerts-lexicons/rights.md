# Rights

## Description

Describes the rights that a user has to the hypercert, such as whether it can be sold, transferred, and under what conditions.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.rights`

**Key:** `any`

**Properties**

| `rightsName`        | `string` | ✅ | Full name of the rights                                           | ​           |
| ------------------- | -------- | - | ----------------------------------------------------------------- | ----------- |
| `rightsType`        | `string` | ✅ | Short rights identifier for easier search                         | ​           |
| `rightsDescription` | `string` | ✅ | Description of the rights of this hypercert                       | ​           |
| `attachment`        | `union`  | ❌ | An attachment to define the rights further, e.g. a legal document | URI or blob |
| `createdAt`         | `string` | ✅ | Client-declared timestamp when this record was originally created |             |
