import { Metadata } from "next";
import { ServiceAccordion } from "@/components/services/ServiceAccordion";
import { CTASection } from "@/components/home/CTASection";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Servicios Legales",
  description: `Conocé nuestras áreas de práctica: ${siteContent.services.map(s => s.title).join(", ")}. Asesoramiento legal integral en Buenos Aires.`,
};

export default function ServiciosPage() {
  return (
    <>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Nuestros Servicios
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Brindamos asesoramiento legal integral en diversas áreas del derecho.
              Hacé clic en cada servicio para conocer más detalles.
            </p>
          </div>

          <ServiceAccordion />
        </div>
      </section>

      <CTASection />
    </>
  );
}
