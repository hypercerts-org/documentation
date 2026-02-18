---
title: Common Use Cases
description: See how hypercerts work for different types of contributions.
---

# Common Use Cases

Hypercerts work for any kind of impact work. This page shows four common scenarios with real SDK code.

## Open-source software maintenance

A team maintains a widely-used library. They create a hypercert covering a year of maintenance — bug fixes, documentation updates, and community support.

```typescript
import { createATProtoSDK } from "@hypercerts-org/sdk-core";

const sdk = createATProtoSDK({ /* oauth config */ });
const session = await sdk.restoreSession("did:plc:abc123");
const repo = sdk.getRepository(session);

const result = await repo.hypercerts.create({
  title: "Library maintenance, 2025",
  shortDescription: "Ongoing maintenance of an open-source library",
  workScope: "Software Development, Open Source",
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    rightsName: "Public Display",
    rightsType: "display",
    rightsDescription: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

After creating the hypercert, the team attaches contribution records for individual maintainers with roles (core developer, documentation lead, community manager). They add evidence linking to the repository, release notes, and commit history. Organizations that depend on the library can fund this work retroactively.

## Regenerative land stewardship

A conservation group restores degraded forest over several years. They document the work with location data and measurements.

```typescript
const locationRef = await repo.locations.create({
  lpVersion: "1",
  srs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
  locationType: "coordinate-decimal",
  location: { string: "-84.10, 10.42" },
  name: "Restoration site",
  createdAt: new Date().toISOString(),
});

const result = await repo.hypercerts.create({
  title: "Forest restoration project, 2020–2025",
  shortDescription: "Reforestation and biodiversity recovery in degraded tropical forest",
  workScope: "Ecosystem Restoration, Biodiversity Conservation",
  startDate: "2020-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  locations: [locationRef],
  rights: {
    rightsName: "Public Display",
    rightsType: "display",
    rightsDescription: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

The group attaches measurement records tracking hectares restored, native species planted, and carbon sequestration estimates. Evidence includes satellite imagery, biodiversity surveys, and field reports. Climate funders or impact investors can review the full record before deciding to support the next phase.

## Scientific research

A research team completes a multi-year study and wants to document the effort with clear contributor roles.

```typescript
const result = await repo.hypercerts.create({
  title: "Drug delivery mechanism research, 2022–2024",
  shortDescription: "Novel approaches to improving therapeutic delivery",
  workScope: "Biomedical Research, Drug Delivery",
  startDate: "2022-03-01T00:00:00Z",
  endDate: "2024-11-30T23:59:59Z",
  rights: {
    rightsName: "Public Display",
    rightsType: "display",
    rightsDescription: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

The team creates contribution records for each researcher — principal investigator, postdoctoral researchers, graduate students. Evidence links to the published paper (via DOI), lab notebooks, and experimental protocols. Evaluation records capture peer review outcomes. Research foundations or industry partners interested in the field can fund the work.

## Community event organization

A group runs regular workshops teaching practical skills to underrepresented communities. They want to document their educational impact.

```typescript
const result = await repo.hypercerts.create({
  title: "Community workshops, 2025",
  shortDescription: "Free skill-building workshops for underrepresented groups",
  workScope: "Education, Community Building",
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    rightsName: "Public Display",
    rightsType: "display",
    rightsDescription: "Right to publicly display this contribution",
  },
  createdAt: new Date().toISOString(),
});
```

The organizers attach measurement records tracking total attendees, completion rates, and outcomes. Contribution records identify instructors, venue hosts, and curriculum developers. Evidence includes workshop materials and participant feedback. Organizations with community investment programs can review the record and decide to fund future sessions.
