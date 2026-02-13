# Measurement

## Description

A measurement is a quantitative observation that can be attached to any claim in the hypercerts graph—an activity, outcome, evaluation, or even another measurement. Measurements are designed to make structured data reusable across actors and applications, while not implying causality, attribution, or a single “true” interpretation.

At their core, measurements capture what was measured, the value, the unit, and the time range of the observation. They can optionally include who produced the data (contributors), how it was produced (method type + URI), supporting resources, and location information.

Measurements provide inputs for analysis and later evaluation. They help ground discussion in observable signals, but leave judgment—how to interpret the data, what it means, and what it implies for funding or recognition—to plural evaluations and domain-specific frameworks.

## Lexicon

**Lexicon ID:** `org.hypercerts.claim.measurement`

**Description:**&#x20;

**Key:** `tid`

| Property                | Type     | Required | Description                                                                   | Comments                                                                            |
| ----------------------- | -------- | -------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `activity`              | `ref`    | ❌        | A strong reference to the activity that this measurement is for               | The record referenced must conform with the lexicon `org.hypercerts.claim.activity` |
| `measurers`             | `array`  | ✅        | DIDs of the entity (or entities) that measured this data                      |                                                                                     |
| `metric`                | `string` | ✅        | The metric being measured                                                     |                                                                                     |
| `value`                 | `string` | ✅        | The measured value                                                            |                                                                                     |
| `measurementMethodType` | `string` | ❌        | Short identifier for the measurement methodology                              |                                                                                     |
| `measurementMethodURI`  | `string` | ❌        | URI to methodology documentation, standard protocol, or measurement procedure |                                                                                     |
| `evidenceURI`           | `array`  | ❌        | URIs to supporting evidence or data                                           |                                                                                     |
| `location`              | `ref`    | ❌        | A strong reference to the location where the measurement was taken            | References must conform to `app.certified.location`                                 |
| `createdAt`             | `string` | ✅        | Client-declared timestamp when this record was originally created             |                                                                                     |
