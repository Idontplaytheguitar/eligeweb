import { MetadataRoute } from "next";
import { siteContent } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteContent.seo.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gracias"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
