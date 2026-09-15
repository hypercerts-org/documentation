---
title: Measurement
description: Lexicon reference for the Measurement record type in Hypercerts.
---

# Measurement

`org.hypercerts.context.measurement`

A measurement records a single quantitative data point related to a hypercert or other record. It captures what was measured (the metric), the unit of measurement, the measured value, and when the measurement was taken.

Measurements support methodology traceability through optional fields for method type, method URI, and evidence URIs. These references can help consumers audit or reproduce a measurement, but the record does not verify the linked method or evidence.

For the full released schema, see [`org.hypercerts.context.measurement` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/context/measurement.json).
