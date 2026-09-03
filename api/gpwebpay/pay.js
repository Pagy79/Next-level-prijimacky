import { createClient } from "@supabase/supabase-js";
import { getAppUrl } from "../../lib/gpwebpay/config.js";
import { buildCreateOrderPayment } from "../../lib/gpwebpay/payment.js";

/**
 * Start GP webpay payment for PREMIUM (69 Kč).
 * Auth: Authorization: Bearer <supabase access_token>
 * Returns { url, orderNumber } — client redirects to `url`.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({ error: "Supabase env not configured" });
  }

  try {
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const appUrl = getAppUrl(req);
    const returnUrl = `${appUrl}/api/gpwebpay/callback`;

    const { redirectUrl, orderNumber } = buildCreateOrderPayment({
      returnUrl,
      userId: user.id,
    });

    return res.status(200).json({
      url: redirectUrl,
      orderNumber,
      provider: "gpwebpay",
    });
  } catch (e) {
    console.error("gpwebpay pay failed:", e);
    return res.status(500).json({ error: e?.message || "Payment start failed" });
  }
}
