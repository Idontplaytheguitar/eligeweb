import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCalendarEvent, isGoogleCalendarConfigured } from "@/lib/calendar";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";
import { addMinutes, defaultBookingConfig } from "@/lib/booking";
import { getNotifyOnBooking } from "@/lib/admin-settings";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, notes, meetingType = 'google_meet' } = body;

    // Validaciones condicionales según el tipo de reunión
    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    switch (meetingType) {
      case 'google_meet':
        if (!email || !date || !time) {
          return NextResponse.json(
            { error: "Email, fecha y hora son requeridos para Google Meet" },
            { status: 400 }
          );
        }
        break;
      
      case 'whatsapp':
        if (!phone || !date || !time) {
          return NextResponse.json(
            { error: "Teléfono, fecha y hora son requeridos para WhatsApp Call" },
            { status: 400 }
          );
        }
        break;
      
      case 'presencial':
        if ((!email && !phone) || !date || !time) {
          return NextResponse.json(
            { error: "Email o teléfono, fecha y hora son requeridos para reunión presencial" },
            { status: 400 }
          );
        }
        break;
      
      case 'acordar':
        if (!email && !phone) {
          return NextResponse.json(
            { error: "Email o teléfono son requeridos" },
            { status: 400 }
          );
        }
        // Para "acordar" no se requiere fecha/hora
        break;
      
      default:
        if (!email || !date || !time) {
          return NextResponse.json(
            { error: "Faltan campos requeridos" },
            { status: 400 }
          );
        }
    }

    let meetingDuration = defaultBookingConfig.meetingDuration;
    let endTime = null;

    // Solo calcular endTime si hay fecha/hora
    if (time) {
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

      endTime = addMinutes(time, meetingDuration);
    }

    const meetingId = `meeting-${Date.now()}`;

    const meeting = {
      id: meetingId,
      name,
      email: email || null,
      phone: phone || null,
      date: date || null,
      time: time || null,
      endTime: endTime,
      type: "google_meet", // Legacy field
      meetingType: meetingType,
      notes: notes || null,
      status: meetingType === 'acordar' ? "pending" : "pending",
      meetLink: null as string | null,
      calendarEventId: null as string | null,
    };

    // Solo crear evento de Google Calendar si tiene fecha/hora y es tipo google_meet
    if (meetingType === 'google_meet' && date && time && endTime && isGoogleCalendarConfigured()) {
      const startDateTime = `${date}T${time}:00-03:00`;
      const endDateTime = `${date}T${endTime}:00-03:00`;

      const calendarResult = await createCalendarEvent({
        summary: `Consulta con ${name} - ELIGE`,
        description: `Reunión de consulta legal con ${name}\n\nTeléfono: ${phone || "No proporcionado"}\nEmail: ${email || "No proporcionado"}\n\nNotas: ${notes || "Sin notas"}`,
        startDateTime,
        endDateTime,
        attendeeEmail: email || undefined,
        attendeeName: name,
        createMeetLink: true,
      });

      if (calendarResult.success) {
        meeting.meetLink = calendarResult.meetLink || null;
        meeting.calendarEventId = calendarResult.eventId || null;
        meeting.status = "confirmed";
      }
    } else if (meetingType !== 'acordar') {
      // Confirmar reuniones que no son "acordar" aunque no tengan evento de calendario
      meeting.status = "confirmed";
    }
    // Las reuniones "acordar" mantienen status "pending" hasta que se coordine

    await prisma.meeting.create({
      data: meeting,
    });

    // Enviar emails solo si hay email y fecha/hora (no para "acordar")
    try {
      if (email && date && time) {
        await sendBookingConfirmation({
          to: email,
          name,
          date,
          time,
          meetLink: meeting.meetLink || undefined,
        });
      }

      const notifyOnBooking = await getNotifyOnBooking();
      if (notifyOnBooking) {
        await sendBookingNotification({
          name,
          email: email || "",
          phone: phone || undefined,
          date: date || "",
          time: time || "",
          notes: notes || undefined,
        });
      }
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
