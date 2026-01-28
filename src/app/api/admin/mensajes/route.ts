import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // If action is "count", return unseen count only
    if (action === "count") {
      const unseenCount = await prisma.contactMessage.count({
        where: { seen: false },
      });
      return NextResponse.json({ unseenCount });
    }

    // Fetch all messages
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Mark all unseen messages as seen
    await prisma.contactMessage.updateMany({
      where: { seen: false },
      data: { seen: true },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await prisma.contactMessage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
