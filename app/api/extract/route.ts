import { NextRequest } from "next/server";
import { extractFromImage } from "@/lib/stego/extract";
import { decryptMessage } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const key = formData.get("key") as string | null;

    if (!file || !key) {
      return Response.json(
        { error: "Image and key required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1️⃣ Extract raw bytes from image
    const extracted = await extractFromImage(buffer);

    // 2️⃣ Read payload length
    const payloadLength = extracted.readUInt32BE(0);

    // 3️⃣ Extract ONLY payload
    const payloadBuffer = extracted.slice(4, 4 + payloadLength);

    // 4️⃣ Decode JSON
    const payload = JSON.parse(payloadBuffer.toString("utf8"));

    // 5️⃣ Decrypt
    const message = decryptMessage(
      payload.encrypted,
      key,
      payload.iv
    );

    return Response.json({
      success: true,
      message,
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Extraction failed" },
      { status: 500 }
    );
  }
}

