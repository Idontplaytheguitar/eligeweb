import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Seed SiteContent
  const siteContent = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      // Hero
      heroTitle: "Asesoramiento legal claro, estratégico y humano.",
      heroSubtitle:
        "Defendemos tus derechos con empatía y profesionalismo. Más de 10 años de experiencia nos respaldan.",
      // Quién Soy
      aboutName: "Dra. Aldana García Eldik",
      aboutRole: "Abogada - Fundadora de ELIGE",
      aboutImage: "/EstudioFrentePerfil.jpeg",
      aboutBio: JSON.stringify([
        "Me recibí de abogada en diciembre de 2018 y desde los 18 años trabajé en el mismo estudio jurídico, donde adquirí una sólida formación y experiencia práctica en diversas áreas del derecho.",
        "En diciembre de 2022, decidí independizarme y fundar ELIGE (Estudio Legal Integral García Eldik), con la visión de ofrecer un servicio legal cercano, empático y profesional.",
        "Cuento con aproximadamente 10 años de experiencia profesional, durante los cuales me especialicé en múltiples fueros: laboral, civil, previsional, asesoría a empresas, sucesiones y más.",
        "Mi enfoque se basa en escuchar activamente a cada cliente, entender su situación particular y diseñar la mejor estrategia para defender sus derechos.",
      ]),
      aboutTimeline: JSON.stringify([
        {
          title: "Fundadora de ELIGE",
          date: "Diciembre 2022 - Presente",
          description:
            "Estudio jurídico propio especializado en derecho laboral, civil, previsional, sucesiones y asesoría integral a empresas.",
          icon: "Briefcase",
        },
        {
          title: "Experiencia en Estudio Jurídico",
          date: "2012 - 2022 (10 años)",
          description:
            "Desarrollo profesional en múltiples áreas del derecho, adquiriendo experiencia práctica y formación integral.",
          icon: "Award",
        },
        {
          title: "Título de Abogada",
          date: "Diciembre 2018",
          description:
            "Graduada como Abogada con formación integral en todas las ramas del derecho.",
          icon: "GraduationCap",
        },
      ]),
      // Servicios
      services: JSON.stringify([
        {
          id: "laboral",
          title: "Derecho Laboral",
          shortDescription:
            "Despidos, accidentes de trabajo, enfermedades profesionales y reclamos laborales.",
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
          forWho:
            "Trabajadores en relación de dependencia, empleados despedidos, víctimas de accidentes laborales.",
          icon: "Briefcase",
        },
        {
          id: "civil",
          title: "Derecho Civil y Comercial",
          shortDescription:
            "Contratos, obligaciones, daños y perjuicios, y asesoramiento comercial.",
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
          shortDescription:
            "Divorcios, alimentos, régimen de comunicación y cuidado personal.",
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
          forWho:
            "Familias, padres, madres, y personas en situación de conflicto familiar.",
          icon: "Users",
        },
        {
          id: "sucesiones",
          title: "Sucesiones",
          shortDescription:
            "Trámites sucesorios, declaratorias de herederos y partición de bienes.",
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
          forWho:
            "Herederos, familiares de personas fallecidas, personas que deseen realizar testamento.",
          icon: "FileText",
        },
        {
          id: "transito",
          title: "Accidentes de Tránsito",
          shortDescription:
            "Reclamos a compañías de seguros, indemnizaciones y representación judicial.",
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
          forWho:
            "Víctimas de accidentes de tránsito, conductores, peatones, ciclistas.",
          icon: "Car",
        },
        {
          id: "consumidor",
          title: "Defensa del Consumidor",
          shortDescription:
            "Reclamos por productos defectuosos, servicios y derechos del consumidor.",
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
          forWho:
            "Consumidores afectados por empresas, bancos, financieras o proveedores de servicios.",
          icon: "ShieldCheck",
        },
      ]),
      // Testimonios
      testimonials: JSON.stringify([
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
      ]),
      // FAQs
      faqs: JSON.stringify([
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
      ]),
      // WhyChooseUs
      whyChooseUs: JSON.stringify([
        {
          title: "Más de 10 años de experiencia",
          description: "Trayectoria comprobada en diversas ramas del derecho.",
          icon: "Award",
        },
        {
          title: "Atención personalizada",
          description:
            "Cada caso es único. Te escuchamos y diseñamos una estrategia a tu medida.",
          icon: "UserCheck",
        },
        {
          title: "Respuesta rápida",
          description:
            "Sabemos que los tiempos importan. Respondemos tus consultas en menos de 24 horas.",
          icon: "Clock",
        },
        {
          title: "Transparencia en honorarios",
          description:
            "Sin sorpresas. Te explicamos claramente cómo trabajamos y cuánto cuesta.",
          icon: "BadgeDollarSign",
        },
        {
          title: "Seguimiento constante",
          description: "Te mantenemos informado en cada etapa del proceso.",
          icon: "MessageSquare",
        },
      ]),
      // Process
      process: JSON.stringify([
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
      ]),
      // Footer
      footerDesc:
        "Estudio jurídico con más de 10 años de experiencia. Te asesoramos con claridad, estrategia y compromiso.",
      // Contact
      contactWhatsapp: "+54 11 5037-2749",
      contactEmail: "eligeabogados@gmail.com",
      contactAddress: "Av. Directorio 2543",
      contactCity: "Capital Federal, Buenos Aires, Argentina",
      contactHours: "Lunes a Viernes: 9:00 - 19:00 | Sábados: 9:00 - 14:00",
      // Social
      socialInstagram: "https://www.instagram.com/estudiojuridico.elige/",
      socialFacebook: "https://www.facebook.com/elige.y.asociados",
      // CTA
      ctaTitle: "¿Tenés una consulta legal?",
      ctaSubtitle: "Contactanos hoy. La primera consulta es sin cargo.",
      ctaButton: "Escribinos por WhatsApp",
    },
  });

  console.log("✓ SiteContent seeded");

  // Seed Blog Posts
  const blogPosts = [
    {
      slug: "derechos-trabajador-despedido",
      title: "Derechos del Trabajador ante un Despido: Lo que necesitás saber",
      excerpt:
        "Si te despidieron o estás por ser despedido, es fundamental que conozcas tus derechos para asegurarte de recibir lo que te corresponde por ley.",
      content: `<h2>Introducción</h2>
<p>El despido laboral es una situación difícil que puede generar incertidumbre y preocupación. Sin embargo, es importante saber que la ley te protege y tenés derechos que deben ser respetados.</p>

<h2>Tipos de despido</h2>
<p>Existen diferentes tipos de despido en Argentina:</p>
<ul>
<li><strong>Despido con causa:</strong> Cuando el empleador alega que existe una falta grave del trabajador.</li>
<li><strong>Despido sin causa:</strong> Cuando el empleador decide finalizar la relación laboral sin invocar ningún motivo.</li>
<li><strong>Despido indirecto:</strong> Cuando el trabajador se considera despedido por conductas del empleador.</li>
</ul>

<h2>¿Qué te corresponde cobrar?</h2>
<p>En caso de despido sin causa, tenés derecho a cobrar:</p>
<ul>
<li>Preaviso (o indemnización sustitutiva)</li>
<li>Indemnización por antigüedad</li>
<li>Vacaciones no gozadas</li>
<li>Proporcional del aguinaldo</li>
<li>Días trabajados del mes</li>
</ul>

<h2>Plazos importantes</h2>
<p>Es fundamental actuar rápido. Tenés <strong>2 años</strong> desde la fecha de despido para iniciar un reclamo judicial. No dejes pasar el tiempo.</p>

<h2>¿Qué hacer si te despiden?</h2>
<ol>
<li>Conservá toda la documentación (recibos de sueldo, telegramas, etc.)</li>
<li>No firmes nada sin asesorarte legalmente</li>
<li>Consultá con un abogado laboralista de inmediato</li>
<li>Registrate en el SECLO (Sistema de Conciliación Laboral Obligatoria)</li>
</ol>

<p><strong>En ELIGE te acompañamos en todo el proceso</strong> para que recibas lo que te corresponde por ley. Contactanos para una consulta sin cargo.</p>`,
      coverImage: "/EstudioDentroDesk.jpeg",
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "proceso-sucesorio-paso-a-paso",
      title: "Proceso Sucesorio: Guía paso a paso para herederos",
      excerpt:
        "Iniciar una sucesión puede parecer complejo, pero con la información correcta y asesoramiento adecuado, el proceso se vuelve mucho más sencillo.",
      content: `<h2>¿Qué es una sucesión?</h2>
<p>La sucesión es el proceso legal mediante el cual se transmiten los bienes, derechos y obligaciones de una persona fallecida a sus herederos.</p>

<h2>Documentación necesaria</h2>
<p>Para iniciar el trámite sucesorio, necesitarás:</p>
<ul>
<li>Partida de defunción</li>
<li>DNI del fallecido y de los herederos</li>
<li>Partidas de nacimiento de los herederos</li>
<li>Partida de matrimonio (si correspondiera)</li>
<li>Documentación de los bienes (escrituras, títulos, etc.)</li>
</ul>

<h2>Pasos del proceso</h2>
<h3>1. Declaratoria de herederos</h3>
<p>Se inicia el juicio sucesorio y se declara quiénes son los herederos legales.</p>

<h3>2. Inventario de bienes</h3>
<p>Se realiza un listado completo de todos los bienes que conforman el patrimonio del fallecido.</p>

<h3>3. Avalúo</h3>
<p>Se determina el valor de cada bien para calcular los impuestos correspondientes.</p>

<h3>4. Partición</h3>
<p>Se divide el patrimonio entre los herederos según corresponda por ley o testamento.</p>

<h3>5. Adjudicación</h3>
<p>Finalmente, se adjudican los bienes a cada heredero mediante escritura pública.</p>

<h2>Plazos estimados</h2>
<p>El proceso completo puede llevar entre 6 meses y 2 años, dependiendo de la complejidad del caso y si existen conflictos entre herederos.</p>

<h2>¿Necesitás iniciar una sucesión?</h2>
<p>En ELIGE te acompañamos en todo el proceso sucesorio con claridad y empatía. <strong>Primera consulta sin cargo.</strong></p>`,
      coverImage: "/EstudioFrente.jpeg",
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "divorcio-express-argentina-2024",
      title: "Divorcio Express en Argentina: Requisitos y proceso 2024",
      excerpt:
        "El divorcio express es la forma más rápida de disolver un matrimonio cuando ambas partes están de acuerdo. Te contamos cómo funciona.",
      content: `<h2>¿Qué es el divorcio express?</h2>
<p>El divorcio express o divorcio de común acuerdo es un procedimiento simplificado que permite disolver el matrimonio de forma rápida cuando ambos cónyuges están de acuerdo.</p>

<h2>Requisitos</h2>
<p>Para iniciar un divorcio express necesitás:</p>
<ul>
<li>Que ambos cónyuges estén de acuerdo en divorciarse</li>
<li>Presentar un convenio regulador con acuerdos sobre:
  <ul>
    <li>Alimentos (si hay hijos menores)</li>
    <li>Régimen de comunicación con los hijos</li>
    <li>División de bienes</li>
  </ul>
</li>
<li>No es necesario alegar causales ni demostrar nada</li>
</ul>

<h2>Documentación necesaria</h2>
<ul>
<li>DNI de ambos cónyuges</li>
<li>Partida de matrimonio</li>
<li>Partidas de nacimiento de los hijos (si los hay)</li>
<li>Convenio regulador firmado</li>
</ul>

<h2>Plazos</h2>
<p>El divorcio express puede completarse en aproximadamente <strong>2 a 3 meses</strong> si no hay demoras en la presentación de documentación.</p>

<h2>¿Qué pasa si no hay acuerdo?</h2>
<p>Si no logran ponerse de acuerdo, igualmente pueden divorciarse pero el proceso será un divorcio contencioso, que lleva más tiempo y requiere audiencias ante el juez.</p>

<h2>Costos</h2>
<p>Los costos incluyen:</p>
<ul>
<li>Honorarios del abogado</li>
<li>Tasas judiciales</li>
<li>Escritura pública (si hay bienes a dividir)</li>
</ul>

<h2>¿Querés iniciar tu divorcio?</h2>
<p>En ELIGE te asesoramos sobre la mejor forma de proceder según tu situación particular. <strong>Consultá sin compromiso.</strong></p>`,
      coverImage: "/EstudioFrenteLejos.jpeg",
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "accidente-transito-reclamo-seguro",
      title: "Accidente de Tránsito: Cómo reclamar a la aseguradora",
      excerpt:
        "Si sufriste un accidente de tránsito, tenés derecho a una indemnización. Te explicamos cómo hacer el reclamo correctamente.",
      content: `<h2>Primeros pasos después del accidente</h2>
<p>Lo primero que debés hacer después de un accidente es:</p>
<ol>
<li>Llamar a la policía para hacer la denuncia</li>
<li>Sacar fotos del lugar, los vehículos y las lesiones</li>
<li>Obtener los datos del otro conductor y testigos</li>
<li>Ir al hospital para que te revisen (aunque creas que no tenés lesiones)</li>
<li>Notificar a tu compañía de seguros</li>
</ol>

<h2>¿Qué podés reclamar?</h2>
<p>Tenés derecho a reclamar:</p>
<ul>
<li><strong>Daño emergente:</strong> Gastos médicos, reparación del vehículo, etc.</li>
<li><strong>Lucro cesante:</strong> Pérdida de ingresos por no poder trabajar</li>
<li><strong>Daño moral:</strong> Compensación por el sufrimiento psicológico</li>
<li><strong>Incapacidad:</strong> Si quedaste con alguna secuela o incapacidad</li>
</ul>

<h2>Reclamo a la aseguradora</h2>
<p>El proceso incluye:</p>

<h3>1. Notificación</h3>
<p>Informás a la aseguradora del tercero responsable sobre el accidente.</p>

<h3>2. Presentación del reclamo</h3>
<p>Enviás toda la documentación que respalde tu reclamo (informes médicos, presupuestos, etc.).</p>

<h3>3. Negociación</h3>
<p>La aseguradora evaluará el caso y hará una oferta de indemnización.</p>

<h3>4. Acuerdo o demanda</h3>
<p>Si la oferta es justa, se llega a un acuerdo. Si no, se inicia una demanda judicial.</p>

<h2>¿Cuánto tarda?</h2>
<p>Si se llega a un acuerdo extrajudicial, puede resolverse en <strong>3 a 6 meses</strong>. Si hay juicio, puede llevar 2 años o más.</p>

<h2>Errores comunes a evitar</h2>
<ul>
<li>No ir al médico inmediatamente</li>
<li>Aceptar la primera oferta de la aseguradora sin asesoramiento</li>
<li>No conservar pruebas del accidente</li>
<li>Firmar acuerdos sin leerlos</li>
</ul>

<h2>¿Tuviste un accidente?</h2>
<p>No dejes que la aseguradora te ofrezca menos de lo que te corresponde. En ELIGE te ayudamos a obtener la <strong>justa indemnización</strong>. Consultanos ahora.</p>`,
      coverImage: "/EstudioFrentePerfil.jpeg",
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "defensa-consumidor-reclamos",
      title: "Defensa del Consumidor: Cómo hacer reclamos efectivos",
      excerpt:
        "Como consumidor, tenés derechos que te protegen. Conocé cómo reclamar ante productos defectuosos, servicios mal prestados y publicidad engañosa.",
      content: `<h2>Ley de Defensa del Consumidor</h2>
<p>La <strong>Ley 24.240</strong> de Defensa del Consumidor protege tus derechos en las relaciones de consumo. Esta ley se aplica a productos y servicios adquiridos para uso personal o familiar.</p>

<h2>Situaciones más comunes</h2>
<ul>
<li>Productos defectuosos o que no cumplen lo prometido</li>
<li>Servicios mal prestados</li>
<li>Publicidad engañosa</li>
<li>Cobros indebidos de bancos o tarjetas</li>
<li>Incumplimiento de garantías</li>
<li>Cláusulas abusivas en contratos</li>
</ul>

<h2>Pasos para hacer un reclamo</h2>

<h3>1. Reclamo directo al proveedor</h3>
<p>Primero, intentá resolver el problema directamente con la empresa. Hacelo por escrito (email, carta documento) para tener prueba.</p>

<h3>2. Reclamo en Defensa del Consumidor</h3>
<p>Si no resuelven tu problema, podés hacer una denuncia en la <strong>Dirección de Defensa y Protección al Consumidor</strong>. Podés hacerlo online o presencialmente.</p>

<h3>3. Mediación</h3>
<p>Te citarán a ti y a la empresa a una audiencia de mediación para intentar llegar a un acuerdo.</p>

<h3>4. Demanda judicial</h3>
<p>Si no llegás a un acuerdo, podés iniciar una demanda judicial. En estos casos, podés reclamar además el <strong>daño punitivo</strong>.</p>

<h2>¿Qué es el daño punitivo?</h2>
<p>Es una multa que el juez puede imponer a la empresa (además de la indemnización) cuando actuó con negligencia grave o dolo. Puede ser de hasta <strong>5 millones de pesos</strong>.</p>

<h2>Documentación importante</h2>
<p>Para hacer un reclamo efectivo, guardá:</p>
<ul>
<li>Ticket o factura de compra</li>
<li>Garantía del producto</li>
<li>Contrato del servicio</li>
<li>Emails o mensajes con la empresa</li>
<li>Fotos del producto defectuoso</li>
<li>Resúmenes de cuenta (en caso de cobros indebidos)</li>
</ul>

<h2>Plazos de garantía</h2>
<p>Los productos tienen una <strong>garantía legal mínima de 3 meses</strong>, independientemente de la garantía del fabricante. Para productos durables, la garantía puede extenderse hasta 6 meses.</p>

<h2>¿Te perjudicó una empresa?</h2>
<p>No dejes que vulneren tus derechos como consumidor. En ELIGE te ayudamos a reclamar lo que te corresponde. <strong>Consultá gratis.</strong></p>`,
      published: true,
      publishedAt: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log(`✓ ${blogPosts.length} blog posts seeded`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
