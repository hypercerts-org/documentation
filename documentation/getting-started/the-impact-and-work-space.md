# The Impact and Work Space

## Introduction

A _Hypercert_ is defined by:

1. **Contributors** - The individuals or entities who performed the work
2. **Scope of Work** - What work was done, defined using logical conditions on labels
3. **Time of Work** - When the work was performed (start and end dates)
4. **Scope of Impact** - What impact was created, defined using logical conditions on labels
5. **Time of Impact** - When the impact occurs or occurred (start and end dates)
6. **Rights** - What rights holders have over this impact claim



### **Claims in the Space**

Every hypercert represents a single claim within this impact space - a specific combination of who did what work, when they did it, what impact it created, when that impact occurred, and what rights exist over that claim.



## Work Scope

The work described in hypercerts is supposed to create a positive impact.

#### Excursion: Logic Models

To describe this impact in a structured way, **logic models** are often used. They distinguish between

The work scope defines what work a hypercert covers using logical conditions.

The work scope defines **what work** a hypercert covers inside the [impact space](the-impact-and-work-space.md#the-impact-space). This is the core definition of what a hypercert actually is—the scope of work being claimed for impact.

### How It Works

The work scope uses three logical operators based on [logical conjunction](https://en.wikipedia.org/wiki/Logical_conjunction):

* **`allOf`** - Labels that MUST all be present
* **`anyOf`** - At least ONE of these labels must be present
* **`noneOf`** - NONE of these labels can be present

Think of it like filtering: you're defining exactly which work falls within your hypercert's boundaries.

### Examples

**All IPFS work except library X:**

json

```json
{
  "allOf": ["IPFS"],
  "noneOf": ["library-x"]
}
```

**Go and JavaScript implementations of libp2p:**

json

```json
{
  "allOf": ["libp2p"],
  "anyOf": ["go-libp2p", "js-libp2p"]
}
```

"Any of" here is required because a single piece of work cannot simultaneously be both a Go implementation AND a JavaScript implementation - they are mutually exclusive. However, you want your hypercert to cover work for both implementations.

The `anyOf` operator captures this "either/or" logic: work must be related to libp2p (`allOf`) AND must be either Go OR JavaScript work (`anyOf`).&#x20;



### Key Insight

The `anyOf` operator is essentially "this OR this OR this" — it captures cases where work can't be multiple things simultaneously (like being both Go AND JavaScript) but you want to include multiple valid options in your scope.
