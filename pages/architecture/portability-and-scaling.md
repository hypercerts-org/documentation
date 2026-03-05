---
title: Portability & Data Access
description: How ATProto enables data migration, app switching, and transparent data access.
---

# {% $markdoc.frontmatter.title %}

## Switching PDSs

Users can migrate their entire repository to a new PDS without breaking references. The migration process:

1. Export the repository from the old PDS (a signed commit history)
2. Import it to the new PDS
3. Update the DID document to point to the new PDS URL
4. Applications automatically follow the new location

AT-URIs use DIDs, not server addresses, so references remain valid after migration.

## Switching apps

Because data is stored on PDSs, not in application databases, users can switch apps without losing data. A claim created in App A is immediately readable by App B. Evaluations, attachments, and measurements created in different apps all reference the same underlying claims.

This is fundamentally different from traditional platforms, where switching apps means starting over.

## Public by default

ATProto records are public by default. Anyone can read your activity claims, evaluations, and contributions. This is intentional — impact work benefits from transparency and discoverability.
