import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Talleres y Cursos",
  description:
    "Talleres y cursos sobre temas legales. Aprende sobre tus derechos con material práctico y accesible.",
};

async function getWorkshops() {
  try {
    return await prisma.workshop.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        price: true,
        coverImage: true,
      },
    });
  } catch {
    return [];
  }
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(cents / 100);
}

export default async function TalleresPage() {
  const workshops = await getWorkshops();

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Talleres</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Capacitaciones y materiales sobre temas legales de interés. Aprende sobre tus derechos
              de forma clara y práctica.
            </p>
          </div>

          {workshops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-xl">
                Próximamente dispondremos de talleres.
              </p>
              <p className="text-muted-foreground mt-4">
                Estamos trabajando para ofrecerte contenido educativo de calidad. Volvé pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {workshops.map((w) => (
                <Link key={w.id} href={`/talleres/${w.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden flex flex-col">
                    {w.coverImage && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={w.coverImage}
                          alt={w.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {w.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-3 mb-4">{w.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {formatPrice(w.price)}
                        </Badge>
                        <Button size="sm">Ver más</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
