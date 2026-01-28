import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content";
import { getAdminConfig } from "@/lib/admin-settings";

/**
 * Configuración pública (sin auth): WhatsApp link y aviso de ausencia.
 * Todos los valores vienen de la DB (SiteContent + AdminConfig).
 */
export async function GET() {
  try {
    const [content, config] = await Promise.all([
      getSiteContent(),
      getAdminConfig(),
    ]);

    const whatsappNumber = content.contactWhatsapp.replace(/\D/g, "") || "";
    const message = config.whatsappDefaultMessage || "Hola, quisiera hacer una consulta legal.";
    const whatsappLink = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      : "";

    return NextResponse.json({
      whatsappLink,
      whatsappNumber,
      absenceNoticeEnabled: config.absenceNoticeEnabled ?? false,
      absenceNoticeText: config.absenceNoticeText || null,
    });
  } catch (error) {
    console.error("Error loading public config:", error);
    return NextResponse.json(
      { whatsappLink: "", whatsappNumber: "", absenceNoticeEnabled: false, absenceNoticeText: null },
      { status: 200 }
    );
  }
}
