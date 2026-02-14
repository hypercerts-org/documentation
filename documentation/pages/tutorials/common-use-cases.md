---
title: Common Use Cases
description: See how hypercerts work for different types of contributions.
---

# Common Use Cases

This page shows how to create hypercerts for four common scenarios. Each example uses the real SDK API and shows what additional records you'd attach.

## Open-source software maintenance

The NumPy team maintains the library throughout 2025. They want to create a hypercert covering their maintenance work, including bug fixes, documentation updates, and community support.

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({ /* oauth config */ });
const session = await sdk.restoreSession("did:plc:numpy-team");
const repo = sdk.getRepository(session);

const result = await repo.hypercerts.create({
  title: "NumPy library maintenance, 2025",
  shortDescription: "Ongoing maintenance of the NumPy scientific computing library",
  workScope: {
    allOf: ["Software Development", "Open Source"],
  },
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

After creating the hypercert, the team would attach contribution records identifying individual maintainers with roles (core developer, documentation lead, community manager). They'd add evidence records linking to the GitHub repository, release notes, and commit history. Research institutions or companies that depend on NumPy might fund this work retroactively.

## Regenerative land stewardship

A conservation organization restores 50 hectares of rainforest in Costa Rica from 2020 to 2025. They want to document their stewardship work with precise location data.

```typescript
const locationRef = await repo.locations.create({
  latitude: 10.4183,
  longitude: -84.0989,
  radius: 500, // meters
  createdAt: new Date().toISOString(),
});

const result = await repo.hypercerts.create({
  title: "Rainforest restoration, Monteverde region",
  shortDescription: "Reforestation and biodiversity recovery in degraded tropical forest",
  workScope: {
    allOf: ["Ecosystem Restoration", "Biodiversity Conservation"],
  },
  startDate: "2020-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  location: locationRef,
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

The organization would attach measurement records tracking hectares restored, native species planted, and carbon sequestration estimates. Evidence records would include satellite imagery, biodiversity surveys, and field reports. Climate funders or impact investors focused on nature-based solutions might support this work.

## Scientific research

A research team publishes a breakthrough paper on mRNA delivery mechanisms. They want to create a hypercert documenting the multi-year research effort with clear contributor roles.

```typescript
const result = await repo.hypercerts.create({
  title: "mRNA delivery mechanism research, 2022-2024",
  shortDescription: "Novel lipid nanoparticle design for improved mRNA therapeutic delivery",
  workScope: {
    allOf: ["Biomedical Research", "Drug Delivery"],
  },
  startDate: "2022-03-01T00:00:00Z",
  endDate: "2024-11-30T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

The team would create contribution records for each researcher, specifying roles like Principal Investigator, Postdoctoral Researcher, and Graduate Student. Evidence records would link to the published paper (via DOI), lab notebooks, and experimental protocols. Evaluation records might capture peer review outcomes or citation metrics. Pharmaceutical companies or research foundations interested in therapeutic development might fund this work.

## Community event organization

A developer community runs monthly coding workshops throughout 2025, teaching web development to underrepresented groups. They want to document their educational impact.

```typescript
const result = await repo.hypercerts.create({
  title: "Monthly web development workshops, 2025",
  shortDescription: "Free coding workshops for underrepresented groups in tech",
  workScope: {
    allOf: ["Education", "Community Building", "Web Development"],
  },
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

The organizers would attach measurement records tracking total attendees, completion rates, and post-workshop employment outcomes. Contribution records would identify instructors, venue hosts, and curriculum developers. Evidence records might include workshop materials, participant testimonials, and photos from events. Tech companies with diversity initiatives or local government education programs might fund this work.
