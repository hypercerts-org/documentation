---
title: Quickstart
description: Get set up to create hypercerts — via code or the Scaffold app.
---

# Quickstart

There are two ways to create a hypercert:

- **[Creating Your First Hypercert](/getting-started/creating-your-first-hypercert)** — using TypeScript and the ATProto API directly
- **[Using the Scaffold App](/getting-started/using-the-scaffold-app)** — a guided UI wizard, no code required

Both approaches create the same records on your PDS. Pick whichever fits your workflow.

## Setup (for the code path)

If you're using the Scaffold app, skip this — just go to [hypercerts-scaffold.vercel.app](https://hypercerts-scaffold.vercel.app) and sign in with your ATProto handle.

### Install dependencies

```bash
pnpm add @atproto/oauth-client-node @atproto/jwk-jose @atproto/api
```

{% callout type="info" %}
Building a React app? Use `@atproto/oauth-client-browser` instead, alongside `@tanstack/react-query` for data fetching and caching.
{% /callout %}

### Authenticate

Authentication uses AT Protocol OAuth. Your app needs a client metadata document hosted at a public URL:

```typescript
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { JoseKey } from "@atproto/jwk-jose";
import { Agent } from "@atproto/api";

const client = new NodeOAuthClient({
  clientMetadata: {
    client_id: "https://your-app.example.com/client-metadata.json",
    client_name: "My App",
    client_uri: "https://your-app.example.com",
    redirect_uris: ["https://your-app.example.com/callback"],
    grant_types: ["authorization_code", "refresh_token"],
    scope: "atproto transition:generic",
    response_types: ["code"],
    application_type: "web",
    token_endpoint_auth_method: "private_key_jwt",
    token_endpoint_auth_signing_alg: "RS256",
    dpop_bound_access_tokens: true,
    jwks_uri: "https://your-app.example.com/jwks.json",
  },
  keyset: await Promise.all([
    JoseKey.fromImportable(process.env.PRIVATE_KEY_1, "key1"),
    JoseKey.fromImportable(process.env.PRIVATE_KEY_2, "key2"),
    JoseKey.fromImportable(process.env.PRIVATE_KEY_3, "key3"),
  ]),
  stateStore: { /* ... your state store implementation */ },
  sessionStore: { /* ... your session store implementation */ },
});

// Redirect the user to their PDS to authorize
const url = await client.authorize("alice.certified.app");

// After the user approves, exchange the callback params for a session
const { session } = await client.callback(new URLSearchParams(callbackQuery));

// Wrap the session in an Agent to make authenticated calls
const agent = new Agent(session);
```

See the [AT Protocol OAuth documentation](https://atproto.com/specs/oauth) for full details on client metadata, session storage, and keyset configuration. For further info on how to set up OAuth you can check out [AT Protos node.js implementation tutorial](https://atproto.com/guides/oauth-cli-tutorial) or the [scaffold app](/tools/scaffold).
