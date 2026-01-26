import { redirect } from "next/navigation";

// DISABLED: Talleres feature not ready for production yet
// Redirect all workshop detail pages to main talleres page

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkshopPage({ params }: Props) {
  redirect("/talleres");
}

/* DISABLED CODE - Keep for future use
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BuyButton } from "@/components/talleres/BuyButton";

async function getWorkshop(slug: string) {
  try {
    const workshop = await prisma.workshop.findUnique({
      where: { slug, published: true },
    });
    return workshop;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);

  if (!workshop) {
    return { title: "Taller no encontrado" };
  }

  return {
    title: workshop.title,
    description: workshop.description,
    openGraph: {
      title: workshop.title,
      description: workshop.description,
      images: workshop.coverImage ? [workshop.coverImage] : [],
    },
  };
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(cents / 100);
}

export default async function WorkshopPage({ params }: Props) {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);

  if (!workshop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/talleres">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Talleres
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            {workshop.coverImage && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={workshop.coverImage}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {workshop.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {workshop.description}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Contenido</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown>{workshop.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Precio</p>
                  <Badge variant="secondary" className="text-2xl px-4 py-2">
                    {formatPrice(workshop.price)}
                  </Badge>
                </div>

                <BuyButton workshopId={workshop.id} workshopTitle={workshop.title} />

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Incluye:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Acceso inmediato al material</li>
                    <li>✓ Material descargable en PDF</li>
                    <li>✓ Contenido actualizado</li>
                    {workshop.materialUrl && <li>✓ Recursos adicionales</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
*/
