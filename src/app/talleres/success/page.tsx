"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ManifestFile {
  id: string;
  label: string;
  source: "cloudinary" | "external";
}

interface Manifest {
  workshop: { id: string; title: string };
  expiresAt: string;
  files: ManifestFile[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Falta el token de descarga. Revisá el link del email.");
      setLoading(false);
      return;
    }
    fetch(`/api/talleres/download?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Error al cargar la descarga");
        }
        return res.json();
      })
      .then((data) => setManifest(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {loading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold">No pudimos validar tu compra</h1>
              <p className="text-muted-foreground">{error}</p>
              <Button asChild>
                <Link href="/talleres">Volver a Talleres</Link>
              </Button>
            </CardContent>
          </Card>
        ) : manifest ? (
          <>
            <div className="text-center mb-8">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">¡Pago confirmado!</h1>
              <p className="text-muted-foreground">
                Acá tenés el material de <strong>{manifest.workshop.title}</strong>.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-3">
                {manifest.files.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Este curso aún no tiene archivos cargados. Contactanos si esto es un error.
                  </p>
                ) : (
                  manifest.files.map((f) => (
                    <a
                      key={f.id}
                      href={`/api/talleres/download?token=${encodeURIComponent(
                        token!
                      )}&fileId=${encodeURIComponent(f.id)}`}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <span className="flex-1 font-medium truncate">{f.label}</span>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))
                )}
                <p className="text-xs text-muted-foreground pt-4 border-t">
                  El link expira el{" "}
                  {new Date(manifest.expiresAt).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  . Guardalo o descargá los archivos ahora.
                </p>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <Button variant="ghost" asChild>
                <Link href="/talleres">Volver a Talleres</Link>
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function TalleresSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
