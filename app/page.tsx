"use client";

import { useState } from "react";

export default function FluxGenerator() {
  const [prompt, setPrompt] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setPrediction(null);
    setStatus("Iniciando...");

    try {
      // 1. SOLICITA A GERAÇÃO
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        throw new Error(data.error || "Falha ao iniciar geração");
      }

      let currentPrediction = data;
      setPrediction(currentPrediction);
      setStatus(currentPrediction.status);

      // 2. LOOP DE POLLING (Blindado contra undefined)
      while (
        currentPrediction.status !== "succeeded" &&
        currentPrediction.status !== "failed"
      ) {
        await sleep(2000); // Aguarda 2 segundos entre checagens

        const checkRes = await fetch(`/api/predictions/${currentPrediction.id}`);
        const updated = await checkRes.json();

        if (checkRes.ok && updated.id) {
          currentPrediction = updated;
          setPrediction(currentPrediction);
          setStatus(currentPrediction.status);
        } else {
          throw new Error("Erro ao atualizar status da imagem");
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatus("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-10 flex flex-col items-center font-sans">
      <div className="max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Flux Schnell - Ultra Fast</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="border-2 border-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva a imagem..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-all"
          >
            {loading ? `Gerando (${status})...` : "Gerar Imagem"}
          </button>
        </form>

        {prediction && (
          <div className="mt-10 flex flex-col items-center">
            {prediction.output && (
              <img
                src={prediction.output[prediction.output.length - 1]}
                alt="Resultado"
                className="rounded-lg shadow-2xl w-full h-auto border border-gray-200"
              />
            )}
            <p className="mt-4 text-sm text-gray-500 uppercase font-bold tracking-widest">
              Status Final: {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
