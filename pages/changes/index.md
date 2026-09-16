---
title: Changes
description: The current Hypercerts Protocol release, its new capabilities, and the release histories of the components that support it.
---

# Changes

{% release-summary /%}

## Component releases

{% release-cards /%}

## How versions work

**Major and minor versions identify the shared protocol release line**, such as 1.4. Included components can advance their patch versions independently within that line. A new coordinated major or minor release brings the components into alignment again.

A compatible addition, such as the new feature and vocabulary-tag Lexicons in 1.4, is a minor release. Fixes advance the affected component's patch version. Breaking changes require a major release and migration guidance; a breaking change to an existing record format also needs a new schema identifier.

Within a shared release line, use the latest stable patch of each component. A hosted service may run a different version from its latest published release.
