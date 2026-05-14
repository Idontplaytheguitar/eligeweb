"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, Link2, Trash2, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface CourseFileItem {
  id?: string;
  label: string;
  url: string;
  source: "cloudinary" | "external";
  mimeType?: string | null;
  sizeBytes?: number | null;
}

type FilesUpdater = CourseFileItem[] | ((prev: CourseFileItem[]) => CourseFileItem[]);

interface Props {
  files: CourseFileItem[];
  onChange: (updater: FilesUpdater) => void;
}

export function CourseFilesManager({ files, onChange }: Props) {
  const [externalUrl, setExternalUrl] = useState("");
  const [externalLabel, setExternalLabel] = useState("");

  const update = (idx: number, patch: Partial<CourseFileItem>) => {
    onChange((prev) => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  };

  const remove = (idx: number) => {
    onChange((prev) => prev.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    onChange((prev) => {
      const j = idx + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const addExternal = () => {
    const url = externalUrl.trim();
    const label = externalLabel.trim();
    if (!url) return;
    onChange((prev) => [
      ...prev,
      {
        label: label || url.split("/").pop() || "Enlace externo",
        url,
        source: "external",
      },
    ]);
    setExternalUrl("");
    setExternalLabel("");
  };

  const hasCloudinary = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium mb-1">Archivos del taller</p>
        <p className="text-xs text-muted-foreground">
          Material descargable que recibe el comprador (PDF, ZIP, video, etc.). Podés subir archivos
          o pegar enlaces externos (Drive, Dropbox, etc.).
        </p>
      </div>

      {files.length > 0 && (
        <div className="border rounded-lg divide-y bg-background">
          {files.map((f, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                value={f.label}
                onChange={(e) => update(idx, { label: e.target.value })}
                placeholder="Nombre visible"
                className="h-8 text-sm flex-1"
              />
              <Badge variant={f.source === "cloudinary" ? "default" : "secondary"} className="shrink-0">
                {f.source === "cloudinary" ? "Subido" : "Externo"}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                title="Mover arriba"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => move(idx, 1)}
                disabled={idx === files.length - 1}
                title="Mover abajo"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(idx)}
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {hasCloudinary ? (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "estudioelige"}
            options={{ resourceType: "auto", sources: ["local", "url"] }}
            onSuccess={(result: unknown) => {
              const info = (result as {
                info?: { secure_url?: string; original_filename?: string; bytes?: number; format?: string };
              })?.info;
              if (info?.secure_url) {
                const newFile: CourseFileItem = {
                  label: info.original_filename
                    ? `${info.original_filename}${info.format ? "." + info.format : ""}`
                    : "Archivo",
                  url: info.secure_url,
                  source: "cloudinary",
                  sizeBytes: info.bytes ?? null,
                };
                onChange((prev) => [...prev, newFile]);
              }
            }}
          >
            {({ open }: { open: () => void }) => (
              <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                <Upload className="h-4 w-4 mr-2" />
                Subir archivo
              </Button>
            )}
          </CldUploadWidget>
        ) : (
          <p className="text-xs text-muted-foreground">
            Configurá Cloudinary para subir archivos.
          </p>
        )}
      </div>

      <div className="border rounded-lg p-3 bg-muted/30 space-y-2">
        <p className="text-xs font-medium flex items-center gap-1">
          <Link2 className="h-3 w-3" />
          Agregar enlace externo
        </p>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Nombre (opcional)"
            value={externalLabel}
            onChange={(e) => setExternalLabel(e.target.value)}
            className="h-8 text-sm flex-1 min-w-[120px]"
          />
          <Input
            placeholder="https://..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="h-8 text-sm flex-[2] min-w-[200px]"
          />
          <Button type="button" size="sm" onClick={addExternal} disabled={!externalUrl.trim()}>
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
