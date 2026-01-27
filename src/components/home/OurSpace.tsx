"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function OurSpace() {
  const images = [
    { src: "/EstudioFrente.jpeg", alt: "Frente del estudio ELIGE" },
    { src: "/EstudioDentroDesk.jpeg", alt: "Interior del estudio - Escritorio" },
    { src: "/EstudioFrenteLejos.jpeg", alt: "Vista externa del estudio" },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Nuestro espacio</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Un lugar pensado para vos
          </h2>
          <p className="text-muted-foreground text-lg">
            Te recibimos en un espacio cómodo y profesional, diseñado para que te sientas 
            tranquilo y acompañado en cada consulta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col items-center gap-2 p-6 bg-muted/50 rounded-lg border">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Av. Directorio 2543</p>
              <p className="text-sm text-muted-foreground">Capital Federal, Buenos Aires, Argentina</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
