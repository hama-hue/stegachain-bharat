"use client";

import { useState } from "react";

export default function ExtractPage() {
  const [image, setImage] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExtract() {
    if (!image || !key) {
      alert("Image and key required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("key", key);

    setLoading(true);

    const res = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setResult(data.message);
    } else {
      alert(data.error);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Extract Hidden Message</h1>

      <input
        type="file"
        accept="image/png"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Secret Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />

      <br /><br />

      <button onClick={handleExtract} disabled={loading}>
        {loading ? "Extracting..." : "Extract Message"}
      </button>

      {result && (
        <>
          <h3>Hidden Message:</h3>
          <pre>{result}</pre>
        </>
      )}
    </div>
  );
}
