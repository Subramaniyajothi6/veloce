import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Tiny stateless session token: `base64url(payload).base64url(HMAC-SHA256)`.
 * Signed with `SESSION_SECRET` so a forged cookie can't pass verification.
 * No dependencies and no `next/headers`, so it's safe to import from `proxy.ts`
 * (Node runtime) as well as server components / actions.
 */
export const SESSION_COOKIE = "veloce_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

/** Create a signed token for the admin. Throws if `SESSION_SECRET` is missing. */
export function createToken(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const body = Buffer.from(JSON.stringify({ sub: "admin", exp })).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

/** True only for a structurally valid, correctly signed, unexpired token. */
export function verifyToken(token?: string | null): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !token) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
