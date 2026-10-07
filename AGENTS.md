# Documentation protocols

These instructions govern agent-authored documentation in this repository. They apply when creating a page or materially changing a page. They do not authorize broad rewrites of existing documentation.

## Mission

Help a defined reader make a decision, understand a concept, or complete a task. Prefer the smallest accurate explanation that does so. More words are not more help.

Before drafting, identify:

1. **Reader:** who needs this page.
2. **Need:** the question they need answered or task they need completed.
3. **Outcome:** what they can understand, decide, or do after reading.
4. **Page type:** tutorial, how-to, reference, or explanation.

If one page serves unrelated needs, split the work or choose the primary need. Do not disguise several pages as one long page.

## Write for the job

- Begin with the direct answer, goal, or purpose. A reader should know whether the page is useful within its opening paragraph.
- Use task-oriented titles for how-to pages. Use precise subject titles for conceptual and reference pages.
- Match the page type to its job:
  - **Tutorial:** a safe, bounded learning path with a working result.
  - **How-to:** ordered steps to achieve a specific real-world outcome.
  - **Reference:** facts, schemas, options, and constraints organized for lookup.
  - **Explanation:** the mental model, rationale, relationships, and trade-offs a reader needs to reason well.
- Keep concepts, instructions, and reference material separate unless combining them directly reduces the reader's work.
- Put information at the point it becomes necessary. Link to deeper context rather than interrupting the main path with it.
- State prerequisites, assumptions, limitations, and non-goals where they affect a decision or a step.

## Keep prose useful

- Use plain, concrete language; prefer active verbs and specific nouns.
- Give one clear claim per sentence and one purpose per paragraph.
- Use examples only when they demonstrate a decision, a workflow, an edge case, or valid syntax. Examples must be realistic and technically valid.
- Use headings to answer the reader's next question. Do not create headings merely to subdivide short prose.
- Prefer a compact list, table, diagram, or code sample when it reduces scanning or ambiguity. Do not add visual structure as decoration.
- Define unfamiliar terms on first use on the page, briefly. Link to a fuller explanation when useful.
- Preserve precise technical terms when they are needed. Do not substitute friendly but inaccurate language.

Delete or avoid:

- promotional claims, vague benefits, and scene-setting that does not change the reader's understanding;
- repeated explanations, including restating a heading in its first sentence;
- obvious transitions, rhetorical questions, summaries of nearby text, and conclusion sections with no new action;
- exhaustive background before a reader can act;
- invented facts, speculative implementation details, and unsupported claims.

## Hypercerts-specific integrity

- Read `docs/information-architecture.md` before changing documentation content. Follow its section boundaries, page structures, ownership rules, and release guidance.
- Document the released, current behavior. Do not present proposals, unreleased work, or historical behavior as current capability.
- Treat lexicon schemas, generated schema tables, and linked authoritative sources as the source of truth. Do not copy volatile versions, counts, endpoints, or schema details into prose when the repository already generates or centralizes them.
- Do not add or repeat service endpoints outside the Running services overview.
- Verify factual changes against repository sources or a source explicitly provided or already linked by the repository. When evidence is unavailable, say so or leave the claim out.

## Change discipline

1. Read the target page, related navigation, and similar pages before writing.
2. Make the smallest change that satisfies the defined reader need.
3. Preserve established terminology, Markdoc patterns, and information architecture.
4. For a new page, ensure its title, description, navigation placement, and links make it discoverable.
5. Review the completed change as a first-time reader: remove anything that does not help them reach the stated outcome.
6. Run the checks described in the repository README and the architecture guide when applicable.

Before declaring documentation work complete, answer: **What can this reader now do, decide, or understand that they could not before?** If the answer is not specific, the page needs another pass.
