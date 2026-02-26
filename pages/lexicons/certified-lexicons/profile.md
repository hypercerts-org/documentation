---
title: Profile
---

# Profile

## Description

A declaration of a Certified account profile. This is a singleton record (key: `self`) — each account has exactly one profile record.

## Lexicon

**Lexicon ID:** `app.certified.actor.profile`

**Key:** `literal:self`

| Property | Type | Required | Description | Comments |
| --- | --- | --- | --- | --- |
| `displayName` | `string` | ❌ | Display name for the account | Max 64 graphemes, 640 characters. |
| `description` | `string` | ❌ | Free-form profile description text | Max 256 graphemes, 2560 characters. |
| `pronouns` | `string` | ❌ | Free-form pronouns text | Max 20 graphemes, 200 characters. |
| `website` | `string` | ❌ | Website URL | Format: `uri`. |
| `avatar` | `union` | ❌ | Small image displayed next to posts from this account | Accepts `org.hypercerts.defs#uri` or `org.hypercerts.defs#smallImage`. |
| `banner` | `union` | ❌ | Larger horizontal image displayed behind the profile view | Accepts `org.hypercerts.defs#uri` or `org.hypercerts.defs#largeImage`. |
| `createdAt` | `string` | ❌ | Client-declared timestamp when this record was created | Format: `datetime`. |
