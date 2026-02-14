---
title: Evaluation
---

# Evaluation

## Description

An evaluation of a hypercert or other claim.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.evaluation`

**Key:** `tid`

| Property      | Type     | Required | Description                                                                | Comments                                            |
| ------------- | -------- | -------- | -------------------------------------------------------------------------- | --------------------------------------------------- |
| `subject`     | `ref`    | ✅        | A strong reference to the evaluated claim                                  | (e.g measurement, hypercert, contribution, etc)     |
| `evaluators`  | `array`  | ✅        | DIDs of the evaluators                                                     |                                                     |
| `evaluations` | `array`  | ❌        | Evaluation data (URIs or blobs) containing detailed reports or methodology |                                                     |
| `summary`     | `string` | ✅        | Brief evaluation summary                                                   |                                                     |
| `location`    | `ref`    | ❌        | An optional reference for georeferenced evaluations                        | References must conform to `app.certified.location` |
| `createdAt`   | `string` | ✅        | Client-declared timestamp when this record was originally created          |                                                     |

***
