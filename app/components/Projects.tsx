"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ExternalLink, FolderGit2, Sparkles } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import { projectsData } from "../data/projects";
import type { Language } from "../data/translations";

// Removed incorrect gsap.registerPlugin(useGSAP) (useGSAP is a hook, not a GSAP plugin)
import { translations } from "../data/translations";

interface ProjectsProps {
  language: Language;
}

function ProjectsComponent({ language }: ProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const localizedProjects = useMemo(
    () =>
      projectsData.map((project) => ({
        ...project,
        localized: project.content[language],
      })),
    [language],
  );

  const aiBadgeLabel = useMemo(() => {
    if (language === "es") return "IA-IMPULSADO";
    if (language === "de") return "KI-UNTERSTÜTZT";
    return "AI-POWERED";
  }, [language]);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: "power2.out",
          stagger: 0.12,
          clearProps: "transform,opacity",
        },
      );

      gsap.to(".project-card__badge", {
        boxShadow: "0 0 14px rgba(34, 211, 238, 0.4)",
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.08, from: "start" },
      });

      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const onEnter = () => {
          gsap.to(card, {
            y: -6,
            borderColor: "rgba(125, 211, 252, 0.8)",
            boxShadow: "0 0 24px rgba(34, 211, 238, 0.38), inset 0 0 0 1px rgba(125, 211, 252, 0.3)",
            duration: 0.22,
            ease: "power2.out",
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            borderColor: "rgba(103, 232, 249, 0.5)",
            boxShadow: "0 0 16px rgba(34, 211, 238, 0.18), inset 0 0 0 1px rgba(103, 232, 249, 0.14)",
            duration: 0.25,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: containerRef, dependencies: [language], revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className="projects-grid">
      {localizedProjects.map((project) => (
        <article key={project.id} className="project-card">
          <div className="project-card__head">
            <div>
              <h3 className="project-card__title">{project.localized.title}</h3>
              <p className="project-card__date">{project.date}</p>
            </div>
            {project.isAiPowered && (
              <span className="project-card__badge">
                <Sparkles className="h-3.5 w-3.5" />
                {translations[language].ui?.aiBadge ?? aiBadgeLabel}
              </span>
            )}
          </div>

          <p className="project-card__description">{project.localized.description}</p>

          <ul className="project-card__highlights">
            {project.localized.highlights.map((highlight, index) => (
              <li key={`${project.id}-highlight-${index}`}>{highlight}</li>
            ))}
          </ul>

          <div className="project-card__tech">
            {project.tech.map((tech) => (
              <span key={`${project.id}-${tech}`} className="project-card__tech-item">
                {tech}
              </span>
            ))}
          </div>

          <div className="project-card__actions">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="project-card__action"
              aria-label={`Open repository for ${project.localized.title}`}
            >
              <FolderGit2 className="h-4 w-4" />
              {translations[language].ui?.repo ?? "Repo"}
            </a>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="project-card__action"
                aria-label={`Open live demo for ${project.localized.title}`}
              >
                <ExternalLink className="h-4 w-4" />
                {translations[language].ui?.demo ?? "Demo"}
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

const Projects = memo(ProjectsComponent);

export default Projects;
