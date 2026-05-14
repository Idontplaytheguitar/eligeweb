"use client";

import { useState, useEffect, useRef } from "react";
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
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseFilesManager, CourseFileItem } from "./CourseFilesManager";

export interface CourseDraft {
  id?: string;
  title: string;
  description: string;
  content: string;
  price: number; // ARS pesos (no centavos) en UI
  coverImage?: string | null;
  published: boolean;
  files: CourseFileItem[];
}

interface Props {
  course: Partial<CourseDraft>;
  onSave: (course: CourseDraft) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function CourseEditor({ course, onSave, onCancel, isSaving }: Props) {
  const [draft, setDraft] = useState<CourseDraft>({
    title: course.title ?? "",
    description: course.description ?? "",
    content: course.content ?? "",
    price: course.price ?? 0,
    coverImage: course.coverImage ?? null,
    published: course.published ?? false,
    files: course.files ?? [],
    id: course.id,
  });
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary hover:underline" } }),
      Placeholder.configure({ placeholder: "Detalles del curso, temario, objetivos..." }),
      Underline,
    ],
    content: draft.content,
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      setDraft((d) => ({ ...d, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (editor && course.content !== undefined && course.content !== editor.getHTML()) {
      editor.commands.setContent(course.content || "");
    }
  }, [course.content, editor]);

  const handleSave = () => {
    const current = draftRef.current;
    const finalContent = editor ? editor.getHTML() : current.content;
    if (editor) setDraft((d) => ({ ...d, content: finalContent }));
    onSave({ ...current, content: finalContent });
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
              {draft.id ? "Editar taller" : "Nuevo taller"}
            </h1>
          </div>
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

      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título *</label>
          <Input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Título del taller"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción corta *</label>
          <Textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            placeholder="Resumen que se ve en la lista de talleres"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Precio (ARS) *</label>
            <Input
              type="number"
              min={0}
              step={1}
              value={draft.price === 0 ? "" : draft.price}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  price: e.target.value === "" ? 0 : Number(e.target.value),
                }))
              }
              placeholder="ej. 5000"
            />
            <p className="text-xs text-muted-foreground">
              Pesos argentinos. Se guarda en centavos internamente.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <label className="flex items-center gap-2 h-9">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Publicado (visible al público)</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Imagen de portada</label>
          {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "estudioelige"}
              onSuccess={(result: unknown) => {
                const info = (result as { info?: { secure_url?: string } })?.info;
                if (info?.secure_url) {
                  const url = info.secure_url;
                  setDraft((d) => ({ ...d, coverImage: url }));
                }
              }}
            >
              {({ open }: { open: () => void }) => (
                <div className="space-y-2">
                  {draft.coverImage && (
                    <div
                      className="relative w-48 h-48 rounded-lg overflow-hidden border cursor-pointer group"
                      onClick={() => open()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && open()}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={draft.coverImage}
                        alt="Portada"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                    {draft.coverImage ? "Cambiar imagen" : "Subir imagen"}
                  </Button>
                </div>
              )}
            </CldUploadWidget>
          ) : (
            <p className="text-sm text-muted-foreground">Configurá Cloudinary para subir imagen.</p>
          )}
        </div>

        <CourseFilesManager
          files={draft.files}
          onChange={(updater) =>
            setDraft((d) => ({
              ...d,
              files: typeof updater === "function" ? updater(d.files) : updater,
            }))
          }
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Contenido / temario</label>
          <div className="border rounded-lg overflow-hidden bg-background">
            <div className="border-b p-2 flex flex-wrap gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "bg-muted" : ""}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "bg-muted" : ""}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "bg-muted" : ""}>
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}>
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}>
                <Heading2 className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "bg-muted" : ""}>
                <List className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "bg-muted" : ""}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "bg-muted" : ""}>
                <Quote className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
