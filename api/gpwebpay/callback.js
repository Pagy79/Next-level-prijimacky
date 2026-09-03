import { getPremiumResultRedirectUrl } from "../../lib/gpwebpay/config.js";
import {
  grantPremium,
  isSuccessfulPayment,
  pickCallbackParams,
  verifyCallbackDigests,
} from "../../lib/gpwebpay/payment.js";

function readParams(req) {
  if (req.method === "POST" && req.body && typeof req.body === "object") {
    return pickCallbackParams(req.body);
  }
  return pickCallbackParams(req.query || {});
}

function redirect(res, req, premiumStatus) {
  const target = getPremiumResultRedirectUrl(req, premiumStatus);
  res.writeHead(302, { Location: target });
  res.end();
}

/**
 * GP webpay return URL (browser GET/POST).
 * Verifies DIGEST + DIGEST1, grants premium on PRCODE=0 & SRCODE=0, redirects to app.
 *
 * CREATE_ORDER URL must be absolute:
 *   https://www.kompasnaskolu.cz/api/gpwebpay/callback
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const params = readParams(req);

  try {
    const verified = verifyCallbackDigests(params);
    if (!verified.ok) {
      console.error("gpwebpay callback signature failed:", verified.reason, {
        order: params.ORDERNUMBER,
        prcode: params.PRCODE,
        srcode: params.SRCODE,
      });
      return redirect(res, req, "cancel");
    }

    if (!isSuccessfulPayment(params)) {
      console.info("gpwebpay payment not successful:", {
        order: params.ORDERNUMBER,
        prcode: params.PRCODE,
        srcode: params.SRCODE,
        result: params.RESULTTEXT,
      });
      return redirect(res, req, "cancel");
    }

    const userId = String(params.MD || "").trim();
    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(userId)) {
      console.error("gpwebpay callback: invalid MD user id", params.ORDERNUMBER);
      return redirect(res, req, "cancel");
    }

    await grantPremium(userId);
    console.info("gpwebpay premium granted:", {
      userId,
      order: params.ORDERNUMBER,
    });
    return redirect(res, req, "success");
  } catch (e) {
    console.error("gpwebpay callback failed:", e);
    try {
      return redirect(res, req, "cancel");
    } catch {
      res.writeHead(302, { Location: "https://www.kompasnaskolu.cz/?premium=cancel" });
      res.end();
    }
  }
}
