---
title: Describing and Classifying Work
description: Help people and applications understand what an activity covers and find related projects.
---

# Describing and Classifying Work

People describe similar work in different ways. That is fine for a conversation, but it makes searching and comparing projects harder. Shared terms help an application recognize connections without throwing away the detail in people's descriptions.

Hypercerts offers two related tools: work scopes for activities, and classification tags for collections and features.

## Say what an activity covers

A **work scope** explains the work included in an activity claim. For an open-source project, it might say “maintenance of the mapping library, including bug fixes and documentation.” This helps a reader understand what the claim covers and what would belong in another activity.

A plain-text scope is often enough. When applications need to compare or combine scopes more precisely, there is also a structured form using **Common Expression Language (CEL)**. It combines shared work-scope terms with logical expressions instead of relying on wording alone.

You don't need to learn that expression language to understand the Guide. The choice is practical: use a readable description when people need an explanation, and consider the structured form when software needs a shared way to reason about the scope.

## Help people find related projects

**Vocabulary tags** classify collections, including projects, and features such as land areas. They can help a directory group projects by subject or let a funder find work in a field it supports.

These classification tags have a different job from an activity's work scope. A project category helps people find the project; a work scope says which work an activity covers. They use separate schemas.

## Share terms, not just labels

A reusable tag is a record with its own publisher and identifier. Two tags called “restoration” may mean different things if different organizations define them. Keeping the link to the actual tag lets another app inspect the intended meaning.

Tags can also relate to broader terms, external concepts, or replacement terms. Communities can develop vocabularies suited to their field, while applications choose which vocabularies to recognize.

This gives shared structure room to grow. An app can show an unfamiliar term with its source instead of silently translating it into a category that means something else.

The [Lexicon inventory](/reference/lexicon-inventory) lists the work-scope and vocabulary schemas when you need their exact definitions.

Next: [Records That Change Over Time](/architecture/data-flow-and-lifecycle), to see how these connections behave when information is updated.
