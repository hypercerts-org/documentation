---
title: "Deep Dive: The Work Scope"
---

# Deep Dive: The Work Scope

Compared to the _who_, _when_, and _where_ dimensions, the _what_ dimension requires additional structure to define a piece of work in a clearly bounded and non-overlapping way. Conceptually, this means precisely specifying which activities belong to a claim, and which do not. To do this, hypercerts use a simple logical scoping mechanism based on conjunctive and disjunctive conditions, allowing a hypercert to specify exactly which subset of activities is included—and which is excluded—within a broader set of possible work.

If the _what_ dimension is left empty, the hypercert applies to **all work performed by the named contributors** within the specified time period and location. In other words, the empty _what_ defines a maximal scope: the full set of activities performed by those actors within the specified time period and location.

{% callout type="info" %}
**Formal scoping model vs. user mental model** Conceptually, hypercert work scopes are defined by starting from this maximal activity set and progressively narrowing it using explicit inclusion and exclusion conditions. • This formal model ensures _precise_ scopes; non-overlap requires coordination across issuers and shared tag semantics.

In practice, however, contributors typically think in terms of positively declaring what work is included. User interfaces and tooling may therefore present this as a constructive selection of activities, even though the underlying model is expressed as filters on a maximal scope.
{% /callout %}

Starting from this maximal scope, the work scope can be progressively narrowed using three complementary conditions that describe how activities relate to the work being claimed. These conditions act as filters on the broader activity set, making explicit which scope tags must all apply, which require at least one match, and which must not apply—allowing scopes to be defined precisely, compositionally, and without overlap.

* **withinAllOf**: Scope tags that **must all apply** for an activity to be included in the scope.
* **withinAnyOf**: Scope tags of which **at least one must apply** for an activity to be included in the scope.
* **withinNoneOf**: Scope tags that **must not apply** for an activity to be included in the scope.

Together, these correspond to logical **AND**, **OR**, and **NOT** conditions.

Let's look at a concrete example: contributors working on the InterPlanetary File System (IPFS) in 2025. The goal is to issue a hypercert that represents **only contributions to IPFS**, and excludes any other work those contributors may have done during the same period. To do this, the work scope is restricted as follows:

* **Hypercert 1**
  * `withinAllOf: IPFS`

This definition ensures that only activities related to IPFS are included. To reduce ambiguity, the scope tag _IPFS_ can be grounded in a concrete reference, such as the GitHub organization at [https://github.com/ipfs](https://github.com/ipfs).

Now suppose we want to distinguish **implementation work** on IPFS from other forms of contribution, such as work on the overall technical specification. In particular, we want to separate concrete implementations in different programming languages—such as Go and Rust—from the rest of the IPFS work. This can be expressed by defining two non-overlapping hypercerts:

* **Hypercert 2**
  * `withinAllOf: IPFS`
  * `withinAnyOf: Go-Implementation, Rust-Implementation`
* **Hypercert 3**
  * `withinAllOf: IPFS`
  * `withinNoneOf: Go-Implementation, Rust-Implementation`

Here, `withinAnyOf` defines a specific subset of IPFS work: activities related to _at least one_ of the listed implementations are included in Hypercert 2. `withinNoneOf` is then used to explicitly exclude this same subset from Hypercert 3. Taken together, Hypercerts 2 and 3 form a **partition** of the IPFS work scope defined by Hypercert 1: every included activity appears in exactly one of the two.

We can further refine the implementation work by separating the Go and Rust implementations into their own hypercerts. This allows each implementation to be evaluated, funded, and referenced independently, while still remaining part of the overall IPFS work scope. This refinement results in two additional hypercerts that together cover exactly the same scope as Hypercert 2:

* **Hypercert 2a**
  * `withinAllOf: IPFS`
  * `withinAnyOf: Go-Implementation`
* **Hypercert 2b**
  * `withinAllOf: IPFS`
  * `withinAnyOf: Rust-Implementation`

Together, Hypercerts 2a and 2b form a complete and non-overlapping partition of the IPFS implementation activities. Each activity falls into exactly one of these hypercerts, avoiding any double accounting of work and its associated impact.

In practice, the scope tags used to define work scopes are determined within each practice domain. They are a modeling choice, not a predetermined classifier. The hypercerts scoping mechanism defines how such tags can be combined to specify a work scope, but deliberately does not define which tags are valid or what they mean.

Hence, these examples illustrate how to _construct_ non-overlapping scopes. However, overlap prevention is not enforced globally by the protocol; it emerges from shared tag vocabularies, domain governance, and application-level checks.

These scope tags can be informal at first, but over time are typically grounded in shared domain ontologies. For example, if separate hypercerts are issued for _reforestation_ activities and _water management_ activities in the same area and time period, it must be clear—within that domain—what these tags concretely refer to.

These ontologies cannot be defined centrally by the hypercerts project. Instead, they must emerge from the practitioners, institutions, and communities operating within each domain. The role of the hypercerts project is to support the coordination of these domain-specific ontologies—helping actors align on shared definitions, reference them consistently, and evolve them over time—without prescribing their content.
