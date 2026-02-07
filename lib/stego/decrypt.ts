import crypto from "crypto";

export function decryptData(
  encrypted: Buffer,
  key: string
): string {
  const iv = encrypted.subarray(0, 16);
  const content = encrypted.subarray(16);

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  const decrypted = Buffer.concat([
    decipher.update(content),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}
