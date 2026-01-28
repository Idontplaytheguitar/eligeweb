export interface TimeSlot {
  start: string;
  end: string;
}

export interface RecurringSchedule {
  dayOfWeek: number;
  slots: TimeSlot[];
}

export interface DateException {
  date: string;
  slots: TimeSlot[];
  isBlocked: boolean;
}

export interface BookingConfigData {
  enabled: boolean;
  recurring: RecurringSchedule[];
  exceptions: DateException[];
  meetingDuration: number;
}

export const defaultBookingConfig: BookingConfigData = {
  enabled: true,
  recurring: [
    { dayOfWeek: 1, slots: [{ start: "09:00", end: "18:00" }] },
    { dayOfWeek: 2, slots: [{ start: "09:00", end: "18:00" }] },
    { dayOfWeek: 3, slots: [{ start: "09:00", end: "18:00" }] },
    { dayOfWeek: 4, slots: [{ start: "09:00", end: "18:00" }] },
    { dayOfWeek: 5, slots: [{ start: "09:00", end: "18:00" }] },
  ],
  exceptions: [],
  meetingDuration: 30,
};

export function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function addMinutes(time: string, mins: number): string {
  return formatTime(parseTime(time) + mins);
}

export function generateTimeSlots(
  start: string,
  end: string,
  duration: number
): string[] {
  const slots: string[] = [];
  let current = parseTime(start);
  const endMinutes = parseTime(end);

  while (current + duration <= endMinutes) {
    slots.push(formatTime(current));
    current += duration;
  }

  return slots;
}

/** Returns true if time (HH:mm) falls inside [block.start, block.end). */
function isTimeInRange(time: string, block: TimeSlot): boolean {
  const min = parseTime(time);
  const start = parseTime(block.start);
  const end = parseTime(block.end);
  return min >= start && min < end;
}

export function getAvailableSlotsForDate(
  date: string,
  config: BookingConfigData,
  bookedTimes: string[]
): string[] {
  const dayDate = new Date(date + "T12:00:00");
  const dayOfWeek = dayDate.getDay();

  const exception = config.exceptions.find((e) => e.date === date);

  let allSlots: string[] = [];

  if (exception) {
    if (exception.isBlocked) {
      return [];
    }
    const recurring = config.recurring.find((r) => r.dayOfWeek === dayOfWeek);
    if (!recurring || recurring.slots.length === 0) {
      return [];
    }
    for (const range of recurring.slots) {
      allSlots.push(
        ...generateTimeSlots(range.start, range.end, config.meetingDuration)
      );
    }
    const blocked = exception.slots;
    allSlots = allSlots.filter(
      (startTime) => !blocked.some((b) => isTimeInRange(startTime, b))
    );
  } else {
    const recurring = config.recurring.find((r) => r.dayOfWeek === dayOfWeek);
    if (!recurring) {
      return [];
    }
    for (const range of recurring.slots) {
      allSlots.push(
        ...generateTimeSlots(range.start, range.end, config.meetingDuration)
      );
    }
  }

  return allSlots.filter((slot) => !bookedTimes.includes(slot));
}

export function isDateAvailable(
  date: Date,
  config: BookingConfigData
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) return false;

  const dateStr = date.toISOString().split("T")[0];
  const dayOfWeek = date.getDay();

  const exception = config.exceptions.find((e) => e.date === dateStr);
  if (exception) {
    if (exception.isBlocked) return false;
    const recurring = config.recurring.find((r) => r.dayOfWeek === dayOfWeek);
    if (!recurring || recurring.slots.length === 0) return false;
    const slots = getAvailableSlotsForDate(dateStr, config, []);
    return slots.length > 0;
  }

  const recurring = config.recurring.find((r) => r.dayOfWeek === dayOfWeek);
  return !!recurring && recurring.slots.length > 0;
}

export const DAYS_OF_WEEK = [
  { id: 0, name: "Domingo", short: "Dom" },
  { id: 1, name: "Lunes", short: "Lun" },
  { id: 2, name: "Martes", short: "Mar" },
  { id: 3, name: "Miércoles", short: "Mié" },
  { id: 4, name: "Jueves", short: "Jue" },
  { id: 5, name: "Viernes", short: "Vie" },
  { id: 6, name: "Sábado", short: "Sáb" },
];
