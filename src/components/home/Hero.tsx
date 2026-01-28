"use client";

import Link from "next/link";
import { MessageCircle, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";

interface HeroProps {
  videoEnabled?: boolean;
}

export function Hero({ videoEnabled = true }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Video background - mobile hidden, desktop subtle, respeta toggle del admin */}
      {videoEnabled && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-10 hidden md:block video-fade-loop"
        >
          <source src="/EstudioEntradaVideo.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3E7F020_1px,transparent_1px),linear-gradient(to_bottom,#E3E7F020_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/20 to-transparent" />
      
      <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-36">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
              {siteContent.name} — {siteContent.fullName}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {siteContent.hero.title}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {siteContent.hero.subtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button asChild size="lg" className="text-base">
              <a
                href={siteContent.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {siteContent.hero.ctaPrimary}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/contacto" className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {siteContent.hero.ctaSecondary}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
