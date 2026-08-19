import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(key);
}

export function getAppUrl(req) {
  const fromEnv = (process.env.APP_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

export function getStripePriceId() {
  return process.env.STRIPE_PRICE_ID || "price_1U6DXtC2fCrHJOlkyGzf1vcA";
}
