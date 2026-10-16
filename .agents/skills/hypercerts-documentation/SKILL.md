---
name: hypercerts-documentation
description: Create or materially revise documentation in the Hypercerts documentation repository. Use this skill whenever a task adds a documentation page, substantially changes a page, restructures documentation, writes a guide, tutorial, how-to, explanation, reference page, service page, Lexicon page, integration page, or release-related documentation. Do not use it for code-only changes or trivial corrections that do not change a reader's understanding.
---

# Hypercerts documentation

Write documentation that helps a specific reader understand, decide, or act. The goal is not comprehensive prose. The goal is the smallest accurate page that lets the reader succeed.

Read `AGENTS.md` and `docs/information-architecture.md` before changing documentation content. They define the repository-wide protocols, site information architecture, ownership, and release rules. This skill applies those controls to individual documentation tasks.

## Establish the reader need

Before drafting, state internally:

- **Reader:** who will use this page.
- **Need:** the question to answer or task to complete.
- **Outcome:** what the reader can understand, decide, or do after reading.
- **Page type:** tutorial, how-to, reference, or explanation.

Choose one primary need. If the request combines unrelated needs, split the documentation or make the primary path short and link to supporting material. Do not turn a page into an undifferentiated briefing document.

## Select the page type

- **Tutorial:** help a new reader achieve one bounded, working result. Keep the path safe and sequential. Explain only concepts needed to make the result meaningful.
- **How-to:** help a reader solve a defined practical problem. Start with the goal and prerequisites, then provide ordered, testable steps.
- **Reference:** enable accurate lookup. Organize around stable objects, fields, methods, options, and constraints. Keep explanatory narrative brief and link outward.
- **Explanation:** give readers a sound mental model. Organize around relationships, reasoning, boundaries, and trade-offs. Do not bury operational steps in it.

Use the page structure required by `docs/information-architecture.md` when one exists, especially for Lexicon and service pages.

## Draft the smallest useful page

1. Open with the reader's goal or a concise answer to the page's central question.
2. State prerequisites and constraints only when they affect a choice or a step.
3. Put the main path first. Place optional detail behind a descriptive heading or a link.
4. Use short paragraphs, descriptive headings, and one main idea per paragraph.
5. Use a list, table, diagram, or code sample only when it improves scanning, correctness, or decision-making.
6. Give examples that are realistic, valid, and directly support a reader action or decision.
7. Define a term briefly on first use when the reader needs it on that page. Preserve precise protocol terminology.
8. End when the reader has reached the stated outcome. Do not add a recap or conclusion unless it offers a distinct next action.

Remove text that does not change what the reader can understand, decide, or do. In particular, remove promotional language, vague claims, repeated explanations, rhetorical questions, generic transitions, decorative sectioning, and background that delays the task.

## Maintain Hypercerts accuracy

- Describe released, current behavior only. Identify unavailable capabilities as under development when relevant; do not invent a roadmap.
- Verify factual statements from repository sources or authoritative sources already linked by the repository. If the evidence is unavailable, leave the assertion out or state the uncertainty precisely.
- Treat released Lexicon schemas and generated schema tables as authoritative. Do not hand-copy fields, versions, counts, or validation rules that the repository generates.
- Keep service endpoints exclusively in the Running services overview. Link to it rather than repeating hostnames.
- Keep release history in the release system and changelogs. Do not use product pages for historical narratives unless the history changes a present-day integration decision.
- Follow ownership boundaries: this repository contains user-facing documentation; component repositories contain operator and contributor material.

## Change safely

1. Read the target page, its parent index, nearby pages of the same type, and relevant navigation before editing.
2. Make the smallest change that serves the reader need. This skill does not authorize broad cleanup of unrelated existing content.
3. Preserve existing terminology, Markdoc syntax, and site conventions.
4. For a new page, supply accurate frontmatter, add navigation and index links where the architecture requires them, and link to related concepts rather than duplicating them.
5. Check all code, commands, paths, URLs, identifiers, and examples against the repository or authoritative source.
6. Read the resulting page as a first-time reader. Cut every sentence, heading, and example that does not move them toward the outcome.
7. Run `pnpm test`, then the applicable build and link checks when the change affects rendered pages, navigation, or links.

Before completing the task, be able to answer specifically: **What can this reader now do, decide, or understand that they could not before?**
