"use client";

import { motion } from "framer-motion";
import { MessageCircle, Target, Handshake } from "lucide-react";
import { siteContent } from "@/content/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Target,
  Handshake,
};

export function ProcessSteps() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ¿Cómo trabajamos?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Un proceso simple y transparente para resolver tu caso.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {siteContent.process.map((step, index) => {
              const Icon = iconMap[step.icon] || MessageCircle;
              return (
                <motion.div
                  key={step.step}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mt-2">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
