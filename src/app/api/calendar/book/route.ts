import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCalendarEvent, isGoogleCalendarConfigured } from "@/lib/calendar";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";
import { addMinutes, defaultBookingConfig } from "@/lib/booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, notes } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    let meetingDuration = defaultBookingConfig.meetingDuration;

    try {
      const config = await prisma.bookingConfig.findUnique({
        where: { id: "main" },
      });
      if (config) {
        meetingDuration = config.meetingDuration;
      }
    } catch {
      // Use default
    }

    const endTime = addMinutes(time, meetingDuration);
    const meetingId = `meeting-${Date.now()}`;

    const meeting = {
      id: meetingId,
      name,
      email,
      phone: phone || null,
      date,
      time,
      endTime,
      type: "google_meet",
      notes: notes || null,
      status: "pending",
      meetLink: null as string | null,
      calendarEventId: null as string | null,
    };

    if (isGoogleCalendarConfigured()) {
      const startDateTime = `${date}T${time}:00-03:00`;
      const endDateTime = `${date}T${endTime}:00-03:00`;

      const calendarResult = await createCalendarEvent({
        summary: `Consulta con ${name} - ELIGE`,
        description: `Reunión de consulta legal con ${name}\n\nTeléfono: ${phone || "No proporcionado"}\nEmail: ${email}\n\nNotas: ${notes || "Sin notas"}`,
        startDateTime,
        endDateTime,
        attendeeEmail: email,
        attendeeName: name,
        createMeetLink: true,
      });

      if (calendarResult.success) {
        meeting.meetLink = calendarResult.meetLink || null;
        meeting.calendarEventId = calendarResult.eventId || null;
        meeting.status = "confirmed";
      }
    } else {
      meeting.status = "confirmed";
    }

    await prisma.meeting.create({
      data: meeting,
    });

    try {
      await sendBookingConfirmation({
        to: email,
        name,
        date,
        time,
        meetLink: meeting.meetLink || undefined,
      });

      await sendBookingNotification({
        name,
        email,
        phone: phone || undefined,
        date,
        time,
        notes: notes || undefined,
      });
    } catch (emailError) {
      console.error("Error sending booking emails:", emailError);
    }

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        date: meeting.date,
        time: meeting.time,
        status: meeting.status,
        meetLink: meeting.meetLink,
      },
    });
  } catch (error) {
    console.error("Error booking meeting:", error);
    return NextResponse.json(
      { error: "Error al agendar la reunión" },
      { status: 500 }
    );
  }
}
