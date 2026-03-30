// app/data/translations.ts

export type Language = 'es' | 'en' | 'de';

export interface Translation {
  hero: { name: string; role: string; status: string; description: string; };
  terminal: {
    sectionTitle: string;
    initialMessage1: string;
    initialMessage2: string;
    prompt: { user: string; host: string; separator: string; };
    availableText: string;
    whoami: { name: string; role: string; location: string; tools: string; };
    contact: { askName: string; askEmail: string; askMessage: string; uploading: string; success: string; };
    commands: { 
      help: string; about: string; skills: string; projects: string; experience: string; education: string;
      socials: string; all: string; sudo: string; clear: string; whoami: string; cv: string; 
      contact: string; mute: string; unmute: string; matrix: string; notFound: string;
      stats: string;
      threatmap: string;
    };
    clues: {
      clickHint: string;
      tucanHint: string;
      leoHint: string;
    };
    hiring: { sudoMsg: string; }; // New property
    apiMessages: { fetching: string; error: string; }; // New property
    aboutResponse: string;
    contactResponse: string;
  };
  techStack: { sectionTitle: string; skills: string[]; };
  projects: { sectionTitle: string; items: ProjectData[]; };
  workExperience: { sectionTitle: string; items: ExperienceData[]; };
  education: { sectionTitle: string; items: EducationData[]; };
  footer: { status: string; copyright: string; };
  metadata: { title: string; description:string; };
}

export interface ProjectData { title: string; date: string; tech: string; description: string[]; isAiPowered?: boolean; aiBadgeText?: string; role?: string; }
export interface ExperienceData { title: string; date: string; subtitle: string; description: string[]; }
export interface EducationData { title: string; date: string; subtitle: string; description: string[]; }


