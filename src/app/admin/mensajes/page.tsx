"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Trash2, Mail, Phone, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  area: string | null;
  message: string;
  createdAt: string;
}

export default function AdminMensajesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/mensajes");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
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

      await fetchMessages();
    } catch {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este mensaje?")) return;

    try {
      const res = await fetch(`/api/admin/mensajes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchMessages();
      }
    } catch {
      toast.error("Error al eliminar el mensaje");
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
            <h1 className="text-xl font-bold">Consultas</h1>
          </div>
          <Badge variant="secondary">{messages.length} consultas</Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay consultas todavía
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: ContactMessage) => (
              <Card key={msg.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <CardTitle className="text-lg">{msg.name}</CardTitle>
                        {msg.area && (
                          <Badge variant="outline">{msg.area}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {msg.phone}
                          </span>
                        )}
                        {msg.whatsapp && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {msg.whatsapp}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(msg.createdAt).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap mb-4">
                        {msg.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.email && (
                          <Button asChild variant="outline" size="sm">
                            <a href={`mailto:${msg.email}`} target="_blank" rel="noopener noreferrer">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </a>
                          </Button>
                        )}
                        {msg.whatsapp && (
                          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                            <a 
                              href={`https://wa.me/${msg.whatsapp.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              WhatsApp
                            </a>
                          </Button>
                        )}
                        {msg.phone && !msg.whatsapp && (
                          <Button asChild variant="outline" size="sm">
                            <a href={`tel:${msg.phone}`}>
                              <Phone className="h-4 w-4 mr-2" />
                              Llamar
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(msg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
