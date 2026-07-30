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

1. **Sign in** with your ATProto handle (e.g. `yourname.certified.one` or `yourname.bsky.social`)
2. **Create a board** from the dashboard — select one or more hypercerts to visualize
3. **Customize** the treemap layout by dragging and resizing contributor tiles
4. **Share** the board URL or embed it on your website via iframe

Because boards pull data from ATProto repositories, the contributor information is cryptographically signed and publicly verifiable. Anyone can inspect the underlying records and confirm who contributed to a hypercert.

## How weights become tile sizes

Hyperboards normalizes contributor weights into proportional tile areas using this formula:

```text
tileArea = contributorWeight / sumOfAllWeights
```

For example, if three contributors have weights `"70"`, `"20"`, and `"10"`:

| Contributor | Weight | Calculation | Tile Area |
|-------------|--------|-------------|-----------|
| Alice       | 70     | 70 / 100    | 70%       |
| Bob         | 20     | 20 / 100    | 20%       |
| Carol       | 10     | 10 / 100    | 10%       |

D3 recomputes tile positions from the weights on every render.

**Missing or invalid weights:** Contributors without a `contributionWeight` default to a weight of 1. There are two fallback layers: (1) if `contributionWeight` is undefined or null, the string `"1"` is used; (2) if the string cannot be parsed as a number (e.g. empty string), the number `1` is used. Contributors are never excluded — they always appear on the board with at least a weight of 1.

**Drag-to-resize behavior:** When you drag to resize tiles in the editor, this directly updates the `contributionWeight` stored in the contributor's ATProto activity record on their PDS. There is no separate layout layer — the weight IS the layout. Weights are rounded to one decimal place on save.

**Choosing weights for visual clarity:** For boards with many contributors, using percentage-style weights (summing to 100) makes the visual proportions intuitive. For boards with few contributors, simple multipliers (like `"3"`, `"2"`, `"1"`) work well.

For methods to calculate contributor weights, see [Choosing contribution weights](/lexicons/hypercerts-lexicons/contribution#choosing-contribution-weights).

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

- [Quickstart](/getting-started/quickstart) — build a hypercert with contributors that Hyperboards can display
- [Core Data Model](/core-concepts/hypercerts-core-data-model) — understand the record types behind a board
- [Scaffold Starter App](/tools/scaffold) — another example of building on ATProto with the Hypercerts protocol
