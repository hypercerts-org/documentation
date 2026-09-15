---
title: Attachment
description: Lexicon reference for the Attachment record type in Hypercerts.
---

# Attachment

`org.hypercerts.context.attachment`

An attachment can link documentary material or other context to zero or more records. Its optional `subjects` array uses strong references, and its optional content can include URI or blob objects.

Only `title` and `createdAt` are required. Description, subjects, content, content type, location, and signatures are optional. Applications should not assume that every attachment is evidence or that its contents verify a subject.

For the full released schema, see [`org.hypercerts.context.attachment` at v1.4.0](https://github.com/hypercerts-org/hypercerts-lexicon/blob/v1.4.0/lexicons/org/hypercerts/context/attachment.json).
