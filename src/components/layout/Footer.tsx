import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteContent } from "@/content/site";
import type { NavItem, ServiceItem } from "@/types";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Image
              src="/Logo.png"
              alt={siteContent.fullName}
              width={140}
              height={50}
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {siteContent.footer.description}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={siteContent.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteContent.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Navegación</h3>
            <nav className="flex flex-col gap-2">
              {siteContent.navigation.map((item: NavItem) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/privacidad"
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Política de Privacidad
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Servicios</h3>
            <nav className="flex flex-col gap-2">
              {siteContent.services.slice(0, 6).map((service: ServiceItem) => (
                <Link
                  key={service.id}
                  href={`/servicios#${service.id}`}
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {service.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contacto</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${siteContent.contact.whatsapp.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {siteContent.contact.whatsapp}
              </a>
              <a
                href={`mailto:${siteContent.contact.email}`}
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {siteContent.contact.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{siteContent.contact.city}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{siteContent.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
          <p>{siteContent.footer.copyright}</p>
          <p>
            Diseñado con compromiso para nuestros clientes.
          </p>
        </div>
      </div>
    </footer>
  );
}
