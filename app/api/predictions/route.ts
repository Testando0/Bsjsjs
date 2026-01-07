import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "Configuração ausente: API Token" }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }

    // Usando Flux Schnell: O mais rápido e fiel ao prompt
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-schnell",
      input: {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp"
      },
    });

    // Verificação de segurança para garantir que o Replicate criou o objeto
    if (!prediction || !prediction.id) {
      throw new Error("Replicate não retornou um ID de predição.");
    }

    return NextResponse.json(prediction, { status: 201 });
  } catch (error: any) {
    console.error("ERRO API POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