export const translations: Record<Language, Translation> = {
  es: {
    hero: { name: "JUAN\nLASSO.", role: "FULL-STACK WEB DEV & AI ENGINEER", status: "// ESTADO: SISTEMA EN LÍNEA_2026", description: "Desarrollador Full-Stack y Arquitecto de Software en formación. Especializado en la integración de Inteligencia Artificial, desarrollo web moderno y arquitecturas escalables." },
    terminal: {
      sectionTitle: "EJECUTAR_COMANDOS",
      initialMessage1: "Sistema inicializado...",
      initialMessage2: "Escribe 'ayuda' para ver los comandos.",
      prompt: { user: 'invitado', host: 'lasso', separator: ':~$' },
      availableText: "Comandos disponibles",
      whoami: { name: "Nombre", role: "Rol", location: "Ubicación", tools: "Herramientas" },
      contact: { askName: "Nombre completo:", askEmail: "Email de contacto:", askMessage: "Tu mensaje:", uploading: "[ CARGANDO DATOS ENCRIPTADOS... 100% ]", success: "Mensaje enviado. Gracias por contactar." },
      commands: { 
        help: "ayuda", about: "sobre", skills: "habilidades", projects: "proyectos", experience: "experiencia", education: "educacion", 
        socials: "sociales", all: "todo", sudo: "sudo", clear: "limpiar", whoami: "quiensoy", cv: "cv", 
        contact: "contacto", mute: "silenciar", unmute: "activar-sonido", matrix: "matrix", notFound: "No encontrado",
        stats: "estadisticas",
        threatmap: "threatmap"
      },
      clues: {
        clickHint: "[ ! ] ALERTA: Anomalía detectada. Un intruso con pico enorme y colorido observa el sistema. Identifícalo...",
        tucanHint: "¡Observador localizado! Para avanzar, busca a mi leal compañero: es un Golden Retriever y comparte nombre con mi signo zodiacal (Agosto). Escribe su nombre.",
        leoHint: "El sistema es una simulación. Escribe 'matrix' para despertar."
      },
      hiring: { sudoMsg: "¡Permisos de Superusuario Reconocidos! Abriendo canal seguro con el candidato..." },
      apiMessages: { fetching: "Conectando con GitHub API...", error: "Error: No se pudo conectar con el servidor remoto." },
      aboutResponse: "Soy Juan Felipe Lasso. Curso el Master de IA en Big School y me apasiona la Ciberseguridad y los Videojuegos. Trato este portafolio como un CTF (Capture The Flag). Hay aves tropicales ocultas en el código. ¿Puedes encontrarlas?",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: {
      sectionTitle: "PILA_TECNOLÓGICA",
      skills: [
        "Linux/Bash",
        "Python",
        "React/Tailwind CSS",
        "Next.js",
        "TypeScript/JavaScript",
        "Data Analysis",
        "AI Agents design",
        "Vulnerability Analysis"
      ]
    },
    projects: {
      sectionTitle: "PROYECTOS_DESTACADOS",
      items: [
        {
          title: "Luvi - E-Commerce Web-Plattform",
          date: "12.2025 - Presente",
          tech: "Next.js, TypeScript",
          isAiPowered: true,
          aiBadgeText: "IA-IMPULSADO",
          description: [
            "Aplicación de e-commerce boutique con enfoque premium de UI/UX.",
            "Implementación de layouts responsivos y arquitectura de enrutamiento dinámico.",
            "Sistema interactivo de feedback de usuarios integrado en el footer.",
            "Gestión de versiones estructurada mediante Git y GitHub."
          ]
        }
      ]
    },
    workExperience: {
      sectionTitle: "EXPERIENCIA_LABORAL",
      items: [
        {
          title: "Produktionsmitarbeiter",
          subtitle: "Sartorius AG (vía Manpower), Göttingen",
          date: "10.2025 - Presente",
          description: ["Manejo de equipamiento especializado en entorno de tecnología de laboratorio.", "Cumplimiento de protocolos estrictos de calidad y seguridad con rotación de turnos de mañana, tarde y noche."]
        },
        {
          title: "Limpieza en área OP",
          subtitle: "Hospital UMG Göttingen",
          date: "04.2025 - 09.2025",
          description: ["Limpieza y desinfección de áreas críticas bajo requisitos hospitalarios de esterilidad y protocolos estrictos."]
        },
        {
          title: "Traductor & IT-Selbststudium",
          subtitle: "Freelance / Autodidacta",
          date: "04.2024 - 04.2025",
          description: ["Traducciones ES/DE y formación intensiva en tecnologías web (Next.js, React).", "Desarrollo del proyecto Luvi."]
        },
        {
          title: "Fachinformatiker für Systemintegration",
          subtitle: "net@vision GmbH, Göttingen",
          date: "12.2023 - 03.2024",
          description: ["Fundamentos de infraestructura IT, administración de sistemas y redes."]
        },
        {
          title: "Kassierer",
          subtitle: "Kaufland, Göttingen",
          date: "10.2022 - 12.2023",
          description: ["Atención al cliente y gestión de caja registradora."]
        }
      ]
    },
    education: {
      sectionTitle: "EDUCACIÓN",
      items: [
        {
          title: "Master in AI-Powered Software Engineering",
          subtitle: "The Big School",
          date: "Inicio: 10.2025",
          description: ["Especialización en Large Language Models.", "Diseño e implementación de AI Agents."]
        },
        {
          title: "Ciberseguridad Ofensiva & Defensiva",
          subtitle: "continuo",
          date: "2023 - Presente",
          description: ["Hardening de sistemas.", "Vulnerability analysis."]
        },
        {
          title: "net@vision GmbH",
          subtitle: "Ausbildung: Fachinformatiker Systemintegration [AUSBILDUNG/TRAINING]",
          date: "12.2023 - 03.2024",
          description: ["Gestión de redes, integración de sistemas e infraestructura IT."]
        },
        {
          title: "Hauptschulabschluss",
          subtitle: "BBS1 Arnoldi-Schule",
          date: "09/2021 - 07/2022",
          description: ["Educación básica secundaria."]
        }
      ]
    },
    footer: { status: "SISTEMA: EN LÍNEA", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | Portafolio IT", description: "Portafolio de Fachinformatiker." }
  },
  en: {
    hero: { name: "JUAN\nLASSO.", role: "FULL-STACK WEB DEV & AI ENGINEER", status: "// STATUS: SYSTEM ONLINE_2026", description: "Full-Stack Developer and Software Architect in training. Specialized in Artificial Intelligence integration, modern web development, and scalable architectures." },
    terminal: {
      sectionTitle: "EXECUTE_COMMANDS",
      initialMessage1: "System initialized...",
      initialMessage2: "Type 'help' to see commands.",
      prompt: { user: 'guest', host: 'lasso', separator: ':~$' },
      availableText: "Available commands",
      whoami: { name: "Name", role: "Role", location: "Location", tools: "Tools" },
      contact: { askName: "Full Name:", askEmail: "Contact Email:", askMessage: "Your Message:", uploading: "[ UPLOADING ENCRYPTED DATA... 100% ]", success: "Message sent. Thank you for reaching out." },
      commands: { 
        help: "help", about: "about", skills: "skills", projects: "projects", experience: "experience", education: "education", 
        socials: "socials", all: "all", sudo: "sudo", clear: "clear", whoami: "whoami", cv: "cv", 
        contact: "contact", mute: "mute", unmute: "unmute", matrix: "matrix", notFound: "Command not found",
        stats: "stats",
        threatmap: "threatmap"
      },
      clues: {
        clickHint: "[ ! ] ALERT: Anomaly detected. An intruder with a huge colorful beak is observing the system. Identify it...",
        tucanHint: "Watcher located! To proceed, seek my loyal companion: he is a Golden Retriever and shares his name with my zodiac sign (August). Type his name.",
        leoHint: "The system is a simulation. Type 'matrix' to wake up."
      },
      hiring: { sudoMsg: "Superuser Permissions Recognized! Opening secure channel with candidate..." },
      apiMessages: { fetching: "Connecting to GitHub API...", error: "Error: Could not connect to remote server." },
      aboutResponse: "I am Juan Felipe Lasso. AI Master student at Big School, passionate about Cybersecurity and Game Dev. I treat this portfolio like a CTF. There are tropical birds hidden in the code. Can you find them?",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: {
      sectionTitle: "TECH_STACK",
      skills: [
        "Linux/Bash",
        "Python",
        "React/Tailwind CSS",
        "Next.js",
        "TypeScript/JavaScript",
        "C#",
        "Data Analysis",
        "AI Agents design",
        "Vulnerability Analysis"
      ]
    },
    projects: {
      sectionTitle: "FEATURED_PROJECTS",
      items: [
        {
          title: "Luvi - E-Commerce Web Platform",
          date: "12.2025 - Present",
          tech: "Next.js, Python, TypeScript",
          isAiPowered: true,
          aiBadgeText: "AI-POWERED",
          description: [
            "Boutique e-commerce application built with a premium UI/UX focus.",
            "Implementation of responsive layouts and dynamic routing architecture.",
            "Interactive user feedback system integrated into the footer.",
            "Structured version control workflow with Git and GitHub."
          ]
        }
      ]
    },
    workExperience: {
      sectionTitle: "WORK_EXPERIENCE",
      items: [
        {
          title: "Production Worker",
          subtitle: "Sartorius AG (via Manpower), Göttingen",
          date: "10.2025 - Present",
          description: ["Handling specialized equipment in a lab-technology production environment.", "Compliance with strict quality and safety protocols across morning, afternoon, and night shift rotation."]
        },
        {
          title: "OP Area Cleaning",
          subtitle: "Hospital UMG Göttingen",
          date: "04.2025 - 09.2025",
          description: ["Critical-area cleaning and disinfection under hospital sterile requirements and strict protocols."]
        },
        {
          title: "Translator & IT Self-Study",
          subtitle: "Freelance / Self-Taught",
          date: "04.2024 - 04.2025",
          description: ["ES/DE translation work and intensive training in web technologies (Next.js, React).", "Development of the Luvi project."]
        },
        {
          title: "IT Specialist for System Integration",
          subtitle: "net@vision GmbH, Göttingen",
          date: "12.2023 - 03.2024",
          description: ["Fundamentals of IT infrastructure, system administration, and networks."]
        },
        {
          title: "Cashier",
          subtitle: "Kaufland, Göttingen",
          date: "10.2022 - 12.2023",
          description: ["Customer service and cash register operations."]
        }
      ]
    },
    education: {
      sectionTitle: "EDUCATION",
      items: [
        {
          title: "Master in AI-Powered Software Engineering",
          subtitle: "The Big School",
          date: "Starting 10.2025",
          description: ["Specialized Large Language Models.", "AI Agents design and implementation."]
        },
        {
          title: "Offensive & Defensive Cybersecurity",
          subtitle: "Continuous",
          date: "2023 - Present",
          description: ["System hardening.", "Vulnerability analysis."]
        },
        {
          title: "net@vision GmbH",
          subtitle: "Ausbildung: Fachinformatiker Systemintegration [AUSBILDUNG/TRAINING]",
          date: "12.2023 - 03.2024",
          description: ["Network management, system integration, and IT infrastructure fundamentals."]
        },
        {
          title: "Hauptschulabschluss",
          subtitle: "BBS1 Arnoldi-Schule",
          date: "09/2021 - 07/2022",
          description: ["Basic secondary education."]
        }
      ]
    },
    footer: { status: "SYSTEM STATUS: ONLINE", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | IT Portfolio", description: "Portfolio of Juan Felipe Lasso - Aspiring IT Specialist." }
  },
  de: {
    hero: { name: "JUAN\nLASSO.", role: "FULL-STACK WEB DEV & AI ENGINEER", status: "// STATUS: SYSTEM ONLINE_2026", description: "Full-Stack-Entwickler und angehender Softwarearchitekt. Spezialisiert auf KI-Integration, moderne Webentwicklung und skalierbare Architekturen." },
    terminal: {
      sectionTitle: "BEFEHLE_AUSFÜHREN",
      initialMessage1: "System initialisiert...",
      initialMessage2: "Geben Sie 'hilfe' ein.",
      prompt: { user: 'gast', host: 'lasso', separator: ':~$' },
      availableText: "Verfügbare Befehle",
      whoami: { name: "Name", role: "Rolle", location: "Standort", tools: "Tools" },
      contact: { askName: "Vollständiger Name:", askEmail: "Kontakt-E-Mail:", askMessage: "Ihre Nachricht:", uploading: "[ VERSCHLÜSSELTE DATEN WERDEN HOCHGELADEN... 100% ]", success: "Nachricht gesendet. Danke für Ihre Kontaktaufnahme." },
      commands: { 
        help: "hilfe", about: "ueber", skills: "faehigkeiten", projects: "projekte", experience: "erfahrung", education: "ausbildung", 
        socials: "soziales", all: "alle", sudo: "sudo", clear: "leeren", whoami: "werbinich", cv: "lebenslauf", 
        contact: "kontakt", mute: "stumm", unmute: "ton-an", matrix: "matrix", notFound: "Nicht gefunden",
        stats: "stats",
        threatmap: "threatmap"
      },
      clues: {
        clickHint: "[ ! ] ANOMALIE ENTDECKT: Tropische Vögel in den Systemprotokollen gesichtet. Versuchen Sie, sie herbeizurufen...",
        tucanHint: "Sie haben den Beobachter gefunden. Suchen Sie nun meinen treuen Begleiter: Er ist ein Golden Retriever und trägt den Namen meines Sternzeichens (August). Geben Sie seinen Namen ein.",
        leoHint: "Das System ist eine Simulation. Gib 'matrix' ein, um aufzuwachen."
      },
      hiring: { sudoMsg: "Superuser-Berechtigungen erkannt! Sicheren Kanal zum Kandidaten öffnen..." },
      apiMessages: { fetching: "Verbindung mit GitHub API wird hergestellt...", error: "Fehler: Verbindung zum Remote-Server konnte nicht hergestellt werden." },
      aboutResponse: "Ich bin Juan Felipe Lasso. Ich studiere den KI-Master an der Big School und begeistere mich für Cybersicherheit und Videospielentwicklung. Ich behandle dieses Portfolio wie ein CTF (Capture The Flag). Im Code sind tropische Vögel versteckt. Können Sie sie finden?",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: {
      sectionTitle: "TECH_STACK",
      skills: [
        "Linux/Bash",
        "Python",
        "React/Tailwind CSS",
        "Next.js",
        "TypeScript/JavaScript",
        "C#",
        "Datenanalyse",
        "AI-Agents Design",
        "Schwachstellenanalyse"
      ]
    },
    projects: {
      sectionTitle: "AUSGEWÄHLTE_PROJEKTE",
      items: [
        {
          title: "Luvi - E-Commerce Web-Plattform",
          date: "12.2025 - Heute",
          tech: "Next.js, Python, TypeScript",
          isAiPowered: true,
          aiBadgeText: "KI-UNTERSTÜTZT",
          description: [
            "Boutique-E-Commerce-Anwendung mit Premium-Fokus auf UI/UX.",
            "Umsetzung responsiver Layouts und einer dynamischen Routing-Architektur.",
            "Interaktives Nutzer-Feedback-System im Footer integriert.",
            "Strukturierte Versionsverwaltung mit Git und GitHub."
          ]
        }
      ]
    },
    workExperience: {
      sectionTitle: "BERUFSERFAHRUNG",
      items: [
        {
          title: "Produktionsmitarbeiter",
          subtitle: "Sartorius AG (via Manpower), Göttingen",
          date: "10.2025 - Heute",
          description: ["Bedienung spezialisierter Geräte im labortechnischen Produktionsumfeld.", "Einhaltung strenger Qualitäts- und Sicherheitsprotokolle bei Früh-, Spät- und Nachtschichtrotation."]
        },
        {
          title: "Reinigung im OP-Bereich",
          subtitle: "Hospital UMG Göttingen",
          date: "04.2025 - 09.2025",
          description: ["Reinigung und Desinfektion kritischer Bereiche unter strengen Sterilitätsanforderungen und Klinikprotokollen."]
        },
        {
          title: "Übersetzer & IT-Selbststudium",
          subtitle: "Freelance / Autodidakt",
          date: "04.2024 - 04.2025",
          description: ["ES/DE-Übersetzungen und intensives Selbststudium in Webtechnologien (Next.js, React).", "Entwicklung des Projekts Luvi."]
        },
        {
          title: "Fachinformatiker für Systemintegration",
          subtitle: "net@vision GmbH, Göttingen",
          date: "12.2023 - 03.2024",
          description: ["Grundlagen von IT-Infrastruktur, Systemadministration und Netzwerken."]
        },
        {
          title: "Kassierer",
          subtitle: "Kaufland, Göttingen",
          date: "10.2022 - 12.2023",
          description: ["Kundenbetreuung und Bedienung der Kasse."]
        }
      ]
    },
    education: {
      sectionTitle: "AUSBILDUNG",
      items: [
        {
          title: "Master in KI-gestützter Softwareentwicklung",
          subtitle: "The Big School",
          date: "Start: 10.2025",
          description: ["Spezialisierung auf Large Language Models.", "Design und Implementierung von AI Agents."]
        },
        {
          title: "Offensive & Defensive Cybersicherheit",
          subtitle: "Continuous",
          date: "2023 - Present",
          description: ["Systemhärtung.", "Schwachstellenanalyse."]
        },
        {
          title: "net@vision GmbH",
          subtitle: "Ausbildung: Fachinformatiker Systemintegration [AUSBILDUNG/TRAINING]",
          date: "12.2023 - 03.2024",
          description: ["Netzwerkmanagement, Systemintegration und Grundlagen der IT-Infrastruktur."]
        },
        {
          title: "Hauptschulabschluss",
          subtitle: "BBS1 Arnoldi-Schule",
          date: "09/2021 - 07/2022",
          description: ["Allgemeine Sekundarschulbildung."]
        }
      ]
    },
    footer: { status: "SYSTEM: ONLINE", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | IT Portfolio", description: "Portfolio von Juan Felipe Lasso - Angehender Fachinformatiker." }
  }
};
