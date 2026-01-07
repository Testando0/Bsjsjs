"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    let pred = await response.json();
    setPrediction(pred);

    // Loop de Polling: Verifica status sem travar a Vercel
    while (pred.status !== "succeeded" && pred.status !== "failed") {
      await sleep(1500);
      const checkRes = await fetch(`/api/predictions/${pred.id}`);
      pred = await checkRes.json();
      setPrediction(pred);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
        <Sparkles className="text-blue-500" /> Flux Generator
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-4 border rounded-xl shadow-sm text-black"
          placeholder="Ex: A futuristic city made of glass, cinematic lighting..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <button
          disabled={loading || !prompt}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400 transition-all hover:bg-blue-700"
        >
          {loading ? "Gerando..." : "Gerar Imagem Realista"}
        </button>
      </form>

      {prediction && (
        <div className="mt-10">
          {prediction.status === "succeeded" ? (
            <img
              src={prediction.output[0]}
              alt="Generated"
              className="w-full rounded-2xl shadow-2xl animate-in fade-in duration-700"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-gray-100 rounded-2xl border-dashed border-2">
              <Loader2 className="animate-spin text-blue-500 mb-2" />
              <p className="text-gray-500 uppercase tracking-widest text-xs">{prediction.status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
