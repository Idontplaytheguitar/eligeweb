import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos y publicaciones sobre derecho laboral, civil, familia y más. Información legal útil y actualizada.",
};

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Blog
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Artículos, novedades y publicaciones sobre temas legales de interés.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Próximamente publicaremos artículos de interés.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {posts.map((post: { id: string; slug: string; title: string; excerpt: string | null; coverImage: string | null; publishedAt: Date | null }) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden ${!post.coverImage ? "border-t-4 border-primary pt-6" : ""}`}>
                    {post.coverImage && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className={!post.coverImage ? "pt-0" : undefined}>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      {post.publishedAt && (
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
