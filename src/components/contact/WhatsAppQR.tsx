"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

interface WhatsAppQRProps {
  whatsappLink: string;
}

export function WhatsAppQR({ whatsappLink }: WhatsAppQRProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(whatsappLink, {
          width: 200,
          margin: 2,
          color: {
            dark: "#1e3a5f",
            light: "#ffffff",
          },
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQR();
  }, [whatsappLink]);

  if (!qrDataUrl) {
    return (
      <div className="w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Cargando QR...</span>
      </div>
    );
  }

  return (
    <Image
      src={qrDataUrl}
      alt="QR Code para WhatsApp"
      className="rounded-lg shadow-sm"
      width={200}
      height={200}
      unoptimized
    />
  );
}
