"use client";

import { useState } from "react";
import { Plus, X, Clock, Calendar, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type RecurringSchedule,
  type DateException,
  type TimeSlot,
  DAYS_OF_WEEK,
} from "@/lib/booking";

interface ScheduleEditorProps {
  recurring: RecurringSchedule[];
  exceptions: DateException[];
  onUpdateRecurring: (recurring: RecurringSchedule[]) => void;
  onUpdateExceptions: (exceptions: DateException[]) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

function timeToSlotIndex(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h - 7) * 2 + (m >= 30 ? 1 : 0);
}

function slotIndexToTime(index: number): string {
  const hour = Math.floor(index / 2) + 7;
  const minutes = (index % 2) * 30;
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function slotsToMatrix(slots: TimeSlot[]): boolean[] {
  const matrix = new Array(28).fill(false);
  slots.forEach((slot) => {
    const start = timeToSlotIndex(slot.start);
    const end = timeToSlotIndex(slot.end);
    for (let i = start; i < end && i < 28; i++) {
      matrix[i] = true;
    }
  });
  return matrix;
}

function matrixToSlots(matrix: boolean[]): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let start: number | null = null;
  for (let i = 0; i <= 28; i++) {
    if (matrix[i] && start === null) {
      start = i;
    } else if (!matrix[i] && start !== null) {
      slots.push({ start: slotIndexToTime(start), end: slotIndexToTime(i) });
      start = null;
    }
  }
  return slots;
}

