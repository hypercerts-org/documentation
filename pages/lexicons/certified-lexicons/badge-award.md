---
title: Badge Award
description: Lexicon reference for app.certified.badge.award, the record that gives a badge to an account or a specific record.
---

# Badge Award

`app.certified.badge.award`

## Overview

A badge award gives a badge to a recipient. It connects a [badge definition](/lexicons/certified-lexicons/badge-definition) to a subject, which is either an account (by DID) or a specific record, such as a project's activity claim. It can include a note explaining why the badge was given and a link to supporting material.

The award is published in the issuer's repository, and the issuer is the account that holds that repository. No field names the issuer. An application displaying a badge needs to check who awarded it and whether that issuer is recognized for the badge. See [Trust and Recognition](/core-concepts/certified-identity) in the Guide.

## How it's used

- **An issuer awards the badge.** After reviewing a project, a certification network publishes an award in its own repository that references its badge definition and names the project.
- **The subject can be an account or a record.** Use a DID to recognize a person or organization as a whole. Use a strong reference to recognize one specific record, such as the activity that was reviewed.
- **The recipient can respond.** The recipient publishes a [badge response](/lexicons/certified-lexicons/badge-response) in their own repository to accept or reject the award.
- **Applications gather awards by indexing.** Neither the definition nor the subject points to the award, so applications find awards by indexing badge award records across repositories.

`badge`, `subject`, and `createdAt` are required.

## Schema

{% lexicon-schema nsid="app.certified.badge.award" /%}

## Example

A solar network awarding its certification badge to the community energy project's installation activity:

```json
{
  "$type": "app.certified.badge.award",
  "badge": {
    "uri": "at://did:plc:k3nq7wz2vbx5rmt4ydh6pcsa/app.certified.badge.definition/3lu7ynb2ksd2x",
    "cid": "bafyreif5qfk6bt2qjm4ajg3e4ovy5yalczwnvxm7mhh2ccgyqrckfnrkoa"
  },
  "subject": {
    "$type": "com.atproto.repo.strongRef",
    "uri": "at://did:plc:4yyb5gyoxl3sqdlqrvuxshkp/org.hypercerts.claim.activity/3lx2m5qfzxk2b",
    "cid": "bafyreihx3yc6gvt5dn2xvh7kt4y4zj5ohbrgkvq3kx2clcqm7m4ln6gxbe"
  },
  "note": "Design, safety, and first-year production data reviewed in September 2026.",
  "url": "https://solarnetwork.example.org/reviews/millbrook-phase-1",
  "createdAt": "2026-09-22T14:10:00.000Z"
}
```

The award sits in the network's repository (`did:plc:k3nq7wz2vbx5rmt4ydh6pcsa`), which is what makes the network its issuer.

## Rules and best practices

- **Check who awarded it.** Take the issuer from the DID of the repository holding the award. If the definition has `allowedIssuers`, only count awards from listed DIDs. Otherwise, decide whether your application recognizes that issuer at all.
- **An award isn't the recipient's agreement.** Anyone can award any badge to any account or record, and the recipient can't edit or delete it. Show an award as accepted only when the recipient has published an accepting [response](/lexicons/certified-lexicons/badge-response).
- **Label self-awarded badges.** If the issuer is also the subject (or the account that published the subject record), the award is not an outside recognition. Don't present it like one.
- **Award the record when the recognition is specific.** A DID subject covers the account as it is now and later. A strong reference covers one version of one record, so a badge for a reviewed installation stays tied to the version that was reviewed. If that activity is later edited, the award still points to the earlier version.
- **The definition is pinned too.** `badge` is a strong reference, so the award refers to the definition as it stood when awarded. Applications can indicate when the current definition differs.
- **Withdraw by deleting.** The schema has no expiry or revocation field. To withdraw an award, the issuer deletes it; applications that cache awards should re-check them from time to time. Don't infer an expiry that the record doesn't state.
- **Repeated awards aren't extra recognition.** If an issuer awards the same badge to the same subject more than once, treat it as one award rather than counting each record.
- **The `url` is the issuer's own link.** It can point to a review report or certificate page, but it's supplied by the issuer and doesn't count as independent confirmation.

## Related

- [Badge Definition](/lexicons/certified-lexicons/badge-definition): what the badge means and who may award it.
- [Badge Response](/lexicons/certified-lexicons/badge-response): the recipient's acceptance or rejection.
- [Activity Claim](/lexicons/hypercerts-lexicons/activity-claim) and [Profile](/lexicons/certified-lexicons/profile): common subjects of an award.
- [Shared Definitions](/lexicons/certified-lexicons/shared-defs): the DID object used for account subjects.
- Guide: [Trust and Recognition](/core-concepts/certified-identity), [Records That Change Over Time](/architecture/data-flow-and-lifecycle).
