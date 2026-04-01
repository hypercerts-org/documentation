---
title: Common Use Cases
description: See how hypercerts work for different types of contributions.
---

# Common Use Cases

Hypercerts work for any kind of impact work. This page shows four common scenarios and how they map to the hypercerts data model.

## Open-source software maintenance

A team maintains a widely-used library. They create a hypercert covering a year of maintenance — bug fixes, documentation updates, and community support.

```typescript
const result = await agent.com.atproto.repo.createRecord({
  repo: agent.session.did,
  collection: "org.hypercerts.claim.activity",
  record: {
    title: "Library maintenance, 2025",
    shortDescription: "Ongoing maintenance of an open-source library",
    description: "Fixed 47 bugs, reviewed 120 pull requests, updated documentation, and provided community support on Discord.",
    workScope: { allOf: ["Software Development", "Open Source"] },
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    $type: "org.hypercerts.claim.activity",
    createdAt: new Date().toISOString(),
  },
});
```

The team then attaches links to the repository, release notes, and commit history. Contribution records identify who did what — core developers, documentation leads, community managers. Organizations that depend on the library can fund this work retroactively.

## Regenerative land stewardship

A conservation group restores degraded forest over several years. The activity claim covers the full project timeline (2020–2025) with work scopes like "Ecosystem Restoration" and "Biodiversity Conservation".

Measurement records track hectares restored, native species planted, and carbon sequestration estimates. Location records anchor the work geographically. Attachments include satellite imagery, biodiversity surveys, and field reports. Climate funders can review the full record before deciding to support the next phase.

## Scientific research

A research team completes a multi-year study and wants to document the effort with clear contributor roles. The activity claim describes the research and its outputs, with contribution records identifying the principal investigator, postdocs, and graduate students along with their relative contributions.

Attachments link to published papers (via DOI), lab notebooks, and experimental protocols. Evaluation records capture peer review outcomes. Research foundations or industry partners interested in the field can fund the work.

## Community event organization

A group runs regular workshops teaching practical skills to underrepresented communities. They want to document their educational impact. The activity claim covers the full year of workshops with work scopes like "Education" and "Community Building".

Measurement records track total attendees, completion rates, and outcomes. Contribution records identify instructors, venue hosts, and curriculum developers. Attachments include workshop materials and participant feedback. Organizations with community programs can review the record and decide to fund future sessions.
