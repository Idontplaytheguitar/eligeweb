import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail, sendContactAutoReply } from "@/lib/email";
import { contactFormSchema } from "@/lib/schemas";
import { getNotifyOnContact, getContactAutoReplyEnabled } from "@/lib/admin-settings";

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

    const { name, email, phone, preferWhatsApp, area, message } = result.data;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        preferWhatsApp: preferWhatsApp || false,
        area: area || null,
        message,
      },
    });

    const [notifyOnContact, contactAutoReplyEnabled] = await Promise.all([
      getNotifyOnContact(),
      getContactAutoReplyEnabled(),
    ]);

    if (notifyOnContact) {
      try {
        await sendContactEmail({
          name,
          email,
          phone,
          preferWhatsApp: preferWhatsApp || false,
          area,
          message,
        });
      } catch (emailError) {
        console.error("Error sending contact email to admin:", emailError);
      }
    }

    if (contactAutoReplyEnabled) {
      try {
        await sendContactAutoReply(email);
      } catch (autoReplyError) {
        console.error("Error sending contact auto-reply to user:", autoReplyError);
      }
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
