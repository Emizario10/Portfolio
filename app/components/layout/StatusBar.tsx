"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, ShieldCheck } from "lucide-react";
import type { Translation } from "../../data/translations";

interface StatusBarProps {
  viewMode: "terminal" | "classic";
  onToggleViewMode: () => void;
  currentTranslation: Translation;
}

export default function StatusBar({ viewMode, onToggleViewMode, currentTranslation }: StatusBarProps) {
  const [clock, setClock] = useState("");
  const isClassic = viewMode === "classic";

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date().toLocaleTimeString("de-DE")), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="pointer-events-auto fixed left-1/2 top-4 z-[1000] -translate-x-1/2"
      style={{
        pointerEvents: "auto",
        position: "fixed",
        left: "50%",
        top: "16px",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "min(980px, calc(100% - 24px))",
      }}
    >
      <div
        className="rounded-2xl border border-cyan-300/45 bg-slate-950/90 px-4 py-3 backdrop-blur-xl"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.9rem",
          backgroundColor: "rgba(6, 14, 26, 0.9)",
          border: "1px solid rgba(103, 232, 249, 0.42)",
          borderRadius: "1rem",
          boxShadow: "0 0 22px rgba(34, 211, 238, 0.18), inset 0 0 0 1px rgba(103, 232, 249, 0.16)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flex: "1 1 280px", minWidth: "260px" }}>
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              border: "1px solid rgba(103, 232, 249, 0.3)",
              borderRadius: "1rem",
              flexShrink: 0,
            }}
          >
            <ShieldCheck className="h-5 w-5 text-cyan-200" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200">{currentTranslation.footer.status}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <span
                className="font-mono text-[11px] text-cyan-100"
                style={{ borderRadius: "9999px", backgroundColor: "rgba(34, 211, 238, 0.1)", padding: "0.28rem 0.7rem" }}
              >
                {currentTranslation.metadata.title}
              </span>
              <span
                className="font-mono text-[11px] text-slate-200"
                style={{ borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.06)", padding: "0.28rem 0.7rem" }}
              >
                CSOC CORE
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onToggleViewMode}
          aria-pressed={isClassic}
          className="view-toggle-btn micro-interactive"
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.55rem 0.7rem",
            borderRadius: "1rem",
            border: "1px solid rgba(103, 232, 249, 0.28)",
            backgroundColor: "rgba(255,255,255,0.03)",
            flex: "0 0 auto",
            boxShadow: "0 0 14px rgba(34, 211, 238, 0.12)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "148px",
              height: "42px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(18, 35, 58, 0.9))",
              border: "1px solid rgba(103, 232, 249, 0.24)",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "inset 0 0 18px rgba(2, 132, 199, 0.14)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                pointerEvents: "none",
                fontFamily: "Fira Code, monospace",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <span style={{ color: isClassic ? "rgba(186, 230, 253, 0.42)" : "#effdff" }}>TTY</span>
              <span style={{ color: isClassic ? "#effdff" : "rgba(186, 230, 253, 0.42)" }}>GUI</span>
            </div>
            <motion.div
              animate={{ x: isClassic ? 74 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                width: "66px",
                height: "32px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Fira Code, monospace",
                fontSize: "10px",
                fontWeight: 700,
                color: "#f8feff",
                textShadow: "0 0 10px rgba(255,255,255,0.15)",
                background: isClassic
                  ? "linear-gradient(135deg, rgba(103,232,249,1), rgba(34,211,238,0.95))"
                  : "linear-gradient(135deg, rgba(129,140,248,0.95), rgba(59,130,246,0.95))",
                boxShadow: isClassic
                  ? "0 0 16px rgba(34, 211, 238, 0.42)"
                  : "0 0 16px rgba(96, 165, 250, 0.38)",
              }}
            >
              {isClassic ? "GUI" : "TTY"}
            </motion.div>
          </div>
        </button>

        <div
          className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-white/[0.03] px-3 py-2"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            padding: "0.75rem 0.9rem",
            borderRadius: "1rem",
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(103, 232, 249, 0.24)",
            marginLeft: "auto",
          }}
        >
          <Clock3 className="h-4 w-4 text-cyan-200" />
          <span className="font-mono text-sm text-cyan-100">{clock}</span>
        </div>
      </div>
    </div>
  );
}
