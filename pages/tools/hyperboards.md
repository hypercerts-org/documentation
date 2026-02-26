---
title: Hyperboards
description: Visual contributor boards on ATProto — see who built what, beautifully.
---

# Hyperboards

Hyperboards creates visual contributor boards backed by ATProto data. Build a board from your hypercerts, customize the layout, and embed it anywhere.

Live at [hyperboards.org](https://hyperboards.org). Source: [github.com/hypercerts-org/hyperboards](https://github.com/hypercerts-org/hyperboards).

## What it does

Hyperboards turns hypercert data into shareable, embeddable visualizations. Each board is a treemap layout that shows contributors, their roles, and relative weights at a glance.

- **Treemap layouts** — contributors are displayed as proportionally sized tiles, making contribution weights immediately visible
- **Drag-to-resize editing** — adjust contributor tile sizes interactively to reflect their relative contributions
- **Embeddable** — drop a board into any website with a simple iframe
- **ATProto-native** — board data comes directly from signed ATProto records, not a separate database

## How it works

1. **Sign in** with your ATProto handle (e.g. `yourname.certified.app` or `yourname.bsky.social`)
2. **Create a board** from the dashboard — select one or more hypercerts to visualize
3. **Customize** the treemap layout by dragging and resizing contributor tiles
4. **Share** the board URL or embed it on your website via iframe

Because boards pull data from ATProto repositories, the contributor information is cryptographically signed and publicly verifiable. Anyone can inspect the underlying records and confirm who contributed to a hypercert.

## Embedding

Add a board to any website:

```html
<iframe
  src="https://hyperboards.org/embed/BOARD_ID"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

Replace `BOARD_ID` with your board's identifier from the dashboard.

## Use cases

**Project pages** — Embed a board on your project website to showcase your team. The treemap makes it easy to see who contributed and how much.

**Funding transparency** — Show funders exactly who their contributions support. Contributors are displayed with verifiable ATProto-backed attribution.

**Impact portfolios** — Contributors can link to boards as portable proof of their work. Because the underlying records are signed, the attribution is credible across platforms.

**Recognition** — Publicly acknowledge contributors in a visual, shareable format that is not locked into any single platform.

## See also

- [Creating Your First Hypercert](/getting-started/creating-your-first-hypercert) — build a hypercert with contributors that Hyperboards can display
- [Core Data Model](/core-concepts/hypercerts-core-data-model) — understand the record types behind a board
- [Scaffold Starter App](/tools/scaffold) — another example of building on ATProto with the Hypercerts SDK
