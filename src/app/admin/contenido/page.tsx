"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Save,
  Home,
  User,
  Briefcase,
  MessageSquare,
  HelpCircle,
  Award,
  Route,
  Phone,
  Layout,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { IconPicker } from "@/components/admin/IconPicker";
import Image from "next/image";

type TabId = "hero" | "about" | "services" | "testimonials" | "faqs" | "whychoose" | "process" | "contact" | "footer";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutName: string;
  aboutRole: string;
  aboutImage: string;
  aboutBio: string[];
  aboutTimeline: TimelineItem[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  whyChooseUs: WhyChooseUsItem[];
  process: ProcessStep[];
  footerDesc: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAddress: string;
  contactCity: string;
  contactHours: string;
  socialInstagram: string;
  socialFacebook: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

interface TimelineItem {
  title: string;
  date: string;
  description: string;
  icon: string;
}

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  forWho: string;
  icon: string;
}

interface Testimonial {
  initials: string;
  text: string;
  location: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: "hero", label: "Hero / Inicio", icon: Home },
  { id: "about", label: "Quién Soy", icon: User },
  { id: "services", label: "Servicios", icon: Briefcase },
  { id: "testimonials", label: "Testimonios", icon: MessageSquare },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "whychoose", label: "Por qué elegirnos", icon: Award },
  { id: "process", label: "Proceso", icon: Route },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "footer", label: "Footer & CTA", icon: Layout },
];

