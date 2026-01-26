"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Scale,
  Users,
  FileText,
  Car,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { siteContent } from "@/content/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Scale,
  Users,
  FileText,
  Car,
  ShieldCheck,
};

export function ServicesGrid() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Áreas de práctica
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Brindamos asesoramiento integral en diversas ramas del derecho, siempre con un enfoque humano y profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteContent.services
            .filter((service) => service.id !== "transito")
            .map((service, index) => {
            const Icon = iconMap[service.icon] || Scale;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/servicios#${service.id}`}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 cursor-pointer group">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {service.shortDescription}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/servicios"
            className="inline-flex items-center text-primary font-medium hover:underline underline-offset-4"
          >
            Ver todos los servicios →
          </Link>
        </div>
      </div>
    </section>
  );
}
