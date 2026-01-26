"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Video,
  X,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScheduleEditor } from "@/components/admin/ScheduleEditor";
import {
  type RecurringSchedule,
  type DateException,
  defaultBookingConfig,
} from "@/lib/booking";

interface Meeting {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  endTime: string;
  type: string;
  meetLink: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

export default function AdminAgendaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"meetings" | "config">("meetings");

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [recurring, setRecurring] = useState<RecurringSchedule[]>(
    defaultBookingConfig.recurring
  );
  const [exceptions, setExceptions] = useState<DateException[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [meetingsRes, configRes] = await Promise.all([
        fetch("/api/admin/meetings"),
        fetch("/api/admin/booking-config"),
      ]);

      if (meetingsRes.ok) {
        const meetingsData = await meetingsRes.json();
        setMeetings(meetingsData.meetings || []);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        setEnabled(configData.enabled ?? true);
        setMeetingDuration(configData.meetingDuration ?? 30);
        setRecurring(configData.recurring ?? defaultBookingConfig.recurring);
        setExceptions(configData.exceptions ?? []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuthAndFetch = useCallback(async () => {
    try {
      const authRes = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const authData = await authRes.json();

      if (!authData.authenticated) {
        router.push("/admin");
        return;
      }

      await fetchData();
    } catch {
      router.push("/admin");
    }
  }, [router, fetchData]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/booking-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          recurring,
          exceptions,
          meetingDuration,
        }),
      });

      if (res.ok) {
        alert("Configuración guardada");
      } else {
        alert("Error al guardar");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!confirm("¿Cancelar esta reunión?")) return;

    try {
      const res = await fetch("/api/admin/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, action: "cancel" }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch {
      alert("Error al cancelar");
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("¿Eliminar esta reunión permanentemente?")) return;

    try {
      const res = await fetch("/api/admin/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, action: "delete" }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch {
      alert("Error al eliminar");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmada</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "completed":
        return <Badge variant="secondary">Completada</Badge>;
      default:
        return <Badge variant="outline">Pendiente</Badge>;
    }
  };

  const upcomingMeetings = meetings.filter(
    (m) => m.status !== "cancelled" && new Date(`${m.date}T${m.time}`) >= new Date()
  );
  const pastMeetings = meetings.filter(
    (m) => m.status === "cancelled" || new Date(`${m.date}T${m.time}`) < new Date()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Gestionar Agenda</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "meetings" ? "default" : "outline"}
            onClick={() => setActiveTab("meetings")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reuniones ({upcomingMeetings.length})
          </Button>
          <Button
            variant={activeTab === "config" ? "default" : "outline"}
            onClick={() => setActiveTab("config")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Configurar horarios
          </Button>
        </div>

        {activeTab === "meetings" && (
          <div className="space-y-6">
            {upcomingMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Próximas reuniones</h2>
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => (
                    <Card key={meeting.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{meeting.name}</span>
                              {getStatusBadge(meeting.status)}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                {new Date(meeting.date + "T12:00:00").toLocaleDateString(
                                  "es-AR",
                                  { weekday: "long", day: "numeric", month: "long" }
                                )}{" "}
                                - {meeting.time} a {meeting.endTime}
                              </p>
                              <p>{meeting.email}</p>
                              {meeting.phone && <p>{meeting.phone}</p>}
                              {meeting.notes && (
                                <p className="italic">&ldquo;{meeting.notes}&rdquo;</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {meeting.meetLink && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={meeting.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Video className="w-4 h-4 mr-1" />
                                  Meet
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </Button>
                            )}
                            {meeting.status !== "cancelled" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancelMeeting(meeting.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMeeting(meeting.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {upcomingMeetings.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay reuniones próximas</p>
                </CardContent>
              </Card>
            )}

            {pastMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                  Reuniones pasadas/canceladas
                </h2>
                <div className="space-y-2">
                  {pastMeetings.slice(0, 10).map((meeting) => (
                    <Card key={meeting.id} className="opacity-60">
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{meeting.name}</span>
                            {getStatusBadge(meeting.status)}
                            <span className="text-sm text-muted-foreground">
                              {new Date(meeting.date).toLocaleDateString("es-AR")} -{" "}
                              {meeting.time}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMeeting(meeting.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "config" && (
          <div className="space-y-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Configuración general</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="enabled" className="font-medium">
                    Habilitar sistema de agenda
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duración de reuniones (minutos)
                  </label>
                  <Input
                    type="number"
                    value={meetingDuration}
                    onChange={(e) => setMeetingDuration(parseInt(e.target.value) || 30)}
                    min={15}
                    max={120}
                    step={15}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horarios de disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduleEditor
                  recurring={recurring}
                  exceptions={exceptions}
                  onUpdateRecurring={setRecurring}
                  onUpdateExceptions={setExceptions}
                />
              </CardContent>
            </Card>

            <Button onClick={handleSaveConfig} disabled={isSaving} className="w-full">
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar configuración
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
