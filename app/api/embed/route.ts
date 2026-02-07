import { encryptMessage } from "@/lib/crypto";
import { embedMessage } from "@/lib/stego";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("image") as File;
  const message = formData.get("message") as string;
  const userKey = formData.get("key") as string;

  if (!file || !message || !userKey) {
    return new Response("Invalid input", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // 🔐 Encrypt using USER key
  const { encrypted, iv } = encryptMessage(message, userKey);

  const payload = JSON.stringify({
    encrypted,
    iv,
  });

  const stegoImage = await embedMessage(buffer, payload);

  return new Response(new Uint8Array(stegoImage), {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
