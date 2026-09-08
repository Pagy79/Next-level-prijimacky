import { createPrivateKey, createPublicKey, createSign, createVerify } from "crypto";
import forge from "node-forge";

/**
 * GP webpay signs with RSA-SHA1 + PKCS#1 v1.5.
 * Prefer storing keys on Vercel as base64 of the whole PEM (avoids newline corruption).
 */
export function normalizePem(raw) {
  let s = String(raw || "")
    .replace(/^\uFEFF/, "")
    .trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1);
  }

  // Whole-PEM base64 (recommended for Vercel secrets)
  if (s && !s.includes("-----BEGIN") && /^[A-Za-z0-9+/=\s]+$/.test(s)) {
    try {
      const decoded = Buffer.from(s.replace(/\s+/g, ""), "base64").toString("utf8");
      if (decoded.includes("-----BEGIN")) s = decoded;
    } catch {
      // keep original
    }
  }

  // Common Vercel paste variants
  s = s
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/&#10;|&#x0a;/gi, "\n")
    .trim();

  // Newlines collapsed to spaces: "-----BEGIN …----- MIIE… -----END …-----"
  if (
    s.includes("-----BEGIN") &&
    s.includes("-----END") &&
    s.split("\n").length < 3
  ) {
    s = rewrapPem(s);
  }

  // Soften accidental spaces around headers
  s = s
    .replace(/-----BEGIN ([^-]+)-----\s*/g, "-----BEGIN $1-----\n")
    .replace(/\s*-----END ([^-]+)-----/g, "\n-----END $1-----")
    .trim();

  return s;
}

/** Rebuild PEM when body lost its newlines (common after Vercel paste). */
function rewrapPem(singleLine) {
  const m = singleLine.match(
    /-----BEGIN ([^-]+)-----(.*)-----END \1-----/s
  );
  if (!m) return singleLine;

  const type = m[1].trim();
  let body = m[2].replace(/\s+/g, "");
  const lines = body.match(/.{1,64}/g) || [];
  return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
}

function decryptPrivateKeyWithForge(pem, passphrase) {
  const pass = passphrase || "";
  const errors = [];

  // 1) Classic OpenSSL encrypted RSA (Proc-Type / DEK-Info)
  try {
    const k = forge.pki.decryptRsaPrivateKey(pem, pass);
    if (k) return forge.pki.privateKeyToPem(k);
  } catch (e) {
    errors.push(`decryptRsaPrivateKey: ${e.message}`);
  }

  // 2) Unencrypted RSA / PKCS#1
  try {
    const k = forge.pki.privateKeyFromPem(pem);
    if (k) return forge.pki.privateKeyToPem(k);
  } catch (e) {
    errors.push(`privateKeyFromPem: ${e.message}`);
  }

  // 3) PKCS#8 (unencrypted) via asn1
  try {
    const info = forge.pem.decode(pem)[0];
    if (info && /PRIVATE KEY/i.test(info.type) && !/ENCRYPTED/i.test(info.type)) {
      const asn1 = forge.asn1.fromDer(info.body);
      const k = forge.pki.privateKeyFromAsn1(asn1);
      if (k) return forge.pki.privateKeyToPem(k);
    }
  } catch (e) {
    errors.push(`pkcs8: ${e.message}`);
  }

  // 4) Encrypted PKCS#8
  try {
    const encryptedInfo = forge.pki.encryptedPrivateKeyFromPem(pem);
    const decrypted = forge.pki.decryptPrivateKeyInfo(encryptedInfo, pass);
    if (decrypted) {
      const k = forge.pki.privateKeyFromAsn1(decrypted);
      if (k) return forge.pki.privateKeyToPem(k);
    }
  } catch (e) {
    errors.push(`encryptedPkcs8: ${e.message}`);
  }

  const begin = (pem.match(/-----BEGIN [^-]+-----/) || ["(no BEGIN)"])[0];
  throw new Error(
    `Cannot parse GPWEBPAY_PRIVATE_KEY (${begin}). Check newlines/passphrase. ${errors.slice(0, 2).join(" | ")}`
  );
}

export function loadMerchantPrivateKey() {
  const pem = normalizePem(process.env.GPWEBPAY_PRIVATE_KEY);
  if (!pem) throw new Error("Missing GPWEBPAY_PRIVATE_KEY");
  const passphrase = process.env.GPWEBPAY_KEY_PASSPHRASE || undefined;

  if (!/-----BEGIN [^-]+PRIVATE KEY-----/.test(pem)) {
    throw new Error(
      "GPWEBPAY_PRIVATE_KEY must be a PEM private key (-----BEGIN … PRIVATE KEY-----)"
    );
  }

  try {
    return createPrivateKey({
      key: pem,
      format: "pem",
      passphrase: passphrase || undefined,
    });
  } catch {
    const unencryptedPem = decryptPrivateKeyWithForge(pem, passphrase);
    return createPrivateKey({
      key: unencryptedPem,
      format: "pem",
    });
  }
}

export function loadGpPublicKey() {
  const pem = normalizePem(process.env.GPWEBPAY_PUBLIC_KEY);
  if (!pem) throw new Error("Missing GPWEBPAY_PUBLIC_KEY");
  try {
    return createPublicKey(pem);
  } catch {
    const cert = forge.pki.certificateFromPem(pem);
    const pubPem = forge.pki.publicKeyToPem(cert.publicKey);
    return createPublicKey(pubPem);
  }
}

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
