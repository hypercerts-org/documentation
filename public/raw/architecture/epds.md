---
title: ePDS (extended PDS)
description: How the ePDS adds email/OTP login on top of AT Protocol without changing the standard OAuth flow for apps.
---

# ePDS (extended PDS)

The ePDS adds email-based, passwordless sign-in on top of a standard AT Protocol PDS. Users enter their email, receive a one-time code, and end up with a normal AT Protocol session tied to a DID.

Certified operates production, staging, and test ePDS instances. See [Certified services](/reference/certified-services) for the current hostnames and guidance on which to use in which scenario.

For applications, the important part is that ePDS still finishes by issuing a standard AT Protocol authorization code. In practice, this means you can integrate it with [`@atproto/oauth-client-node`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node).

## System overview

```text
Client App
  -> starts AT Protocol OAuth against the PDS

PDS Core
  -> remains the OAuth issuer and token endpoint
  -> advertises the Auth Service as the authorization endpoint

Auth Service
  -> collects the user's email or OTP
  -> verifies the user
  -> returns control to PDS Core via signed callback

PDS Core
  -> issues a normal authorization code

Client App
  -> exchanges the code for tokens
```

The PDS remains the OAuth issuer and token endpoint. The main difference is that the authorization step happens on the ePDS Auth Service, which handles the email and OTP flow before returning control to the PDS.

## Integrating with `@atproto/oauth-client-node`

ePDS works with the standard AT Protocol OAuth client libraries. The main ePDS-specific behavior is how you shape the authorization URL before redirecting the user.

### Flow 1: your app collects the email

In Flow 1, your app has its own email field. Start OAuth normally, then add `login_hint=<email>` to the authorization URL before redirecting the user.

```ts
import { NodeOAuthClient } from '@atproto/oauth-client-node'

const oauthClient = new NodeOAuthClient({
  clientMetadata: {
    client_id: 'https://yourapp.example.com/client-metadata.json',
    client_name: 'Your App',
    client_uri: 'https://yourapp.example.com',
    redirect_uris: ['https://yourapp.example.com/api/oauth/callback'],
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    dpop_bound_access_tokens: true,
  },
  stateStore,
  sessionStore,
})

const url = await oauthClient.authorize('alice.certified.one', {
  scope: 'atproto transition:generic',
})

// ePDS-specific customization happens here.
const authUrl = new URL(url)
authUrl.searchParams.set('login_hint', email)
authUrl.searchParams.set('epds_handle_mode', 'picker-with-random')

return authUrl.toString()
```

{% callout type="warning" %}
Do not put an email address into the PAR body as `login_hint`. For ePDS, add `login_hint` to the authorization URL instead.
{% /callout %}

With `login_hint` set, the user lands directly on the OTP entry step instead of first seeing an email form on ePDS.

### Flow 2: ePDS collects the email

In Flow 2, your app just shows a "Sign in" button. Start OAuth normally and redirect the user to the authorization URL without `login_hint`.

```ts
import { NodeOAuthClient } from '@atproto/oauth-client-node'

const oauthClient = new NodeOAuthClient({
  clientMetadata: {
    client_id: 'https://yourapp.example.com/client-metadata.json',
    client_name: 'Your App',
    client_uri: 'https://yourapp.example.com',
    redirect_uris: ['https://yourapp.example.com/api/oauth/callback'],
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    dpop_bound_access_tokens: true,
  },
  stateStore,
  sessionStore,
})

const url = await oauthClient.authorize('alice.certified.one', {
  scope: 'atproto transition:generic',
})

const authUrl = new URL(url)
authUrl.searchParams.set('epds_handle_mode', 'picker')

return authUrl.toString()
```

Without `login_hint`, ePDS renders its own email form and takes the user through the rest of the OTP flow.

### Callback handling

Callback handling stays standard. Once the user finishes on ePDS, your callback handler receives a normal authorization code and hands it back to `oauth-client-node`.

```ts
const result = await oauthClient.callback(params)

const session = result.session
const did = session.did
```

## Handle modes

Handle mode controls what happens when a brand new user needs a handle during signup.

| Mode | Behavior |
|------|----------|
| `picker-with-random` | Show the handle picker with a "Generate random" option. |
| `picker` | Show the handle picker without a random option. |
| `random` | Skip the picker and assign a random handle automatically. |

Handle mode is resolved in this order:

1. `epds_handle_mode` query param on the authorization URL
2. `epds_handle_mode` in client metadata
3. The ePDS instance default (`EPDS_DEFAULT_HANDLE_MODE`)

This only affects new account creation. Existing users keep their current handle and skip this step.

## Client metadata

Your client metadata file is a public JSON document served over HTTPS. Its URL is also your `client_id`.

### Bare-bones example

```json
{
  "client_id": "https://yourapp.example.com/client-metadata.json",
  "client_name": "Your App",
  "client_uri": "https://yourapp.example.com",
  "redirect_uris": ["https://yourapp.example.com/api/oauth/callback"],
  "scope": "atproto transition:generic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none",
  "dpop_bound_access_tokens": true
}
```

### Full config example

```json
{
  "client_id": "https://yourapp.example.com/client-metadata.json",
  "client_name": "Your App",
  "client_uri": "https://yourapp.example.com",
  "logo_uri": "https://yourapp.example.com/logo.png",
  "redirect_uris": ["https://yourapp.example.com/api/oauth/callback"],
  "scope": "atproto transition:generic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none",
  "dpop_bound_access_tokens": true,
  "brand_color": "#0f172a",
  "background_color": "#ffffff",
  "email_template_uri": "https://yourapp.example.com/email-template.html",
  "email_subject_template": "{{code}} - Your {{app_name}} code",
  "epds_handle_mode": "picker-with-random"
}
```

The extra branding fields customize the hosted login and email experience. `epds_handle_mode` sets your preferred handle mode for new users unless you override it on the authorization URL.

## Further reading

- [Account & Identity Setup](/architecture/account-and-identity)
- [Certified PDSs](/reference/certified-services) — the production, staging, and test ePDS instances Certified operates
- [Certified Group Service (CGS)](/architecture/certified-group-service) — a governance layer that sits in front of a PDS to support multi-identity, role-based repo management
- [Scaffold Starter App](/tools/scaffold)
- [ePDS repository](https://github.com/hypercerts-org/ePDS)
- Install the ePDS agent skill with `npx skills add hypercerts-org/ePDS --skill epds-login`
