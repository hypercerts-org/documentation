# How the documentation is organized

A guide for people who maintain this site: what goes where, how pages are structured, and the rules we write by. It describes the documentation as it is today.

## Sections

The site has four sections, each with its own sidebar. The root page is a short landing page that introduces them and has no sidebar.

| Section | Purpose | Reader |
|---|---|---|
| **Guide** | Explains what Hypercerts is and how its records work, as one start-to-finish reading path | Anyone new to Hypercerts |
| **Client Integration** | Shows how to build an application: signing in, writing records, reading them | Developers building on Hypercerts |
| **Reference** | Exact details to look up: Lexicons, the API and SDK, and the services in the stack | Developers while they build |
| **Changes** | Protocol releases and the published version of each component | Anyone tracking what changed |

The Guide, the Lexicons, the API and SDK, and the release history together describe the protocol. There is no separate formal specification.

Navigation is defined in `lib/navigation.js`. A section's entries can be grouped under an uppercase subsection heading with a `group` entry, as Reference does for Lexicons, XRPC API, SDK, and Services and tooling.

## Guide

The Guide follows the story told on hypercerts.org one level deeper: existing knowledge about projects should be reusable, different people contribute to the same picture, trust builds over time, and that picture informs funding decisions.

- The navigation is flat and ordered. Each page ends by leading to the next, and the last page hands over to Client Integration.
- Concept pages explain what something is and why a reader would use it before any schema detail. Field lists and validation rules belong in Reference.
- Use short, concrete examples. The community energy project (a solar installation) runs through the Guide and the Lexicon examples.
- Explain a limitation next to the decision it affects, not as a list of things the protocol cannot do.

## Reference

### Lexicons

Every record type has a page with the same sections:

1. **Overview**: what the record is and why it exists, with a link to the Guide.
2. **How it's used**: who publishes it and how it connects to other records.
3. **Schema**: generated, see below.
4. **Example**: a realistic record that validates against the released schema.
5. **Rules and best practices**: usage conventions the schema cannot express.
6. **Related**: connected Lexicons and Guide pages.

The schema section contains only a marker, `{% lexicon-schema nsid="..." /%}`. At build time `lib/lexicon-schema.js` expands it into tables from the pinned `@hypercerts-org/lexicon` package, so the tables always match a released version. Bumping the package version updates every table. The Lexicon inventory page states the version and counts in prose and needs a manual update when the version changes.

### Services and tooling

The overview page has the architecture diagram, a table of components, and **the only list of running endpoints**. Service pages link to it and do not repeat hostnames in tables.

Every service has one page with the same sections: Where it fits, AT Protocol background, How it works, Using it from your application, Status and source, Related. Each page has one short code example and is about 800 to 1,100 words.

The pages are written for a project integrating with Hypercerts. Deploying or operating a service is out of scope; each page links to the service's repository for that.

### XRPC API and SDK

Placeholder pages until those components are released. They describe what is coming and what to use meanwhile, and do not document unreleased methods.

## Changes

`lib/protocol-releases.json` holds the protocol's major and minor release history. Component version badges come from each component's published GitHub release, and component changelogs are imported at build time. A component without a published release shows **Under development**. See [Build-time changelog imports](remote-markdown.md).

## Writing rules

- **Describe the current state.** What something is, how it works, and how to use it. History, earlier approaches, and the reasons for changing them belong in changelogs and blog posts.
- **Introduce every term where it first appears on a page**, with a few words, even if another page explains it. Readers arrive on any page.
- **Do not document what is not released.** Mark components under development as such, and say what readers can use today.
- **No specification language.** The documentation gives practical guidance ("Use X when…"), not requirement keywords such as MUST or SHOULD. Unratified proposals are not presented as protocol rules.
- **Only actively maintained components are documented.** Material for retired components belongs in their own repositories.
- **Write plainly.** Short sentences, concrete examples, no promotional language.

## Design

The site follows the Hypercerts design system through `@hypercerts-org/ui-react`: its tokens supply colour, type, and radius (see the top of `styles/globals.css`), and its components are used where they fit (callouts, breadcrumbs, buttons, badges, and the landing hero). Dark mode is a documentation-site exception with its own values for the same tokens. Diagrams are React components that read the same tokens.

## Documentation ownership

All pages, including Reference pages for individual components, are written in this repository and changed through pull requests. Component changelogs are the only content imported from other repositories.

Keeping pages here lets authors use the site's components, link between sections, and preview the result before review.

Component repositories own:

- `CHANGELOG.md` and published GitHub Releases, which feed Changes and the version badges;
- contributor and operator material, such as local development, internal architecture, and self-hosting;
- canonical schemas, such as Lexicon JSON, from which this site generates its schema tables.

When a component release changes public behaviour, its maintainer reviews the affected pages here and opens a pull request, or notes that the release has no documentation impact.

## Checks and automation

- `pnpm test` runs the tests for the build scripts.
- `pnpm run build` builds the static site and fails on invalid pages or failed changelog imports.
- `pnpm run check:links` checks every internal link and anchor in the built site. CI runs all three on pull requests.
- An hourly workflow redeploys the site when an imported changelog or a component release changes.
- Dependabot opens a pull request when a new `@hypercerts-org/lexicon` or `@hypercerts-org/ui-react` version is published.

## URLs

Page routes are public addresses. When a page moves or is removed, add a permanent redirect in `vercel.json` for the page and for its `/raw/….md` export, and update links across the site.
