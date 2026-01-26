"use client";

import { motion } from "framer-motion";
import {
  Award,
  UserCheck,
  Clock,
  BadgeDollarSign,
  MessageSquare,
} from "lucide-react";
import { siteContent } from "@/content/site";
import type { WhyChooseUsItem } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  UserCheck,
  Clock,
  BadgeDollarSign,
  MessageSquare,
};

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ¿Por qué elegir ELIGE?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No somos un estudio más. Nos diferenciamos por nuestra forma de trabajar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {siteContent.whyChooseUs.map((item: WhyChooseUsItem, index: number) => {
            const Icon = iconMap[item.icon] || Award;
            return (
              <motion.div
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
