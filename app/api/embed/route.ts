import { encryptMessage } from "@/lib/crypto";
import { embedMessage } from "@/lib/stego";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const message = formData.get("message") as string;

  if (!file || !message) {
    return new Response("Invalid input", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const { encrypted, key, iv } = encryptMessage(message);

  const payload = JSON.stringify({ encrypted, iv });
  const stegoImage = await embedMessage(buffer, payload);

    return new Response(new Uint8Array(stegoImage), {
    headers: {
        "Content-Type": "image/png",
        "X-ENCRYPTION-KEY": key, // demo-only
    },
    });

}
