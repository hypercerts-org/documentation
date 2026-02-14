---
title: Evidence
---

# Evidence

## Description

A piece of evidence supporting a hypercert claim.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.evidence`

| Property           | Type     | Required | Description                                                                | Comments                                                                            |
| ------------------ | -------- | -------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `activity`         | `ref`    | ❌        | A strong reference to the activity this evidence is for                    | The record referenced must conform with the lexicon `org.hypercerts.claim.activity` |
| `content`          | `union`  | ✅        | A piece of evidence (URI or blobs) supporting a hypercert claim            |                                                                                     |
| `title`            | `string` | ✅        | Title to describe the nature of the evidence                               |                                                                                     |
| `shortDescription` | `string` | ❌        | Short description explaining what this evidence demonstrates or proves     |                                                                                     |
| `description`      | `string` | ❌        | Optional longer description describing the impact claim evidence.          |                                                                                     |
| `createdAt`        | `string` | ✅        | Client-declared timestamp when this hypercert claim was originally created |                                                                                     |
