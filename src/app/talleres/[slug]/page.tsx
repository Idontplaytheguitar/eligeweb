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

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

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
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/talleres">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a talleres
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            {workshop.coverImage && (
              <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
                <Image
                  src={workshop.coverImage}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {workshop.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              {workshop.description}
            </p>

            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
              <ReactMarkdown>{workshop.content}</ReactMarkdown>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Badge variant="secondary" className="text-2xl px-4 py-2 mb-4">
                    {formatPrice(workshop.price)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Pago único - Acceso inmediato al material
                  </p>
                </div>

                <BuyButton workshopId={workshop.id} workshopTitle={workshop.title} />

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Acceso inmediato después del pago</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Material descargable</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Pago seguro con MercadoPago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
