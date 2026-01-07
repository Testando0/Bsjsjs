import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "Token não configurado" }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    // Iniciamos a predição. O Replicate retorna o ID imediatamente.
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-schnell",
      input: { 
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp"
      },
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
