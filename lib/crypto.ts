import crypto from "crypto";

const ALGO = "aes-256-cbc";

export function encryptMessage(message: string) {
  const key = crypto.randomBytes(32); // 256-bit key
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrypted,
    key: key.toString("hex"),
    iv: iv.toString("hex"),
  };
}
