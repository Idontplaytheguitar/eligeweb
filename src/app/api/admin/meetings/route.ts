import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { cancelCalendarEvent } from "@/lib/calendar";

export async function GET() {
  try {
    const isValid = await validateSession();
    if (!isValid) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error("Error getting meetings:", error);
    return NextResponse.json(
      { error: "Failed to get meetings" },
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
    const { meetingId, action, status } = body;

    if (!meetingId || !action) {
      return NextResponse.json(
        { error: "meetingId y action son requeridos" },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Reunión no encontrada" },
        { status: 404 }
      );
    }

    if (action === "update_status") {
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { status },
      });

      return NextResponse.json({ success: true });
    }

    if (action === "cancel") {
      if (meeting.calendarEventId) {
        await cancelCalendarEvent(meeting.calendarEventId);
      }

      await prisma.meeting.update({
        where: { id: meetingId },
        data: { status: "cancelled" },
      });

      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      if (meeting.calendarEventId) {
        await cancelCalendarEvent(meeting.calendarEventId);
      }

      await prisma.meeting.delete({
        where: { id: meetingId },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}
