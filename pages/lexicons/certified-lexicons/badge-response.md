---
title: Badge Response
---

# Badge Response

## Description

A recipient's response to a [badge award](/lexicons/certified-lexicons/badge-award). The recipient can accept or reject the badge, and optionally assign a relative weight to accepted badges.

## Lexicon

**Lexicon ID:** `app.certified.badge.response`

**Key:** `tid`

| Property | Type | Required | Description | Comments |
| --- | --- | --- | --- | --- |
| `badgeAward` | `ref` | ✅ | Reference to the badge award being responded to | References `app.certified.badge.award`. |
| `response` | `string` | ✅ | The recipient's response | Enum: `accepted`, `rejected`. |
| `weight` | `string` | ❌ | Optional relative weight for accepted badges, assigned by the recipient | |
| `createdAt` | `string` | ✅ | Client-declared timestamp when this record was originally created | Format: `datetime`. |
