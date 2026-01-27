"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";

interface BlogPreviewProps {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  publishedAt?: Date | null;
}

export function BlogPreview({
  title,
  excerpt,
  content,
  coverImage,
  publishedAt,
}: BlogPreviewProps) {
  const displayDate = publishedAt || new Date();

  return (
    <div className="bg-gradient-to-b from-muted/30 to-background rounded-lg overflow-hidden">
      <div className="p-6 md:p-8">
        {coverImage && (
          <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
            <Image
              src={coverImage}
              alt={title || "Imagen de portada"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title || "Título del artículo"}
          </h1>
          {excerpt && (
            <p className="text-lg text-muted-foreground mb-4">{excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={displayDate.toISOString()}>
              {displayDate.toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-muted-foreground italic">
              El contenido del artículo aparecerá aquí...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