export default function AdminContenidoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      
      if (data.exists === false) {
        toast.error("El contenido aún no está inicializado. Ejecutá el seed primero.");
        setContent(null);
      } else {
        setContent(data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Error al cargar el contenido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuthAndFetch = useCallback(async () => {
    try {
      const authRes = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const authData = await authRes.json();

      if (!authData.authenticated) {
        router.push("/admin");
        return;
      }

      await fetchContent();
    } catch {
      router.push("/admin");
    }
  }, [router, fetchContent]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        toast.success("Contenido guardado correctamente");
        setHasChanges(false);
      } else {
        toast.error("Error al guardar el contenido");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (updates: Partial<SiteContent>) => {
    if (!content) return;
    setContent({ ...content, ...updates });
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="border-b bg-header">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Manejo de contenido</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                El contenido del sitio no está inicializado. Ejecutá el comando de seed primero.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-header sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Manejo de contenido</h1>
            {hasChanges && (
              <span className="text-sm text-orange-600 dark:text-orange-400">
                • Cambios sin guardar
              </span>
            )}
          </div>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Guardar cambios
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with tabs */}
          <aside className="lg:w-64">
            <div className="lg:sticky lg:top-24 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content area */}
          <main className="flex-1">
            {activeTab === "hero" && <HeroTab content={content} updateContent={updateContent} />}
            {activeTab === "about" && <AboutTab content={content} updateContent={updateContent} />}
            {activeTab === "services" && <ServicesTab content={content} updateContent={updateContent} />}
            {activeTab === "testimonials" && <TestimonialsTab content={content} updateContent={updateContent} />}
            {activeTab === "faqs" && <FAQsTab content={content} updateContent={updateContent} />}
            {activeTab === "whychoose" && <WhyChooseTab content={content} updateContent={updateContent} />}
            {activeTab === "process" && <ProcessTab content={content} updateContent={updateContent} />}
            {activeTab === "contact" && <ContactTab content={content} updateContent={updateContent} />}
            {activeTab === "footer" && <FooterTab content={content} updateContent={updateContent} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// Hero Tab Component
function HeroTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero / Inicio</CardTitle>
        <CardDescription>
          Editá el título y subtítulo principal que aparece en la página de inicio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Título principal</label>
          <Input
            value={content.heroTitle}
            onChange={(e) => updateContent({ heroTitle: e.target.value })}
            placeholder="Título del hero"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subtítulo</label>
          <Textarea
            value={content.heroSubtitle}
            onChange={(e) => updateContent({ heroSubtitle: e.target.value })}
            placeholder="Subtítulo del hero"
            rows={3}
          />
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
          <h2 className="text-2xl font-bold mb-2">{content.heroTitle}</h2>
          <p className="text-muted-foreground">{content.heroSubtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// About Tab Component
function AboutTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  const [bioText, setBioText] = useState(content.aboutBio.join("\n\n"));

  const handleBioChange = (text: string) => {
    setBioText(text);
    const paragraphs = text.split("\n\n").filter(p => p.trim());
    updateContent({ aboutBio: paragraphs });
  };

  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      title: "Nuevo evento",
      date: "",
      description: "",
      icon: "Briefcase",
    };
    updateContent({ aboutTimeline: [...content.aboutTimeline, newItem] });
  };

  const updateTimelineItem = (index: number, updates: Partial<TimelineItem>) => {
    const newTimeline = [...content.aboutTimeline];
    newTimeline[index] = { ...newTimeline[index], ...updates };
    updateContent({ aboutTimeline: newTimeline });
  };

  const removeTimelineItem = (index: number) => {
    updateContent({ aboutTimeline: content.aboutTimeline.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>Datos que aparecen en la página "Quién Soy"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <Input
              value={content.aboutName}
              onChange={(e) => updateContent({ aboutName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rol/Título</label>
            <Input
              value={content.aboutRole}
              onChange={(e) => updateContent({ aboutRole: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Imagen de perfil</label>
            {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "estudioelige"}
                onSuccess={(result: unknown) => {
                  const info = (result as { info?: { secure_url?: string } })?.info;
                  if (info?.secure_url) {
                    updateContent({ aboutImage: info.secure_url });
                  }
                }}
              >
                {({ open }: { open: () => void }) => (
                  <>
                    {content.aboutImage && (
                      <div
                        className="relative w-48 h-48 rounded-lg overflow-hidden border cursor-pointer group mb-3"
                        onClick={() => open()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && open()}
                      >
                        <Image
                          src={content.aboutImage}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-sm font-medium">Cambiar imagen</span>
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => open()}
                    >
                      {content.aboutImage ? "Cambiar imagen" : "Subir imagen"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Subí una imagen desde tu computadora
                    </p>
                  </>
                )}
              </CldUploadWidget>
            ) : (
              <>
                {content.aboutImage && (
                  <div className="mb-3 relative w-48 h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={content.aboutImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <Input
                  type="url"
                  value={content.aboutImage ?? ""}
                  onChange={(e) => updateContent({ aboutImage: e.target.value || "" })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Pegá la URL de la imagen. Para subir desde el equipo, configurá NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en el entorno. En Vercel: Settings → Environment Variables, agregá esas variables y volvé a desplegar.
                </p>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Biografía (separar párrafos con doble enter)</label>
            <Textarea
              value={bioText}
              onChange={(e) => handleBioChange(e.target.value)}
              rows={8}
              placeholder="Primer párrafo de la biografía...

Segundo párrafo..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trayectoria / Timeline</CardTitle>
              <CardDescription>Eventos importantes en la carrera profesional</CardDescription>
            </div>
            <Button onClick={addTimelineItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.aboutTimeline.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Título del evento</label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, { title: e.target.value })}
                        placeholder="Fundadora de ELIGE"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha</label>
                      <Input
                        value={item.date}
                        onChange={(e) => updateTimelineItem(index, { date: e.target.value })}
                        placeholder="Diciembre 2022 - Presente"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Descripción</label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateTimelineItem(index, { description: e.target.value })}
                        placeholder="Descripción del evento o logro"
                        rows={2}
                      />
                    </div>
                    <IconPicker
                      label="Ícono"
                      value={item.icon}
                      onChange={(iconName) => updateTimelineItem(index, { icon: iconName })}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimelineItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Services Tab Component (continued in next message due to length)
function ServicesTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: "Nuevo servicio",
      shortDescription: "",
      fullDescription: "",
      includes: [],
      forWho: "",
      icon: "Briefcase",
    };
    updateContent({ services: [...content.services, newService] });
    setEditingIndex(content.services.length);
  };

  const updateService = (index: number, updates: Partial<Service>) => {
    const newServices = [...content.services];
    newServices[index] = { ...newServices[index], ...updates };
    updateContent({ services: newServices });
  };

  const removeService = (index: number) => {
    updateContent({ services: content.services.filter((_, i) => i !== index) });
  };

  const updateServiceIncludes = (index: number, text: string) => {
    const includes = text.split("\n").filter(item => item.trim());
    updateService(index, { includes });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Servicios</CardTitle>
            <CardDescription>Gestioná los servicios que ofrecés</CardDescription>
          </div>
          <Button onClick={addService} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar servicio
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.services.map((service, index) => (
          <Card key={service.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    {editingIndex === index ? "Cerrar" : "Editar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              {editingIndex === index && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título del servicio</label>
                    <Input
                      value={service.title}
                      onChange={(e) => updateService(index, { title: e.target.value })}
                      placeholder="Asesoramiento Legal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción corta</label>
                    <Textarea
                      value={service.shortDescription}
                      onChange={(e) => updateService(index, { shortDescription: e.target.value })}
                      placeholder="Descripción breve del servicio"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción completa</label>
                    <Textarea
                      value={service.fullDescription}
                      onChange={(e) => updateService(index, { fullDescription: e.target.value })}
                      placeholder="Descripción detallada del servicio"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Incluye (uno por línea)</label>
                    <Textarea
                      value={service.includes.join("\n")}
                      onChange={(e) => updateServiceIncludes(index, e.target.value)}
                      placeholder="Item 1&#10;Item 2&#10;Item 3"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">¿Para quién está dirigido?</label>
                    <Textarea
                      value={service.forWho}
                      onChange={(e) => updateService(index, { forWho: e.target.value })}
                      placeholder="Empresas, particulares, etc."
                      rows={2}
                    />
                  </div>
                  <IconPicker
                    label="Ícono"
                    value={service.icon}
                    onChange={(iconName) => updateService(index, { icon: iconName })}
                  />
                </div>
              )}
              
              {editingIndex !== index && (
                <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// Testimonials Tab
function TestimonialsTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      initials: "",
      text: "",
      location: "",
    };
    updateContent({ testimonials: [...content.testimonials, newTestimonial] });
  };

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const newTestimonials = [...content.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], ...updates };
    updateContent({ testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    updateContent({ testimonials: content.testimonials.filter((_, i) => i !== index) });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Testimonios</CardTitle>
            <CardDescription>Opiniones de clientes satisfechos</CardDescription>
          </div>
          <Button onClick={addTestimonial} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Iniciales</label>
                    <Input
                      value={testimonial.initials}
                      onChange={(e) => updateTestimonial(index, { initials: e.target.value })}
                      placeholder="M.G."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Testimonio</label>
                    <Textarea
                      value={testimonial.text}
                      onChange={(e) => updateTestimonial(index, { text: e.target.value })}
                      placeholder="Opinión del cliente sobre el servicio"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ubicación</label>
                    <Input
                      value={testimonial.location}
                      onChange={(e) => updateTestimonial(index, { location: e.target.value })}
                      placeholder="Capital Federal"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTestimonial(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// FAQs Tab
function FAQsTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  const addFAQ = () => {
    const newFAQ: FAQ = {
      question: "",
      answer: "",
    };
    updateContent({ faqs: [...content.faqs, newFAQ] });
  };

  const updateFAQ = (index: number, updates: Partial<FAQ>) => {
    const newFAQs = [...content.faqs];
    newFAQs[index] = { ...newFAQs[index], ...updates };
    updateContent({ faqs: newFAQs });
  };

  const removeFAQ = (index: number) => {
    updateContent({ faqs: content.faqs.filter((_, i) => i !== index) });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preguntas Frecuentes</CardTitle>
            <CardDescription>FAQs que aparecen en la página principal</CardDescription>
          </div>
          <Button onClick={addFAQ} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pregunta</label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, { question: e.target.value })}
                      placeholder="¿Cuál es tu pregunta?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Respuesta</label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, { answer: e.target.value })}
                      placeholder="La respuesta a la pregunta"
                      rows={3}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFAQ(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// WhyChoose Tab
function WhyChooseTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  const addItem = () => {
    const newItem: WhyChooseUsItem = {
      title: "",
      description: "",
      icon: "Award",
    };
    updateContent({ whyChooseUs: [...content.whyChooseUs, newItem] });
  };

  const updateItem = (index: number, updates: Partial<WhyChooseUsItem>) => {
    const newItems = [...content.whyChooseUs];
    newItems[index] = { ...newItems[index], ...updates };
    updateContent({ whyChooseUs: newItems });
  };

  const removeItem = (index: number) => {
    updateContent({ whyChooseUs: content.whyChooseUs.filter((_, i) => i !== index) });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Por qué elegirnos</CardTitle>
            <CardDescription>Ventajas y beneficios de trabajar con el estudio</CardDescription>
          </div>
          <Button onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.whyChooseUs.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(index, { title: e.target.value })}
                      placeholder="Experiencia comprobada"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      placeholder="Explicación de la ventaja o beneficio"
                      rows={2}
                    />
                  </div>
                  <IconPicker
                    label="Ícono"
                    value={item.icon}
                    onChange={(iconName) => updateItem(index, { icon: iconName })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// Process Tab
function ProcessTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  const addStep = () => {
    const newStep: ProcessStep = {
      step: content.process.length + 1,
      title: "",
      description: "",
      icon: "MessageCircle",
    };
    updateContent({ process: [...content.process, newStep] });
  };

  const updateStep = (index: number, updates: Partial<ProcessStep>) => {
    const newSteps = [...content.process];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateContent({ process: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = content.process
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, step: i + 1 }));
    updateContent({ process: newSteps });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Proceso de trabajo</CardTitle>
            <CardDescription>Pasos que seguís con los clientes</CardDescription>
          </div>
          <Button onClick={addStep} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar paso
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.process.map((step, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título del paso</label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {step.step}
                      </span>
                      <Input
                        value={step.title}
                        onChange={(e) => updateStep(index, { title: e.target.value })}
                        placeholder="Consulta inicial"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateStep(index, { description: e.target.value })}
                      placeholder="Descripción del paso del proceso"
                      rows={2}
                    />
                  </div>
                  <IconPicker
                    label="Ícono"
                    value={step.icon}
                    onChange={(iconName) => updateStep(index, { icon: iconName })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// Contact Tab
function ContactTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de contacto</CardTitle>
          <CardDescription>Datos de contacto del estudio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <Input
              value={content.contactWhatsapp}
              onChange={(e) => updateContent({ contactWhatsapp: e.target.value })}
              placeholder="+54 11 1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={content.contactEmail}
              onChange={(e) => updateContent({ contactEmail: e.target.value })}
              placeholder="contacto@elige.com.ar"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dirección</label>
            <Input
              value={content.contactAddress}
              onChange={(e) => updateContent({ contactAddress: e.target.value })}
              placeholder="Calle 123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad</label>
            <Input
              value={content.contactCity}
              onChange={(e) => updateContent({ contactCity: e.target.value })}
              placeholder="Capital Federal, Buenos Aires, Argentina"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Horarios</label>
            <Input
              value={content.contactHours}
              onChange={(e) => updateContent({ contactHours: e.target.value })}
              placeholder="Lunes a Viernes: 9:00 - 19:00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes sociales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Instagram</label>
            <Input
              value={content.socialInstagram}
              onChange={(e) => updateContent({ socialInstagram: e.target.value })}
              placeholder="https://www.instagram.com/..."
              type="url"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Facebook</label>
            <Input
              value={content.socialFacebook}
              onChange={(e) => updateContent({ socialFacebook: e.target.value })}
              placeholder="https://www.facebook.com/..."
              type="url"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Footer Tab
function FooterTab({ content, updateContent }: { content: SiteContent; updateContent: (u: Partial<SiteContent>) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Contenido que aparece en el pie de página</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">Descripción del footer</label>
            <Textarea
              value={content.footerDesc}
              onChange={(e) => updateContent({ footerDesc: e.target.value })}
              placeholder="Texto descriptivo para el footer"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sección CTA (Call to Action)</CardTitle>
          <CardDescription>Llamado a la acción que aparece en varias páginas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <Input
              value={content.ctaTitle}
              onChange={(e) => updateContent({ ctaTitle: e.target.value })}
              placeholder="¿Tenés una consulta legal?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtítulo</label>
            <Input
              value={content.ctaSubtitle}
              onChange={(e) => updateContent({ ctaSubtitle: e.target.value })}
              placeholder="Contactanos hoy."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Texto del botón</label>
            <Input
              value={content.ctaButton}
              onChange={(e) => updateContent({ ctaButton: e.target.value })}
              placeholder="Escribinos por WhatsApp"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
