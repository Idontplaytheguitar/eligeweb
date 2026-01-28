"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFloatingButton() {
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public-config")
      .then((res) => res.json())
      .then((data: { whatsappLink?: string }) => {
        const link = typeof data.whatsappLink === "string" && data.whatsappLink ? data.whatsappLink : "";
        setWhatsappLink(link);
      })
      .catch(() => setWhatsappLink(""));
  }, []);

  if (!whatsappLink) return null;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Contactar por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
      <motion.span
        className="absolute -top-1 -right-1 flex h-4 w-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366]"></span>
      </motion.span>
    </motion.a>
  );
}
