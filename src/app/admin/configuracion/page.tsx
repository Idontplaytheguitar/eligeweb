"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Save,
  Key,
  Bell,
  Mail,
  MessageCircle,
  Send,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ConfigState {
  adminEmail: string;
  notifyOnContact: boolean;
  notifyOnBooking: boolean;
  emailSenderName: string;
  whatsappDefaultMessage: string;
  contactAutoReplyEnabled: boolean;
  contactAutoReplyText: string;
  absenceNoticeEnabled: boolean;
  absenceNoticeText: string;
}

const defaultConfig: ConfigState = {
  adminEmail: "",
  notifyOnContact: true,
  notifyOnBooking: true,
  emailSenderName: "",
  whatsappDefaultMessage: "",
  contactAutoReplyEnabled: false,
  contactAutoReplyText: "",
  absenceNoticeEnabled: false,
  absenceNoticeText: "",
};

export default function AdminConfiguracionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<ConfigState>(defaultConfig);

  // Cambiar contraseña
  const [adminEmailConfigured, setAdminEmailConfigured] = useState<boolean | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // MercadoPago
  const [mp, setMp] = useState<{
    connected: boolean;
    accountEmail?: string | null;
    accountNickname?: string | null;
    connectedAt?: string | null;
    liveMode?: boolean;
  } | null>(null);
  const [mpError, setMpError] = useState<string>("");
  const [mpLoaded, setMpLoaded] = useState(false);
  const [mpBusy, setMpBusy] = useState(false);

  const fetchMpStatus = useCallback(async () => {
    setMpError("");
    try {
      const res = await fetch("/api/mercadopago/connection");
      if (res.ok) {
        setMp(await res.json());
      } else {
        const data = await res.json().catch(() => ({}));
        setMpError(
          data?.error ||
            `No se pudo consultar el estado (HTTP ${res.status}). ¿La migración de DB está aplicada?`
        );
      }
    } catch (e) {
      setMpError("Error de conexión al consultar el estado de MercadoPago.");
    } finally {
      setMpLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchMpStatus();
    // detectar callback de OAuth y notificar
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mp_ok") === "1") {
        toast.success("MercadoPago conectado");
        window.history.replaceState({}, "", "/admin/configuracion#mercadopago");
      } else if (params.get("mp_error")) {
        toast.error("No se pudo conectar MercadoPago: " + params.get("mp_error"));
        window.history.replaceState({}, "", "/admin/configuracion#mercadopago");
      }
    }
  }, [fetchMpStatus]);

  const handleMpDisconnect = async () => {
    if (!confirm("¿Desconectar tu cuenta de MercadoPago? Los cobros dejarán de funcionar hasta reconectarla.")) return;
    setMpBusy(true);
    try {
      const res = await fetch("/api/mercadopago/oauth/disconnect", { method: "POST" });
      if (res.ok) {
        toast.success("MercadoPago desconectado");
        await fetchMpStatus();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al desconectar");
      }
    } finally {
      setMpBusy(false);
    }
  };

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

      const settingsRes = await fetch("/api/admin/settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setConfig({
          adminEmail: data.adminEmail ?? "",
          notifyOnContact: data.notifyOnContact ?? true,
          notifyOnBooking: data.notifyOnBooking ?? true,
          emailSenderName: data.emailSenderName ?? "",
          whatsappDefaultMessage: data.whatsappDefaultMessage ?? "",
          contactAutoReplyEnabled: data.contactAutoReplyEnabled ?? false,
          contactAutoReplyText: data.contactAutoReplyText ?? "",
          absenceNoticeEnabled: data.absenceNoticeEnabled ?? false,
          absenceNoticeText: data.absenceNoticeText ?? "",
        });
        setAdminEmailConfigured(data.adminEmail != null && String(data.adminEmail).trim() !== "");
      }
    } catch {
      router.push("/admin");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: config.adminEmail.trim() || null,
          notifyOnContact: config.notifyOnContact,
          notifyOnBooking: config.notifyOnBooking,
          emailSenderName: config.emailSenderName.trim() || null,
          whatsappDefaultMessage: config.whatsappDefaultMessage.trim() || null,
          contactAutoReplyEnabled: config.contactAutoReplyEnabled,
          contactAutoReplyText: config.contactAutoReplyText.trim() || null,
          absenceNoticeEnabled: config.absenceNoticeEnabled,
          absenceNoticeText: config.absenceNoticeText.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al guardar");
        return;
      }
      toast.success("Configuración guardada");
      setAdminEmailConfigured(!!(config.adminEmail && config.adminEmail.trim()));
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestOTP = async () => {
    setIsSubmittingPassword(true);
    setChangePasswordMessage("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_otp" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangePasswordMessage(data.error || "Error al enviar código");
        return;
      }
      setOtpSent(true);
      setOtpEmail(data.email ?? "");
      setChangePasswordMessage(`Código enviado a ${data.email ?? "tu email"}`);
      setResendCooldown(30);
    } catch {
      setChangePasswordMessage("Error de conexión");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordMessage("");
    if (newPassword !== confirmPassword) {
      setChangePasswordMessage("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setIsSubmittingPassword(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangePasswordMessage(data.error || "Error al cambiar contraseña");
        return;
      }
      toast.success("Contraseña cambiada");
      setOtpSent(false);
      setResendCooldown(0);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordMessage("Contraseña cambiada exitosamente");
    } catch {
      setChangePasswordMessage("Error de conexión");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Configuración</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Cuenta: email + cambiar contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Cuenta
            </CardTitle>
            <CardDescription>
              Email del administrador (consultas, códigos de verificación, idealmente el de Google
              Calendar/Meet) y cambio de contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="adminEmail" className="text-sm font-medium">
                Email del administrador
              </label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="tu@email.com"
                value={config.adminEmail}
                onChange={(e) => setConfig((c) => ({ ...c, adminEmail: e.target.value }))}
                autoComplete="email"
              />
            </div>

            <div id="cambiar-contraseña" className="pt-4 border-t">
              <p className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                <Key className="h-4 w-4" />
                Cambiar contraseña
              </p>
              {!adminEmailConfigured ? (
                <p className="text-xs text-muted-foreground">
                  Configurá el email arriba y guardá; ese email recibe los códigos.
                </p>
              ) : !otpSent ? (
                <div className="space-y-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRequestOTP}
                    disabled={isSubmittingPassword}
                  >
                    {isSubmittingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Enviar código"
                    )}
                  </Button>
                  {changePasswordMessage && (
                    <p className="text-xs text-muted-foreground">{changePasswordMessage}</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Código enviado a {otpEmail}.
                  </p>
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div className="space-y-1">
                      <label htmlFor="otp" className="text-xs font-medium">
                        Código
                      </label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="newPassword" className="text-xs font-medium">
                        Nueva
                      </label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="confirmPassword" className="text-xs font-medium">
                        Confirmar
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  {changePasswordMessage && (
                    <p className="text-xs text-destructive">{changePasswordMessage}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <Button type="submit" size="sm" disabled={isSubmittingPassword}>
                      {isSubmittingPassword ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Cambiar"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={resendCooldown > 0 || isSubmittingPassword}
                      onClick={handleRequestOTP}
                    >
                      {resendCooldown > 0 ? `Reenviar (${resendCooldown}s)` : "Reenviar código"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        {/* MercadoPago */}
        <Card id="mercadopago">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              MercadoPago
            </CardTitle>
            <CardDescription>
              Conectá tu cuenta de MercadoPago para cobrar los cursos. El dinero entra directo a tu
              cuenta — nosotros nunca lo retenemos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!mpLoaded ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : mpError ? (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {mpError}
              </div>
            ) : mp?.connected ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-green-900 dark:text-green-200">
                      Cuenta conectada
                      {mp.liveMode === false && (
                        <span className="ml-2 text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                          modo sandbox
                        </span>
                      )}
                    </p>
                    {(mp.accountEmail || mp.accountNickname) && (
                      <p className="text-green-800 dark:text-green-300">
                        {mp.accountNickname ?? mp.accountEmail}
                      </p>
                    )}
                    {mp.connectedAt && (
                      <p className="text-xs text-green-700/80 dark:text-green-400/80">
                        Conectada el{" "}
                        {new Date(mp.connectedAt).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleMpDisconnect}
                  disabled={mpBusy}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Desconectar MercadoPago
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Al conectar, vas a ser redirigida a MercadoPago para autorizar la conexión con tu
                  cuenta.
                </p>
                <Button asChild>
                  <a href="/api/mercadopago/oauth/start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Conectar MercadoPago
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones por email
            </CardTitle>
            <CardDescription>
              Decidí cuándo recibir un correo al administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyOnContact}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, notifyOnContact: e.target.checked }))
                }
                className="rounded border-input"
              />
              <span className="text-sm">
                Notificarme cuando llegue una consulta de contacto
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyOnBooking}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, notifyOnBooking: e.target.checked }))
                }
                className="rounded border-input"
              />
              <span className="text-sm">
                Notificarme cuando alguien agende una reunión
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Nombre en correos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Nombre del estudio en correos
            </CardTitle>
            <CardDescription>
              Aparece como remitente y en el pie de los emails. Si está vacío se usa &quot;ELIGE -
              Estudio Legal&quot;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="ej. ELIGE - Estudio Legal"
              value={config.emailSenderName}
              onChange={(e) =>
                setConfig((c) => ({ ...c, emailSenderName: e.target.value }))
              }
            />
          </CardContent>
        </Card>

        {/* Mensaje WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Mensaje por defecto para WhatsApp
            </CardTitle>
            <CardDescription>
              Texto que se precarga cuando alguien abre el chat desde el sitio (botón flotante,
              contacto, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="ej. Hola, quisiera hacer una consulta legal."
              value={config.whatsappDefaultMessage}
              onChange={(e) =>
                setConfig((c) => ({ ...c, whatsappDefaultMessage: e.target.value }))
              }
            />
          </CardContent>
        </Card>

        {/* Respuesta automática al contactar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Respuesta automática al contactar
            </CardTitle>
            <CardDescription>
              Si está activo, quien envíe el formulario de contacto recibirá un email de
              confirmación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.contactAutoReplyEnabled}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, contactAutoReplyEnabled: e.target.checked }))
                }
                className="rounded border-input"
              />
              <span className="text-sm">Enviar mail de confirmación al que escribe</span>
            </label>
            <div className="space-y-2">
              <label htmlFor="contactAutoReplyText" className="text-sm font-medium">
                Texto del mail (opcional)
              </label>
              <Textarea
                id="contactAutoReplyText"
                placeholder="Recibimos tu consulta. Te responderemos a la brevedad."
                value={config.contactAutoReplyText}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, contactAutoReplyText: e.target.value }))
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aviso de ausencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Aviso de ausencia
            </CardTitle>
            <CardDescription>
              Un texto opcional que se muestra como banner en contacto y agendar (ej. vacaciones o
              demoras). No bloquea el sitio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.absenceNoticeEnabled}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, absenceNoticeEnabled: e.target.checked }))
                }
                className="rounded border-input"
              />
              <span className="text-sm">Mostrar aviso de ausencia</span>
            </label>
            <div className="space-y-2">
              <label htmlFor="absenceNoticeText" className="text-sm font-medium">
                Texto del aviso
              </label>
              <Input
                id="absenceNoticeText"
                placeholder="ej. Del 20/1 al 5/2 respondemos con demora."
                value={config.absenceNoticeText}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, absenceNoticeText: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSaveConfig}>
          <Button type="submit" disabled={isSaving} size="lg">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar configuración
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
