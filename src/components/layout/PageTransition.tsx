"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayContent, setDisplayContent] = useState(children);

  useEffect(() => {
    setDisplayContent(children);
  }, [children]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {displayContent}
    </motion.div>
  );
}
