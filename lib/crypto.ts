import crypto from "crypto";

const ALGO = "aes-256-cbc";

// Derive a 256-bit key from user password
function deriveKey(password: string) {
  return crypto.createHash("sha256").update(password).digest();
}

export function encryptMessage(message: string, password: string) {
  const key = deriveKey(password);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrypted,
    iv: iv.toString("hex"),
  };
}

export function decryptMessage(
  encrypted: string,
  password: string,
  ivHex: string
) {
  const key = deriveKey(password);
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
