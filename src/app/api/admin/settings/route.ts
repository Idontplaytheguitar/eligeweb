import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import {
  getAdminEmailForSettings,
  setAdminEmail,
} from "@/lib/admin-settings";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const adminEmail = await getAdminEmailForSettings();
    return NextResponse.json({ adminEmail });
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
    const { adminEmail: raw } = body;
    const email = typeof raw === "string" ? raw.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    await setAdminEmail(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving admin settings:", error);
    return NextResponse.json(
      { error: "Error al guardar configuración" },
      { status: 500 }
    );
  }
}
