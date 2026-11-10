# Hypercerts documentation

The source of [docs.hypercerts.org](https://docs.hypercerts.org), the documentation for building on Hypercerts.

Hypercerts is an open protocol for describing work and the trust around it: who did what, the evidence behind it, who reviewed or endorsed it, and who funded it. The records live on [AT Protocol](https://atproto.com), in repositories their authors control, so any application can read and build on them. For the high-level introduction, see [hypercerts.org](https://hypercerts.org).

## What the documentation covers

- **Guide**: the concepts, from why Hypercerts builds on AT Protocol to how work, evidence, evaluations, and funding connect.
- **Client Integration**: how to build an application on Hypercerts.
- **Reference**: the record schemas (Lexicons), the API and SDK, and the services that make up the stack.
- **Changes**: protocol releases and the versions of each component.

## Where things are

| Path | Contents |
|---|---|
| `pages/` | The documentation pages, written in Markdown |
| `components/`, `styles/` | The site's React components and styles |
| `markdoc/` | Custom Markdown tags used in pages, such as cards, callouts, and diagrams |
| `lib/` | Navigation and the scripts that generate search, schema tables, and release data at build time |
| `test/` | Tests for those scripts |
| `docs/` | Notes for maintainers, listed below |

The site is built with [Next.js](https://nextjs.org) and [Markdoc](https://markdoc.dev), and follows the Hypercerts design system.

## Run it locally

Requires Node.js 22 or later and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Before opening a pull request:

```bash
pnpm test
pnpm run build
pnpm run check:links
```

## Contributing

All pages are written in this repository and changed through pull requests to `main`. Write about the current state of the protocol and its services; release history belongs in changelogs.

Two notes for maintainers:

- [How the documentation is organized](docs/information-architecture.md): the sections, the structure of Lexicon and service pages, the writing rules, who owns what, and **what to update by hand when a Lexicon version or a service is released**.
- [Build-time changelog imports](docs/remote-markdown.md): how component changelogs and version badges are fetched, and how protocol releases are published.

## Related repositories

- [hypercerts-lexicon](https://github.com/hypercerts-org/hypercerts-lexicon): the record schemas
- [certified-group-service](https://github.com/hypercerts-org/certified-group-service), [hypercerts-relay](https://github.com/hypercerts-org/hypercerts-relay), [hypercerts-feed-service](https://github.com/hypercerts-org/hypercerts-feed-service): services in the stack
- [certified-app](https://github.com/hypercerts-org/certified-app): the Certified account app

## License

- The documentation text is licensed under [CC BY 4.0](LICENSE). You may share and adapt it if you credit the Hypercerts Foundation, link to the license, and say whether you changed it.
- The code, meaning the examples and snippets in the pages and the site's own source, is licensed under either [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option, so you can copy it straight into your own project.
- The licenses don't cover the logos, wordmarks, or fonts in this repository: logos and wordmarks belong to their owners, and each font keeps its own license.
- Changelogs that the site imports from other repositories at build time (listed in `docs-sources.yml`) aren't stored here. Each keeps the license of the repository it comes from.
