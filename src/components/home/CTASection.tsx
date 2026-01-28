"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function CTASection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {siteContent.ctaSection.title}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {siteContent.ctaSection.subtitle}
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base font-semibold"
            >
              <a
                href={getWhatsAppUrl("Hola, me interesa contactarlos. Quisiera más información.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {siteContent.ctaSection.button}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