export function ScheduleEditor({
  recurring,
  exceptions,
  onUpdateRecurring,
  onUpdateExceptions,
}: ScheduleEditorProps) {
  const [viewMode, setViewMode] = useState<"recurring" | "exceptions">("recurring");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [newExceptionDate, setNewExceptionDate] = useState("");

  const getScheduleMatrix = (dayOfWeek: number): boolean[] => {
    const schedule = recurring.find((r) => r.dayOfWeek === dayOfWeek);
    return schedule ? slotsToMatrix(schedule.slots) : new Array(28).fill(false);
  };

  const toggleHourForDay = (dayOfWeek: number, hour: number) => {
    const matrix = getScheduleMatrix(dayOfWeek);
    const slotIndex = (hour - 7) * 2;
    const isActive = matrix[slotIndex] || matrix[slotIndex + 1];
    const newValue = !isActive;
    matrix[slotIndex] = newValue;
    matrix[slotIndex + 1] = newValue;
    const newSlots = matrixToSlots(matrix);

    const existing = recurring.filter((r) => r.dayOfWeek !== dayOfWeek);
    if (newSlots.length > 0) {
      onUpdateRecurring([...existing, { dayOfWeek, slots: newSlots }]);
    } else {
      onUpdateRecurring(existing);
    }
  };

  const setDaySchedule = (dayOfWeek: number, start: string, end: string) => {
    const existing = recurring.filter((r) => r.dayOfWeek !== dayOfWeek);
    onUpdateRecurring([...existing, { dayOfWeek, slots: [{ start, end }] }]);
  };

  const clearDay = (dayOfWeek: number) => {
    onUpdateRecurring(recurring.filter((r) => r.dayOfWeek !== dayOfWeek));
  };

  const copyToAllWeekdays = (sourceDayOfWeek: number) => {
    const sourceSchedule = recurring.find((r) => r.dayOfWeek === sourceDayOfWeek);
    if (!sourceSchedule) return;

    const weekendSchedules = recurring.filter((r) => r.dayOfWeek === 0 || r.dayOfWeek === 6);
    const newRecurring: RecurringSchedule[] = [...weekendSchedules];
    for (let i = 1; i <= 5; i++) {
      newRecurring.push({ dayOfWeek: i, slots: [...sourceSchedule.slots] });
    }
    onUpdateRecurring(newRecurring);
  };

  const setAllWeekdays = (start: string, end: string) => {
    const slots = [{ start, end }];
    const newRecurring: RecurringSchedule[] = [];
    for (let i = 1; i <= 5; i++) {
      newRecurring.push({ dayOfWeek: i, slots });
    }
    const weekendSchedules = recurring.filter((r) => r.dayOfWeek === 0 || r.dayOfWeek === 6);
    onUpdateRecurring([...newRecurring, ...weekendSchedules]);
  };

  const clearAll = () => {
    onUpdateRecurring([]);
  };

  const addException = () => {
    if (!newExceptionDate) return;
    if (exceptions.find((e) => e.date === newExceptionDate)) return;
    onUpdateExceptions([...exceptions, { date: newExceptionDate, slots: [], isBlocked: true }]);
    setNewExceptionDate("");
  };

  const updateException = (date: string, updates: Partial<DateException>) => {
    onUpdateExceptions(exceptions.map((e) => (e.date === date ? { ...e, ...updates } : e)));
  };

  const removeException = (date: string) => {
    onUpdateExceptions(exceptions.filter((e) => e.date !== date));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={viewMode === "recurring" ? "default" : "outline"}
          onClick={() => setViewMode("recurring")}
          className="flex-1"
        >
          <Clock className="w-4 h-4 mr-2" />
          Horarios semanales
        </Button>
        <Button
          variant={viewMode === "exceptions" ? "default" : "outline"}
          onClick={() => setViewMode("exceptions")}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Excepciones ({exceptions.length})
        </Button>
      </div>

      {viewMode === "recurring" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setAllWeekdays("09:00", "18:00")}>
              Lun-Vie 9-18
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAllWeekdays("10:00", "19:00")}>
              Lun-Vie 10-19
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="w-3 h-3 mr-1" />
              Limpiar todo
            </Button>
          </div>

          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const schedule = recurring.find((r) => r.dayOfWeek === day.id);
              const hasSlots = schedule && schedule.slots.length > 0;
              const isExpanded = expandedDay === day.id;

              return (
                <div
                  key={day.id}
                  className={`border rounded-lg overflow-hidden ${hasSlots ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${hasSlots ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <span className="font-medium">{day.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSlots && (
                        <span className="text-sm text-muted-foreground">
                          {schedule!.slots.map((s) => `${s.start}-${s.end}`).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 border-t space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setDaySchedule(day.id, "09:00", "13:00")}>
                          9-13
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDaySchedule(day.id, "14:00", "18:00")}>
                          14-18
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDaySchedule(day.id, "09:00", "18:00")}>
                          9-18
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => clearDay(day.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToAllWeekdays(day.id)}>
                          <Copy className="w-3 h-3 mr-1" />
                          Copiar a L-V
                        </Button>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {HOURS.map((hour) => {
                          const matrix = getScheduleMatrix(day.id);
                          const slotIndex = (hour - 7) * 2;
                          const isActive = matrix[slotIndex] || matrix[slotIndex + 1];

                          return (
                            <button
                              key={hour}
                              onClick={() => toggleHourForDay(day.id, hour)}
                              className={`py-2 text-xs rounded font-medium transition-colors ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-4 pt-2 border-t">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-primary rounded" /> Disponible
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-muted rounded" /> No disponible
            </span>
          </div>
        </div>
      )}

      {viewMode === "exceptions" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Agregá días especiales donde no estarás disponible (feriados, vacaciones, etc.)
          </p>

          <div className="flex gap-3">
            <Input
              type="date"
              value={newExceptionDate}
              onChange={(e) => setNewExceptionDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="flex-1"
            />
            <Button onClick={addException} disabled={!newExceptionDate}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>

          {exceptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              No hay días especiales configurados
            </div>
          ) : (
            <div className="space-y-2">
              {exceptions
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((exception) => {
                  const dateObj = new Date(exception.date + "T12:00:00");

                  return (
                    <div
                      key={exception.date}
                      className={`p-4 rounded-lg border ${
                        exception.isBlocked ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {dateObj.toLocaleDateString("es-AR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exception.isBlocked}
                              onChange={(e) =>
                                updateException(exception.date, {
                                  isBlocked: e.target.checked,
                                  slots: [],
                                })
                              }
                              className="rounded"
                            />
                            <span className="text-destructive">No disponible</span>
                          </label>
                          <Button variant="ghost" size="icon" onClick={() => removeException(exception.date)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
