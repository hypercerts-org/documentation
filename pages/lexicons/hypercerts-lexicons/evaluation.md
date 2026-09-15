---
title: Evaluation
description: Lexicon reference for the Evaluation record type in Hypercerts.
---

# Evaluation

`org.hypercerts.context.evaluation`

An evaluation is a structured assessment. It requires an `evaluators` array, a summary, and a creation time. It can identify one primary `subject`, reference supporting measurements, attach report content, and include a string-based score range.

The `subject` is optional and singular. Measurements are a separate plural relationship. The schema does not require the named evaluators to be the repository publisher, require a non-empty evaluator array, establish independence, or enforce numeric score ordering.

For the full released schema, see [`org.hypercerts.context.evaluation` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/context/evaluation.json).
