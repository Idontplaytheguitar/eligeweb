import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { purchases: true },
        },
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
    const { title, description, content, price, coverImage, materialUrl, published } = body;

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

    const workshop = await prisma.workshop.create({
      data: {
        slug,
        title,
        description,
        content,
        price: Math.round(price * 100),
        coverImage: coverImage || null,
        materialUrl: materialUrl || null,
        published: published || false,
      },
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
    const { id, title, description, content, price, coverImage, materialUrl, published } = body;

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
    if (price !== undefined) updateData.price = Math.round(price * 100);
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (materialUrl !== undefined) updateData.materialUrl = materialUrl;
    if (published !== undefined) updateData.published = published;

    const workshop = await prisma.workshop.update({
      where: { id },
      data: updateData,
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
