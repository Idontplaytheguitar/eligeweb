import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Gracias por contactarnos",
  description: "Recibimos tu consulta. Nos comunicaremos con vos a la brevedad.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasPage() {
  return (
    <section className="section-padding bg-background min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {siteContent.thanksPage.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            {siteContent.thanksPage.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {siteContent.thanksPage.ctaText}
              </Link>
            </Button>
            <Button asChild>
              <a
                href={getWhatsAppUrl("Hola, acabo de enviar el formulario de contacto y quisiera seguir por WhatsApp.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Escribirnos por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
