---
title: Measurement
---

# Measurement

`org.hypercerts.context.measurement`

A measurement records a single quantitative data point related to a hypercert or other record. It captures what was measured (the metric), the unit of measurement, the measured value, and when the measurement was taken.

Measurements support methodology traceability through optional fields for method type, method URI (linking to a detailed methodology), and evidence URIs (linking to raw data or supporting documentation). This makes measurements auditable and reproducible.

Like attachments and evaluations, measurements live in the context namespace, meaning anyone can contribute measurements to existing claims. This enables collaborative impact tracking where different parties can add their own data points to build a richer picture of outcomes and impact.

For the full schema, see [`org.hypercerts.context.measurement`](https://github.com/hypercerts-org/hypercerts-lexicon/blob/main/lexicons/org/hypercerts/context/measurement.json) in the lexicon repo.
