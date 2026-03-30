import type { Language } from "./translations";

export type ProjectId = "portfolio" | "luxus-vibe";

export interface LocalizedProjectContent {
  title: string;
  description: string;
  highlights: string[];
}

export interface PortfolioProject {
  id: ProjectId;
  date: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
  featured?: boolean;
  isAiPowered?: boolean;
  role?: string;
  content: Record<Language, LocalizedProjectContent>;
}

export const projectsData: PortfolioProject[] = [
  {
    id: "portfolio",
    date: "2026 - Presente",
    tech: ["Next.js", "TypeScript", "GSAP", "Framer Motion", "Tailwind CSS"],
    repoUrl: "https://github.com/Emizario10/Portfolio",
    demoUrl: "https://portfolio-kappa-three-rjwyss70hq.vercel.app",
    featured: true,
    isAiPowered: true,
    role: "Lead Developer",
    content: {
      es: {
        title: "Portfolio CSOC Terminal",
        description: "Portfolio personal con identidad terminal/hacker, sistema de comandos y visualizaciones de seguridad.",
        highlights: [
          "Arquitectura con modo TTY/GUI y desbloqueo de secciones por comandos.",
          "Threat Map interactivo con telemetría simulada y animaciones GSAP.",
          "Soporte multilenguaje ES/EN/DE y diseño orientado a rendimiento.",
        ],
      },
      en: {
        title: "CSOC Terminal Portfolio",
        description: "Personal portfolio with a terminal/hacker identity, command engine, and security visualizations.",
        highlights: [
          "TTY/GUI architecture with command-based section unlocking.",
          "Interactive Threat Map with simulated telemetry and GSAP animation.",
          "ES/EN/DE multilingual support with performance-focused design.",
        ],
      },
      de: {
        title: "CSOC Terminal Portfolio",
        description: "Persönliches Portfolio mit Terminal/Hacker-Identität, Befehls-Engine und Security-Visualisierung.",
        highlights: [
          "TTY/GUI-Architektur mit befehlsbasierter Freischaltung von Sektionen.",
          "Interaktive Threat-Map mit simulierter Telemetrie und GSAP-Animationen.",
          "Mehrsprachigkeit (ES/EN/DE) und performance-orientiertes Design.",
        ],
      },
    },
  },
  {
    id: "luxus-vibe",
    date: "2025 - Presente",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    repoUrl: "https://github.com/Emizario10/luxus-vibe",
    demoUrl: "https://luxus-vibe.vercel.app",
    featured: true,
    isAiPowered: true,
    role: "Full-Stack Developer",
    content: {
      es: {
        title: "Luxus Vibe",
        description: "Plataforma boutique de e-commerce enfocada en productos de belleza con estética premium.",
        highlights: [
          "UI/UX elegante y responsive para experiencia de compra moderna.",
          "Estructura escalable con Next.js App Router y TypeScript.",
          "Integración de feedback de usuarios y despliegue continuo en Vercel.",
        ],
      },
      en: {
        title: "Luxus Vibe",
        description: "Boutique e-commerce platform for beauty products with a premium visual identity.",
        highlights: [
          "Elegant responsive UI/UX for a modern shopping experience.",
          "Scalable structure with Next.js App Router and TypeScript.",
          "User-feedback integration and continuous deployment on Vercel.",
        ],
      },
      de: {
        title: "Luxus Vibe",
        description: "Boutique-E-Commerce-Plattform für Beauty-Produkte mit Premium-Designsprache.",
        highlights: [
          "Elegantes responsives UI/UX für ein modernes Einkaufserlebnis.",
          "Skalierbare Struktur mit Next.js App Router und TypeScript.",
          "Nutzerfeedback-Integration und Continuous Deployment auf Vercel.",
        ],
      },
    },
  },
];
