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
      stats: string; // New command
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
    hero: { name: "JUAN\nLASSO.", role: "Analista de Datos & Desarrollador", status: "// ESTADO: DISPONIBLE_PARA_AUSBILDUNG_2026", description: "Analista de datos en formación y desarrollador Python. Especializado en la automatización de procesos y optimización de flujos de trabajo en entornos Linux." },
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
        stats: "estadisticas" // New command
      },
      clues: {
        clickHint: "[ ! ] ALERTA: Anomalía detectada. Un intruso con pico enorme y colorido observa el sistema. Identifícalo...",
        tucanHint: "¡Observador localizado! Para avanzar, busca a mi leal compañero: es un Golden Retriever y comparte nombre con mi signo zodiacal (Agosto). Escribe su nombre.",
        leoHint: "¡Acceso Root concedido! El Rey del Sistema te espera. Para reescribir la realidad, invoca a la matrix."
      },
      hiring: { sudoMsg: "¡Permisos de Superusuario Reconocidos! Abriendo canal seguro con el candidato..." },
      apiMessages: { fetching: "Conectando con GitHub API...", error: "Error: No se pudo conectar con el servidor remoto." },
      aboutResponse: "Soy Juan Felipe Lasso. Curso el Master de IA en Big School y me apasiona la Ciberseguridad y los Videojuegos. Trato este portafolio como un CTF (Capture The Flag). Hay aves tropicales ocultas en el código. ¿Puedes encontrarlas?",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: { sectionTitle: "PILA_TECNOLÓGICA", skills: ["Linux/Bash", "Python", "Hardware/Redes", "SQL/Data", "JavaScript", "C#"] },
    projects: { sectionTitle: "PROYECTOS_DESTACADOS", items: [ { title: 'Proyecto "Luvi": Ecosistema Empresarial', date: '01/2024 – Hoy', tech: 'Python, SQLite, IA Generativa', isAiPowered: true, aiBadgeText: "IMPULSADO POR IA", description: ['Plataforma integral para gestión de inventarios y marketing.', 'Algoritmos de ML para predicción de stock.', 'Generación de campañas con IA.'] }, { title: 'Scripts de Automatización', date: '06/2023 – Hoy', tech: 'Bash, Python, System Admin', description: ['Scripts para backups automáticos y monitoreo de sistemas.', 'Optimización de flujos de trabajo en Linux.'] }, { title: 'The Lab: Desarrollo Personal', date: '2022 – Hoy', tech: 'JavaScript, Hardware', role: "HOBBYIST", description: ['Desarrollo de pequeñas apps para problemas cotidianos.', 'Reparación y modificación de hardware y PCs.'] } ] },
    workExperience: { sectionTitle: "EXPERIENCIA_LABORAL", items: [ { title: "Formación: Fachinformatiker Systemintegration", date: "12/2023 – 03/2024", subtitle: "Ausbildung (Göttingen)", description: ["Fundamentos de integración de sistemas y tecnología de redes.", "Gestión de infraestructuras IT profesionales."] }, { title: "Empleado de Ventas / Cajero", date: "10/2022 – Hoy", subtitle: "Kaufland, Göttingen", description: ["Gestión de efectivo y procesos bajo alta presión.", "Resolución de problemas con clientes."] } ] },
    education: { sectionTitle: "EDUCACIÓN", items: [ 
      { title: "Master en Desarrollo con IA", subtitle: "Big School", date: "2024 - Present", description: ["Desarrollo de software potenciado por LLMs", "Agentes autónomos y RAG"] },
      { title: "Ciberseguridad Ofensiva & Defensiva", subtitle: "Formación Continua", date: "2023 - Present", description: ["Hardening de sistemas", "Análisis de vulnerabilidades"] },
      { title: "Escuela Profesional de Economía (Informática)", date: "09/2022 – 07/2023", subtitle: "BBS1 Arnoldi-Schule", description: ["Enfoque en procesos económicos y TI."] }, 
      { title: "Certificado de Educación Secundaria", date: "09/2021 – 07/2022", subtitle: "BBS1 Arnoldi-Schule", description: [] } 
    ] },
    footer: { status: "SISTEMA: EN LÍNEA", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | Portafolio IT", description: "Portafolio de Fachinformatiker." }
  },
  en: {
    hero: { name: "JUAN\nLASSO.", role: "Data Analyst & Developer", status: "// STATUS: OPEN_FOR_AUSBILDUNG_2026", description: "Data Analyst in training and Python developer. Specialized in process automation and workflow optimization in Linux environments." },
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
        stats: "stats" // New command
      },
      clues: {
        clickHint: "[ ! ] ALERT: Anomaly detected. An intruder with a huge colorful beak is observing the system. Identify it...",
        tucanHint: "Watcher located! To proceed, seek my loyal companion: he is a Golden Retriever and shares his name with my zodiac sign (August). Type his name.",
        leoHint: "Root Access Granted! The King of the System awaits you. To rewrite reality, invoke the matrix."
      },
      hiring: { sudoMsg: "Superuser Permissions Recognized! Opening secure channel with candidate..." },
      apiMessages: { fetching: "Connecting to GitHub API...", error: "Error: Could not connect to remote server." },
      aboutResponse: "I am Juan Felipe Lasso. AI Master student at Big School, passionate about Cybersecurity and Game Dev. I treat this portfolio like a CTF. There are tropical birds hidden in the code. Can you find them?",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: { sectionTitle: "TECH_STACK", skills: ["Linux/Bash", "Python", "Hardware/Network", "SQL/Data", "JavaScript", "C#"] },
    projects: { sectionTitle: "FEATURED_PROJECTS", items: [ { title: 'Project "Luvi": AI-Powered Ecosystem', date: '01/2024 – Present', tech: 'Python, SQLite, Generative AI', isAiPowered: true, aiBadgeText: "AI-POWERED", description: ['Platform for inventory management and automated marketing.', 'ML algorithms for stock prediction.', 'AI-generated marketing campaigns.'] }, { title: 'Automation Scripts Portfolio', date: '06/2023 – Present', tech: 'Bash, Python, System Admin', description: ['Scripts for automated backups and system monitoring.', 'Linux workflow optimization.'] } ] },
    workExperience: { sectionTitle: "WORK_EXPERIENCE", items: [ { title: "Apprenticeship: System Integration Specialist", date: "12/2023 – 03/2024", subtitle: "Ausbildung (Göttingen)", description: ["Fundamentals of system integration and network technology.", "Professional IT infrastructure management."] }, { title: "Sales Employee / Cashier", date: "10/2022 – Present", subtitle: "Kaufland, Göttingen", description: ["Cash management under high pressure.", "Customer communication and problem solving."] } ] },
    education: { sectionTitle: "EDUCATION", items: [ 
      { title: "Master in AI Development", subtitle: "Big School", date: "2024 - Present", description: ["Software development powered by LLMs", "Autonomous agents and RAG"] },
      { title: "Offensive & Defensive Cybersecurity", subtitle: "Continuous Training", date: "2023 - Present", description: ["System hardening", "Vulnerability analysis"] },
      { title: "Vocational School of Economics (IT)", date: "09/2022 – 07/2023", subtitle: "BBS1 Arnoldi-Schule", description: ["Focus on economic processes and IT."] }, 
      { title: "Secondary School Certificate", date: "09/2021 – 07/2022", subtitle: "BBS1 Arnoldi-Schule", description: [] } 
    ] },
    footer: { status: "SYSTEM STATUS: ONLINE", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | IT Portfolio", description: "Portfolio of Juan Felipe Lasso - Aspiring IT Specialist." }
  },
  de: {
    hero: { name: "JUAN\nLASSO.", role: "Datenanalyst & Entwickler", status: "// STATUS: OFFEN_FÜR_AUSBILDUNG_2026", description: "Angehender Fachinformatiker für Daten- und Prozessanalyse. Spezialisiert auf Prozessautomatisierung und Workflow-Optimierung in Linux-Umgebungen." },
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
        stats: "stats" // New command
      },
      clues: {
        clickHint: "[ ! ] ANOMALIE ENTDECKT: Tropische Vögel in den Systemprotokollen gesichtet. Versuchen Sie, sie herbeizurufen...",
        tucanHint: "Sie haben den Beobachter gefunden. Suchen Sie nun meinen treuen Begleiter: Er ist ein Golden Retriever und trägt den Namen meines Sternzeichens (August). Geben Sie seinen Namen ein.",
        leoHint: "Root-Zugriff gewährt! Der König des Systems erwartet Sie. Um die Realität neu zu schreiben, rufen Sie die Matrix auf."
      },
      hiring: { sudoMsg: "Superuser-Berechtigungen erkannt! Sicheren Kanal zum Kandidaten öffnen..." },
      apiMessages: { fetching: "Verbindung mit GitHub API wird hergestellt...", error: "Fehler: Verbindung zum Remote-Server konnte nicht hergestellt werden." },
      aboutResponse: "Ich bin Juan Felipe Lasso. Ich studiere den KI-Master an der Big School und begeistere mich für Cybersicherheit und Videospielentwicklung. Ich behandle dieses Portfolio wie ein CTF (Capture The Flag). Im Code sind tropische Vögel versteckt. Können Sie sie finden?",
      contactResponse: "juanfe13lasso@gmail.com | +49 155 6310 0482"
    },
    techStack: { sectionTitle: "TECH_STACK", skills: ["Linux/Bash", "Python", "Hardware/Netzwerk", "SQL/Daten", "JavaScript", "C#"] },
    projects: { sectionTitle: "AUSGEWÄHLTE_PROJEKTE", items: [ { title: 'Projekt "Luvi": KI-Gestütztes Ökosystem', date: '01/2024 – Heute', tech: 'Python, SQLite, Generative KI', isAiPowered: true, aiBadgeText: "KI-BASIERT", description: ['Plattform für Bestandsmanagement und Marketing.', 'ML-Algorithmen zur Bestandsvorhersage.', 'KI-generierte Marketingkampagnen.'] }, { title: 'Automatisierungs-Skripte', date: '06/2023 – Heute', tech: 'Bash, Python, System Admin', description: ['Skripte für automatisierte Backups und Monitoring.', 'Optimierung von Linux-Workflows.'] }, { title: 'The Lab: Persönliche Entwicklung', date: '2022 – Heute', tech: 'JavaScript, Hardware', role: "HOBBYIST", description: ['Entwicklung kleiner Apps zur Problemlösung.', 'Reparatur y Modifikation von Hardware.'] } ] },
    workExperience: { sectionTitle: "BERUFSERFAHRUNG", items: [ { title: "Ausbildung: Fachinformatiker Systemintegration", date: "12/2023 – 03/2024", subtitle: "Göttingen", description: ["Grundlagen der Systemintegration und Netzwerktechnik.", "Einblick in professionelle IT-Infrastrukturen."] }, { title: "Mitarbeiter im Verkauf / Kassierer", date: "10/2022 – Heute", subtitle: "Kaufland, Göttingen", description: ["Arbeiten unter hohem Zeitdruck.", "Kundenkommunikation und Problemlösung."] } ] },
    education: { sectionTitle: "AUSBILDUNG", items: [ 
      { title: "Master in KI-Entwicklung", subtitle: "Big School", date: "2024 - Present", description: ["Softwareentwicklung mit Künstlicher Intelligenz und LLMs", "Autonome Agenten und RAG"] },
      { title: "Offensive & Defensive Cybersicherheit", subtitle: "Fortlaufende Schulung", date: "2023 - Present", description: ["Systemhärtung", "Schwachstellenanalyse"] },
      { title: "Berufsfachschule Wirtschaft (Informatik)", date: "09/2022 – 07/2023", subtitle: "BBS1 Arnoldi-Schule", description: ["Fokus auf wirtschaftliche Prozesse und IT."] }, 
      { title: "Hauptschulabschluss", date: "09/2021 – 07/2022", subtitle: "BBS1 Arnoldi-Schule", description: [] } 
    ] },
    footer: { status: "SYSTEM: ONLINE", copyright: "© 2026 Juan Felipe Lasso" },
    metadata: { title: "Juan Felipe | IT Portfolio", description: "Portfolio von Juan Felipe Lasso - Angehender Fachinformatiker." }
  }
};
