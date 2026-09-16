---
title: Changes
description: The current Hypercerts Protocol release, its new capabilities, and the release histories of the components that support it.
---

# Changes

This site is the canonical record of Hypercerts Protocol major and minor releases. Each release explains what changed for builders; the component changelogs retain the detailed implementation history.

{% release-summary /%}

## Component releases

The protocol stack includes **Lexicons, Hypercerts API, SDK, Certified Group Service, Entryway, Relay, and Feed Service**. These cards and the sidebar show their latest published stable releases, refreshed when this site builds.

Shared major/minor numbering is being adopted. Some components still have earlier version numbers or are under development. The versions below are the actual published versions, not a claim that the entire stack has already been released and tested together on 1.4.

{% release-cards /%}

## How versions work

**Major and minor versions identify the shared protocol release line**, such as 1.4. Included components can advance their patch versions independently within that line. A new coordinated major or minor release brings the components into alignment again.

A compatible addition, such as the new feature and vocabulary-tag Lexicons in 1.4, is a minor release. Fixes advance the affected component's patch version. Breaking changes require a major release and migration guidance; a breaking change to an existing record format also needs a new schema identifier.

The intended integration path is the latest stable patch of each participating component within the same release line, backed by compatibility testing. Published component versions are distinct from the versions currently deployed by a particular hosted service.

## Earlier releases

The [protocol changelog](/changes/protocol) covers **1.0 through 1.4**, reconstructed from the published Lexicon history. Its dates are the corresponding Lexicon release dates; the entries do not imply that every service released simultaneously at those times.

Future protocol releases will summarize changes across the whole stack. Release articles can provide worked examples alongside these entries when published.
