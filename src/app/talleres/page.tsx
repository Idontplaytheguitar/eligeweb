import { Metadata } from "next";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Talleres - Próximamente",
  description:
    "Talleres y cursos sobre temas legales. Aprende sobre tus derechos con material práctico y accesible.",
};

// DISABLED: Talleres feature not ready for production yet
// This page will be re-enabled when payment integration is complete

export default function TalleresPage() {
  return (
    <>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Talleres
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Capacitaciones y materiales sobre temas legales de interés.
              Aprende sobre tus derechos de forma clara y práctica.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground text-xl">
              Próximamente dispondremos de talleres.
            </p>
            <p className="text-muted-foreground mt-4">
              Estamos trabajando para ofrecerte contenido educativo de calidad.
              Volvé pronto para conocer nuestros talleres disponibles.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

/* DISABLED CODE - Keep for future use
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getWorkshops() {
  try {
    const workshops = await prisma.workshop.findMany({
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
    return workshops;
  } catch {
    return [];
  }
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(cents / 100);
}

// In the component:
// const workshops = await getWorkshops();
// {workshops.map((workshop: { id: string; slug: string; title: string; description: string | null; price: number; coverImage: string | null }) => (
//   <Link key={workshop.id} href={`/talleres/${workshop.slug}`}>
//     <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden flex flex-col">
//       {workshop.coverImage && (
//         <div className="aspect-video relative overflow-hidden">
//           <Image
//             src={workshop.coverImage}
//             alt={workshop.title}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         </div>
//       )}
//       <CardHeader className="flex-1">
//         <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
//           {workshop.title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <p className="text-muted-foreground line-clamp-3 mb-4">
//           {workshop.description}
//         </p>
//         <div className="flex items-center justify-between">
//           <Badge variant="secondary" className="text-lg px-3 py-1">
//             {formatPrice(workshop.price)}
//           </Badge>
//           <Button size="sm">Ver más</Button>
//         </div>
//       </CardContent>
//     </Card>
//   </Link>
// ))}
*/
