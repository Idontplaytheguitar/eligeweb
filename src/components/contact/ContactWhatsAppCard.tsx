"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppQR } from "./WhatsAppQR";

const CONTACT_PAGE_MESSAGE = "Hola, estoy en la página de contacto y quisiera comunicarme con ustedes.";

export function ContactWhatsAppCard() {
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    fetch("/api/public-config")
      .then((res) => res.json())
      .then((data: { whatsappLink?: string; whatsappNumber?: string }) => {
        const num = typeof data.whatsappNumber === "string" ? data.whatsappNumber : "";
        const defaultLink = typeof data.whatsappLink === "string" ? data.whatsappLink : "";
        const customLink = num
          ? `https://wa.me/${num}?text=${encodeURIComponent(CONTACT_PAGE_MESSAGE)}`
          : defaultLink;
        setLink(customLink || defaultLink);
      })
      .catch(() => setLink(""));
  }, []);

  if (!link) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-xl text-foreground mb-4">
            ¿Preferís WhatsApp?
          </h2>
          <p className="text-muted-foreground">Cargando…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-semibold text-xl text-foreground mb-4">
          ¿Preferís WhatsApp?
        </h2>
        <p className="text-muted-foreground mb-4">
          Escaneá el código QR o hacé clic en el botón.
        </p>
        <div className="flex flex-col items-center gap-4">
          <WhatsAppQR whatsappLink={link} />
          <Button asChild className="w-full">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
