---
title: Work Scopes and Classification
description: How Hypercerts records describe and classify the work covered by a claim.
---

# Work Scopes and Classification

A work scope describes what an activity covers. Classification tags describe projects, features, and reusable categories. The released model keeps these concerns separate.

## Activity work scopes

An activity's `workScope` can contain either:

- A free-form work-scope string for human-readable descriptions.
- An embedded `org.hypercerts.workscope.cel` object for machine-readable expressions.

The CEL object is embedded inside the activity; it is not a repository record. It contains an expression, a version, and `usedTags`, which are strong references to `org.hypercerts.workscope.tag` records.

Work-scope tags are reusable atoms for expressions. They can identify a parent tag, an equivalent external concept, or a replacement tag. Applications still need to decide which publishers and vocabularies they recognize.

## General classification

`org.hypercerts.vocab.tag` provides broader classifications for:

- `org.hypercerts.collection` records, including project collections.
- `org.hypercerts.entity.feature` records.

General vocabulary tags can name broader concepts, equivalent external concepts, and superseding tags. The attached tags apply together by the released convention; they do not provide the Boolean expression language used by activity work scopes.

## The three related schema families

- `org.hypercerts.workscope.cel` defines the structured Common Expression Language (CEL) object used by work-scope fields.
- `org.hypercerts.workscope.tag` defines reusable terms used in work-scope expressions.
- `org.hypercerts.vocab.tag` provides broader classification tags outside the work-scope expression model.

These replace the older `org.hypercerts.ontology.*` names that appeared in previous documentation drafts.

## Shared usage guidance

- Use a simple textual scope when shared machine interpretation is not required.
- Use a CEL scope when consumers need to apply logical operations to shared work-scope terms.
- Use general vocabulary tags for classification of a collection or feature, not as a substitute for an activity's work-scope expression.
- Preserve the publisher's AT-URI with every referenced tag. Matching names or keys from different repositories do not establish identical meaning.
- Follow `supersededBy` and hierarchy relationships according to an explicit application policy. The Lexicons do not prevent cycles or invalid hierarchies.
- Preserve unknown `knownValues`, tags, and CEL versions even when the application cannot interpret them.
- Do not describe a scope or classification as verified merely because it passes structural validation.

## Open values and governance

Lexicon `knownValues` are open suggestions, not closed enums. A writer may publish another value that remains structurally valid. This supports extension, but it also means interoperable applications need fallback behavior.

Vocabulary authority is similarly contextual. The DID in a tag's AT-URI identifies its publisher. It does not make that publisher universally authoritative for a domain. Applications should state which tag publishers they recognize and retain the original source when presenting normalized categories.

For exact fields and constraints, use the released `@hypercerts-org/lexicon` package and the [Lexicon inventory](/reference/lexicon-inventory). Tested SDK examples remain part of the evolving [Client Integration](/client-integration) path.

## Related pages

- [Core Data Model](/core-concepts/hypercerts-core-data-model)
- [Validation, Extension & Interpretation](/core-concepts/validation-and-interpretation)
- [Lexicon inventory](/reference/lexicon-inventory)
