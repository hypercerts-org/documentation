# Runtime remote Markdown

Use the `{% remote-doc %}` Markdoc tag when a page should render canonical Markdown from a Hypercerts service repository without copying that Markdown into this documentation repo.

```md
---
rawUrl: "https://raw.githubusercontent.com/hypercerts-org/ePDS/main/docs/tutorial.md"
---

{% remote-doc source="https://github.com/hypercerts-org/ePDS/blob/main/docs/tutorial.md" %}

A short unavailable-state fallback goes here. Keep it brief so the documentation repo does not become a second source of truth.

{% /remote-doc %}
```

## How it works

- The site remains a static Next.js export.
- The browser fetches the source file from `raw.githubusercontent.com` at runtime first.
- If the live GitHub fetch fails, the browser falls back to the build-time copy in `/raw`.
- The fetched Markdown is parsed with the same Markdoc tags and nodes used by local pages.
- Fenced `mermaid` diagrams render as SVGs in the browser through the Mermaid npm package.
- Relative links in the remote Markdown point back to the source GitHub repository.
- `Copy raw` and `View raw` use the page's `rawUrl` frontmatter when it is set.
- The wrapped local Markdown is the last-resort fallback content. Keep it to a short unavailable-state message, not a copy of the canonical docs.

## Constraints

- Sources must be in `hypercerts-org` GitHub repositories.
- The current implementation is browser-runtime fetching, not server-side rendering.
- Build-time search and raw-page generation fetch `rawUrl`, so search and `/raw` use the canonical Markdown instead of the local fallback.
- If runtime docs become permanent for many pages, add build-time indexing for the remote sources too.
