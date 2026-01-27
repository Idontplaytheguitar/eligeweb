import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { contactFormSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, whatsapp, area, message } = result.data;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        area: area || null,
        message,
      },
    });

    try {
      await sendContactEmail({
        name,
        email,
        phone,
        whatsapp,
        area,
        message,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    );
  }
}
