"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminConfiguracionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

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
        setAdminEmail(data.adminEmail ?? "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: adminEmail.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al guardar");
        return;
      }

      toast.success("Email guardado correctamente");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
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

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Email del administrador</CardTitle>
            <CardDescription>
              Este email recibe las consultas del formulario de contacto, los códigos
              para cambiar contraseña y conviene que sea el mismo que uses en Google
              Calendar/Meet para las reuniones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="adminEmail" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="tu@email.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
