import crypto from "crypto";

const ALGO = "aes-256-cbc";

function deriveKey(password: string) {
  return crypto.createHash("sha256").update(password).digest();
}

export function decryptData(
  encryptedHex: string,
  password: string,
  ivHex: string
): string {
  const key = deriveKey(password);
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, key, iv);

  let decrypted = decipher.update(encrypted, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
