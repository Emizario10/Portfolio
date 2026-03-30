"use client";

import { Languages } from "lucide-react";
import type { Language } from "../../data/translations";

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  return (
    <div
      className="pointer-events-auto fixed z-[1000]"
      style={{ pointerEvents: "auto", position: "fixed", top: "88px", right: "24px", zIndex: 1000 }}
    >
      <div
        className="flex items-center gap-2 rounded-2xl border border-cyan-300/45 bg-slate-950/90 p-1.5 backdrop-blur-xl"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          backgroundColor: "rgba(6, 14, 26, 0.9)",
          border: "1px solid rgba(103, 232, 249, 0.42)",
          borderRadius: "1rem",
          padding: "0.45rem",
          boxShadow: "0 0 18px rgba(34, 211, 238, 0.18), inset 0 0 0 1px rgba(103, 232, 249, 0.08)",
        }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            backgroundColor: "rgba(34, 211, 238, 0.1)",
            border: "1px solid rgba(103, 232, 249, 0.3)",
            borderRadius: "0.85rem",
          }}
        >
          <Languages className="h-4 w-4 text-cyan-200" />
        </div>
        {(["es", "en", "de"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            type="button"
            aria-label={`Switch language to ${lang.toUpperCase()}`}
            className={`lang-switch-btn micro-interactive rounded-xl px-3 py-2 text-xs font-mono uppercase transition ${
              language === lang ? "text-cyan-50" : "text-cyan-100 hover:text-white"
            }`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "42px",
              height: "36px",
              borderRadius: "0.85rem",
              padding: "0 0.8rem",
              color: language === lang ? "#f8feff" : "#d8fbff",
              border: language === lang ? "1px solid rgba(186, 230, 253, 0.5)" : "1px solid rgba(103, 232, 249, 0.12)",
              background: language === lang
                ? "linear-gradient(135deg, rgba(34, 211, 238, 0.85), rgba(59, 130, 246, 0.95))"
                : "rgba(255,255,255,0.02)",
              boxShadow: language === lang ? "0 0 12px rgba(34, 211, 238, 0.35)" : "none",
            }}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
