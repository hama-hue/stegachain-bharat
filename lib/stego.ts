import sharp from "sharp";

/**
 * Embed binary payload into an image using LSB steganography
 * @param imageBuffer Original image buffer
 * @param payloadBuffer Buffer containing encrypted message + length prefix
 * @returns Promise<Buffer> of stego image (PNG)
 */
export async function embedMessage(
  imageBuffer: Buffer,
  payloadBuffer: Buffer
): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Convert payload buffer to binary string
  const binary = Array.from(payloadBuffer)
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join("") + "1111111111111110"; // delimiter

  if (binary.length > data.length) {
    throw new Error("Payload is too large to embed in this image");
  }

  // Embed LSB
  for (let i = 0; i < binary.length; i++) {
    data[i] = (data[i] & 0xfe) | Number(binary[i]);
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer();
}
