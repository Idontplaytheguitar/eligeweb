import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getMercadoPagoConnectionInfo } from "@/lib/mercadopago";

export async function GET() {
  const isValid = await validateSession();
  if (!isValid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const info = await getMercadoPagoConnectionInfo();
  return NextResponse.json(info);
}
