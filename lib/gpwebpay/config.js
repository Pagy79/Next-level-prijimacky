import {
  getAppUrl as resolveRequestAppUrl,
  normalizeAppUrl,
  resolveAppUrlFromEnv,
  DEFAULT_APP_URL,
} from "../appUrl.js";

export const GP_CURRENCY_CZK = "203";
export const GP_OPERATION_CREATE_ORDER = "CREATE_ORDER";

/** Premium price in hellers (69 Kč). Override via GPWEBPAY_AMOUNT. */
export function getPremiumAmountHellers() {
  const raw = process.env.GPWEBPAY_AMOUNT || "6900";
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Invalid GPWEBPAY_AMOUNT");
  }
  return String(n);
}

export function getMerchantNumber() {
  const n = String(process.env.GPWEBPAY_MERCHANT_NUMBER || "").trim();
  if (!n) throw new Error("Missing GPWEBPAY_MERCHANT_NUMBER");
  return n;
}

/** Full gateway URL including path, e.g. https://test.3dsecure.gpwebpay.com/pgw/order.do */
export function getGatewayUrl() {
  let raw = String(process.env.GPWEBPAY_URL || "").trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  if (!raw) throw new Error("Missing GPWEBPAY_URL");

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid GPWEBPAY_URL: ${raw}`);
  }

  // Never collapse to origin — gateway path must stay (/pgw/order.do, /pay-gpw, …).
  if (!parsed.pathname || parsed.pathname === "/") {
    throw new Error(
      `GPWEBPAY_URL must include the gateway path (e.g. https://test.3dsecure.gpwebpay.com/pgw/order.do), got: ${raw}`
    );
  }

  if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  }

  return parsed;
}

/**
 * Absolute public app origin for GP webpay (CREATE_ORDER URL + post-payment redirect).
 *
 * Must NOT trust Referer/Origin — after payment the browser Referer is the GP gateway
 * (e.g. test.3dsecure.gpwebpay.com), which would break redirects to /?premium=success.
 */
export function getAppUrl(req, env = process.env) {
  const fromEnv = resolveAppUrlFromEnv(env);
  // Explicit APP_URL / VITE_APP_URL / NEXT_PUBLIC_APP_URL wins when set.
  const explicit =
    normalizeAppUrl(env.APP_URL) ||
    normalizeAppUrl(env.VITE_APP_URL) ||
    normalizeAppUrl(env.NEXT_PUBLIC_APP_URL);
  if (explicit) return explicit;

  const proto = String(req?.headers?.["x-forwarded-proto"] || "https")
    .split(",")[0]
    .trim();
  const host = String(req?.headers?.["x-forwarded-host"] || req?.headers?.host || "")
    .split(",")[0]
    .trim();
  if (host && !isExternalPaymentHost(host)) {
    return normalizeAppUrl(`${proto}://${host}`);
  }

  return fromEnv || DEFAULT_APP_URL;
}

function isExternalPaymentHost(host) {
  const h = String(host).toLowerCase();
  return (
    h.includes("gpwebpay.com") ||
    h.includes("gpe.cz") ||
    h.includes("3dsecure.")
  );
}

/** Absolute https callback for GP CREATE_ORDER `URL` parameter. */
export function getPaymentReturnUrl(req) {
  const appUrl = getAppUrl(req);
  const returnUrl = new URL("/api/gpwebpay/callback", `${appUrl}/`).href;
  assertAbsoluteHttpUrl(returnUrl, "GP CREATE_ORDER URL");
  return returnUrl;
}

/** Absolute redirect after callback, e.g. https://www.kompasnaskolu.cz/?premium=success */
export function getPremiumResultRedirectUrl(req, premiumStatus) {
  const appUrl = getAppUrl(req);
  const target = new URL("/", `${appUrl}/`);
  target.searchParams.set("premium", String(premiumStatus));
  const href = target.href;
  assertAbsoluteHttpUrl(href, "premium result redirect");
  return href;
}

function assertAbsoluteHttpUrl(url, label) {
  if (!/^https?:\/\//i.test(url) || url.startsWith("/")) {
    throw new Error(`${label} must be absolute http(s) URL, got: ${url}`);
  }
}

/** Kept for debugging / rare callers that need Stripe-style Origin preference. */
export function getAppUrlFromBrowserOrigin(req) {
  return resolveRequestAppUrl(req);
}

/**
 * Unique ORDERNUMBER: max 15 digits (GP requirement).
 * Not a UUID — GP accepts only numeric order numbers.
 */
export function makeOrderNumber() {
  const stamp = Date.now().toString(); // 13 digits
  const rnd = String(Math.floor(Math.random() * 90) + 10); // 2 digits
  return (stamp + rnd).slice(-15);
}
