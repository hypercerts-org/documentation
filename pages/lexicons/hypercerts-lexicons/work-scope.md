---
title: Work Scope
description: Lexicon reference for org.hypercerts.workscope.tag and org.hypercerts.workscope.cel, the building blocks of structured work scopes on activity claims.
---

# Work Scope

`org.hypercerts.workscope.tag` · `org.hypercerts.workscope.cel`

## Overview

A work scope says what an [activity claim](/lexicons/hypercerts-lexicons/activity-claim) covers. The activity's `workScope` field accepts either a plain-text description or a structured scope. This page covers the structured form, which has two parts:

- **Work-scope tags** (`org.hypercerts.workscope.tag`) are records. Each one defines a reusable scope term, such as `solar_pv_installation` or `mangrove_restoration`, with a machine-readable `key`. A curator publishes them once and many activities use them.
- **CEL expressions** (`org.hypercerts.workscope.cel`) are objects embedded directly in an activity's `workScope`. Each holds an expression in [Common Expression Language (CEL)](https://github.com/google/cel-spec) that combines tag keys with logic, plus strong references to the tags it uses.

A list of tags can only say "all of these". An expression can also say "this but not that", "either of these", or combine a tag test with other conditions, which is how boundaries between pieces of work are usually drawn. For the concepts behind it, see [Describing and Classifying Work](/core-concepts/cel-work-scopes) in the Guide.

## How it's used

- **A curator publishes scope terms.** A funder, network, or community publishes work-scope tag records for the kinds of work it cares about, with `parent` links to build a taxonomy and `status` to show which terms are accepted.
- **A project writes a scope for its activity.** The activity's `workScope` holds a CEL object whose `expression` names tag keys, and whose `usedTags` pins the exact tag records those keys refer to.
- **Applications compare and filter.** A funder's application can evaluate expressions to find activities within its focus, or check whether two claims describe overlapping work.

Work-scope tags are separate from [vocabulary tags](/lexicons/hypercerts-lexicons/vocabulary-tag), which classify Hypercerts records, today collections and features. An expression uses work-scope tags only.

## Work-scope tag schema

A work-scope tag is a record stored in the curator's repository.

{% lexicon-schema nsid="org.hypercerts.workscope.tag" /%}

## CEL expression schema

The CEL expression is an object, not a record. It has no AT-URI of its own and lives inside the activity's `workScope`, with `$type` set to `org.hypercerts.workscope.cel`.

{% lexicon-schema nsid="org.hypercerts.workscope.cel" /%}

## Example

A community energy network's scope term for solar installation work:

```json
{
  "$type": "org.hypercerts.workscope.tag",
  "key": "solar_pv_installation",
  "name": "Solar PV installation",
  "category": "method",
  "description": "Design, permitting, and physical installation of photovoltaic generation, up to and including grid connection. Excludes operation and maintenance after commissioning.",
  "parent": {
    "uri": "at://did:plc:3kzv6qm7xw2hrl5tdnyb4fae/org.hypercerts.workscope.tag/3lw4xq2mzpk2b",
    "cid": "bafyreidq6mzvt2k4xh7wrnjlb5ypc3sfaeg4ukoqz6hvdx2m7tnbi3lwye"
  },
  "status": "accepted",
  "aliases": ["PV installation", "Solar array installation"],
  "sameAs": ["https://vocab.example.org/energy/solar-pv-installation"],
  "createdAt": "2026-02-10T08:00:00.000Z"
}
```

An activity using that term, together with `community_ownership` and an explicit exclusion of `system_maintenance`, in its work scope. Each entry in `usedTags` points to the tag record for one key in the expression:

