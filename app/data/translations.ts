// app/data/translations.ts

export type Language = 'es' | 'en' | 'de';

// Corrected: skills are now a simple string array
export interface Translation {
  hero: {
    name: string;
    role: string;
    status: string;
    description: string;
  };
  terminal: {
    sectionTitle: string;
    initialMessage1: string;
    initialMessage2: string;
    prompt: string;
    commands: { help: string; about: string; skills: string; contact: string; clear: string; notFound: string; };
    aboutResponse: string;
    skillsResponse: string;
    contactResponse: string;
  };
  techStack: {
    sectionTitle: string;
    skills: string[]; // This is now string[]
  };
  projects: {
    sectionTitle: string;
    items: ProjectData[];
  };
  workExperience: {
    sectionTitle: string;
    items: ExperienceData[];
  };
  education: {
    sectionTitle: string;
    items: EducationData[];
  };
  footer: {
    status: string;
    copyright: string;
  };
  metadata: {
    title: string;
    description: string;
  };
}

export interface ProjectData {
  title: string;
  date: string;
  tech: string;
  description: string[];
  isAiPowered?: boolean;
  aiBadgeText?: string;
  role?: string;
}

export interface ExperienceData {
  title: string;
  date: string;
  subtitle: string;
  description: string[];
}

export interface EducationData {
  title: string;
  date: string;
  subtitle: string;
  description: string[];
}


