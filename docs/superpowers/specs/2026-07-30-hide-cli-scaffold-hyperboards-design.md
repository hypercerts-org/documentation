# Hide CLI, Scaffold, and Hyperboards pages

## Goal

Temporarily remove the Hypercerts CLI, Scaffold Starter App, and Hyperboards documentation pages from site discovery without deleting their source content or assets.

## Visibility contract

The following routes remain buildable and directly accessible:

- `/tools/hypercerts-cli`
- `/tools/scaffold`
- `/tools/hyperboards`

They will not appear in:

- sidebar navigation or previous/next navigation
- the header Tools destination
- search results or curated search quick links
- the generated sitemap
- links from other documentation pages

The surrounding documentation remains unchanged except where wording must be adjusted after removing an internal link. General references to the products and external project links remain in scope; this change hides the documentation routes rather than erasing the products from the documentation.

## Implementation shape

A shared page-visibility configuration will list the three hidden paths. Search-index and sitemap generation will read that configuration so a page can be shown again by removing one path from a single list. Navigation entries and internal links will be removed because those sources are authored statically.

The header Tools link currently targets Scaffold. It will point to the first remaining visible Tools page instead.

## Validation

Automated tests will verify that:

1. the three Markdown source files still exist;
2. the generated search index excludes all three routes;
3. the generated sitemap excludes all three routes; and
4. no authored navigation or documentation link points to a hidden route.

The normal test suite and production build must pass.
