import Stripe from "stripe";
import { getAppUrl as resolveRequestAppUrl } from "../appUrl.js";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(key);
}

export function getAppUrl(req) {
  return resolveRequestAppUrl(req);
}

export function getStripePriceId() {
  return process.env.STRIPE_PRICE_ID || "price_1U6DXtC2fCrHJOlkyGzf1vcA";
}
