# Documentation information architecture

This is the working migration map for the protocol-first documentation restructure. It is a maintainer document, not a protocol specification.

## Principles

- The documentation has four primary sections: Guide, Client Integration, Reference, and Changes.
- Together, the Guide, Lexicons, API and SDK contracts, reference implementation behavior, and change history describe the protocol. There is no separate ratified formal specification.
- Guide pages explain meaning and shared usage. Reference pages provide exact source-backed contracts.
- Integration pages publish tested paths, not inferred or aspirational APIs.
- Existing public routes remain stable during the first pass unless their content has been explicitly retired.
- A proposal in the third editor's draft is not a protocol requirement unless it is independently ratified and reflected in authoritative sources.

## Guide reader journey

The landing page introduces the promise; the Guide explains how it works; Client Integration helps readers build; Reference supplies the details they look up along the way.

Assume readers have seen the landing page, with an optional link to `https://hypercerts.org` at the start for those who haven't. The Guide follows the same story one level deeper: reuse existing knowledge, connect contributions from different people, build a fuller picture over time, and bring it into funding decisions.

- Begin with familiar questions and explain technical terms at the point they become useful. Introduce AT Protocol, repositories, Lexicons, and indexers early enough to explain cross-application reuse.
- Give activities, projects, evidence, and evaluations recognizable concept pages. Explain what they are and why a reader would use them before discussing schema details.
- Use short illustrative examples. Keep field inventories, exhaustive validation rules, and implementation contracts in Reference or Client Integration.
- Explain a limitation alongside the decision it affects, rather than opening each page with a list of things the protocol cannot do.
- Keep the Guide navigation flat and ordered for a start-to-finish reading path. Each page leads to the next; the final page leads to Client Integration with its current implementation status clear.
- Treat the older vision essay as separate background, outside the sequential Guide. It includes historical economic ideas that would interrupt the current learning path.

## Documentation landing page

The root route is a section directory, with a short introduction, four section overviews, and curated links into each section. It has no sidebar, table of contents, or article tools. The header and a compact section navigation on smaller screens provide access to the section hubs; each hub retains its own sidebar.

The public name and route for change history are **Changes** and `/changes`. Redirect the previous `/change-history` route and its raw Markdown URL to their new equivalents.

## First-pass migration

| Previous area | New primary home | Treatment |
|---|---|---|
| Get Started | Client Integration | Keep Building on Hypercerts and Testing & Deployment. Retire the current Quickstart and Working with Evaluations pages. |
| Core Concepts | Guide | Keep and regroup the existing concept pages. Review claims against current Lexicons and AT Protocol behavior. |
| Tutorials | Client Integration | Keep the ePDS tutorial source-backed from its service repository. |
| Tools | Reference | Keep Agent Skills, Hypercerts Feed Service, Labelers, and legacy Hyperindex. Remove Scaffold from the active documentation because it is not a supported integration path. |
| Architecture | Guide or Reference | Put lifecycle and portability guidance in Guide; put system and service architecture in Reference; put account setup in Client Integration. |
| Lexicons and service directories | Reference | Keep existing routes and expand source-backed coverage. |
| Lexicon releases | Changes | Keep the imported upstream changelog and add adopter-facing migration context separately. |
| Ecosystem and vision | Separate background | Retain the existing essay route outside the sequential Guide; the landing page provides the high-level introduction. |
| Roadmap | Unassigned | Keep the source for now, but do not mix planned capabilities into supported instructions or change history. |

## Third editor's draft disposition

The draft at `https://claude.ai/code/artifact/cf891a57-416c-4d63-8ec3-8194e6cb6e28` is explicitly unratified. Use it as an inventory and review source, not as publication-ready normative text.

| Draft material | Destination | Publication rule |
|---|---|---|
| Introduction and relationship to AT Protocol (section 1) | Guide foundations | Reuse descriptive material after checking current terminology. |
| Conformance model and requirement keywords (section 2) | Do not publish as current protocol | No conformance classes or test suite have been ratified. |
| General requirements (section 3) | Guide topics such as references, trust, validation, and aggregation | Treat the numbered requirements as proposals until reviewed. |
| Terminology and data model (section 4) | Guide and Glossary | Separate concept meaning from field-level Reference content. |
| Identity, authority, and provenance (section 5) | Guide: Identity and Trust | Explain repository attribution, named subjects, corroboration, and optional record-level attestations. |
| Hypercerts and Certified schema chapters (sections 6 to 11) | Guide concept groups plus Lexicon Reference | Take structural facts from released Lexicons, not from the prose draft alone. |
| Interoperability profiles (section 13) | Unresolved | Do not publish the proposed profiles as compatibility requirements. |
| Authorization and permission sets (section 14) | Client Integration and Reference | Document released permission sets and tested OAuth behavior; review proposed expansion rules separately. |
| Versioning and releases (section 15) | Changes | Distinguish independent component releases from any coordinated protocol release relationship. |
| Open issues (section 16) | Future known-limitations pages | Publish verified limitations, not speculative resolutions. |
| Lexicon inventory (appendix B) | Reference coverage checklist | Verify every item against a released Lexicon source. |
| Worked example (appendix C) | Future Client Integration walkthrough | Rebuild as a runnable, tested SDK and XRPC example. |
| Proposed requirements register (appendix D) | Draft review only | Do not convert it into active documentation requirements. |

## Missing pages and source work

### Guide

The narrative path now covers the main concepts, common usage, and the handoff to building. Further work should test whether newcomers can explain the system and choose a useful integration after reading it, rather than expand the Guide into a field-by-field reference.

### Client Integration

- Prerequisites and supported environments
- Authentication and permission sets
- Create and store records with the SDK
- Read and discover records through XRPC
- Complete project, activity, and evidence walkthrough
- Evaluation workflow
- Organization-managed records
- Troubleshooting and production readiness

### Reference

- Complete `org.hypercerts.*` and `app.certified.*` Lexicon inventory
- XRPC query and procedure pages generated or imported from canonical schemas
- SDK exports, types, validation, errors, and version support
- Hypercerts API service overview and environments
- Per-service subpages for ePDS, CGS, labelers, feed generators, relay or Jetstream, and operational status

### Changes

- Adopter-facing change entries that link meaning, schemas, components, and migration steps
- Component changelog links without implying one universal compliance version
- Migration guides for changes that require adopter action

## External service documentation

Keep one local service overview when the documentation site needs to explain role, support status, and relationships. Import each canonical technical subpage independently from its owning repository through `docs-sources.yml` and a frontmatter-only route wrapper. This preserves source ownership while allowing a service to occupy a full subtree in the documentation site.

Do not combine locally maintained prose with imported Markdown on the same route. The import loader intentionally rejects that pattern to prevent two sources from drifting.

## URL migration

The first pass reorganizes navigation while preserving the existing URLs of retained pages. The four explicitly retired pages redirect to the nearest active section hub. Future route moves should be made only with permanent redirects, internal-link checks, and a review of raw Markdown URLs.
