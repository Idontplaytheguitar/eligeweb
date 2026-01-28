import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Artículo no encontrado" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Button variant="ghost" asChild className={post.coverImage ? "mb-8" : "mb-6"}>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Link>
          </Button>

          {post.coverImage && (
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <header className={`mb-8 ${!post.coverImage ? "border-b border-border pb-6" : ""}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            {post.publishedAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {post.publishedAt.toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
          </header>

          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <CTASection />
    </>
  );
}
