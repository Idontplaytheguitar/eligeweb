import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export async function POST() {
  const isValid = await validateSession();
  if (!isValid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.adminConfig.update({
      where: { id: "main" },
      data: {
        mpUserId: null,
        mpAccessToken: null,
        mpRefreshToken: null,
        mpPublicKey: null,
        mpTokenExpiresAt: null,
        mpConnectedAt: null,
        mpAccountEmail: null,
        mpAccountNickname: null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MP disconnect error", err);
    return NextResponse.json({ error: "Error al desconectar" }, { status: 500 });
  }
}
