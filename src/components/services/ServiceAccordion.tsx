"use client";

import { MessageCircle, Briefcase, Scale, Users, FileText, Car, ShieldCheck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Scale,
  Users,
  FileText,
  Car,
  ShieldCheck,
};

export function ServiceAccordion() {
  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {siteContent.services.map((service, index) => {
          const Icon = iconMap[service.icon] || Scale;
          return (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <AccordionItem
                value={service.id}
                className="border rounded-lg px-4 bg-card shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-foreground">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="pl-16 space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {service.fullDescription}
                    </p>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        ¿Qué incluye?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.includes.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        ¿Para quién?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {service.forWho}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button asChild>
                        <a
                          href={siteContent.contact.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Consultar por este servicio
                        </a>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
    </div>
  );
}
