---
title: Hypercerts Agent Skills
description: Agent skills that help coding agents work across the Hypercerts stack.
---

# Hypercerts Agent Skills

Hypercerts Agent Skills help coding agents work across the Hypercerts stack. They are intended for agents and agent harnesses, not as a runtime dependency for Hypercerts applications.

The main entry point is the [`hypercerts`](https://github.com/hypercerts-org/skills/tree/main/skills/hypercerts) meta-skill. It is a small catalog skill that helps an agent choose and install the right focused skill for a task.

## Install

Install the meta-skill from the [Hypercerts skills repository](https://github.com/hypercerts-org/skills):

```bash
npx skills add hypercerts-org/skills --skill hypercerts
```

List the skills available in the repository:

```bash
npx skills add hypercerts-org/skills --list
```

## What the meta-skill does

The `hypercerts` meta-skill keeps the first step small:

- Choose the smallest focused skill for the task.
- Install that focused skill from its source repository.
- Read the focused skill's own `SKILL.md` instructions.
- Continue the task using the focused skill instead of keeping all workflow guidance in one large skill.

This keeps task-specific instructions close to the projects they describe while still giving agents one Hypercerts entry point.

## Focused skills

| Task area | Focused skill |
| --- | --- |
| ePDS login, AT Protocol OAuth, OTP login, email-first auth, PAR, PKCE, and DPoP flows | `epds-login` |
| Hyperindex GraphQL queries, hosted endpoints, filtering, pagination, sorting, and consumer query workflows | `hyperindex` |
| Certified Group Service app development, group-owned records, member and role management, blob uploads, and API keys | `app-development-with-cgs` |
| Certified Organization Labeler / OrgLabeler labels for filtering certified actors and hiding likely test data | `orglabeler` |
| Hypercerts lexicons, generated TypeScript types, validators, and reading or writing Hypercerts records | `building-with-hypercerts-lexicons` |

See the repository's [skill map](https://github.com/hypercerts-org/skills/blob/main/skills/hypercerts/references/skill-map.md) for the current source repositories and fallback install URLs.

{% callout type="note" %}
Agent Skills do not define a portable way for one skill to invoke another skill directly. The meta-skill points the agent to the right focused skill and install path; the agent then reads and follows that focused skill's own instructions.
{% /callout %}
