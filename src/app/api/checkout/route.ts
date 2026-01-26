import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPreference } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workshopId, email, name } = body;

    if (!workshopId) {
      return NextResponse.json(
        { error: "ID de taller requerido" },
        { status: 400 }
      );
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId, published: true },
    });

    if (!workshop) {
      return NextResponse.json(
        { error: "Taller no encontrado" },
        { status: 404 }
      );
    }

    const preferenceData = await createPreference({
      workshopId: workshop.id,
      workshopTitle: workshop.title,
      price: workshop.price,
      buyerEmail: email || "comprador@email.com",
      buyerName: name || "Comprador",
    });

    return NextResponse.json({
      id: preferenceData.id,
      init_point: preferenceData.init_point,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Error al crear el pago" },
      { status: 500 }
    );
  }
}
