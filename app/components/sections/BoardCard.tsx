"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.985, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.62, ease: premiumEase } },
  exit: { opacity: 0, y: 12, scale: 0.99, filter: "blur(4px)", transition: { duration: 0.24, ease: "easeInOut" } },
};

interface BoardCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  date: string;
  badges?: string[];
  children: ReactNode;
}

export default function BoardCard({ icon: Icon, title, subtitle, date, badges = [], children }: BoardCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 210, damping: 18, mass: 0.8 }}
      className="group relative mb-6 w-full overflow-hidden rounded-xl border border-cyan-300/70 bg-slate-950/90 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.35)]"
      style={{
        backgroundColor: "rgba(6, 14, 26, 0.92)",
        border: "1px solid rgba(103, 232, 249, 0.78)",
        boxShadow: "0 0 24px rgba(34, 211, 238, 0.34), inset 0 0 0 1px rgba(103, 232, 249, 0.22)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl border border-cyan-200/40" />
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{ backgroundImage: "linear-gradient(140deg, rgba(34,211,238,0.22), rgba(34,211,238,0.05) 45%, transparent 70%)" }}
      />
      <div className="card-aura pointer-events-none absolute -inset-px rounded-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100 [box-shadow:0_0_34px_rgba(34,211,238,0.45)]" />
      <div className="relative z-10 flex flex-col gap-4" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", rowGap: "0.6rem", columnGap: "0.75rem" }}>
          <div className="flex items-start gap-3" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <Icon className="mt-0.5 h-5 w-5 text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
            <div>
              <h3 className="text-xl font-bold text-white drop-shadow-[0_0_6px_rgba(34,211,238,0.35)]">{title}</h3>
              {subtitle && <p className="mt-1 font-mono text-xs tracking-wide text-cyan-200">{subtitle}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
            <span className="font-mono text-xs text-cyan-300">{date}</span>
            {badges.map((badge) => (
              <span
                key={`${title}-${badge}`}
                className="rounded-full border border-cyan-300/70 bg-cyan-500/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.35)]"
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(103, 232, 249, 0.7)",
                  backgroundColor: "rgba(34, 211, 238, 0.2)",
                  borderRadius: "9999px",
                  padding: "0.25rem 0.6rem",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        {children}
      </div>
    </motion.article>
  );
}
