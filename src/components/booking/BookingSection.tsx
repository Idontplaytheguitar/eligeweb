"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  type BookingConfigData,
  defaultBookingConfig,
  isDateAvailable,
} from "@/lib/booking";

const DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const MEETING_TYPES = [
  { 
    id: 'google_meet', 
    label: 'Google Meet', 
    icon: Video, 
    description: 'Videollamada online' 
  },
  { 
    id: 'whatsapp', 
    label: 'WhatsApp Call', 
    icon: Phone, 
    description: 'Llamada por WhatsApp' 
  },
  { 
    id: 'presencial', 
    label: 'Presencial', 
    icon: MapPin, 
    description: 'En el estudio' 
  },
  { 
    id: 'acordar', 
    label: 'A acordar', 
    icon: MessageSquare, 
    description: 'Lo coordinamos luego' 
  }
];

type FieldRequirements = {
  requiresEmail: boolean;
  requiresPhone: boolean;
  phoneOrEmailRequired: boolean;
  allowsScheduling: boolean;
  showEmail: boolean;
  showPhone: boolean;
};

function getFieldRequirements(meetingType: string): FieldRequirements {
  switch (meetingType) {
    case 'google_meet':
      return {
        requiresEmail: true,
        requiresPhone: false,
        phoneOrEmailRequired: false,
        allowsScheduling: true,
        showEmail: true,
        showPhone: true,
      };
    case 'whatsapp':
      return {
        requiresEmail: false,
        requiresPhone: true,
        phoneOrEmailRequired: false,
        allowsScheduling: true,
        showEmail: true, // Show but not required
        showPhone: true,
      };
    case 'presencial':
      return {
        requiresEmail: false,
        requiresPhone: false,
        phoneOrEmailRequired: true,
        allowsScheduling: true,
        showEmail: true,
        showPhone: true,
      };
    case 'acordar':
      return {
        requiresEmail: false,
        requiresPhone: false,
        phoneOrEmailRequired: true,
        allowsScheduling: false,
        showEmail: true,
        showPhone: true,
      };
    default:
      return {
        requiresEmail: true,
        requiresPhone: false,
        phoneOrEmailRequired: false,
        allowsScheduling: true,
        showEmail: true,
        showPhone: true,
      };
  }
}

