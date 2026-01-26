import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { defaultBookingConfig, type BookingConfigData } from "@/lib/booking";

export async function GET() {
  try {
    let config: BookingConfigData = defaultBookingConfig;

    try {
      const storedConfig = await prisma.bookingConfig.findUnique({
        where: { id: "main" },
      });

      if (storedConfig) {
        config = {
          enabled: storedConfig.enabled,
          recurring: storedConfig.recurring as unknown as BookingConfigData["recurring"],
          exceptions: storedConfig.exceptions as unknown as BookingConfigData["exceptions"],
          meetingDuration: storedConfig.meetingDuration,
        };
      }
    } catch {
      // Return default config if table doesn't exist
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting booking config:", error);
    return NextResponse.json(
      { error: "Failed to get booking config" },
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
    const { enabled, recurring, exceptions, meetingDuration } = body;

    await prisma.bookingConfig.upsert({
      where: { id: "main" },
      update: {
        enabled: enabled ?? true,
        recurring: recurring ?? defaultBookingConfig.recurring,
        exceptions: exceptions ?? [],
        meetingDuration: meetingDuration ?? 30,
      },
      create: {
        id: "main",
        enabled: enabled ?? true,
        recurring: recurring ?? defaultBookingConfig.recurring,
        exceptions: exceptions ?? [],
        meetingDuration: meetingDuration ?? 30,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving booking config:", error);
    return NextResponse.json(
      { error: "Failed to save booking config" },
      { status: 500 }
    );
  }
}
