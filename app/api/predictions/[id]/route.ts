import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Tipagem correta para Next.js moderno
) {
  try {
    // RESOLVE A PROMISE DO PARAMS (Isso evita o erro 'undefined')
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "ID inválido recebido" }, { status: 400 });
    }

    const prediction = await replicate.predictions.get(id);

    if (!prediction) {
      return NextResponse.json({ error: "Predição não encontrada" }, { status: 404 });
    }

    return NextResponse.json(prediction);
  } catch (error: any) {
    console.error("ERRO API GET ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
