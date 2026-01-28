"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  X,
  Users,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  price: number;
  coverImage: string | null;
  materialUrl: string | null;
  published: boolean;
  createdAt: string;
  _count?: { purchases: number };
}

export default function AdminTalleresPage() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState<Partial<Workshop> | null>(null);
  const [priceInput, setPriceInput] = useState("");

  const fetchWorkshops = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/talleres");
      const data = await res.json();
      setWorkshops(data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthAndFetch = useCallback(async () => {
    try {
      const authRes = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const authData = await authRes.json();

      if (!authData.authenticated) {
        router.push("/admin");
        return;
      }

      await fetchWorkshops();
    } catch {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  const handleSave = async () => {
    if (!currentWorkshop?.title || !currentWorkshop?.description || !currentWorkshop?.content) {
      alert("Completá todos los campos requeridos");
      return;
    }

    const price = parseFloat(priceInput);
    if (isNaN(price) || price < 0) {
      alert("Ingresá un precio válido");
      return;
    }

    setIsSaving(true);
    try {
      const method = currentWorkshop.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/talleres", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentWorkshop, price }),
      });

      if (res.ok) {
        await fetchWorkshops();
        setIsEditing(false);
        setCurrentWorkshop(null);
        setPriceInput("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al guardar");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este taller?")) return;

    try {
      const res = await fetch(`/api/admin/talleres?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchWorkshops();
      }
    } catch {
      toast.error("Error al eliminar el taller");
    }
  };

  const handleTogglePublish = async (workshop: Workshop) => {
    try {
      await fetch("/api/admin/talleres", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workshop.id, published: !workshop.published }),
      });
      await fetchWorkshops();
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="border-b bg-background">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentWorkshop(null);
                  setPriceInput("");
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <h1 className="text-xl font-bold">
                {currentWorkshop?.id ? "Editar taller" : "Nuevo taller"}
              </h1>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Guardar
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={currentWorkshop?.title || ""}
                onChange={(e) =>
                  setCurrentWorkshop({ ...currentWorkshop, title: e.target.value })
                }
                placeholder="Nombre del taller"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción breve *</label>
              <Textarea
                value={currentWorkshop?.description || ""}
                onChange={(e) =>
                  setCurrentWorkshop({ ...currentWorkshop, description: e.target.value })
                }
                placeholder="Descripción que se muestra en el listado"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio (ARS) *</label>
                <Input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="5000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Imagen de portada</label>
                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "estudioelige"}
                    onSuccess={(result: unknown) => {
                      const info = (result as { info?: { secure_url?: string } })?.info;
                      if (info?.secure_url && currentWorkshop) {
                        setCurrentWorkshop({ ...currentWorkshop, coverImage: info.secure_url });
                      }
                    }}
                  >
                    {({ open }: { open: () => void }) => (
                      <div className="space-y-2">
                        {currentWorkshop?.coverImage && (
                          <div
                            className="relative w-48 h-48 rounded-lg overflow-hidden border cursor-pointer group"
                            onClick={() => open()}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && open()}
                          >
                            <img
                              src={currentWorkshop.coverImage}
                              alt="Portada"
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-sm font-medium">Cambiar imagen</span>
                            </div>
                          </div>
                        )}
                        <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                          {currentWorkshop?.coverImage ? "Cambiar imagen" : "Subir imagen"}
                        </Button>
                      </div>
                    )}
                  </CldUploadWidget>
                ) : null}
                {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                  <p className="text-sm text-muted-foreground">
                    Configurá NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET para poder subir la imagen de portada (en Vercel: Settings → Environment Variables, y volvé a desplegar).
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL del material (PDF, Drive, etc.)</label>
              <Input
                value={currentWorkshop?.materialUrl || ""}
                onChange={(e) =>
                  setCurrentWorkshop({ ...currentWorkshop, materialUrl: e.target.value })
                }
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Link al material que recibirán los compradores
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido completo * (Markdown)</label>
              <Textarea
                value={currentWorkshop?.content || ""}
                onChange={(e) =>
                  setCurrentWorkshop({ ...currentWorkshop, content: e.target.value })
                }
                placeholder="Descripción detallada del taller..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={currentWorkshop?.published || false}
                onChange={(e) =>
                  setCurrentWorkshop({ ...currentWorkshop, published: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publicar y permitir compras
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Gestionar Talleres</h1>
          </div>
          <Button
            onClick={() => {
              setCurrentWorkshop({
                title: "",
                description: "",
                content: "",
                published: false,
              });
              setPriceInput("");
              setIsEditing(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo taller
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {workshops.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No hay talleres todavía
              </p>
              <Button
                onClick={() => {
                  setCurrentWorkshop({
                    title: "",
                    description: "",
                    content: "",
                    published: false,
                  });
                  setPriceInput("");
                  setIsEditing(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primer taller
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workshops.map((workshop: Workshop) => (
              <Card key={workshop.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CardTitle className="text-lg">{workshop.title}</CardTitle>
                        <Badge variant={workshop.published ? "default" : "secondary"}>
                          {workshop.published ? "Publicado" : "Borrador"}
                        </Badge>
                        <Badge variant="outline">{formatPrice(workshop.price)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {workshop.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {workshop._count?.purchases || 0} compras
                        </span>
                        <span>
                          {new Date(workshop.createdAt).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(workshop)}
                        title={workshop.published ? "Despublicar" : "Publicar"}
                      >
                        {workshop.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentWorkshop(workshop);
                          setPriceInput((workshop.price / 100).toString());
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(workshop.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
