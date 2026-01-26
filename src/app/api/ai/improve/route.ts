import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validateSession } from "@/lib/auth";

const prompts: Record<string, string> = {
  grammar: `Corrige los errores ortográficos y gramaticales del siguiente texto en español. 
Mantené el formato Markdown original. Solo corregí errores, no cambies el estilo ni el contenido.
Devolvé únicamente el texto corregido, sin explicaciones.`,

  style: `Mejorá la redacción y fluidez del siguiente texto en español, manteniendo el significado original.
Usá un tono profesional pero accesible, apropiado para un blog de un estudio jurídico.
Mantené el formato Markdown original.
Devolvé únicamente el texto mejorado, sin explicaciones.`,

  expand: `Expandí y desarrollá más las ideas del siguiente texto en español.
Agregá más detalles, ejemplos o explicaciones donde sea apropiado.
Mantené el tono profesional y el formato Markdown original.
Devolvé únicamente el texto expandido, sin explicaciones.`,

  summarize: `Resumí el siguiente texto en español, manteniendo los puntos más importantes.
Creá una versión más concisa pero que conserve la información esencial.
Mantené el formato Markdown original.
Devolvé únicamente el texto resumido, sin explicaciones.`,
};

export async function POST(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "IA no configurada. Agregá OPENAI_API_KEY en las variables de entorno." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { text, action } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Texto requerido" },
        { status: 400 }
      );
    }

    if (!action || !prompts[action]) {
      return NextResponse.json(
        { error: "Acción inválida" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompts[action] },
        { role: "user", content: text },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const improved = completion.choices[0]?.message?.content;

    if (!improved) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta" },
        { status: 500 }
      );
    }

    return NextResponse.json({ improved });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Error al procesar con IA" },
      { status: 500 }
    );
  }
}
