# Documentation information architecture

This is the working migration map for the protocol-first documentation restructure. It is a maintainer document, not a protocol specification.

## Principles

- The documentation has four primary sections: Guide, Client Integration, Reference, and Change History.
- Together, the Guide, Lexicons, API and SDK contracts, reference implementation behavior, and change history describe the protocol. There is no separate ratified formal specification.
- Guide pages explain meaning and shared usage. Reference pages provide exact source-backed contracts.
- Integration pages publish tested paths, not inferred or aspirational APIs.
- Existing public routes remain stable during the first pass unless their content has been explicitly retired.
- A proposal in the third editor's draft is not a protocol requirement unless it is independently ratified and reflected in authoritative sources.

## First-pass migration

| Previous area | New primary home | Treatment |
|---|---|---|
| Get Started | Client Integration | Keep Building on Hypercerts and Testing & Deployment. Retire the current Quickstart and Working with Evaluations pages. |
| Core Concepts | Guide | Keep and regroup the existing concept pages. Review claims against current Lexicons and AT Protocol behavior. |
| Tutorials | Client Integration | Keep the ePDS tutorial source-backed from its service repository. |
| Tools | Reference | Keep Agent Skills, Hypercerts Feed Service, Labelers, and legacy Hyperindex. Remove Scaffold from the active documentation because it is not a supported integration path. |
| Architecture | Guide or Reference | Put lifecycle and portability guidance in Guide; put system and service architecture in Reference; put account setup in Client Integration. |
| Lexicons and service directories | Reference | Keep existing routes and expand source-backed coverage. |
| Lexicon releases | Change History | Keep the imported upstream changelog and add adopter-facing migration context separately. |
| Ecosystem and vision | Guide | Keep protocol-purpose content in the conceptual path. |
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
| Versioning and releases (section 15) | Change History | Distinguish independent component releases from any coordinated protocol release relationship. |
| Open issues (section 16) | Future known-limitations pages | Publish verified limitations, not speculative resolutions. |
| Lexicon inventory (appendix B) | Reference coverage checklist | Verify every item against a released Lexicon source. |
| Worked example (appendix C) | Future Client Integration walkthrough | Rebuild as a runnable, tested SDK and XRPC example. |
| Proposed requirements register (appendix D) | Draft review only | Do not convert it into active documentation requirements. |

## Missing pages and source work

### Guide

- Protocol and infrastructure boundaries
- Record identity, versions, and references
- Identity, authority, trust, and corroboration
- Validation and extensibility
- Aggregation and interpretation
- Known limitations and open semantic questions

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

### Change History

- Adopter-facing change entries that link meaning, schemas, components, and migration steps
- Component changelog links without implying one universal compliance version
- Migration guides for changes that require adopter action

## External service documentation

Keep one local service overview when the documentation site needs to explain role, support status, and relationships. Import each canonical technical subpage independently from its owning repository through `docs-sources.yml` and a frontmatter-only route wrapper. This preserves source ownership while allowing a service to occupy a full subtree in the documentation site.

Do not combine locally maintained prose with imported Markdown on the same route. The import loader intentionally rejects that pattern to prevent two sources from drifting.

## URL migration

The first pass reorganizes navigation while preserving the existing URLs of retained pages. The four explicitly retired pages redirect to the nearest active section hub. Future route moves should be made only with permanent redirects, internal-link checks, and a review of raw Markdown URLs.
