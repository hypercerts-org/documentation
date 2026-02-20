---
title: Badge Award
---

# Badge Award

## Description

Records a badge award to a user, project, or activity claim. References a [badge definition](/lexicons/certified-lexicons/badge-definition) and a subject (either an account DID or a specific AT Protocol record).

## Lexicon

**Lexicon ID:** `app.certified.badge.award`

**Key:** `tid`

| Property | Type | Required | Description | Comments |
| --- | --- | --- | --- | --- |
| `badge` | `ref` | ✅ | Reference to the badge definition for this award | References `app.certified.badge.definition`. |
| `subject` | `union` | ✅ | Entity the badge is awarded to | Accepts `app.certified.defs#did` (an account) or `com.atproto.repo.strongRef` (a specific record, e.g. an activity claim). |
| `note` | `string` | ❌ | Optional statement explaining the reason for this badge award | |
| `createdAt` | `string` | ✅ | Client-declared timestamp when this record was originally created | Format: `datetime`. |
