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
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseEditor, CourseDraft } from "@/components/admin/CourseEditor";
import { CourseFileItem } from "@/components/admin/CourseFilesManager";
import { toast } from "sonner";

interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  price: number; // cents
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  files: (CourseFileItem & { id: string })[];
  _count?: { purchases: number };
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(cents / 100);
}

export default function AdminCursosPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [current, setCurrent] = useState<Partial<CourseDraft> | null>(null);
  const [mpConnected, setMpConnected] = useState<boolean | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/talleres");
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      console.error(e);
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
      const mpRes = await fetch("/api/mercadopago/connection");
      if (mpRes.ok) {
        const mp = await mpRes.json();
        setMpConnected(!!mp.connected);
      }
      await fetchCourses();
    } catch {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  const handleSave = async (course: CourseDraft) => {
    if (!course.title || !course.description || !course.price) {
      toast.error("Completá título, descripción y precio");
      return;
    }
    setIsSaving(true);
    try {
      const method = course.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/talleres", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          title: course.title,
          description: course.description,
          content: course.content,
          price: course.price,
          coverImage: course.coverImage,
          published: course.published,
          files: course.files.map((f) => ({
            label: f.label,
            url: f.url,
            source: f.source,
            mimeType: f.mimeType ?? null,
            sizeBytes: f.sizeBytes ?? null,
          })),
        }),
      });
      if (res.ok) {
        await fetchCourses();
        setIsEditing(false);
        setCurrent(null);
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
    if (!confirm("¿Eliminar este curso? Las ventas registradas se borrarán también.")) return;
    try {
      const res = await fetch(`/api/admin/talleres?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchCourses();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleTogglePublish = async (c: Workshop) => {
    try {
      await fetch("/api/admin/talleres", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, published: !c.published }),
      });
      await fetchCourses();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing && current) {
    return (
      <CourseEditor
        course={current}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setCurrent(null);
        }}
        isSaving={isSaving}
      />
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
            <h1 className="text-xl font-bold">Cursos</h1>
          </div>
          <Button
            onClick={() => {
              setCurrent({
                title: "",
                description: "",
                content: "",
                price: 0,
                published: false,
                files: [],
              });
              setIsEditing(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo curso
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {mpConnected === false && (
          <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="py-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  MercadoPago no está conectado
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Para poder cobrar los cursos, conectá tu cuenta de MercadoPago desde la página de
                  configuración.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/configuracion#mercadopago">Configurar</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No hay cursos todavía</p>
              <Button
                onClick={() => {
                  setCurrent({
                    title: "",
                    description: "",
                    content: "",
                    price: 0,
                    published: false,
                    files: [],
                  });
                  setIsEditing(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primer curso
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {courses.map((c) => (
              <Card key={c.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{c.title}</CardTitle>
                        <Badge variant={c.published ? "default" : "secondary"}>
                          {c.published ? "Publicado" : "Borrador"}
                        </Badge>
                        <Badge variant="outline">{formatPrice(c.price)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {c.files.length} archivo{c.files.length === 1 ? "" : "s"} ·{" "}
                        {c._count?.purchases ?? 0} venta{(c._count?.purchases ?? 0) === 1 ? "" : "s"} ·{" "}
                        {new Date(c.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {c.published && (
                        <Button variant="ghost" size="icon" asChild title="Ver curso">
                          <Link href={`/talleres/${c.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(c)}
                        title={c.published ? "Despublicar" : "Publicar"}
                      >
                        {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrent({
                            id: c.id,
                            title: c.title,
                            description: c.description,
                            content: c.content,
                            price: c.price / 100, // cents → pesos for UI
                            coverImage: c.coverImage,
                            published: c.published,
                            files: c.files.map((f) => ({
                              label: f.label,
                              url: f.url,
                              source: f.source,
                              mimeType: f.mimeType ?? null,
                              sizeBytes: f.sizeBytes ?? null,
                            })),
                          });
                          setIsEditing(true);
                        }}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                        title="Eliminar"
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
