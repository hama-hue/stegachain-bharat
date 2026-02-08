// app/api/stego/embed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { encryptMessage } from "@/lib/crypto";
import { embedMessage } from "@/lib/stego";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File | null;
    const message = formData.get("message") as string | null;
    const userKey = formData.get("key") as string | null;

    if (!file || !message || !userKey) {
      return NextResponse.json(
        { error: "Image, message, and key are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 🔐 Encrypt the message using user key
    const { encrypted, iv } = encryptMessage(message, userKey);

    // Prepare JSON payload
    const payloadJson = JSON.stringify({ encrypted, iv });
    const payloadBuffer = Buffer.from(payloadJson, "utf8");

    // 1️⃣ Prepend 4-byte payload length (big-endian)
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(payloadBuffer.length, 0);

    // 2️⃣ Combine length + payload
    const finalPayload = Buffer.concat([lengthBuffer, payloadBuffer]);

    // 3️⃣ Embed into image
    const stegoImage = await embedMessage(buffer, finalPayload);

    // 4️⃣ Return stego image
    return new NextResponse(new Uint8Array(stegoImage), {
      headers: { "Content-Type": "image/png" },
    });

  } catch (err) {
    console.error("Stego embed error:", err);
    return NextResponse.json(
      { error: "Embedding failed" },
      { status: 500 }
    );
  }
}
