/**
 * OAuth 2.0 protected-resource support for the MCP endpoint.
 *
 * Implements the MCP authorization model (MCP spec 2025-06-18, which adopts
 * OAuth 2.1 + RFC 9728 Protected Resource Metadata): the MCP server is an OAuth
 * *resource server*. It advertises which authorization server(s) issue tokens
 * for it via /.well-known/oauth-protected-resource, and validates incoming
 * bearer tokens as audience-bound JWTs against the AS's JWKS.
 *
 * This is OFF by default (MCP_OAUTH_ENABLED!=='true'); when disabled the MCP
 * endpoint keeps using the static API token exactly as before. When enabled, a
 * valid JWT is accepted and — unless MCP_OAUTH_ALLOW_STATIC_FALLBACK==='false'
 * — the static API token still works too (handy for local/CLI use).
 */
import type { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { convictConfig } from '../config/convictConfig';
import { getOrGenerateApiToken } from '../common/apiToken';

export interface McpOAuthConfig {
  enabled: boolean;
  issuer: string;
  jwksUri: string;
  audience: string;
  /** Canonical resource identifier for this MCP server (RFC 8707). */
  resource: string;
  scopes: string[];
  allowStaticFallback: boolean;
}

export function getMcpOAuthConfig(): McpOAuthConfig {
  const env = process.env;
  return {
    enabled: env.MCP_OAUTH_ENABLED === 'true',
    issuer: env.MCP_OAUTH_ISSUER || '',
    jwksUri: env.MCP_OAUTH_JWKS_URI || '',
    audience: env.MCP_OAUTH_AUDIENCE || env.MCP_OAUTH_RESOURCE || '',
    resource: env.MCP_OAUTH_RESOURCE || env.MCP_OAUTH_AUDIENCE || '',
    scopes: (env.MCP_OAUTH_SCOPES || '')
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean),
    allowStaticFallback: env.MCP_OAUTH_ALLOW_STATIC_FALLBACK !== 'false',
  };
}

/**
 * RFC 9728 Protected Resource Metadata document. Returned from
 * GET /.well-known/oauth-protected-resource so MCP clients can discover which
 * authorization server to obtain a token from.
 */
export function protectedResourceMetadata(cfg: McpOAuthConfig, fallbackResource: string) {
  const doc: Record<string, unknown> = {
    resource: cfg.resource || fallbackResource,
    authorization_servers: cfg.issuer ? [cfg.issuer] : [],
    bearer_methods_supported: ['header'],
  };
  if (cfg.scopes.length) doc.scopes_supported = cfg.scopes;
  if (cfg.jwksUri) doc.jwks_uri = cfg.jwksUri;
  return doc;
}

// Lazily-built, cached JWKS resolver keyed by URI (jose caches the keys itself).
let jwksUriCached: string | null = null;
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks(uri: string) {
  if (!jwks || jwksUriCached !== uri) {
    jwks = createRemoteJWKSet(new URL(uri));
    jwksUriCached = uri;
  }
  return jwks;
}

/** Test-only: drop the cached JWKS resolver between tests. */
export function __resetJwksForTests(): void {
  jwks = null;
  jwksUriCached = null;
}

export async function verifyBearerJwt(token: string, cfg: McpOAuthConfig): Promise<JWTPayload> {
  if (!cfg.jwksUri) throw new Error('MCP OAuth misconfigured: MCP_OAUTH_JWKS_URI is required');
  const { payload } = await jwtVerify(token, getJwks(cfg.jwksUri), {
    issuer: cfg.issuer || undefined,
    audience: cfg.audience || undefined,
  });
  return payload;
}

function staticApiToken(): string {
  const overridden = convictConfig().get('security.apiToken') as string | undefined;
  return overridden || getOrGenerateApiToken();
}

function bearer(req: Request): string | undefined {
  const h = req.headers['authorization'];
  if (!h) return undefined;
  const [scheme, value] = h.split(' ');
  return scheme && /^bearer$/i.test(scheme) ? value : undefined;
}

/**
 * Auth middleware for the MCP endpoint. Delegates to the static-token check
 * when OAuth is disabled; otherwise validates the bearer JWT (with optional
 * static-token fallback). On failure emits a WWW-Authenticate challenge that
 * points clients at the protected-resource metadata, per the MCP spec.
 */
export function mcpAuth(staticCheck: (req: Request, res: Response, next: NextFunction) => void) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cfg = getMcpOAuthConfig();
    if (!cfg.enabled) return staticCheck(req, res, next);

    const token = bearer(req);
    const metadataUrl = `${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource`;
    const challenge = (desc?: string) =>
      `Bearer resource_metadata="${metadataUrl}"` + (desc ? `, error="invalid_token", error_description="${desc}"` : '');

    if (!token) {
      res.setHeader('WWW-Authenticate', challenge());
      res.status(401).json({ error: 'Unauthorized', message: 'Bearer token required' });
      return;
    }

    // Static API token fallback (kept for local/CLI use unless disabled).
    if (cfg.allowStaticFallback && token === staticApiToken()) {
      return next();
    }

    try {
      const payload = await verifyBearerJwt(token, cfg);
      (req as any).auth = payload;
      next();
    } catch (e: any) {
      res.setHeader('WWW-Authenticate', challenge(e?.message || 'token verification failed'));
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
  };
}
