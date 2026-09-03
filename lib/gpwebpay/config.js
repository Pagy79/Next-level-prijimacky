import { getAppUrl as resolveRequestAppUrl } from "../appUrl.js";

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

/** Full gateway URL including path, e.g. https://test.gpe.cz/pay-gpw */
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

  // Never collapse to origin — path like /pay-gpw must stay.
  if (!parsed.pathname || parsed.pathname === "/") {
    throw new Error(
      `GPWEBPAY_URL must include the gateway path (e.g. https://test.gpe.cz/pay-gpw), got: ${raw}`
    );
  }

  // Drop only a trailing slash on the path; keep /pay-gpw intact.
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  }

  return parsed;
}

export function getAppUrl(req) {
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
