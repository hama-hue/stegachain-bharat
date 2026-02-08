"use client";

import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!image || !message || !key) {
      alert("Please upload an image, enter a message, and a secret key");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);
    formData.append("key", key);

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
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">
          StegaChain Bharat 🇮🇳
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-3 w-full text-gray-900"
        />

        <textarea
          placeholder="Enter secret message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-3 text-gray-900 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Secret Key (same for extract)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full border p-2 mb-3 text-gray-900 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
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
