import { createClient } from "@supabase/supabase-js";
import { getStripe } from "../../lib/stripe/server.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function grantPremium(userId, extras = {}) {
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
    .update({
      is_premium: true,
      ...extras,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Stripe webhook → set profiles.is_premium = true (service_role).
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: "Missing STRIPE_WEBHOOK_SECRET" });
  }

  try {
    const stripe = getStripe();
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature" });
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "payment" && session.payment_status === "paid") {
        const userId =
          session.metadata?.user_id ||
          session.client_reference_id ||
          null;
        if (!userId) {
          console.error("Stripe webhook: missing user_id on session", session.id);
          return res.status(400).json({ error: "Missing user_id" });
        }
        await grantPremium(userId);
      }
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("stripe webhook failed:", e);
    return res.status(400).json({ error: e?.message || "Webhook error" });
  }
}
