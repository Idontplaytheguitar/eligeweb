import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("elige_admin_session");
  if (!token) return false;

  try {
    const session = await prisma.adminSession.findUnique({
      where: { token: token.value },
    });

    if (!session) return false;
    if (session.expiresAt < new Date()) {
      await prisma.adminSession.delete({ where: { id: session.id } });
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    let content = await prisma.siteContent.findUnique({
      where: { id: "main" },
    });

    // Si no existe, retornar datos por defecto desde site.ts
    if (!content) {
      return NextResponse.json({
        exists: false,
        message: "Content not initialized. Please run seed first.",
      });
    }

    // Parsear los campos JSON
    const parsedContent = {
      ...content,
      aboutBio: JSON.parse(content.aboutBio),
      aboutTimeline: JSON.parse(content.aboutTimeline),
      services: JSON.parse(content.services),
      testimonials: JSON.parse(content.testimonials),
      faqs: JSON.parse(content.faqs),
      whyChooseUs: JSON.parse(content.whyChooseUs),
      process: JSON.parse(content.process),
    };

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Error al obtener contenido" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Validar que los campos JSON sean válidos
    const jsonFields = [
      "aboutBio",
      "aboutTimeline",
      "services",
      "testimonials",
      "faqs",
      "whyChooseUs",
      "process",
    ];

    const processedData: Record<string, any> = { ...data };

    for (const field of jsonFields) {
      if (data[field]) {
        // Si es string, asumir que ya está en formato JSON
        if (typeof data[field] === "string") {
          processedData[field] = data[field];
        } else {
          // Si es objeto o array, convertir a JSON
          processedData[field] = JSON.stringify(data[field]);
        }
      }
    }

    // Usar upsert para crear o actualizar
    const content = await prisma.siteContent.upsert({
      where: { id: "main" },
      update: processedData,
      create: {
        id: "main",
        heroTitle: processedData.heroTitle || "",
        heroSubtitle: processedData.heroSubtitle || "",
        aboutName: processedData.aboutName || "",
        aboutRole: processedData.aboutRole || "",
        aboutImage: processedData.aboutImage || "",
        aboutBio: processedData.aboutBio || "[]",
        aboutTimeline: processedData.aboutTimeline || "[]",
        services: processedData.services || "[]",
        testimonials: processedData.testimonials || "[]",
        faqs: processedData.faqs || "[]",
        whyChooseUs: processedData.whyChooseUs || "[]",
        process: processedData.process || "[]",
        footerDesc: processedData.footerDesc || "",
        contactWhatsapp: processedData.contactWhatsapp || "",
        contactEmail: processedData.contactEmail || "",
        contactAddress: processedData.contactAddress || "",
        contactCity: processedData.contactCity || "",
        contactHours: processedData.contactHours || "",
        socialInstagram: processedData.socialInstagram || "",
        socialFacebook: processedData.socialFacebook || "",
        ctaTitle: processedData.ctaTitle || "",
        ctaSubtitle: processedData.ctaSubtitle || "",
        ctaButton: processedData.ctaButton || "",
      },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Error al guardar contenido" },
      { status: 500 }
    );
  }
}
