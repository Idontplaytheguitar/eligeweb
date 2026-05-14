"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BuyButtonProps {
  workshopId: string;
  workshopTitle: string;
}

export function BuyButton({ workshopId }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Completá tu nombre y email para recibir el material.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError(data.error || "Error al procesar el pago");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBuy} className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium">Nombre</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
        <p className="text-xs text-muted-foreground">A este email enviamos el link de descarga.</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <ShoppingCart className="h-5 w-5 mr-2" />
        )}
        Comprar ahora
      </Button>
    </form>
  );
}
