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
  description: "Fixed 47 bugs, reviewed 120 pull requests, updated documentation, and provided community support on Discord.",
  workScope: "Software Development, Open Source",
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  contributions: [
    {
      contributors: ["did:plc:alice123"],
      contributionDetails: "Core developer",
      weight: "50",
    },
    {
      contributors: ["did:plc:bob456"],
      contributionDetails: "Documentation lead",
      weight: "30",
    },
    {
      contributors: ["did:plc:carol789"],
      contributionDetails: "Community manager",
      weight: "20",
    },
  ],
});
```

After creating the hypercert, the team attaches links to the repository, release notes, and commit history. Organizations that depend on the library can fund this work retroactively.

## Regenerative land stewardship

A conservation group restores degraded forest over several years. They document the work with location data and measurements.

```typescript
const result = await repo.hypercerts.create({
  title: "Forest restoration project, 2020–2025",
  shortDescription: "Reforestation and biodiversity recovery in degraded tropical forest",
  description: "Restored 200 hectares of degraded tropical forest through native species planting, invasive species removal, and community stewardship programs.",
  workScope: "Ecosystem Restoration, Biodiversity Conservation",
  startDate: "2020-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  locations: [{
    lpVersion: "1",
    srs: "EPSG:4326",
    locationType: "coordinate-decimal",
    location: "-84.10, 10.42",
    name: "Restoration site",
  }],
});
```

The group then adds measurement records tracking hectares restored, native species planted, and carbon sequestration estimates. Attachments include satellite imagery, biodiversity surveys, and field reports. Climate funders or impact investors can review the full record before deciding to support the next phase.

## Scientific research

A research team completes a multi-year study and wants to document the effort with clear contributor roles.

```typescript
const result = await repo.hypercerts.create({
  title: "Drug delivery mechanism research, 2022–2024",
  shortDescription: "Novel approaches to improving therapeutic delivery",
  description: "Developed and tested three novel nanoparticle-based drug delivery mechanisms, resulting in two published papers and one patent application.",
  workScope: "Biomedical Research, Drug Delivery",
  startDate: "2022-03-01T00:00:00Z",
  endDate: "2024-11-30T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
  contributions: [
    {
      contributors: ["did:plc:pi001"],
      contributionDetails: "Principal investigator",
      weight: "40",
    },
    {
      contributors: ["did:plc:postdoc002"],
      contributionDetails: "Postdoctoral researcher",
      weight: "35",
    },
    {
      contributors: ["did:plc:grad003"],
      contributionDetails: "Graduate student",
      weight: "25",
    },
  ],
});
```

Attachments link to the published paper (via DOI), lab notebooks, and experimental protocols. Evaluation records capture peer review outcomes. Research foundations or industry partners interested in the field can fund the work.

## Community event organization

A group runs regular workshops teaching practical skills to underrepresented communities. They want to document their educational impact.

```typescript
const result = await repo.hypercerts.create({
  title: "Community workshops, 2025",
  shortDescription: "Free skill-building workshops for underrepresented groups",
  description: "Organized and delivered 24 free workshops covering web development, data literacy, and career skills to 450 participants from underrepresented communities.",
  workScope: "Education, Community Building",
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  rights: {
    name: "Public Display",
    type: "display",
    description: "Right to publicly display this contribution",
  },
});
```

The organizers add measurement records tracking total attendees, completion rates, and outcomes. Contribution records identify instructors, venue hosts, and curriculum developers. Attachments include workshop materials and participant feedback. Organizations with community investment programs can review the record and decide to fund future sessions.
