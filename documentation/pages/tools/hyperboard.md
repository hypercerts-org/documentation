---
title: Hyperboard
description: A visual board that showcases the contributors to a hypercert.
---

# Hyperboard

Hyperboard displays the contributors to a hypercert as a visual, shareable board. Use it to:

- Showcase who did the work behind an impact claim
- Display contribution weights and roles
- Embed contributor recognition on project websites
- Give funders transparency into who their contributions support

Because the underlying data lives on ATProto, every Hyperboard is backed by cryptographically signed, publicly verifiable records.

## What Hyperboard shows

A Hyperboard displays the complete attribution picture for a hypercert. Each board shows:

**The hypercert itself** — the activity claim that describes the work, timeframe, and scope.

**All contributors** — every person or organization listed on the hypercert via `org.hypercerts.claim.contributorInformation` records.

**Contribution details** — weights, roles, or other attribution metadata specified in the contributor records.

**A shareable representation** — a visual board that makes impact attribution visible and recognizable.

## How it works

A hypercert is created with contributors listed. Each contributor is recorded as a separate `org.hypercerts.claim.contributorInformation` record in the creator's ATProto repository.

Hyperboard reads the contributor data directly from ATProto repositories. It queries the hypercert's AT-URI, retrieves the associated contributor records, and parses the attribution details.

It then renders a visual board showing each contributor and their role. The board is a public, shareable view of who contributed to the impact claim.

Because the data lives on ATProto, the board is verifiable. Anyone can inspect the underlying records, check the cryptographic signatures, and confirm who contributed to a hypercert. The attribution is not locked in a database — it is portable, user-controlled data.

## Use cases

**Project pages** — Embed a Hyperboard on your project website to showcase your team. Contributors are displayed with their roles and weights, giving visitors a clear view of who did the work.

**Funding transparency** — Show funders exactly who their contributions support. A Hyperboard makes it clear where funding flows and who benefits from it.

**Portfolio** — Contributors can point to Hyperboards as proof of their impact work. Because the underlying records are signed and verifiable, a Hyperboard serves as portable, credible evidence of contribution.

**Recognition** — Publicly acknowledge contributors in a way that is verifiable and portable. Recognition is not trapped in a single platform — it follows the contributor across the ecosystem.

{% callout type="note" %}
Hyperboard reads contributor data directly from ATProto repositories. The underlying records are cryptographically signed and publicly verifiable — anyone can independently confirm who contributed to a hypercert.
{% /callout %}

## Next steps

- [Creating Your First Hypercert](/tutorials/creating-your-first-hypercert) — build a hypercert with contributors that Hyperboard can display
- [Hypercerts Core Data Model](/getting-started/hypercerts-core-data-model) — understand the record types behind a Hyperboard
- [Architecture Overview](/architecture/overview) — how the protocol stack fits together
