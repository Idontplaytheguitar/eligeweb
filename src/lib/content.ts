import { prisma } from "@/lib/prisma";
import { siteContent } from "@/content/site";

export interface SiteContentData {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoEnabled: boolean;
  aboutName: string;
  aboutRole: string;
  aboutImage: string;
  aboutBio: string[];
  aboutTimeline: any[];
  services: any[];
  testimonials: any[];
  faqs: any[];
  whyChooseUs: any[];
  process: any[];
  footerDesc: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAddress: string;
  contactCity: string;
  contactHours: string;
  socialInstagram: string;
  socialFacebook: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

/**
 * Gets site content from database if available, otherwise returns default from site.ts
 * This allows the CMS to work while keeping site.ts as fallback
 */
export async function getSiteContent(): Promise<SiteContentData> {
  try {
    const content = await prisma.siteContent.findUnique({
      where: { id: "main" },
    });

    if (content) {
      // Parse JSON fields and return
      return {
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroVideoEnabled: content.heroVideoEnabled ?? true,
        aboutName: content.aboutName,
        aboutRole: content.aboutRole,
        aboutImage: content.aboutImage,
        aboutBio: JSON.parse(content.aboutBio),
        aboutTimeline: JSON.parse(content.aboutTimeline),
        services: JSON.parse(content.services),
        testimonials: JSON.parse(content.testimonials),
        faqs: JSON.parse(content.faqs),
        whyChooseUs: JSON.parse(content.whyChooseUs),
        process: JSON.parse(content.process),
        footerDesc: content.footerDesc,
        contactWhatsapp: content.contactWhatsapp,
        contactEmail: content.contactEmail,
        contactAddress: content.contactAddress,
        contactCity: content.contactCity,
        contactHours: content.contactHours,
        socialInstagram: content.socialInstagram,
        socialFacebook: content.socialFacebook,
        ctaTitle: content.ctaTitle,
        ctaSubtitle: content.ctaSubtitle,
        ctaButton: content.ctaButton,
      };
    }
  } catch (error) {
    console.error("Error loading content from database, using fallback:", error);
  }

  // Fallback to site.ts
  return {
    heroTitle: siteContent.hero.title,
    heroSubtitle: siteContent.hero.subtitle,
    heroVideoEnabled: true,
    aboutName: "Dra. Aldana García Eldik",
    aboutRole: "Abogada - Fundadora de ELIGE",
    aboutImage: "/EstudioFrentePerfil.jpeg",
    aboutBio: [
      "Me recibí de abogada en diciembre de 2018 y desde los 18 años trabajé en el mismo estudio jurídico, donde adquirí una sólida formación y experiencia práctica en diversas áreas del derecho.",
      "En diciembre de 2022, decidí independizarme y fundar ELIGE (Estudio Legal Integral García Eldik), con la visión de ofrecer un servicio legal cercano, empático y profesional.",
      "Cuento con aproximadamente 10 años de experiencia profesional, durante los cuales me especialicé en múltiples fueros: laboral, civil, previsional, asesoría a empresas, sucesiones y más.",
      "Mi enfoque se basa en escuchar activamente a cada cliente, entender su situación particular y diseñar la mejor estrategia para defender sus derechos.",
    ],
    aboutTimeline: [],
    services: siteContent.services,
    testimonials: siteContent.testimonials,
    faqs: siteContent.faqs,
    whyChooseUs: siteContent.whyChooseUs,
    process: siteContent.process,
    footerDesc: siteContent.footer.description,
    contactWhatsapp: siteContent.contact.whatsapp,
    contactEmail: siteContent.contact.email,
    contactAddress: siteContent.contact.address,
    contactCity: siteContent.contact.city,
    contactHours: siteContent.contact.hours,
    socialInstagram: siteContent.social.instagram,
    socialFacebook: siteContent.social.facebook,
    ctaTitle: siteContent.ctaSection.title,
    ctaSubtitle: siteContent.ctaSection.subtitle,
    ctaButton: siteContent.ctaSection.button,
  };
}

/**
 * Client-side version that fetches from API
 */
export async function getSiteContentClient(): Promise<SiteContentData | null> {
  try {
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    
    if (data.exists === false) {
      return null;
    }
    
    return data as SiteContentData;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}
