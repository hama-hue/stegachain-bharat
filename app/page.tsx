"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!image || !message) {
      alert("Please upload an image and enter a message");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);

    const res = await fetch("/api/embed", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setResultUrl(url);

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          StegaChain Bharat 🇮🇳
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <textarea
          placeholder="Enter secret message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Processing..." : "Embed Message"}
        </button>

        {resultUrl && (
          <a
            href={resultUrl}
            download="stego-image.png"
            className="block text-center mt-4 text-blue-600 underline"
          >
            Download Stego Image
          </a>
        )}
      </div>
    </main>
  );
}
