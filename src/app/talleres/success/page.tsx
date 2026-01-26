import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Compra exitosa",
  description: "Tu compra se realizó correctamente. Accedé a tu material.",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

async function getPurchase(token: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
    include: { workshop: true },
  });
  return purchase;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Token de descarga no válido o expirado.
              </p>
              <Button asChild>
                <Link href="/talleres">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a talleres
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const purchase = await getPurchase(token);

  if (!purchase) {
    return (
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Compra no encontrada o token expirado.
              </p>
              <Button asChild>
                <Link href="/talleres">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a talleres
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const isExpired = purchase.downloadExpires < new Date();

  if (isExpired) {
    return (
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                El enlace de descarga ha expirado. Contactanos para obtener uno nuevo.
              </p>
              <Button asChild>
                <Link href="/contacto">Contactar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              ¡Gracias por tu compra!
            </h1>

            <p className="text-muted-foreground mb-6">
              Tu pago fue procesado correctamente. Ya podés acceder al material del taller.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-lg mb-2">
                {purchase.workshop.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Comprado por: {purchase.email}
              </p>

              {purchase.workshop.materialUrl ? (
                <Button asChild size="lg">
                  <a
                    href={purchase.workshop.materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Descargar material
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  El material estará disponible pronto. Te notificaremos por email.
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              Este enlace expira en 7 días. Guardá el material en un lugar seguro.
            </p>

            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
