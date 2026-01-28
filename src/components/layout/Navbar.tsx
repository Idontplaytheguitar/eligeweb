"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { siteContent } from "@/content/site";
import type { NavItem } from "@/types";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check" }),
        });
        const data = await res.json();
        setIsAdmin(data.authenticated);

        // Fetch unseen count if authenticated
        if (data.authenticated) {
          const countRes = await fetch("/api/admin/mensajes?action=count");
          const countData = await countRes.json();
          setUnseenCount(countData.unseenCount || 0);
        }
      } catch {
        setIsAdmin(false);
      }
    };
    checkAuth();

    // Poll for new messages every 30 seconds if admin
    const interval = setInterval(() => {
      if (isAdmin) {
        fetch("/api/admin/mensajes?action=count")
          .then(res => res.json())
          .then(data => setUnseenCount(data.unseenCount || 0))
          .catch(() => {});
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-header backdrop-blur supports-[backdrop-filter]:bg-header/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Image
              src="/Logo.png"
              alt={siteContent.fullName}
              width={140}
              height={50}
              className="h-12 w-auto transition-opacity group-hover:opacity-90"
              priority
            />
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteContent.navigation.map((item: NavItem) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium transition-colors group"
              >
                <span className={`relative z-10 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin" title="Admin" className="relative group">
                  <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                    <Settings className="h-6 w-6" />
                  </motion.div>
                  {unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unseenCount > 9 ? '9+' : unseenCount}
                    </span>
                  )}
                </Link>
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild>
              <a
                href={siteContent.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(300px,88vw)] sm:max-w-sm">
            <div className="flex flex-col gap-6 px-5 pt-2 pb-6">
              <Link href="/" className="flex items-center gap-2 pr-10 self-start" onClick={() => setIsOpen(false)}>
                <Image
                  src="/Logo.png"
                  alt={siteContent.fullName}
                  width={140}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
              <nav className="flex flex-col gap-4">
                {siteContent.navigation.map((item: NavItem, index) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={`text-lg font-medium transition-all hover:text-primary hover:translate-x-1 inline-block ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {item.name}
                          {isActive && <span className="ml-2 text-primary">•</span>}
                        </Link>
                      </SheetClose>
                    </motion.div>
                  );
                })}
                {isAdmin && (
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary flex items-center gap-2"
                    >
                      <Settings className="h-6 w-6" />
                      Admin
                    </Link>
                  </SheetClose>
                )}
              </nav>
              <Button asChild className="mt-4">
                <a
                  href={siteContent.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Consultar por WhatsApp
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
