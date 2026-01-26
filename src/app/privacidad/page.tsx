import { Metadata } from "next";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad y protección de datos personales de ELIGE - Estudio Legal Integral García Eldik.",
};

export default function PrivacidadPage() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {siteContent.privacyPolicy.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            Última actualización: {siteContent.privacyPolicy.lastUpdated}
          </p>

          <div className="prose prose-gray max-w-none">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Información que recopilamos
                </h2>
                <p>
                  Cuando completás el formulario de contacto, recopilamos:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Nombre y apellido</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>El mensaje que nos enviás</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Uso de la información
                </h2>
                <p>
                  Utilizamos tu información únicamente para:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Responder a tu consulta</li>
                  <li>Contactarte sobre tu caso</li>
                  <li>Enviarte información relevante si nos autorizás</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Protección de datos
                </h2>
                <p>
                  Tus datos personales son confidenciales y están protegidos según la 
                  Ley de Protección de Datos Personales N° 25.326 de Argentina.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Compartir información
                </h2>
                <p>
                  No compartimos, vendemos ni alquilamos tu información personal a terceros.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Cookies
                </h2>
                <p>
                  Este sitio puede utilizar cookies para mejorar la experiencia del usuario. 
                  Podés configurar tu navegador para rechazarlas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Cambios en esta política
                </h2>
                <p>
                  Nos reservamos el derecho de modificar esta política. Los cambios serán 
                  publicados en esta página.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Contacto
                </h2>
                <p>
                  Si tenés preguntas sobre esta política, contactanos a través de nuestro 
                  formulario o por email a{" "}
                  <a 
                    href={`mailto:${siteContent.contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {siteContent.contact.email}
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
