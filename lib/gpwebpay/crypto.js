import { createPrivateKey, createPublicKey, createSign, createVerify } from "crypto";

/**
 * GP webpay signs with RSA-SHA1 + PKCS#1 v1.5 (official “Key Management and signing messages”).
 * Env keys may contain literal "\n" from Vercel / .env.local.
 */
export function normalizePem(raw) {
  let s = String(raw || "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1);
  }
  return s.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
}

export function loadMerchantPrivateKey() {
  const pem = normalizePem(process.env.GPWEBPAY_PRIVATE_KEY);
  if (!pem) throw new Error("Missing GPWEBPAY_PRIVATE_KEY");
  const passphrase = process.env.GPWEBPAY_KEY_PASSPHRASE || undefined;
  return createPrivateKey({
    key: pem,
    format: "pem",
    passphrase: passphrase || undefined,
  });
}

export function loadGpPublicKey() {
  const pem = normalizePem(process.env.GPWEBPAY_PUBLIC_KEY);
  if (!pem) throw new Error("Missing GPWEBPAY_PUBLIC_KEY");
  // Accepts PEM public key or X.509 certificate.
  return createPublicKey(pem);
}

/** Join digest fields with "|" — omit missing optionals; empty string still counts as present. */
export function joinDigestFields(values) {
  return values.map((v) => String(v)).join("|");
}

export function signDigest(message) {
  const key = loadMerchantPrivateKey();
  const signer = createSign("RSA-SHA1");
  signer.update(message, "utf8");
  signer.end();
  return signer.sign(key, "base64");
}

export function verifyDigest(message, digestBase64) {
  if (!digestBase64) return false;
  const key = loadGpPublicKey();
  const verifier = createVerify("RSA-SHA1");
  verifier.update(message, "utf8");
  verifier.end();
  try {
    return verifier.verify(key, String(digestBase64).replace(/ /g, "+"), "base64");
  } catch {
    return false;
  }
}
