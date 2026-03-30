import type { Language } from "./translations";

export interface SkillMetric {
  id: string;
  level: number;
  category: "core" | "frontend" | "ai" | "security" | "data";
  label: Record<Language, string>;
}

export interface LocalizedSkill {
  id: string;
  level: number;
  category: SkillMetric["category"];
  name: string;
}

export const skillsData: SkillMetric[] = [
  {
    id: "linux-bash",
    level: 89,
    category: "core",
    label: { es: "Linux/Bash", en: "Linux/Bash", de: "Linux/Bash" },
  },
  {
    id: "python",
    level: 86,
    category: "core",
    label: { es: "Python", en: "Python", de: "Python" },
  },
  {
    id: "nextjs",
    level: 88,
    category: "frontend",
    label: { es: "Next.js", en: "Next.js", de: "Next.js" },
  },
  {
    id: "react-tailwind",
    level: 84,
    category: "frontend",
    label: { es: "React/Tailwind CSS", en: "React/Tailwind CSS", de: "React/Tailwind CSS" },
  },
  {
    id: "typescript-javascript",
    level: 87,
    category: "frontend",
    label: { es: "TypeScript/JavaScript", en: "TypeScript/JavaScript", de: "TypeScript/JavaScript" },
  },
  {
    id: "ai-agents",
    level: 81,
    category: "ai",
    label: { es: "Diseño de AI Agents", en: "AI Agents Design", de: "AI-Agents Design" },
  },
  {
    id: "vuln-analysis",
    level: 78,
    category: "security",
    label: { es: "Análisis de Vulnerabilidades", en: "Vulnerability Analysis", de: "Schwachstellenanalyse" },
  },
  {
    id: "data-analysis",
    level: 76,
    category: "data",
    label: { es: "Data Analysis", en: "Data Analysis", de: "Datenanalyse" },
  },
];

export const getLocalizedSkills = (language: Language): LocalizedSkill[] =>
  skillsData.map((skill) => ({
    id: skill.id,
    level: skill.level,
    category: skill.category,
    name: skill.label[language],
  }));
