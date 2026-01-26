# ELIGE - Estudio Legal Integral García Eldik

Sitio web profesional para el estudio jurídico ELIGE, desarrollado con Next.js 14, TypeScript, Tailwind CSS y shadcn/ui.

## Requisitos

- Node.js 18.17 o superior
- npm 9 o superior

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar build de producción
npm start
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

```
src/
├── app/                    # Páginas (App Router)
│   ├── page.tsx           # Home
│   ├── servicios/         # Página de servicios
│   ├── equipo/            # Página del equipo
│   ├── contacto/          # Página de contacto
│   ├── privacidad/        # Política de privacidad
│   └── gracias/           # Página post-formulario
├── components/            # Componentes React
│   ├── layout/            # Navbar, Footer, WhatsApp button
│   ├── home/              # Componentes del home
│   ├── services/          # Componentes de servicios
│   ├── team/              # Componentes del equipo
│   ├── contact/           # Formulario de contacto
│   └── ui/                # Componentes shadcn/ui
├── content/
│   └── site.ts            # ⭐ ARCHIVO PRINCIPAL DE CONTENIDO
└── lib/
    ├── utils.ts           # Utilidades
    └── schemas.ts         # Esquemas de validación Zod
```

## Editar Contenido

Todo el contenido del sitio está centralizado en un único archivo:

📁 **`src/content/site.ts`**

Desde este archivo podés editar:

- **Información del estudio**: nombre, tagline, descripción
- **Datos de contacto**: WhatsApp, email, dirección, horarios
- **Redes sociales**: Instagram, Facebook
- **Servicios**: agregar, quitar o modificar servicios
- **Por qué elegirnos**: razones destacadas
- **Proceso de trabajo**: pasos del proceso
- **Testimonios**: opiniones de clientes
- **Preguntas frecuentes**: FAQs
- **Equipo**: miembros del equipo
- **Textos del CTA**: llamadas a la acción
- **SEO**: título, descripción, keywords

### Ejemplo: Agregar un nuevo servicio

```typescript
// En src/content/site.ts
services: [
  // ... servicios existentes
  {
    id: "nuevo-servicio",
    title: "Nuevo Servicio",
    shortDescription: "Descripción corta...",
    fullDescription: "Descripción completa...",
    includes: ["Item 1", "Item 2", "Item 3"],
    forWho: "Para quién es este servicio...",
    icon: "Scale", // Nombre del ícono de Lucide
  },
],
```

### Íconos disponibles

Los íconos provienen de [Lucide Icons](https://lucide.dev/icons/). Para agregar un nuevo ícono:

1. Buscá el ícono en lucide.dev
2. Agregá el nombre al array `iconMap` en el componente correspondiente
3. Usá ese nombre en `site.ts`

## Cambiar Colores

Los colores se definen en:

📁 **`src/app/globals.css`**

Variables principales:

```css
:root {
  --primary: #2A3554;           /* Navy principal */
  --primary-foreground: #FFFFFF;
  --secondary: #E3E7F0;         /* Fondo secundario */
  --muted-foreground: #858DA5;  /* Texto muted */
  --foreground: #2A3554;        /* Texto principal */
  --background: #FFFFFF;        /* Fondo */
}
```

## Conectar el Formulario de Contacto

El formulario actualmente guarda en consola y redirige a `/gracias`. Para conectarlo a un servicio real:

### Opción 1: Formspree (recomendado, sin código)

1. Crear cuenta en [formspree.io](https://formspree.io)
2. Crear un nuevo formulario y copiar el ID
3. Editar `src/components/contact/ContactForm.tsx`:

```typescript
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  
  const response = await fetch("https://formspree.io/f/TU_FORM_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    router.push("/gracias");
  } else {
    // Manejar error
  }
  
  setIsSubmitting(false);
};
```

### Opción 2: Resend (con API route)

1. Crear cuenta en [resend.com](https://resend.com)
2. Obtener API key
3. Agregar a `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

4. Crear `src/app/api/contact/route.ts`:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, phone, message } = await request.json();

  await resend.emails.send({
    from: "web@tudominio.com",
    to: "contacto@elige.com.ar",
    subject: `Nueva consulta de ${name}`,
    html: `
      <h2>Nueva consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `,
  });

  return Response.json({ success: true });
}
```

5. Actualizar `ContactForm.tsx` para usar `/api/contact`

## Agregar Logo

Colocar los archivos del logo en:

```
public/brand/
├── elige-logo.png              # Logo con fondo
├── elige-logo-transparent.png  # Logo sin fondo (usado en header/footer)
└── og-image.png                # Imagen para redes sociales (1200x630)
```

## Agregar Fotos del Equipo

Colocar las fotos en:

```
public/team/
├── profesional-1.jpg
├── profesional-2.jpg
└── profesional-3.jpg
```

Y actualizar las rutas en `src/content/site.ts` → `team`.

## Google Analytics

Para agregar Google Analytics, descomentar el código en `src/app/layout.tsx` y reemplazar `G-XXXXXXXXXX` con tu ID de medición.

## Mapa de Google

Para agregar el mapa en la página de contacto:

1. Obtener el código embed desde Google Maps
2. Descomentar la sección del mapa en `src/app/contacto/page.tsx`
3. Pegar la URL del iframe

## Deploy en Vercel

1. Subir el proyecto a GitHub
2. Conectar el repositorio en [vercel.com](https://vercel.com)
3. Configurar variables de entorno si es necesario
4. Deploy automático

## Tecnologías Utilizadas

- [Next.js 14](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Lucide Icons](https://lucide.dev/) - Íconos
- [Zod](https://zod.dev/) - Validación
- [React Hook Form](https://react-hook-form.com/) - Formularios

## Soporte

Para consultas técnicas sobre el sitio, contactar al desarrollador.
