# MCP OAuth Gateway

The `/mcp` endpoint (Streamable HTTP) can run as an **OAuth 2.0 protected
resource** following the MCP authorization model (MCP spec 2025-06-18, which
builds on OAuth 2.1 + [RFC 9728 Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728)).

This is **off by default**. With it off, `/mcp` is protected by the same static
bearer API token as the REST API — no behavior change.

## What it does when enabled

1. **Advertises an authorization server.** A public discovery document is served
   at:

   ```
   GET /.well-known/oauth-protected-resource
   ```

   ```json
   {
     "resource": "https://your-host/mcp",
     "authorization_servers": ["https://your-tenant.auth0.com/"],
     "jwks_uri": "https://your-tenant.auth0.com/.well-known/jwks.json",
     "bearer_methods_supported": ["header"],
     "scopes_supported": ["mcp:invoke"]
   }
   ```

2. **Validates bearer JWTs.** Incoming `Authorization: Bearer <jwt>` tokens are
   verified against the authorization server's JWKS (signature, `iss`, `aud`,
   `exp`). Audience binding (RFC 8707) prevents token passthrough.

3. **Challenges unauthenticated clients** with a `WWW-Authenticate` header that
   points back at the metadata document, so spec-compliant MCP clients can
   discover the AS and complete the flow:

   ```
   WWW-Authenticate: Bearer resource_metadata="https://your-host/.well-known/oauth-protected-resource"
   ```

4. **Keeps a static-token fallback** (on by default) so local/CLI usage with the
   API token keeps working. Set `MCP_OAUTH_ALLOW_STATIC_FALLBACK=false` to
   require a JWT.

## Configuration

| Env var | Required | Description |
| --- | --- | --- |
| `MCP_OAUTH_ENABLED` | — | `true` to enable (default off) |
| `MCP_OAUTH_ISSUER` | yes | Authorization server issuer URL |
| `MCP_OAUTH_JWKS_URI` | yes | AS JWKS endpoint used to verify token signatures |
| `MCP_OAUTH_AUDIENCE` | yes* | Expected token audience (*defaults to `MCP_OAUTH_RESOURCE`) |
| `MCP_OAUTH_RESOURCE` | yes* | Canonical resource URI for this server (*defaults to `MCP_OAUTH_AUDIENCE`) |
| `MCP_OAUTH_SCOPES` | no | Advertised scopes (comma/space-separated) |
| `MCP_OAUTH_ALLOW_STATIC_FALLBACK` | no | `false` to reject the static API token (default: accept it) |

### Example (Auth0)

```bash
MCP_OAUTH_ENABLED=true
MCP_OAUTH_ISSUER=https://your-tenant.auth0.com/
MCP_OAUTH_JWKS_URI=https://your-tenant.auth0.com/.well-known/jwks.json
MCP_OAUTH_AUDIENCE=https://your-host/mcp
MCP_OAUTH_RESOURCE=https://your-host/mcp
MCP_OAUTH_SCOPES=mcp:invoke
```

Any standards-compliant OAuth 2.0 / OIDC provider that publishes a JWKS works
(Auth0, Keycloak, Microsoft Entra, Okta, etc.).

## Scope & limitations

This implements the **resource-server** half of the MCP auth model — the half
MCP clients actually negotiate against. The token-issuing **authorization
server** is expected to be an external IdP. An embedded authorization server
(local `/authorize` + `/token` + dynamic client registration) is **not** included
and is tracked as a future roadmap item.
