import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateSession } from "@/lib/auth";

const prompts: Record<string, string> = {
  grammar: `Corrige los errores ortográficos y gramaticales del siguiente texto en español.
Mantené el formato HTML original (tags como <p>, <strong>, <em>, listas, etc.). Solo corregí errores, no cambies el estilo ni el contenido.
Devolvé únicamente el texto corregido, sin explicaciones ni comentarios adicionales.`,

  style: `Mejorá la redacción y fluidez del siguiente texto en español, manteniendo el significado original.
Usá un tono profesional pero accesible, apropiado para un blog de un estudio jurídico.
Mantené el formato HTML original.
Devolvé únicamente el texto mejorado, sin explicaciones.`,

  expand: `Expandí y desarrollá más las ideas del siguiente texto en español.
Agregá más detalles, ejemplos o explicaciones donde sea apropiado.
Mantené el tono profesional y el formato HTML original.
Devolvé únicamente el texto expandido, sin explicaciones.`,

  summarize: `Resumí el siguiente texto en español, manteniendo los puntos más importantes.
Creá una versión más concisa pero que conserve la información esencial.
Mantené el formato HTML original.
Devolvé únicamente el texto resumido, sin explicaciones.`,
};

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "IA no configurada. Agregá GOOGLE_GENERATIVE_AI_API_KEY en las variables de entorno.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { text, action } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
    }

    if (!action || !prompts[action]) {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    });

    const result = await model.generateContent(`${prompts[action]}\n\nTexto:\n${text}`);
    const improved = result.response.text();

    if (!improved) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta" },
        { status: 500 }
      );
    }

    return NextResponse.json({ improved });
  } catch (error) {
    console.error("AI error:", error);
    const message = error instanceof Error ? error.message : "Error al procesar con IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
