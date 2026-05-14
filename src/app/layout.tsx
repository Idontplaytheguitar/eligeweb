import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { PageTransition } from "@/components/layout/PageTransition";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { siteContent } from "@/content/site";
import type { ServiceItem } from "@/types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteContent.name} | ${siteContent.fullName}`,
    template: `%s | ${siteContent.name} - Estudio Legal`,
  },
  description: siteContent.seo.description,
  keywords: siteContent.seo.keywords,
  authors: [{ name: siteContent.fullName }],
  creator: siteContent.fullName,
  metadataBase: new URL(siteContent.seo.url),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteContent.seo.url,
    siteName: siteContent.fullName,
    title: `${siteContent.name} | ${siteContent.fullName}`,
    description: siteContent.seo.description,
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: siteContent.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.name} | ${siteContent.fullName}`,
    description: siteContent.seo.description,
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico", sizes: "any" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LegalService", "LocalBusiness"],
              name: siteContent.fullName,
              description: siteContent.seo.description,
              url: siteContent.seo.url,
              telephone: siteContent.contact.whatsapp,
              email: siteContent.contact.email,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Buenos Aires",
                addressRegion: "CABA",
                addressCountry: "AR",
                streetAddress: siteContent.contact.address,
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-34.6037",
                longitude: "-58.3816",
              },
              openingHours: siteContent.contact.hours,
              sameAs: [
                siteContent.social.instagram,
                siteContent.social.facebook,
              ],
              priceRange: "$$",
              image: `${siteContent.seo.url}/brand/elige-logo.png`,
              areaServed: {
                "@type": "Country",
                name: "Argentina",
              },
              serviceType: siteContent.services.map((s: ServiceItem) => s.title),
            }),
          }}
        />
        {/* Google Analytics placeholder - uncomment and add your ID when ready
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        */}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster position="top-right" richColors />
        <Navbar />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppFloatingButton />
        <Analytics />
      </body>
    </html>
  );
}
