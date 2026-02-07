import sharp from "sharp";

export async function embedMessage(
  imageBuffer: Buffer,
  secret: string
): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const binary =
    secret
      .split("")
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("") + "1111111111111110"; // delimiter

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
