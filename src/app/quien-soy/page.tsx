import { Metadata } from "next";
import { Ear, MessageSquareText, Target, ShieldCheck, GraduationCap, Briefcase, Award } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Quién Soy",
  description: "Conocé a la Dra. Aldana García Eldik, fundadora de ELIGE. Más de 10 años de experiencia en derecho laboral, civil, familia y sucesiones.",
};

const principleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Escucha activa": Ear,
  "Comunicación clara": MessageSquareText,
  "Compromiso con el resultado": Target,
  "Ética profesional": ShieldCheck,
};

export default function QuienSoyPage() {
  return (
    <>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Dra. Aldana García Eldik
              </h1>
              <p className="text-xl text-primary font-medium mb-4">
                Abogada - Fundadora de ELIGE
              </p>
              <div className="prose prose-lg dark:prose-invert prose-p:text-muted-foreground max-w-none">
                <p>
                  Me recibí de abogada en diciembre de 2018 y desde los 18 años trabajé en el mismo 
                  estudio jurídico, donde adquirí una sólida formación y experiencia práctica en 
                  diversas áreas del derecho.
                </p>
                <p>
                  En diciembre de 2022, decidí independizarme y fundar <strong>ELIGE</strong> 
                  (Estudio Legal Integral García Eldik), con la visión de ofrecer un servicio 
                  legal cercano, empático y profesional.
                </p>
                <p>
                  Cuento con aproximadamente <strong>10 años de experiencia profesional</strong>, 
                  durante los cuales me especialicé en múltiples fueros: laboral, civil, previsional, 
                  asesoría a empresas, sucesiones y más.
                </p>
                <p>
                  Mi enfoque se basa en escuchar activamente a cada cliente, entender su situación 
                  particular y diseñar la mejor estrategia para defender sus derechos.
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-primary">AG</span>
                    </div>
                    <p className="text-sm">Foto próximamente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trayectoria
              </h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Fundadora de ELIGE
                      </h3>
                      <p className="text-sm text-primary mb-2">Diciembre 2022 - Presente</p>
                      <p className="text-muted-foreground">
                        Estudio jurídico propio especializado en derecho laboral, civil, 
                        previsional, sucesiones y asesoría integral a empresas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Experiencia en Estudio Jurídico
                      </h3>
                      <p className="text-sm text-primary mb-2">2012 - 2022 (10 años)</p>
                      <p className="text-muted-foreground">
                        Desarrollo profesional en múltiples áreas del derecho, 
                        adquiriendo experiencia práctica y formación integral.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Título de Abogada
                      </h3>
                      <p className="text-sm text-primary mb-2">Diciembre 2018</p>
                      <p className="text-muted-foreground">
                        Graduada como Abogada con formación integral en todas las 
                        ramas del derecho.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {siteContent.workingMethod.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {siteContent.workingMethod.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {siteContent.workingMethod.principles.map((principle, index) => {
                const Icon = principleIcons[principle.title] || ShieldCheck;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {principle.title}
                      </h3>
                      <p className="mt-1 text-muted-foreground leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
