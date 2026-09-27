import { generateSync, verifySync, generateURI, generateSecret } from "otplib";
import QRCode from "qrcode";

/**
 * Generates a fresh, cryptographically secure 20-byte base32 TOTP secret for a specific admin account.
 */
export function generatePerAccountSecret(): string {
  return generateSecret();
}

/**
 * Generates a current valid 6-digit TOTP code for a specific user's base32 secret.
 */
export function generateTotpToken(secret: string): string {
  return generateSync({ secret });
}

/**
 * Verifies a 6-digit TOTP token against a specific user's base32 secret.
 * Enforces RFC 6238 time-step checking (valid only within current window).
 */
export function verifyTotpToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  const clean = token.replace(/\D/g, "").trim();
  if (!/^\d{6}$/.test(clean)) return false;
  try {
    const result = verifySync({ token: clean, secret, epochTolerance: 240 });
    return Boolean(result && result.valid);
  } catch {
    return false;
  }
}

/**
 * Generates standard RFC 6238 otpauth URI for a specific admin user's authenticator enrollment
 */
export function getAccountOtpAuthUri(email: string, secret: string): string {
  return generateURI({
    issuer: "Cambria International College",
    label: email,
    secret,
  });
}

/**
 * Generates QR code Data URI for scanning in Google Authenticator or 1Password for a specific admin
 */
export async function getAccountTotpQrCodeDataUri(email: string, secret: string): Promise<string> {
  const uri = getAccountOtpAuthUri(email, secret);
  return await QRCode.toDataURL(uri, {
    margin: 2,
    width: 200,
    color: {
      dark: "#020B5A",
      light: "#FFFFFF",
    },
  });
}
