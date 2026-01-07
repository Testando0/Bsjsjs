import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Log para você ver no console da Vercel se o ID está chegando
  console.log("Verificando predição ID:", params.id);

  if (!params.id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    const prediction = await replicate.predictions.get(params.id);
    return NextResponse.json(prediction);
  } catch (error: any) {
    console.error("Erro no Replicate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
