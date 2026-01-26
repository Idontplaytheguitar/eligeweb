import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAvailableSlotsForDate,
  defaultBookingConfig,
  type BookingConfigData,
} from "@/lib/booking";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

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
      // Use default config if table doesn't exist yet
    }

    if (!config.enabled) {
      return NextResponse.json({ slots: [], enabled: false });
    }

    let bookedTimes: string[] = [];

    try {
      const existingMeetings = await prisma.meeting.findMany({
        where: { date, status: { not: "cancelled" } },
        select: { time: true },
      });
      bookedTimes = existingMeetings.map((m) => m.time);
    } catch {
      // Table might not exist yet
    }

    const slots = getAvailableSlotsForDate(date, config, bookedTimes);

    return NextResponse.json({
      slots,
      enabled: true,
      duration: config.meetingDuration,
    });
  } catch (error) {
    console.error("Error getting slots:", error);
    return NextResponse.json(
      { error: "Failed to get available slots" },
      { status: 500 }
    );
  }
}
