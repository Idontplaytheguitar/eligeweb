import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface IncomingFile {
  label?: string;
  url?: string;
  source?: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

function normalizeFiles(files: unknown): {
  label: string;
  url: string;
  source: string;
  mimeType: string | null;
  sizeBytes: number | null;
  order: number;
}[] {
  if (!Array.isArray(files)) return [];
  return files
    .map((f, i) => f as IncomingFile)
    .filter((f): f is IncomingFile => !!f && typeof f.url === "string" && f.url.length > 0)
    .map((f, i) => ({
      label: (f.label && f.label.trim()) || `Archivo ${i + 1}`,
      url: f.url as string,
      source: f.source === "external" ? "external" : "cloudinary",
      mimeType: f.mimeType ?? null,
      sizeBytes: typeof f.sizeBytes === "number" ? f.sizeBytes : null,
      order: i,
    }));
}

export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        files: { orderBy: { order: "asc" } },
        _count: { select: { purchases: true } },
      },
    });
    return NextResponse.json(workshops);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, content, price, coverImage, materialUrl, published, files } = body;

    if (!title || !description || !content || price === undefined) {
      return NextResponse.json(
        { error: "Título, descripción, contenido y precio son requeridos" },
        { status: 400 }
      );
    }

    let slug = generateSlug(title);
    const existing = await prisma.workshop.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const normalizedFiles = normalizeFiles(files);

    const workshop = await prisma.workshop.create({
      data: {
        slug,
        title,
        description,
        content,
        price: Math.round(Number(price) * 100),
        coverImage: coverImage || null,
        materialUrl: materialUrl || null,
        published: published || false,
        files: normalizedFiles.length
          ? {
              create: normalizedFiles,
            }
          : undefined,
      },
      include: { files: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error creating workshop:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, content, price, coverImage, materialUrl, published, files } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const existing = await prisma.workshop.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (price !== undefined) updateData.price = Math.round(Number(price) * 100);
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (materialUrl !== undefined) updateData.materialUrl = materialUrl;
    if (published !== undefined) updateData.published = published;

    // If files array is provided, replace the file set entirely.
    if (Array.isArray(files)) {
      const normalizedFiles = normalizeFiles(files);
      await prisma.$transaction([
        prisma.courseFile.deleteMany({ where: { workshopId: id } }),
        prisma.workshop.update({
          where: { id },
          data: {
            ...updateData,
            files: normalizedFiles.length
              ? { create: normalizedFiles }
              : undefined,
          },
        }),
      ]);
    } else if (Object.keys(updateData).length > 0) {
      await prisma.workshop.update({ where: { id }, data: updateData });
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: { files: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error updating workshop:", error);
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

    await prisma.workshop.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
