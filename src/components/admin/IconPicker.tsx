"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Lista curada de íconos más útiles para el sitio
const AVAILABLE_ICONS = [
  // Personas y usuarios
  "User", "Users", "UserCheck", "UserCircle", "UserPlus",
  // Negocios y oficina
  "Briefcase", "Building", "Building2", "BriefcaseBusiness",
  // Legal y justicia
  "Scale", "Gavel", "FileText", "FileSignature", "ScrollText",
  // Comunicación
  "MessageCircle", "MessageSquare", "Mail", "Phone", "PhoneCall",
  // Premios y reconocimientos
  "Award", "Trophy", "Medal", "Star", "BadgeCheck",
  // Documentos
  "File", "FileCheck", "FilePlus", "FolderOpen", "Folders",
  // Protección y seguridad
  "Shield", "ShieldCheck", "Lock", "Key", "ShieldAlert",
  // Transporte
  "Car", "Truck", "Bus", "Bike", "Plane",
  // Tiempo
  "Clock", "Calendar", "CalendarDays", "Timer", "Hourglass",
  // Ubicación
  "MapPin", "Map", "Navigation", "Compass", "Home",
  // Acciones
  "Check", "CheckCircle", "CheckCircle2", "X", "XCircle",
  // Flechas y dirección
  "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Target",
  // Proceso
  "Route", "GitBranch", "Workflow", "ListChecks", "ClipboardCheck",
  // Dinero
  "DollarSign", "BadgeDollarSign", "CreditCard", "Wallet", "Coins",
  // Educación
  "GraduationCap", "BookOpen", "School", "Library", "Presentation",
  // Herramientas
  "Wrench", "Settings", "Tool", "Hammer", "Pencil",
  // Emociones y gestos
  "Heart", "ThumbsUp", "Handshake", "UserHeart", "Smile",
  // Naturaleza
  "Leaf", "Tree", "Sun", "Moon", "Cloud",
  // Varios
  "HelpCircle", "Info", "AlertCircle", "AlertTriangle", "Bell",
  "Search", "Filter", "Tag", "Bookmark", "Archive",
  "Send", "Share2", "Download", "Upload", "Eye",
  "Edit", "Trash2", "Plus", "Minus", "Save",
  "Layout", "Grid", "List", "Layers", "Package",
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = AVAILABLE_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch("");
  };

  // Obtener el ícono actual
  const IconComponent = value && (LucideIcons as any)[value] 
    ? (LucideIcons as any)[value] 
    : LucideIcons.HelpCircle;

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background flex-1">
            <IconComponent className="h-5 w-5 text-primary" />
            <span className="text-sm">{value || "Seleccioná un ícono"}</span>
          </div>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              Seleccionar
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Seleccionar ícono</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="Buscar íconos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            
            <div className="h-[50vh] overflow-y-auto border rounded-lg p-4">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4">
                {filteredIcons.map((iconName) => {
                  const Icon = (LucideIcons as any)[iconName];
                  if (!Icon) return null;
                  
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelectIcon(iconName)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors ${
                        value === iconName ? "bg-primary/10 ring-2 ring-primary" : ""
                      }`}
                      title={iconName}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-[10px] text-center break-all line-clamp-2">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {filteredIcons.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <LucideIcons.Search className="h-8 w-8 mb-2 opacity-50" />
                  <p>No se encontraron íconos</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
