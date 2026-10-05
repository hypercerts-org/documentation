---
title: Vocabulary Tag
description: Lexicon reference for org.hypercerts.vocab.tag, a reusable term for classifying Hypercerts records, used today by collections and features.
---

# Vocabulary Tag

`org.hypercerts.vocab.tag`

## Overview

A vocabulary tag is one term in a shared classification vocabulary, such as a land-cover class, a zone role, or a methodology. Instead of typing "mangrove" into a free-text field, a record points to a published tag that says what "mangrove" means, who defined it, and how it relates to other terms.

Because each tag is a record with its own publisher and AT-URI, two tags called "restoration" from different organizations stay distinct, and an application can inspect the intended meaning instead of guessing from the label. For the concepts behind it, see [Describing and Classifying Work](/core-concepts/cel-work-scopes) in the Guide.

## How it's used

- **A curator publishes a vocabulary.** A funder, registry, standards body, or community publishes a set of tag records, each with a `category` (the classification axis), a `key`, a `name`, and a definition in `description`. Any account can publish tags; there is no central registry.
- **Records reference tags to classify themselves.** [Collections](/lexicons/hypercerts-lexicons/collection) and [features](/lexicons/hypercerts-lexicons/feature) carry a `tags` array of strong references to tag records. A directory can then group projects by subject, or a funder can find land areas of a given type.
- **Terms form a hierarchy.** `broader` links a term to one or more directly broader terms, so "mangrove" can sit under "coastal wetland" and "forest" at the same time.
- **Terms are retired, not deleted.** A curator sets `status` to `deprecated` and points `supersededBy` at the replacement. Records that used the old term keep their references, and applications can show the replacement alongside it.
- **External vocabularies line up.** `sameAs` lists URIs of exactly equivalent concepts elsewhere (for example ENVO or IUCN ecosystem types), so data keyed by an external vocabulary can be joined to Hypercerts records.

Vocabulary tags classify records so people can find them. They are separate from [work-scope tags](/lexicons/hypercerts-lexicons/work-scope), which describe what an activity covers.

## Schema

{% lexicon-schema nsid="org.hypercerts.vocab.tag" /%}

## Example

A land-restoration vocabulary term for mangrove land cover, published at record key `land-cover.mangrove`:

```json
{
  "$type": "org.hypercerts.vocab.tag",
  "key": "mangrove",
  "name": "Mangrove",
  "category": "land-cover",
  "description": "Intertidal forest or shrubland dominated by salt-tolerant mangrove species. Use for areas where mangrove canopy covers at least 10% of the ground, including replanted stands. Use bare-mudflat for tidal areas without woody cover.",
  "broader": [
    {
      "uri": "at://did:plc:3kzv6qm7xw2hrl5tdnyb4fae/org.hypercerts.vocab.tag/land-cover.coastal-wetland",
      "cid": "bafyreibv4hwqkz7m2xrd3ylpnc6tjsa5fqe2gkoh4wzvmu3i7db6xnlqye"
    }
  ],
  "status": "accepted",
  "aliases": ["Mangrove forest", "Mangal"],
  "sameAs": ["https://vocab.example.org/land-cover/mangrove"],
  "referenceDocument": {
    "$type": "org.hypercerts.defs#uri",
    "uri": "https://restoration-vocab.example.org/land-cover/mangrove"
  },
  "createdAt": "2026-05-14T10:20:00.000Z"
}
```

## Rules and best practices

- **Use the record key `<category>.<key>`.** The schema recommends a deterministic record key such as `land-cover.mangrove` or `zone-role.site`. Validation cannot check that the record key matches the body, so writers and indexers keep the two in agreement.
- **Keep `key` and `category` lowercase and free of dots.** Both use the `record-key` format, which permits dots and uppercase, but a dot makes the composed record key ambiguous and a case variant creates a second term that will not match the first.
- **Write a real definition.** `description` is what lets someone outside your organization apply the term consistently. A name alone rarely says where the boundary of a term lies; say what is included and, where useful, what belongs under a neighboring term.
- **Classify by reference, not by label.** A term is identified by its AT-URI. Two tags with the same `name` or a shared alias are not the same term. Use `aliases` for search, autocompletion, and display, not to decide which term a record uses.
- **Reuse before you mint.** If an existing, accepted term from a vocabulary your users recognize fits, reference it rather than copying it into your own repository. A private copy breaks the comparability that shared terms exist to provide.
- **Mark new terms as `proposed`.** `status` is required. Use `proposed` for terms that have not been through a curation process, `accepted` for terms in governed use, and `deprecated` for retired terms.
- **Publish a changed concept as a new term.** If the meaning of a term changes, create a new record, set the old one to `deprecated`, and point its `supersededBy` at the new one. Editing the definition in place silently changes what earlier classifications meant.
- **Keep `sameAs` for exact matches.** List only external concepts that mean exactly the same thing. Broader, narrower, or related concepts do not belong there.
- **A tag array is a set of facts.** All tags on a collection or feature apply at once (logical AND), with no order, weighting, or negation. Put boolean logic in a work scope instead, and don't reference the same tag twice in one array.
- **Readers pin a version and look up the current state.** A tag reference pins the version (CID) the record was classified against. To find whether a term has since been deprecated or superseded, applications resolve the term by its URI. A retired term still classifies the records that used it.
- **Hierarchy is not inheritance.** `broader` states a direct relationship. A record tagged "mangrove" has not itself asserted "coastal wetland". An application that expands a query to broader or narrower terms should make that visible to the reader.

## Related

- [Collection](/lexicons/hypercerts-lexicons/collection) and [Feature](/lexicons/hypercerts-lexicons/feature): the records that carry `tags`.
- [Work Scope](/lexicons/hypercerts-lexicons/work-scope): a separate tag system for describing what an activity covers.
- [Shared Definitions](/lexicons/hypercerts-lexicons/shared-defs): the `uri` and `smallBlob` objects used by `referenceDocument`.
- Guide: [Describing and Classifying Work](/core-concepts/cel-work-scopes), [Records That Change Over Time](/architecture/data-flow-and-lifecycle), [Finding and Reusing Information](/architecture/portability-and-scaling).
