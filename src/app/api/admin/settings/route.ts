import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getAdminConfig, updateAdminConfig } from "@/lib/admin-settings";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const config = await getAdminConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting admin settings:", error);
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const adminEmail = typeof body.adminEmail === "string" ? body.adminEmail.trim() : undefined;
    if (adminEmail !== undefined && adminEmail !== "") {
      if (!EMAIL_REGEX.test(adminEmail)) {
        return NextResponse.json(
          { error: "Formato de email inválido" },
          { status: 400 }
        );
      }
    }

    await updateAdminConfig({
      adminEmail: body.adminEmail !== undefined ? (body.adminEmail === "" ? null : body.adminEmail) : undefined,
      notifyOnContact: typeof body.notifyOnContact === "boolean" ? body.notifyOnContact : undefined,
      notifyOnBooking: typeof body.notifyOnBooking === "boolean" ? body.notifyOnBooking : undefined,
      emailSenderName: body.emailSenderName !== undefined ? body.emailSenderName : undefined,
      whatsappDefaultMessage: body.whatsappDefaultMessage !== undefined ? body.whatsappDefaultMessage : undefined,
      contactAutoReplyEnabled: typeof body.contactAutoReplyEnabled === "boolean" ? body.contactAutoReplyEnabled : undefined,
      contactAutoReplyText: body.contactAutoReplyText !== undefined ? body.contactAutoReplyText : undefined,
      absenceNoticeEnabled: typeof body.absenceNoticeEnabled === "boolean" ? body.absenceNoticeEnabled : undefined,
      absenceNoticeText: body.absenceNoticeText !== undefined ? body.absenceNoticeText : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving admin settings:", error);
    return NextResponse.json(
      { error: "Error al guardar configuración" },
      { status: 500 }
    );
  }
}
