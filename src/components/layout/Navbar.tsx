"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { siteContent } from "@/content/site";
import type { NavItem } from "@/types";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      } catch {
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-header backdrop-blur supports-[backdrop-filter]:bg-header/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt={siteContent.fullName}
            width={140}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteContent.navigation.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin" title="Admin">
                <Settings className="h-6 w-6" />
              </Link>
            </Button>
          )}
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
                {siteContent.navigation.map((item: NavItem) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
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