```json
{
  "$type": "org.hypercerts.claim.activity",
  "title": "Solar array installation, phase 1",
  "shortDescription": "Installation of a 40 kW community-owned solar array on the village hall roof.",
  "workScope": {
    "$type": "org.hypercerts.workscope.cel",
    "expression": "scope.hasAll(['solar_pv_installation', 'community_ownership']) && !scope.hasAll(['system_maintenance'])",
    "usedTags": [
      {
        "uri": "at://did:plc:3kzv6qm7xw2hrl5tdnyb4fae/org.hypercerts.workscope.tag/3lw4xr7kbtc2a",
        "cid": "bafyreihx3ktq7vz2m5rnwdlp4yjc6sfa2ge7ukoqb4hvzx3m6tnci2lwpa"
      },
      {
        "uri": "at://did:plc:3kzv6qm7xw2hrl5tdnyb4fae/org.hypercerts.workscope.tag/3lw4xs2dnvq2c",
        "cid": "bafyreif5ntq2kx7vzm3rwdlh6yjb4sfc2ge5ukoqa7hvzx2m4tnci6lwqe"
      },
      {
        "uri": "at://did:plc:3kzv6qm7xw2hrl5tdnyb4fae/org.hypercerts.workscope.tag/3lw4xt5hqrm2d",
        "cid": "bafyreigk2ntq5vx7zm4rwdlc3yjb6sfd2ge4ukoqh5hvzx7m2tnci3lwra"
      }
    ],
    "version": "v1",
    "createdAt": "2026-07-02T09:15:00.000Z"
  },
  "startDate": "2026-03-01T00:00:00.000Z",
  "endDate": "2026-06-30T00:00:00.000Z",
  "createdAt": "2026-07-02T09:15:00.000Z"
}
```

## Rules and best practices

- **Start with plain text.** A `workScopeString` is enough when people are the audience. Use the CEL form when software needs to compare, filter, or combine scopes.
- **Write keys as lowercase words joined by underscores.** The schema describes `key` this way (for example `mangrove_restoration`) but does not enforce it. Keys appear inside expression strings, so avoid spaces, dots, and quote characters.
- **List every tag the expression names in `usedTags`.** The key in the expression and the strong reference together say which definition of a term the scope was written against. Two curators can publish tags with the same key, so readers bind a key through `usedTags`, not by searching for any tag with that key. Avoid entries for tags the expression doesn't use.
- **Don't read `usedTags` as the scope.** It lists the terms the expression mentions, including terms it excludes. In the example above, `system_maintenance` is in `usedTags` because the work does not include it.
- **Set `version` to `v1`.** It is the only known value. The lexicons do not publish the evaluation context itself; the `expression` description gives `scope.hasAll([...])` and `location.country` as an example. Applications that evaluate expressions need to agree on the context and on which CEL functions they support.
- **Treat an expression you can't evaluate as unknown, not empty.** If an expression fails to parse, uses functions an application doesn't support, or a referenced tag can't be resolved, the activity still has a scope. Show it as unevaluated rather than leaving it out of results or treating it as matching.
- **Evaluate untrusted expressions safely.** Expressions come from any account. Applications typically limit evaluation time and don't give the evaluation context access to the network or file system.
- **Keep `createdAt` tied to the scope.** The CEL object's `createdAt` dates the scope statement. Keep it unchanged when you edit other fields of the activity, and update it when the expression or tags change.
- **Retire tags instead of renaming them.** To change a term, publish a new tag, set the old one's `status` to `deprecated`, and point its `supersededBy` at the new one. Expressions that pinned the old tag keep their original meaning.
- **A parent is context, not an automatic match.** `parent` builds a taxonomy, but no rule says a term also matches its parent or children during evaluation. If an application expands terms, make that visible to readers.
- **Reuse accepted tags.** Referencing an existing tag that your users recognize keeps scopes comparable. Mark new, uncurated tags as `proposed`.

## Related

- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim): the record whose `workScope` holds the CEL object or a plain-text scope.
- [Vocabulary Tag](/lexicons/hypercerts-lexicons/vocabulary-tag): classification terms for Hypercerts records, used today by collections and features.
- [Shared Definitions](/lexicons/hypercerts-lexicons/shared-defs): the `uri` and `smallBlob` objects used by `referenceDocument`.
- Guide: [Describing and Classifying Work](/core-concepts/cel-work-scopes), [Activity Claims](/core-concepts/what-is-hypercerts), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
