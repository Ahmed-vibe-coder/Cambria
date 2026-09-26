import crypto from "crypto";

// Master key for encrypting secrets at rest with AES-256-GCM
// In production, configure ENCRYPTION_MASTER_KEY in environment
const ENCRYPTION_KEY_SOURCE =
  process.env.ENCRYPTION_MASTER_KEY || "cambria-institutional-vault-aes256-master-key-2026-secure";

const MASTER_KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY_SOURCE).digest();

/**
 * Hash a password using scrypt with a cryptographically secure per-user salt.
 * Output format: scrypt:${saltHex}:${derivedKeyHex}
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  // scrypt key derivation parameters (N=16384, r=8, p=1, keylen=64)
  const derivedKey = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return `scrypt:${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored scrypt salted hash.
 * Timing-safe comparison prevents side-channel timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.startsWith("scrypt:")) {
    return false;
  }

  const parts = storedHash.split(":");
  if (parts.length !== 3) {
    return false;
  }

  const saltHex = parts[1];
  const originalKeyHex = parts[2];

  const salt = Buffer.from(saltHex, "hex");
  const originalKey = Buffer.from(originalKeyHex, "hex");

  const derivedKey = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });

  return crypto.timingSafeEqual(derivedKey, originalKey);
}

/**
 * Encrypt a secret at rest using AES-256-GCM.
 * Output format: aes256gcm:${ivHex}:${authTagHex}:${encryptedHex}
 */
export function encryptSecret(plaintextSecret: string): string {
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", MASTER_KEY, iv);

  let encrypted = cipher.update(plaintextSecret, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `aes256gcm:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt a secret stored at rest using AES-256-GCM.
 */
export function decryptSecret(ciphertextPayload: string): string {
  if (!ciphertextPayload || !ciphertextPayload.startsWith("aes256gcm:")) {
    throw new Error("Invalid ciphertext payload format for secret decryption.");
  }

  const parts = ciphertextPayload.split(":");
  if (parts.length !== 4) {
    throw new Error("Malformed AES-256-GCM payload.");
  }

  const ivHex = parts[1];
  const authTagHex = parts[2];
  const encryptedHex = parts[3];

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", MASTER_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
