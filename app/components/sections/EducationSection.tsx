"use client";

import { motion, type Variants } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { EducationData } from "../../data/translations";
import BoardCard from "./BoardCard";

interface EducationSectionProps {
  sectionTitle: string;
  items: EducationData[];
  sectionVariants: Variants;
  containerVariants: Variants;
}

export default function EducationSection({ sectionTitle, items, sectionVariants, containerVariants }: EducationSectionProps) {
  return (
    <motion.section
      id="education"
      key="education"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={sectionVariants}
      className="container relative z-10 mx-auto px-6 py-12"
    >
      <h2 className="section-shell-title neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
        <GraduationCap className="h-5 w-5" />
        <span>&gt;</span>
        {sectionTitle}
      </h2>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item, idx) => (
          <BoardCard key={`${item.title}-${idx}`} icon={GraduationCap} title={item.title} subtitle={item.subtitle} date={item.date}>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.65rem", paddingLeft: "1.1rem", margin: 0 }}>
              {item.description.map((point, pointIdx) => (
                <li
                  key={`${item.title}-e-${pointIdx}`}
                  className="text-sm leading-relaxed text-[#dbe8f5]"
                  style={{ color: "#dbe8f5", lineHeight: 1.7, fontSize: "0.97rem" }}
                >
                  {point}
                </li>
              ))}
            </ul>
          </BoardCard>
        ))}
      </motion.div>
    </motion.section>
  );
}
