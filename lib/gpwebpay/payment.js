import { createClient } from "@supabase/supabase-js";
import {
  joinDigestFields,
  signDigest,
  verifyDigest,
} from "./crypto.js";
import {
  GP_CURRENCY_CZK,
  GP_OPERATION_CREATE_ORDER,
  getGatewayUrl,
  getMerchantNumber,
  getPremiumAmountHellers,
  makeOrderNumber,
} from "./config.js";

/**
 * Build CREATE_ORDER params + redirect URL for GP webpay HTTP API.
 * Digest fields (present only): MERCHANTNUMBER|OPERATION|ORDERNUMBER|AMOUNT|CURRENCY|DEPOSITFLAG|URL|DESCRIPTION|MD
 */
export function buildCreateOrderPayment({ returnUrl, userId }) {
  const merchantNumber = getMerchantNumber();
  const orderNumber = makeOrderNumber();
  const amount = getPremiumAmountHellers();
  const currency = GP_CURRENCY_CZK;
  const depositFlag = "1";
  const description = "Kompas PREMIUM";
  // Returned unchanged in callback — used to map payment → Supabase user.
  const md = String(userId);

  const digestSource = joinDigestFields([
    merchantNumber,
    GP_OPERATION_CREATE_ORDER,
    orderNumber,
    amount,
    currency,
    depositFlag,
    returnUrl,
    description,
    md,
  ]);
  const digest = signDigest(digestSource);

  const params = {
    MERCHANTNUMBER: merchantNumber,
    OPERATION: GP_OPERATION_CREATE_ORDER,
    ORDERNUMBER: orderNumber,
    AMOUNT: amount,
    CURRENCY: currency,
    DEPOSITFLAG: depositFlag,
    URL: returnUrl,
    DESCRIPTION: description,
    MD: md,
    DIGEST: digest,
    LANG: "cs",
  };

  const gateway = getGatewayUrl();
  // Copy so we don't mutate the cached/env URL object across requests.
  const redirect = new URL(gateway.toString());
  // Clear any accidental query from env; payment params are the source of truth.
  redirect.search = "";
  for (const [key, value] of Object.entries(params)) {
    redirect.searchParams.set(key, value);
  }

  return {
    redirectUrl: redirect.toString(),
    orderNumber,
    amount,
    digestSource,
    gatewayPath: redirect.pathname,
  };
}

/** Official response DIGEST field order (include only fields actually present). */
const RESPONSE_DIGEST_ORDER = [
  "OPERATION",
  "ORDERNUMBER",
  "MERORDERNUM",
  "MD",
  "PRCODE",
  "SRCODE",
  "RESULTTEXT",
  "ADDINFO",
  "TOKEN",
  "EXPIRY",
  "ACSRES",
  "ACCODE",
  "PANPATTERN",
  "DAYTOCAPTURE",
  "TOKENREGSTATUS",
  "ACRC",
  "RRN",
  "PAR",
  "TRACEID",
];

export function pickCallbackParams(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw || {})) {
    if (v == null) continue;
    const key = String(k).toUpperCase();
    out[key] = Array.isArray(v) ? String(v[0]) : String(v);
  }
  return out;
}

export function verifyCallbackDigests(params) {
  const digest = params.DIGEST;
  const digest1 = params.DIGEST1;
  if (!digest || !digest1) {
    return { ok: false, reason: "Missing DIGEST or DIGEST1" };
  }

  const present = [];
  for (const key of RESPONSE_DIGEST_ORDER) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      present.push(params[key]);
    }
  }
  const digestMessage = joinDigestFields(present);
  if (!verifyDigest(digestMessage, digest)) {
    return { ok: false, reason: "Invalid DIGEST", digestMessage };
  }

  const merchantNumber = getMerchantNumber();
  const digest1Message = joinDigestFields([...present, merchantNumber]);
  if (!verifyDigest(digest1Message, digest1)) {
    return { ok: false, reason: "Invalid DIGEST1", digestMessage: digest1Message };
  }

  return { ok: true, digestMessage, digest1Message };
}

export function isSuccessfulPayment(params) {
  return String(params.PRCODE) === "0" && String(params.SRCODE) === "0";
}

export async function grantPremium(userId) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase service role env");
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await admin
    .from("profiles")
    .update({ is_premium: true })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