export const translations: Record<Language, Translation> = {
  es: {
    hero: {
      name: "JUAN\nLASSO.",
      role: "Analista de Datos & Desarrollador",
      status: "// ESTADO: DISPONIBLE_PARA_AUSBILDUNG_2026",
      description: "Analista de datos en formación y desarrollador Python. Especializado en la automatización de procesos y optimización de flujos de trabajo en entornos Linux."
    },
    terminal: {
      sectionTitle: "EJECUTAR_COMANDOS",
      initialMessage1: "Sistema inicializado...",
      initialMessage2: "Escribe 'ayuda' para ver los comandos.",
      prompt: "invitado@lasso:~$",
      commands: { help: "ayuda", about: "sobre", skills: "habilidades", contact: "contacto", clear: "limpiar", notFound: "No encontrado" },
      aboutResponse: "Juan Felipe: Aspirante a Fachinformatiker en Göttingen. Nivel B2 de Alemán.",
      skillsResponse: "Python, C#, Bash, SQL, Linux, Hardware.",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: {
      sectionTitle: "PILA_TECNOLÓGICA",
      skills: ["Linux/Bash", "Python", "Hardware/Redes", "SQL/Data", "JavaScript", "C#"]
    },
    projects: {
      sectionTitle: "PROYECTOS_DESTACADOS",
      items: [
        {
          title: 'Proyecto "Luvi": Ecosistema Empresarial',
          date: '01/2024 – Hoy',
          tech: 'Python, SQLite, IA Generativa',
          isAiPowered: true,
          aiBadgeText: "IMPULSADO POR IA",
          description: [
            'Plataforma integral para gestión de inventarios y marketing.',
            'Algoritmos de ML para predicción de stock.',
            'Generación de campañas con IA.'
          ]
        },
        {
          title: 'Scripts de Automatización',
          date: '06/2023 – Hoy',
          tech: 'Bash, Python, System Admin',
          description: [
            'Scripts para backups automáticos y monitoreo de sistemas.',
            'Optimización de flujos de trabajo en Linux.'
          ]
        },
        {
          title: 'The Lab: Desarrollo Personal',
          date: '2022 – Hoy',
          tech: 'JavaScript, Hardware',
          role: "HOBBYIST",
          description: [
            'Desarrollo de pequeñas apps para problemas cotidianos.',
            'Reparación y modificación de hardware y PCs.'
          ]
        }
      ]
    },
    workExperience: {
      sectionTitle: "EXPERIENCIA_LABORAL",
      items: [
        {
          title: "Formación: Fachinformatiker Systemintegration",
          date: "12/2023 – 03/2024",
          subtitle: "Ausbildung (Göttingen)",
          description: [
            "Fundamentos de integración de sistemas y tecnología de redes.",
            "Gestión de infraestructuras IT profesionales."
          ]
        },
        {
          title: "Empleado de Ventas / Cajero",
          date: "10/2022 – Hoy",
          subtitle: "Kaufland, Göttingen",
          description: [
            "Gestión de efectivo y procesos bajo alta presión.",
            "Resolución de problemas con clientes."
          ]
        }
      ]
    },
    education: {
      sectionTitle: "EDUCACIÓN",
      items: [
        {
          title: "Escuela Profesional de Economía (Informática)",
          date: "09/2022 – 07/2023",
          subtitle: "BBS1 Arnoldi-Schule",
          description: ["Enfoque en procesos económicos y TI."]
        },
        {
          title: "Certificado de Educación Secundaria",
          date: "09/2021 – 07/2022",
          subtitle: "BBS1 Arnoldi-Schule",
          description: []
        }
      ]
    },
    footer: { status: "SISTEMA: EN LÍNEA", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | Portafolio IT", description: "Portafolio de Fachinformatiker." }
  },
  en: {
    hero: {
      name: "JUAN\nLASSO.",
      role: "Data Analyst & Developer",
      status: "// STATUS: OPEN_FOR_AUSBILDUNG_2026",
      description: "Data Analyst in training and Python developer. Specialized in process automation and workflow optimization in Linux environments."
    },
    terminal: {
      sectionTitle: "EXECUTE_COMMANDS",
      initialMessage1: "System initialized...",
      initialMessage2: "Type 'help' to see commands.",
      prompt: "guest@lasso:~$",
      commands: { help: "help", about: "about", skills: "skills", contact: "contact", clear: "clear", notFound: "Command not found" },
      aboutResponse: "Juan Felipe: Aspiring IT Specialist in Göttingen. B2 German.",
      skillsResponse: "Python, C#, Bash, SQL, Linux, Hardware.",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: {
      sectionTitle: "TECH_STACK",
      skills: ["Linux/Bash", "Python", "Hardware/Network", "SQL/Data", "JavaScript", "C#"]
    },
    projects: {
      sectionTitle: "FEATURED_PROJECTS",
      items: [
        {
          title: 'Project "Luvi": AI-Powered Ecosystem',
          date: '01/2024 – Present',
          tech: 'Python, SQLite, Generative AI',
          isAiPowered: true,
          aiBadgeText: "AI-POWERED",
          description: [
            'Platform for inventory management and automated marketing.',
            'ML algorithms for stock prediction.',
            'AI-generated marketing campaigns.'
          ]
        },
        {
          title: 'Automation Scripts Portfolio',
          date: '06/2023 – Present',
          tech: 'Bash, Python, System Admin',
          description: [
            'Scripts for automated backups and system monitoring.',
            'Linux workflow optimization.'
          ]
        },
        {
          title: 'The Lab: Personal Development',
          date: '2022 – Present',
          tech: 'JavaScript, Hardware',
          role: "HOBBYIST",
          description: [
            'Development of small apps for daily problem solving.',
            'Hardware repair and modification.'
          ]
        }
      ]
    },
    workExperience: {
      sectionTitle: "WORK_EXPERIENCE",
      items: [
        {
          title: "Apprenticeship: System Integration Specialist",
          date: "12/2023 – 03/2024",
          subtitle: "Ausbildung (Göttingen)",
          description: [
            "Fundamentals of system integration and network technology.",
            "Professional IT infrastructure management."
          ]
        },
        {
          title: "Sales Employee / Cashier",
          date: "10/2022 – Present",
          subtitle: "Kaufland, Göttingen",
          description: [
            "Cash management under high pressure.",
            "Customer communication and problem solving."
          ]
        }
      ]
    },
    education: {
      sectionTitle: "EDUCATION",
      items: [
        {
          title: "Vocational School of Economics (IT)",
          date: "09/2022 – 07/2023",
          subtitle: "BBS1 Arnoldi-Schule",
          description: ["Focus on economic processes and IT."]
        },
        {
          title: "Secondary School Certificate",
          date: "09/2021 – 07/2022",
          subtitle: "BBS1 Arnoldi-Schule",
          description: []
        }
      ]
    },
    footer: { status: "SYSTEM STATUS: ONLINE", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | IT Portfolio", description: "Portfolio of Juan Felipe Lasso - Aspiring IT Specialist." }
  },
  de: {
    hero: {
      name: "JUAN\nLASSO.",
      role: "Datenanalyst & Entwickler",
      status: "// STATUS: OFFEN_FÜR_AUSBILDUNG_2026",
      description: "Angehender Fachinformatiker für Daten- und Prozessanalyse. Spezialisiert auf Prozessautomatisierung und Workflow-Optimierung in Linux-Umgebungen."
    },
    terminal: {
      sectionTitle: "BEFEHLE_AUSFÜHREN",
      initialMessage1: "System initialisiert...",
      initialMessage2: "Geben Sie 'hilfe' ein.",
      prompt: "gast@lasso:~$",
      commands: { help: "hilfe", about: "ueber", skills: "skills", contact: "kontakt", clear: "clear", notFound: "Nicht gefunden" },
      aboutResponse: "Juan Felipe: Angehender Fachinformatiker in Göttingen. Deutsch B2.",
      skillsResponse: "Python, C#, Bash, SQL, Linux, Hardware.",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: {
      sectionTitle: "TECH_STACK",
      skills: ["Linux/Bash", "Python", "Hardware/Netzwerk", "SQL/Daten", "JavaScript", "C#"]
    },
    projects: {
      sectionTitle: "AUSGEWÄHLTE_PROJEKTE",
      items: [
        {
          title: 'Projekt "Luvi": KI-Gestütztes Ökosystem',
          date: '01/2024 – Heute',
          tech: 'Python, SQLite, Generative KI',
          isAiPowered: true,
          aiBadgeText: "KI-BASIERT",
          description: [
            'Plattform für Bestandsmanagement und Marketing.',
            'ML-Algorithmen zur Bestandsvorhersage.',
            'KI-generierte Marketingkampagnen.'
          ]
        },
        {
          title: 'Automatisierungs-Skripte',
          date: '06/2023 – Heute',
          tech: 'Bash, Python, System Admin',
          description: [
            'Skripte für automatisierte Backups und Monitoring.',
            'Optimierung von Linux-Workflows.'
          ]
        },
        {
          title: 'The Lab: Persönliche Entwicklung',
          date: '2022 – Heute',
          tech: 'JavaScript, Hardware',
          role: "HOBBYIST",
          description: [
            'Entwicklung kleiner Apps zur Problemlösung.',
            'Reparatur y Modifikation von Hardware.'
          ]
        }
      ]
    },
    workExperience: {
      sectionTitle: "BERUFSERFAHRUNG",
      items: [
        {
          title: "Ausbildung: Fachinformatiker Systemintegration",
          date: "12/2023 – 03/2024",
          subtitle: "Göttingen",
          description: [
            "Grundlagen der Systemintegration und Netzwerktechnik.",
            "Einblick in professionelle IT-Infrastrukturen."
          ]
        },
        {
          title: "Mitarbeiter im Verkauf / Kassierer",
          date: "10/2022 – Heute",
          subtitle: "Kaufland, Göttingen",
          description: [
            "Arbeiten unter hohem Zeitdruck.",
            "Kundenkommunikation und Problemlösung."
          ]
        }
      ]
    },
    education: {
      sectionTitle: "AUSBILDUNG",
      items: [
        {
          title: "Berufsfachschule Wirtschaft (Informatik)",
          date: "09/2022 – 07/2023",
          subtitle: "BBS1 Arnoldi-Schule",
          description: ["Fokus auf wirtschaftliche Prozesse und IT."]
        },
        {
          title: "Hauptschulabschluss",
          date: "09/2021 – 07/2022",
          subtitle: "BBS1 Arnoldi-Schule",
          description: []
        }
      ]
    },
    footer: { status: "SYSTEM: ONLINE", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | IT Portfolio", description: "Portfolio von Juan Felipe Lasso - Angehender Fachinformatiker." }
  }
};
