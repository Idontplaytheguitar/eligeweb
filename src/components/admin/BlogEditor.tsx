"use client";

import { useRef, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  Loader2,
  Save,
  X,
  Sparkles,
  Eye,
  Edit,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { BlogPreview } from "./BlogPreview";

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
}

interface BlogEditorProps {
  post: Partial<BlogPost>;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

type AIAction = "grammar" | "style" | "expand" | "summarize";

const aiActions: { id: AIAction; label: string; description: string }[] = [
  { id: "grammar", label: "Corregir gramática", description: "Corrige errores ortográficos y gramaticales" },
  { id: "style", label: "Mejorar estilo", description: "Mejora la redacción y fluidez del texto" },
  { id: "expand", label: "Expandir", description: "Desarrolla más las ideas del texto" },
  { id: "summarize", label: "Resumir", description: "Crea una versión más concisa" },
];

export function BlogEditor({ post, onSave, onCancel, isSaving }: BlogEditorProps) {
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>(post);
  const [showPreview, setShowPreview] = useState(true);
  const [isImproving, setIsImproving] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [aiError, setAiError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (newContent: string) => {
    setCurrentPost({ ...currentPost, content: newContent });
  };

  const handleAIImprove = async (action: AIAction) => {
    if (!currentPost.content) return;
    
    setIsImproving(true);
    setShowAIMenu(false);
    setAiError("");

    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentPost.content, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.error || "Error al mejorar el texto");
        return;
      }

      setCurrentPost({ ...currentPost, content: data.improved });
    } catch {
      setAiError("Error de conexión");
    } finally {
      setIsImproving(false);
    }
  };

  const handleSave = () => {
    onSave(currentPost);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="border-b bg-header sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <h1 className="text-lg font-bold hidden sm:block">
              {currentPost.id ? "Editar artículo" : "Nuevo artículo"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden lg:flex"
            >
              {showPreview ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Solo editor
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Mostrar preview
                </>
              )}
            </Button>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "max-w-3xl mx-auto"}`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={currentPost.title || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, title: e.target.value })
                }
                placeholder="Título del artículo"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Extracto *</label>
              <Textarea
                value={currentPost.excerpt || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, excerpt: e.target.value })
                }
                placeholder="Breve descripción que aparece en la lista de artículos"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagen de portada</label>
              {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "estudioelige"}
                  onSuccess={(result: unknown) => {
                    const info = (result as { info?: { secure_url?: string } })?.info;
                    if (info?.secure_url) {
                      setCurrentPost({ ...currentPost, coverImage: info.secure_url });
                    }
                  }}
                >
                  {({ open }: { open: () => void }) => (
                    <div className="space-y-2">
                      {currentPost.coverImage && (
                        <div
                          className="relative w-48 h-48 rounded-lg overflow-hidden border cursor-pointer group"
                          onClick={() => open()}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && open()}
                        >
                          <img
                            src={currentPost.coverImage}
                            alt="Portada"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-sm font-medium">Cambiar imagen</span>
                          </div>
                        </div>
                      )}
                      <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                        {currentPost.coverImage ? "Cambiar imagen" : "Subir imagen"}
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Contenido * (Markdown)</label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIMenu(!showAIMenu)}
                    disabled={isImproving || !currentPost.content}
                    className="gap-2"
                  >
                    {isImproving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Mejorar con IA
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {showAIMenu && (
                    <div className="absolute right-0 mt-1 w-56 bg-background border rounded-lg shadow-lg z-20">
                      {aiActions.map((action: { id: AIAction; label: string; description: string }) => (
                        <button
                          key={action.id}
                          onClick={() => handleAIImprove(action.id)}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {aiError && (
                <p className="text-sm text-destructive">{aiError}</p>
              )}
              <div className="border rounded-lg overflow-hidden">
                <MarkdownToolbar
                  textareaRef={textareaRef}
                  onInsert={handleContentChange}
                />
                <Textarea
                  ref={textareaRef}
                  value={currentPost.content || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Escribí el contenido del artículo en Markdown...

# Ejemplo de título
## Subtítulo

Párrafo con **texto en negrita** y *texto en itálica*.

- Lista de elementos
- Otro elemento

> Cita importante

[Link a un sitio](https://ejemplo.com)"
                  rows={20}
                  className="font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={currentPost.published || false}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, published: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publicar inmediatamente
              </label>
            </div>
          </div>

          {showPreview && (
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Vista previa
                  </span>
                </div>
                <div className="border rounded-lg overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto">
                  <BlogPreview
                    title={currentPost.title || ""}
                    excerpt={currentPost.excerpt || ""}
                    content={currentPost.content || ""}
                    coverImage={currentPost.coverImage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
