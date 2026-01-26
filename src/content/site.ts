export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  forWho: string;
  icon: string;
}

export interface Testimonial {
  initials: string;
  text: string;
  location: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface WorkingPrinciple {
  title: string;
  description: string;
}

export const siteContent: {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  seo: {
    url: string;
    description: string;
    keywords: string[];
  };
  contact: {
    whatsapp: string;
    whatsappLink: string;
    email: string;
    address: string;
    city: string;
    hours: string;
  };
  social: {
    instagram: string;
    facebook: string;
  };
  navigation: { name: string; href: string }[];
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: Service[];
  whyChooseUs: WhyChooseUsItem[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  team: TeamMember[];
  workingMethod: {
    title: string;
    description: string;
    principles: WorkingPrinciple[];
  };
  ctaSection: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  thanksPage: {
    title: string;
    message: string;
    ctaText: string;
  };
} = {
  name: "ELIGE",
  fullName: "Estudio Legal Integral García Eldik",
  tagline: "Asesoramiento legal claro, estratégico y humano.",
  description:
    "Somos un estudio jurídico con más de 10 años de experiencia. Nos especializamos en derecho laboral, civil, sucesorio, de familia y penal. Te acompañamos con empatía y profesionalismo.",

  seo: {
    url: "https://elige.com.ar",
    description:
      "ELIGE - Estudio Legal Integral García Eldik. Asesoramiento jurídico en Buenos Aires, Argentina. Especialistas en derecho laboral, civil, familia, sucesiones y más. Consulta gratuita.",
    keywords: [
      "abogados Buenos Aires",
      "estudio jurídico Argentina",
      "derecho laboral",
      "derecho civil",
      "sucesiones",
      "derecho de familia",
      "consulta legal",
      "abogados CABA",
    ],
  },

  contact: {
    whatsapp: "+54 11 5037-2749",
    whatsappLink: "https://wa.me/5491150372749?text=Hola,%20quisiera%20hacer%20una%20consulta%20legal.",
    email: "contacto@elige.com.ar",
    address: "[Dirección a completar]",
    city: "Capital Federal, Buenos Aires, Argentina",
    hours: "Lunes a Viernes: 9:00 - 19:00 | Sábados: 9:00 - 14:00",
  },

  social: {
    instagram: "https://www.instagram.com/estudiojuridico.elige/",
    facebook: "https://www.facebook.com/elige.y.asociados",
  },

  navigation: [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Quién Soy", href: "/quien-soy" },
    { name: "Agendar", href: "/agendar" },
    { name: "Blog", href: "/blog" },
    // { name: "Talleres", href: "/talleres" }, // DISABLED: Not ready for production yet
    { name: "Contacto", href: "/contacto" },
  ],

  hero: {
    title: "Asesoramiento legal claro, estratégico y humano.",
    subtitle:
      "Defendemos tus derechos con empatía y profesionalismo. Más de 10 años de experiencia nos respaldan.",
    ctaPrimary: "Consultar por WhatsApp",
    ctaSecondary: "Agendar consulta",
  },

  services: [
    {
      id: "laboral",
      title: "Derecho Laboral",
      shortDescription: "Despidos, accidentes de trabajo, enfermedades profesionales y reclamos laborales.",
      fullDescription:
        "Te asesoramos en todo lo relacionado con tu relación laboral. Desde despidos injustificados hasta accidentes de trabajo y enfermedades profesionales. Tramitamos reclamos ante el SECLO y la justicia laboral.",
      includes: [
        "Despidos con y sin causa",
        "Accidentes de trabajo (ART)",
        "Enfermedades profesionales",
        "Trabajo en negro",
        "Diferencias salariales",
        "Comisiones médicas",
      ],
      forWho: "Trabajadores en relación de dependencia, empleados despedidos, víctimas de accidentes laborales.",
      icon: "Briefcase",
    },
    {
      id: "civil",
      title: "Derecho Civil y Comercial",
      shortDescription: "Contratos, obligaciones, daños y perjuicios, y asesoramiento comercial.",
      fullDescription:
        "Brindamos asesoramiento integral en materia civil y comercial. Redacción y revisión de contratos, reclamos por daños, y representación en juicios civiles.",
      includes: [
        "Redacción de contratos",
        "Reclamos por daños y perjuicios",
        "Cobro de deudas",
        "Desalojos",
        "Usucapión",
        "Asesoramiento comercial",
      ],
      forWho: "Particulares, comerciantes, PyMEs, propietarios e inquilinos.",
      icon: "Scale",
    },
    {
      id: "familia",
      title: "Derecho de Familia",
      shortDescription: "Divorcios, alimentos, régimen de comunicación y cuidado personal.",
      fullDescription:
        "Acompañamos en los procesos familiares más sensibles con empatía y profesionalismo. Buscamos soluciones acordadas siempre que sea posible.",
      includes: [
        "Divorcios (express y contenciosos)",
        "Alimentos",
        "Cuidado personal de hijos",
        "Régimen de comunicación",
        "Violencia familiar",
        "Adopción",
      ],
      forWho: "Familias, padres, madres, y personas en situación de conflicto familiar.",
      icon: "Users",
    },
    {
      id: "sucesiones",
      title: "Sucesiones",
      shortDescription: "Trámites sucesorios, declaratorias de herederos y partición de bienes.",
      fullDescription:
        "Gestionamos todo el proceso sucesorio, desde la apertura hasta la adjudicación de bienes. Te acompañamos en un momento difícil con claridad y eficiencia.",
      includes: [
        "Apertura de sucesión",
        "Declaratoria de herederos",
        "Inventario y avalúo",
        "Partición de bienes",
        "Testamentos",
        "Sucesiones intestadas",
      ],
      forWho: "Herederos, familiares de personas fallecidas, personas que deseen realizar testamento.",
      icon: "FileText",
    },
    {
      id: "transito",
      title: "Accidentes de Tránsito",
      shortDescription: "Reclamos a compañías de seguros, indemnizaciones y representación judicial.",
      fullDescription:
        "Si sufriste un accidente de tránsito, te ayudamos a reclamar la indemnización que te corresponde. Negociamos con las aseguradoras o llevamos tu caso a juicio.",
      includes: [
        "Reclamo a aseguradoras",
        "Indemnización por lesiones",
        "Daños materiales",
        "Accidentes con lesiones graves",
        "Fallecimiento por accidente",
        "Juicios contra responsables",
      ],
      forWho: "Víctimas de accidentes de tránsito, conductores, peatones, ciclistas.",
      icon: "Car",
    },
    {
      id: "consumidor",
      title: "Defensa del Consumidor",
      shortDescription: "Reclamos por productos defectuosos, servicios y derechos del consumidor.",
      fullDescription:
        "Defendemos tus derechos como consumidor ante empresas y proveedores. Tramitamos reclamos administrativos y judiciales.",
      includes: [
        "Productos defectuosos",
        "Incumplimiento contractual",
        "Publicidad engañosa",
        "Reclamos a bancos y financieras",
        "Servicios deficientes",
        "Daño punitivo",
      ],
      forWho: "Consumidores afectados por empresas, bancos, financieras o proveedores de servicios.",
      icon: "ShieldCheck",
    },
  ],

  whyChooseUs: [
    {
      title: "Más de 10 años de experiencia",
      description: "Trayectoria comprobada en diversas ramas del derecho.",
      icon: "Award",
    },
    {
      title: "Atención personalizada",
      description: "Cada caso es único. Te escuchamos y diseñamos una estrategia a tu medida.",
      icon: "UserCheck",
    },
    {
      title: "Respuesta rápida",
      description: "Sabemos que los tiempos importan. Respondemos tus consultas en menos de 24 horas.",
      icon: "Clock",
    },
    {
      title: "Transparencia en honorarios",
      description: "Sin sorpresas. Te explicamos claramente cómo trabajamos y cuánto cuesta.",
      icon: "BadgeDollarSign",
    },
    {
      title: "Seguimiento constante",
      description: "Te mantenemos informado en cada etapa del proceso.",
      icon: "MessageSquare",
    },
  ],

  process: [
    {
      step: 1,
      title: "Consulta inicial",
      description:
        "Contactanos por WhatsApp o completá el formulario. Analizamos tu caso sin compromiso.",
      icon: "MessageCircle",
    },
    {
      step: 2,
      title: "Estrategia legal",
      description:
        "Evaluamos las opciones y te proponemos el mejor camino para resolver tu situación.",
      icon: "Target",
    },
    {
      step: 3,
      title: "Acompañamiento",
      description:
        "Te representamos y acompañamos en todo el proceso hasta lograr el mejor resultado.",
      icon: "Handshake",
    },
  ],

  testimonials: [
    {
      initials: "M.G.",
      text: "Excelente atención. Me acompañaron en todo el proceso de mi despido y logré una buena indemnización. Muy recomendables.",
      location: "Capital Federal",
    },
    {
      initials: "L.R.",
      text: "Profesionales y humanos. Resolvieron mi sucesión de forma rápida y sin complicaciones. Siempre respondieron mis dudas.",
      location: "Buenos Aires",
    },
    {
      initials: "C.P.",
      text: "Tuve un accidente de trabajo y no sabía qué hacer. Me explicaron todo con claridad y me ayudaron a cobrar lo que me correspondía.",
      location: "CABA",
    },
  ],

  faqs: [
    {
      question: "¿La primera consulta tiene costo?",
      answer:
        "La consulta inicial por WhatsApp o teléfono es sin cargo. Te escuchamos, evaluamos tu caso y te orientamos sobre los pasos a seguir.",
    },
    {
      question: "¿Cómo cobran los honorarios?",
      answer:
        "Dependiendo del tipo de caso, trabajamos con honorarios fijos, porcentaje sobre resultado, o una combinación. Siempre te explicamos todo antes de empezar.",
    },
    {
      question: "¿Cuánto tiempo tarda un juicio laboral?",
      answer:
        "Los tiempos varían según el caso y la jurisdicción. En promedio, un juicio laboral puede durar entre 1 y 3 años. Siempre buscamos la vía más rápida posible.",
    },
    {
      question: "¿Atienden casos en todo el país?",
      answer:
        "Nuestra sede está en Buenos Aires, pero podemos asesorarte y derivarte a profesionales de confianza en otras provincias si es necesario.",
    },
    {
      question: "¿Qué documentación necesito para iniciar un reclamo laboral?",
      answer:
        "Recibos de sueldo, contrato de trabajo (si lo tenés), telegramas enviados o recibidos, y cualquier documentación que acredite la relación laboral.",
    },
    {
      question: "¿Puedo hacer una consulta fuera del horario de atención?",
      answer:
        "Sí, podés enviarnos un mensaje por WhatsApp o completar el formulario en cualquier momento. Te responderemos a la brevedad durante el horario de atención.",
    },
  ],

  team: [
    {
      name: "[Nombre del profesional 1]",
      role: "Abogado/a - Socio/a",
      bio: "[Breve descripción del profesional, su experiencia y especialidades]",
      image: "/team/profesional-1.jpg",
    },
    {
      name: "[Nombre del profesional 2]",
      role: "Abogado/a",
      bio: "[Breve descripción del profesional, su experiencia y especialidades]",
      image: "/team/profesional-2.jpg",
    },
    {
      name: "[Nombre del profesional 3]",
      role: "Abogado/a",
      bio: "[Breve descripción del profesional, su experiencia y especialidades]",
      image: "/team/profesional-3.jpg",
    },
  ],

  workingMethod: {
    title: "Nuestra forma de trabajar",
    description:
      "En ELIGE creemos que la relación con nuestros clientes debe basarse en la confianza, la transparencia y la comunicación constante. No somos un estudio más: somos tu equipo legal.",
    principles: [
      {
        title: "Escucha activa",
        description: "Entendemos que detrás de cada caso hay una persona. Te escuchamos antes de actuar.",
      },
      {
        title: "Comunicación clara",
        description: "Te explicamos todo en términos simples. Sin jerga legal innecesaria.",
      },
      {
        title: "Compromiso con el resultado",
        description: "Trabajamos para lograr el mejor resultado posible en tu caso.",
      },
      {
        title: "Ética profesional",
        description: "Actuamos siempre dentro del marco legal y ético de la profesión.",
      },
    ],
  },

  ctaSection: {
    title: "¿Tenés una consulta legal?",
    subtitle: "Contactanos hoy. La primera consulta es sin cargo.",
    button: "Escribinos por WhatsApp",
  },

  footer: {
    description:
      "Estudio jurídico con más de 10 años de experiencia. Te asesoramos con claridad, estrategia y compromiso.",
    copyright: `© ${new Date().getFullYear()} ELIGE - Estudio Legal Integral García Eldik. Todos los derechos reservados.`,
  },

  privacyPolicy: {
    title: "Política de Privacidad",
    lastUpdated: "Enero 2024",
    content: `
## Información que recopilamos

Cuando completás el formulario de contacto, recopilamos:
- Nombre y apellido
- Correo electrónico
- Número de teléfono
- El mensaje que nos enviás

## Uso de la información

Utilizamos tu información únicamente para:
- Responder a tu consulta
- Contactarte sobre tu caso
- Enviarte información relevante si nos autorizás

## Protección de datos

Tus datos personales son confidenciales y están protegidos según la Ley de Protección de Datos Personales N° 25.326 de Argentina.

## Compartir información

No compartimos, vendemos ni alquilamos tu información personal a terceros.

## Cookies

Este sitio puede utilizar cookies para mejorar la experiencia del usuario. Podés configurar tu navegador para rechazarlas.

## Cambios en esta política

Nos reservamos el derecho de modificar esta política. Los cambios serán publicados en esta página.

## Contacto

Si tenés preguntas sobre esta política, contactanos a través de nuestro formulario o por email a contacto@elige.com.ar.
    `,
  },

  thanksPage: {
    title: "¡Gracias por contactarnos!",
    message: "Recibimos tu mensaje correctamente. Nos comunicaremos con vos a la brevedad.",
    ctaText: "Volver al inicio",
  },
};

export type SiteContent = typeof siteContent;
