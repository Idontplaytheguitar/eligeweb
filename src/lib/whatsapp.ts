import { siteContent } from "@/content/site";

const DEFAULT_MESSAGE = "Hola, quisiera hacer una consulta legal.";

/**
 * Builds a WhatsApp wa.me URL with an optional pre-filled message.
 * Uses the number from site content; message defaults to a generic legal consultation.
 */
export function getWhatsAppUrl(message?: string): string {
  const raw = siteContent.contact.whatsapp;
  const number = raw.replace(/\D/g, "");
  const text = message ?? DEFAULT_MESSAGE;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
