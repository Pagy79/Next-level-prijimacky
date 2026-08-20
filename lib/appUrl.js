/** Canonical production origin for Kompas na školu. */
export const DEFAULT_APP_URL = "https://www.kompasnaskolu.cz";

export function normalizeAppUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/$/, "");
}

/**
 * Public app URL from env (cron, e-mails, scripts).
 * Supports APP_URL, VITE_APP_URL, and NEXT_PUBLIC_APP_URL.
 * Falls back to the production domain — never to a stale Vercel URL.
 */
export function resolveAppUrlFromEnv(env = process.env) {
  return (
    normalizeAppUrl(env.APP_URL) ||
    normalizeAppUrl(env.VITE_APP_URL) ||
    normalizeAppUrl(env.NEXT_PUBLIC_APP_URL) ||
    DEFAULT_APP_URL
  );
}

/**
 * App URL for request-scoped redirects (Stripe Checkout success/cancel).
 * Prefer the browser Origin so localStorage session stays on the same host.
 */
export function getAppUrl(req, env = process.env) {
  const originHeader = req?.headers?.origin;
  if (originHeader && /^https?:\/\//i.test(originHeader)) {
    return normalizeAppUrl(originHeader);
  }

  const referer = req?.headers?.referer;
  if (referer) {
    try {
      return normalizeAppUrl(new URL(referer).origin);
    } catch {
      /* fall through */
    }
  }

  const explicit =
    normalizeAppUrl(env.APP_URL) ||
    normalizeAppUrl(env.VITE_APP_URL) ||
    normalizeAppUrl(env.NEXT_PUBLIC_APP_URL);
  if (explicit) return explicit;

  const proto = req?.headers?.["x-forwarded-proto"] || "https";
  const host = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
  if (host) return normalizeAppUrl(`${proto}://${host}`);

  return DEFAULT_APP_URL;
}
