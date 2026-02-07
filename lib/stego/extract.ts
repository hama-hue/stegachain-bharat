import sharp from "sharp";

/**
 * Extract hidden binary data from LSB of image
 */
export async function extractFromImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const bits: number[] = [];

  // Read LSB from each channel
  for (let i = 0; i < data.length; i++) {
    bits.push(data[i] & 1);
  }

  // Convert bits → bytes
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8).join("");
    bytes.push(parseInt(byte, 2));
  }

  return Buffer.from(bytes);
}