export function BookingSection() {
  const [config, setConfig] = useState<BookingConfigData>(defaultBookingConfig);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<string>('google_meet');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fieldReqs = getFieldRequirements(meetingType);

  useEffect(() => {
    fetch("/api/admin/booking-config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => {});
  }, []);

  const fetchSlots = useCallback(async (date: string) => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch(`/api/calendar/slots?date=${date}`);
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch {
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate && fieldReqs.allowsScheduling) {
      fetchSlots(selectedDate);
      setSelectedTime(null);
    }
  }, [selectedDate, fetchSlots, fieldReqs.allowsScheduling]);

  // Reset validation error when form changes
  useEffect(() => {
    setValidationError("");
  }, [formData, meetingType]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validación custom para campos condicionales
    if (fieldReqs.phoneOrEmailRequired) {
      if (!formData.email && !formData.phone) {
        setValidationError("Debés proporcionar al menos un email o teléfono");
        return;
      }
    }

    // Solo validar fecha/hora si permite agendamiento
    if (fieldReqs.allowsScheduling && (!selectedDate || !selectedTime)) {
      setValidationError("Seleccioná una fecha y horario");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: fieldReqs.allowsScheduling ? selectedDate : null,
          time: fieldReqs.allowsScheduling ? selectedTime : null,
          meetingType: meetingType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMeetLink(data.meeting?.meetLink || null);
      } else {
        setValidationError(data.error || "Error al procesar la solicitud");
      }
    } catch {
      setValidationError("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = getDaysInMonth(currentMonth);

  if (isSuccess) {
    const wasScheduled = fieldReqs.allowsScheduling;
    
    return (
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {wasScheduled ? '¡Reunión agendada!' : '¡Solicitud enviada!'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {wasScheduled 
              ? 'Te enviamos un email con los detalles de la reunión.'
              : 'Te contactaremos a la brevedad para coordinar la reunión.'}
          </p>
          {meetLink && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Link de Google Meet:</p>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {meetLink}
              </a>
            </div>
          )}
          <Button
            onClick={() => {
            setIsSuccess(false);
            setSelectedDate(null);
            setSelectedTime(null);
            setMeetingType('google_meet');
            setFormData({ name: "", email: "", phone: "", notes: "" });
            setMeetLink(null);
            }}
          >
            {wasScheduled ? 'Agendar otra reunión' : 'Enviar otra solicitud'}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Consulta gratuita</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Agendá tu consulta
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Elegí el día y horario que mejor te quede. La primera consulta es sin cargo.
          </motion.p>
        </div>

        <motion.div
          layout
          className={`grid ${fieldReqs.allowsScheduling ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8 max-w-5xl mx-auto`}
          transition={{
            layout: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }
          }}
        >
          <AnimatePresence mode="popLayout">
            {fieldReqs.allowsScheduling && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -32, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    mass: 0.8
                  }
                }}
                exit={{
                  opacity: 0,
                  x: -32,
                  scale: 0.95,
                  transition: {
                    duration: 0.2,
                    ease: [0.4, 0, 1, 1]
                  }
                }}
                className="min-w-0"
              >
                <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      {currentMonth.toLocaleDateString("es-AR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                          )
                        }
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                          )
                        }
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS_SHORT.map((day: string) => (
                      <div key={day} className="text-center text-xs text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day: Date | null, index: number) => {
                      if (!day) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const dateStr = day.toISOString().split("T")[0];
                      const available = isDateAvailable(day, config);
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => available && setSelectedDate(dateStr)}
                          disabled={!available}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : available
                              ? "hover:bg-primary/20 hover:text-primary"
                              : "text-muted-foreground/40 cursor-not-allowed"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Horarios disponibles
                      </h4>
                      {isLoadingSlots ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {availableSlots.map((time: string) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                                selectedTime === time
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border hover:border-primary hover:text-primary"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No hay horarios disponibles para esta fecha
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            layout={true}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }
            }}
          >
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Tipo de reunión</h3>

                <motion.div layout className="grid grid-cols-2 gap-3 mb-6">
                  {MEETING_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <motion.button
                        layout
                        key={type.id}
                        onClick={() => setMeetingType(type.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          meetingType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          layout: { type: "spring", stiffness: 300, damping: 30 }
                        }}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${
                          meetingType === type.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>

                <h3 className="text-lg font-semibold mb-4">Completá tus datos</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      Nombre completo *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </motion.div>

                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      Email {fieldReqs.requiresEmail ? '*' : fieldReqs.phoneOrEmailRequired ? '(email o teléfono requerido)' : <span className="text-muted-foreground">(opcional)</span>}
                    </label>
                    <Input
                      type="email"
                      required={fieldReqs.requiresEmail}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </motion.div>

                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      Teléfono {fieldReqs.requiresPhone ? '*' : fieldReqs.phoneOrEmailRequired ? '(email o teléfono requerido)' : <span className="text-muted-foreground">(opcional)</span>}
                    </label>
                    <Input
                      type="tel"
                      required={fieldReqs.requiresPhone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                    />
                  </motion.div>

                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      ¿En qué podemos ayudarte?
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Contanos brevemente tu consulta..."
                      rows={3}
                    />
                  </motion.div>

                  {validationError && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                      {validationError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={
                      isSubmitting || 
                      (fieldReqs.allowsScheduling && (!selectedDate || !selectedTime))
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {fieldReqs.allowsScheduling ? 'Agendando...' : 'Enviando...'}
                      </>
                    ) : (
                      <>
                        {fieldReqs.allowsScheduling ? (
                          <>
                            <Calendar className="w-5 h-5 mr-2" />
                            Agendar consulta
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Enviar solicitud
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  {fieldReqs.allowsScheduling && (!selectedDate || !selectedTime) && (
                    <p className="text-center text-sm text-muted-foreground">
                      Seleccioná una fecha y horario para continuar
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
