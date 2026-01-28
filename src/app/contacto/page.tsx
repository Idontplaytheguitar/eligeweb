import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppQR } from "@/components/contact/WhatsAppQR";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteContent } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá al estudio jurídico ELIGE. Consulta gratuita por WhatsApp, teléfono o email. Estamos en Buenos Aires, Argentina.",
};

export default function ContactoPage() {
  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Contactanos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Estamos para ayudarte. La primera consulta es sin cargo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="order-2 lg:order-1">
            <ContactForm />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="font-semibold text-xl text-foreground mb-4">
                  Información de contacto
                </h2>

                <a
                  href={`tel:${siteContent.contact.whatsapp.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium text-foreground">{siteContent.contact.whatsapp}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${siteContent.contact.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{siteContent.contact.email}</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium text-foreground">{siteContent.contact.address}</p>
                    <p className="text-sm text-muted-foreground">{siteContent.contact.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horario de atención</p>
                    <p className="font-medium text-foreground">{siteContent.contact.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold text-xl text-foreground mb-4">
                  ¿Preferís WhatsApp?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Escaneá el código QR o hacé clic en el botón.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <WhatsAppQR whatsappLink={getWhatsAppUrl("Hola, estoy en la página de contacto y quisiera comunicarme con ustedes.")} />
                  <Button asChild className="w-full">
                    <a
                      href={getWhatsAppUrl("Hola, estoy en la página de contacto y quisiera comunicarme con ustedes.")}
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

            <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold text-xl text-foreground mb-4">
                  Seguinos en redes
                </h2>
                <div className="flex gap-3">
                  <a
                    href={siteContent.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href={siteContent.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder para mapa - descomentar cuando tengas la dirección real */}
            {/* <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold text-xl text-foreground mb-4">
                  Ubicación
                </h2>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!..."
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de ELIGE"
                  />
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </section>
  );
}
