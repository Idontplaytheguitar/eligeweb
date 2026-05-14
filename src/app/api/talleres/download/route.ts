import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const fileId = url.searchParams.get("fileId");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
    include: {
      workshop: {
        include: { files: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (purchase.downloadExpires < new Date()) {
    return NextResponse.json({ error: "El link de descarga expiró" }, { status: 410 });
  }

  // List mode: no fileId → return manifest of files for the success page.
  if (!fileId) {
    return NextResponse.json({
      workshop: {
        id: purchase.workshop.id,
        title: purchase.workshop.title,
      },
      expiresAt: purchase.downloadExpires.toISOString(),
      files: purchase.workshop.files.map((f) => ({
        id: f.id,
        label: f.label,
        source: f.source,
      })),
    });
  }

  const file = purchase.workshop.files.find((f) => f.id === fileId);
  if (!file) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  // External: redirect (owner trusted the external URL when uploading).
  if (file.source === "external") {
    return NextResponse.redirect(file.url, 302);
  }

  // Cloudinary: proxy-stream so the underlying URL stays hidden.
  try {
    const upstream = await fetch(file.url);
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "No se pudo descargar el archivo" }, { status: 502 });
    }

    const filename = file.label.replace(/[\r\n"]/g, "_");
    const headers = new Headers();
    headers.set(
      "Content-Type",
      upstream.headers.get("content-type") || file.mimeType || "application/octet-stream"
    );
    const len = upstream.headers.get("content-length");
    if (len) headers.set("Content-Length", len);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Cache-Control", "private, no-store");

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err) {
    console.error("Download proxy error:", err);
    return NextResponse.json({ error: "Error al descargar" }, { status: 500 });
  }
}
