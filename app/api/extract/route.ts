import { NextRequest } from "next/server";
import { extractFromImage } from "@/lib/stego/extract";
import { decryptData } from "@/lib/stego/decrypt";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const key = formData.get("key") as string | null;

    if (!file || !key) {
      return new Response(
        JSON.stringify({ error: "Image and key required" }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1️⃣ Extract raw encrypted bytes
    const extracted = await extractFromImage(buffer);

    // 2️⃣ Decrypt message
    const message = decryptData(extracted, key);

    return Response.json({
      success: true,
      message,
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Extraction failed" }),
      { status: 500 }
    );
  }
}
