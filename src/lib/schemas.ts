import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre es demasiado largo" }),
  email: z
    .string()
    .email({ message: "Ingresá un email válido" }),
  phone: z
    .string()
    .min(8, { message: "Ingresá un número de teléfono válido" })
    .max(20, { message: "El número es demasiado largo" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Ingresá solo números y caracteres válidos" })
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .min(8, { message: "Ingresá un número de WhatsApp válido" })
    .max(20, { message: "El número es demasiado largo" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Ingresá solo números y caracteres válidos" })
    .optional()
    .or(z.literal("")),
  area: z
    .string()
    .optional(),
  message: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres" })
    .max(1000, { message: "El mensaje es demasiado largo" }),
}).refine((data) => data.phone || data.whatsapp, {
  message: "Debés proporcionar al menos un teléfono o WhatsApp",
  path: ["phone"],
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
