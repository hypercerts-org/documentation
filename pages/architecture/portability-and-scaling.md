---
title: Portability & Data Access
description: How ATProto enables data migration, app switching, and transparent data access.
---

# {% $markdoc.frontmatter.title %}

## Public by default

ATProto records are public by default. Anyone can read your activity claims, evaluations, and contributions. This is intentional — impact work benefits from transparency and discoverability.

## Switching PDSs

Users can migrate their entire repository to a new PDS without breaking references. Export from the old PDS, import to the new one, and update your DID document to point to the new URL. Applications automatically follow.

This works because AT-URIs use DIDs, not server addresses — so all existing references remain valid after migration. See the [ATProto account migration guide](https://atproto.com/guides/account-migration) for the full process.

## Interoperable data

Because data is stored on PDSs, not in application databases, users can switch apps without losing data. A claim created in App A is immediately readable by App B. Evaluations, attachments, and measurements created in different apps all reference the same underlying claims.

This is fundamentally different from traditional platforms, where switching apps means starting over.
