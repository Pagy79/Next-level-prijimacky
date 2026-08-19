import { createClient } from "@supabase/supabase-js";
import { getAppUrl, getStripe, getStripePriceId } from "../../lib/stripe/server.js";

/**
 * Create a Stripe Checkout Session for one-time PREMIUM (69 Kč).
 * Auth: Authorization: Bearer <supabase access_token>
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

    const stripe = getStripe();
    const priceId = getStripePriceId();
    const appUrl = getAppUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?premium=success`,
      cancel_url: `${appUrl}/?premium=cancel`,
      client_reference_id: user.id,
      customer_email: user.email || undefined,
      metadata: {
        user_id: user.id,
        product: "premium",
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          product: "premium",
        },
      },
      locale: "cs",
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e) {
    console.error("create-checkout failed:", e);
    return res.status(500).json({ error: e?.message || "Checkout failed" });
  }
}
