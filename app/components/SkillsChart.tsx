"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { memo, useRef } from "react";
import type { LocalizedSkill } from "../data/skills";

interface SkillsChartProps {
  title: string;
  skills: LocalizedSkill[];
}

type SkillTone = "elite" | "advanced" | "solid" | "base";

const toneByLevel = (level: number): SkillTone => {
  if (level >= 88) return "elite";
  if (level >= 80) return "advanced";
  if (level >= 72) return "solid";
  return "base";
};

function SkillsChartComponent({ title, skills }: SkillsChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const rows = gsap.utils.toArray<HTMLElement>(".skills-chart__row");
      const fills = gsap.utils.toArray<HTMLElement>(".skills-chart__bar-fill");

      gsap.set(rows, { autoAlpha: 0, y: 14 });
      gsap.set(fills, { width: "0%" });

      let hasAnimated = false;

      const animateSkills = () => {
        gsap.to(rows, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.08,
          ease: "power2.out",
        });

        fills.forEach((fill, index) => {
          const level = Number(fill.dataset.level ?? 0);
          gsap.to(fill, {
            width: `${level}%`,
            duration: 1.05,
            delay: 0.18 + index * 0.08,
            ease: "power3.out",
            overwrite: true,
          });
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting || hasAnimated) return;
          hasAnimated = true;
          animateSkills();
          observer.disconnect();
        },
        { threshold: 0.32 },
      );

      observer.observe(root);

      const cleanups: Array<() => void> = [];

      rows.forEach((row) => {
        const onEnter = () => {
          gsap.to(row, {
            y: -2,
            boxShadow: "0 0 14px rgba(34, 211, 238, 0.28)",
            duration: 0.18,
            ease: "power2.out",
            overwrite: true,
          });
        };

        const onLeave = () => {
          gsap.to(row, {
            y: 0,
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.2,
            ease: "power2.out",
            overwrite: true,
          });
        };

        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          row.removeEventListener("mouseenter", onEnter);
          row.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => {
        observer.disconnect();
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: rootRef, dependencies: [skills], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className="skills-chart">
      <h3 className="skills-chart__title">
        <span className="mr-2">&gt;</span>
        {title}
      </h3>
      <div className="skills-chart__list">
        {skills.map((skill) => {
          const tone = toneByLevel(skill.level);
          return (
            <div key={skill.id} className="skills-chart__row">
              <div className="skills-chart__meta">
                <span>{skill.name}</span>
                <span className="skills-chart__value">{skill.level}%</span>
              </div>
              <div
                className="skills-chart__bar-track"
                role="progressbar"
                aria-label={`${skill.name} proficiency`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={skill.level}
              >
                <div
                  className={`skills-chart__bar-fill skills-chart__bar-fill--${tone}`}
                  data-level={skill.level}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SkillsChart = memo(SkillsChartComponent);

export default SkillsChart;
