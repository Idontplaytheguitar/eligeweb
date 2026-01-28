"use client";

import { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { CldUploadWidget } from "next-cloudinary";
import {
  Loader2,
  Save,
  X,
  Sparkles,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  UnderlineIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
}

interface BlogEditorWYSIWYGProps {
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

export function BlogEditorWYSIWYG({ post, onSave, onCancel, isSaving }: BlogEditorWYSIWYGProps) {
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>(post);
  const [isImproving, setIsImproving] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary hover:underline",
        },
      }),
      Placeholder.configure({
        placeholder: "Empezá a escribir tu artículo...",
      }),
      Underline,
    ],
    content: currentPost.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      setCurrentPost({ ...currentPost, content: editor.getHTML() });
    },
  });

  // Actualizar el contenido del editor cuando cambia el post
  useEffect(() => {
    if (editor && post.content !== editor.getHTML()) {
      editor.commands.setContent(post.content || "");
    }
  }, [post.content, editor]);

  // Actualizar el estado cuando cambia el post prop
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const handleAIImprove = async (action: AIAction) => {
    if (!editor) return;
    const content = editor.getText();
    if (!content) return;
    
    setIsImproving(true);
    setShowAIMenu(false);
    setAiError("");

    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.error || "Error al mejorar el texto");
        return;
      }

      editor.commands.setContent(data.improved);
    } catch {
      setAiError("Error de conexión");
    } finally {
      setIsImproving(false);
    }
  };

  const setLink = () => {
    if (!editor || !linkUrl) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const addImage = (url?: string) => {
    const src = url ?? imageUrl;
    if (!editor || !src) return;
    editor.chain().focus().setImage({ src }).run();
    setImageUrl("");
    setShowImageInput(false);
  };

  const handleSave = () => {
    if (editor) {
      setCurrentPost({ ...currentPost, content: editor.getHTML() });
    }
    onSave(currentPost);
  };

  if (!editor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <span
              title="próximamente"
              className="inline-block opacity-50 cursor-not-allowed"
            >
              <div className="relative pointer-events-none">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  tabIndex={-1}
                  className="gap-2"
                  disabled
                >
                  <Sparkles className="h-4 w-4" />
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
            </span>
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

      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
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

          {aiError && (
            <p className="text-sm text-destructive">{aiError}</p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Contenido *</label>
            <div className="border rounded-lg overflow-hidden bg-background">
              {/* Toolbar */}
              <div className="border-b p-2 flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-muted" : ""}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-muted" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive("underline") ? "bg-muted" : ""}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive("strike") ? "bg-muted" : ""}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive("bulletList") ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive("orderedList") ? "bg-muted" : ""}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive("blockquote") ? "bg-muted" : ""}
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={editor.isActive("code") ? "bg-muted" : ""}
                >
                  <Code className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageInput(!showImageInput)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              {/* Link Input */}
              {showLinkInput && (
                <div className="border-b p-3 bg-muted/50 flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://ejemplo.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setLink();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={setLink}>
                    Agregar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowLinkInput(false);
                      setLinkUrl("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}

              {/* Image Input */}
              {showImageInput && (
                <div className="border-b p-3 bg-muted/50 flex flex-wrap items-center gap-2">
                  {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "estudioelige"}
                      onSuccess={(result: unknown) => {
                        const info = (result as { info?: { secure_url?: string } })?.info;
                        if (info?.secure_url) addImage(info.secure_url);
                      }}
                    >
                      {({ open }: { open: () => void }) => (
                        <Button type="button" size="sm" variant="outline" onClick={() => open()}>
                          Subir
                        </Button>
                      )}
                    </CldUploadWidget>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Configurá Cloudinary para insertar imágenes.
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowImageInput(false);
                      setImageUrl("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}

              {/* Editor Content */}
              <EditorContent editor={editor} />
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
      </div>
    </div>
  );
}
