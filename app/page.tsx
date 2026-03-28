"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Briefcase, FolderKanban, GraduationCap, type LucideIcon } from "lucide-react";
import {
  translations,
  type EducationData,
  type ExperienceData,
  type Language,
  type ProjectData,
  type Translation,
} from "./data/translations";
import { J_ASCII, LION_ASCII, TOUCAN_ASCII } from "./data/ascii";

type ViewMode = "terminal" | "classic";
type SectionId = "tech" | "projects" | "experience" | "education";

const ALL_SECTIONS: SectionId[] = ["tech", "projects", "experience", "education"];
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.25 } },
};

interface BoardCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  date: string;
  badges?: string[];
  children: ReactNode;
}

const BoardCard = ({ icon: Icon, title, subtitle, date, badges = [], children }: BoardCardProps) => (
  <motion.article
    whileHover={{ y: -4, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
    <div className="pointer-events-none absolute -inset-px rounded-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-pulse [box-shadow:0_0_34px_rgba(34,211,238,0.45)]" />
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

type HistoryEntry =
  | { type: "prompt"; value: string }
  | { type: "text"; value: string; tone?: "normal" | "dim" | "success" | "warn" }
  | { type: "whoami"; ascii: string[]; info: Array<{ label: string; value: string }> }
  | { type: "ascii"; art: string[] };

interface TerminalProps {
  currentTranslation: Translation;
  unlockSection: (section: SectionId) => void;
  triggerMatrix: () => void;
  heroAnimationComplete: boolean;
}

interface MonitorData {
  latency: number;
  jitter: number;
  packetLoss: number;
  traffic: number;
  bufferPool: number;
  queryTime: number;
}

const WhoAmIRenderer = ({ data }: { data: Extract<HistoryEntry, { type: "whoami" }> }) => (
  <div className="mb-4 space-y-4">
    <pre className="ascii-art ascii-container whitespace-pre text-[9px] text-[#00f3ff] leading-[0.72] tracking-tighter md:text-[12px]">
      {data.ascii.join("\n")}
    </pre>
    <div className="grid grid-cols-1 gap-1 border-t border-[#2d3748] pt-3 md:grid-cols-2">
      {data.info.map((item) => (
        <p key={item.label} className="text-xs font-mono text-[#94a3b8]">
          <span className="text-[#00ff41]">{item.label}:</span> {item.value}
        </p>
      ))}
    </div>
  </div>
);

const AsciiArtRenderer = ({ data }: { data: Extract<HistoryEntry, { type: "ascii" }> }) => (
  <pre className="ascii-art ascii-container mb-3 whitespace-pre text-[9px] text-[#00f3ff] leading-[0.72] tracking-tighter md:text-[12px]">
    {data.art.join("\n")}
  </pre>
);

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let drops: number[] = [];
    const chars = "アカサタナハマヤラワ0123456789ABCDEF";
    const fontSize = 16;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => 1);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="!pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
};

const LanguageSelector = ({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
}) => (
  <div className="glass-card pointer-events-auto fixed right-6 top-10 z-[1000] flex gap-3 rounded-full px-3 py-2 backdrop-blur-xl">
    {(["es", "en", "de"] as Language[]).map((lang) => (
      <button
        key={lang}
        onClick={() => setLanguage(lang)}
        className={`rounded-full px-3 py-1 text-xs font-mono uppercase transition ${
          language === lang ? "bg-[#00f3ff] text-black" : "text-[#94a3b8] hover:text-white"
        }`}
      >
        {lang}
      </button>
    ))}
  </div>
);

const StatusBar = ({
  viewMode,
  onToggleViewMode,
}: {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
}) => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date().toLocaleTimeString("de-DE")), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-auto fixed left-0 right-0 top-0 z-[1000] flex h-6 items-center justify-between border-b border-[#2d3748]/30 bg-black/35 px-4 backdrop-blur-sm">
      <div className="neon-prompt flex items-center gap-4 font-mono text-[10px] text-[#00f3ff]">
        <span>[ SYSTEM: ONLINE ]</span>
        <span>[ NODE: LASSO.SEC ]</span>
      </div>
      <button onClick={onToggleViewMode} className="neon-prompt font-mono text-[10px] text-[#00f3ff] hover:underline">
        [ MODE: {viewMode.toUpperCase()} ]
      </button>
      <div className="neon-prompt font-mono text-[10px] text-[#00f3ff]">[ {clock} ]</div>
    </div>
  );
};

const MonitorDashboard = ({ data }: { data: MonitorData }) => {
  const barLength = 24;
  const filled = Math.round((data.traffic / 100) * barLength);
  const bar = `[${"|".repeat(filled)}${" ".repeat(Math.max(0, barLength - filled))}]`;

  return (
    <div className="font-mono text-xs text-[#e0e6ed]">
      <div className="neon-title mb-4 text-center text-[#00f3ff]">[ NOC MONITOR :: lasso.sec ]</div>
      <div className="mb-4 space-y-1 border-y border-[#00f3ff]/20 py-3">
        <div>
          <span className="text-[#94a3b8]">LATENCY:</span> <span className="text-[#00f3ff]">{data.latency.toFixed(1)}ms</span>
          <span className="text-[#94a3b8]"> (jitter {data.jitter.toFixed(2)}ms)</span>
        </div>
        <div>
          <span className="text-[#94a3b8]">PACKET_LOSS:</span>{" "}
          <span className="text-[#00f3ff]">{data.packetLoss.toFixed(2)}%</span>
        </div>
        <div>
          <span className="text-[#94a3b8]">ACTIVE_HOPS:</span> <span className="text-[#00ff41]">4</span>
        </div>
      </div>
      <div className="space-y-1">
        <div>
          <span className="text-[#94a3b8]">TRAFFIC:</span> <span className="text-[#00f3ff]">{bar}</span>{" "}
          <span className="text-[#00f3ff]">{data.traffic}%</span>
        </div>
        <div>
          <span className="text-[#94a3b8]">DB_BUFFER_POOL:</span> <span className="text-[#00f3ff]">{data.bufferPool}%</span>
        </div>
        <div>
          <span className="text-[#94a3b8]">QUERY_EXEC_TIME:</span> <span className="text-[#00f3ff]">{data.queryTime.toFixed(4)}s</span>
        </div>
      </div>
      <div className="mt-6 text-center text-[10px] text-[#94a3b8]">Press ESC or Ctrl+C to exit monitor</div>
    </div>
  );
};

function Terminal({ currentTranslation, unlockSection, triggerMatrix, heroAnimationComplete }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isMonitorActive, setIsMonitorActive] = useState(false);
  const [ctfClicks, setCtfClicks] = useState(0);
  const [monitorData, setMonitorData] = useState<MonitorData>({
    latency: 14.0,
    jitter: 0.2,
    packetLoss: 0.0,
    traffic: 72,
    bufferPool: 92,
    queryTime: 0.004,
  });
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const commands = currentTranslation.terminal.commands;
  const commandVocabulary = useMemo(
    () => [...Object.values(commands), "tucan", "leo", "ping", "trace", "monitor", "matrix"],
    [commands],
  );

  const addHistory = useCallback((entry: HistoryEntry | HistoryEntry[]) => {
    setHistory((prev) => [...prev, ...(Array.isArray(entry) ? entry : [entry])]);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isMonitorActive]);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      setIsBooting(true);
      setHistory([]);
      const bootLines: HistoryEntry[] = [
        { type: "ascii", art: J_ASCII },
        { type: "text", value: currentTranslation.terminal.initialMessage1, tone: "dim" },
        { type: "text", value: currentTranslation.terminal.initialMessage2, tone: "dim" },
      ];

      for (const line of bootLines) {
        if (!mounted) return;
        addHistory(line);
        await sleep(120);
      }

      while (mounted && !heroAnimationComplete) {
        await sleep(150);
      }

      if (mounted) {
        setIsBooting(false);
      }
    };

    void boot();
    return () => {
      mounted = false;
    };
  }, [addHistory, currentTranslation, heroAnimationComplete]);

  useEffect(() => {
    if (!isMonitorActive) return;

    const interval = window.setInterval(() => {
      setMonitorData({
        latency: 12 + Math.random() * 6,
        jitter: 0.1 + Math.random() * 0.4,
        packetLoss: Math.random() < 0.02 ? 0.25 : 0.0,
        traffic: Math.floor(Math.random() * 35) + 60,
        bufferPool: Math.floor(Math.random() * 10) + 90,
        queryTime: 0.002 + Math.random() * 0.006,
      });
    }, 800);

    const handleExit = (event: KeyboardEvent) => {
      if (event.key === "Escape" || (event.ctrlKey && event.key.toLowerCase() === "c")) {
        event.preventDefault();
        setIsMonitorActive(false);
        addHistory({ type: "text", value: "[ monitor exited ]", tone: "dim" });
      }
    };

    document.addEventListener("keydown", handleExit);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("keydown", handleExit);
    };
  }, [addHistory, isMonitorActive]);

  const playBeep = useCallback(() => {
    if (isMuted || typeof window === "undefined") return;
    const audioContext = new window.AudioContext();
    const osc = audioContext.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(840, audioContext.currentTime);
    osc.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.08);
  }, [isMuted]);

  const handleStats = useCallback(async () => {
    addHistory({ type: "text", value: currentTranslation.terminal.apiMessages.fetching, tone: "dim" });
    try {
      const response = await fetch("https://api.github.com/users/Emizario10");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { public_repos?: number; followers?: number; following?: number; login?: string };
      addHistory([
        { type: "text", value: "[ GITHUB_USER :: Emizario10 ]", tone: "success" },
        { type: "text", value: `login: ${data.login ?? "Emizario10"}` },
        { type: "text", value: `public_repos: ${data.public_repos ?? 0}` },
        { type: "text", value: `followers: ${data.followers ?? 0}` },
        { type: "text", value: `following: ${data.following ?? 0}` },
      ]);
      playBeep();
    } catch {
      addHistory({ type: "text", value: currentTranslation.terminal.apiMessages.error, tone: "warn" });
    }
  }, [addHistory, currentTranslation.terminal.apiMessages.error, currentTranslation.terminal.apiMessages.fetching, playBeep]);

  const handlePing = useCallback(async () => {
    const target = "lasso.sec";
    addHistory({ type: "text", value: `PING ${target} (104.21.31.14): 56 data bytes`, tone: "dim" });

    for (let seq = 1; seq <= 4; seq += 1) {
      await sleep(260 + Math.floor(Math.random() * 220));
      const latency = Math.floor(Math.random() * (35 - 12 + 1)) + 12;
      addHistory({
        type: "text",
        value: `64 bytes from ${target}: icmp_seq=${seq} ttl=54 time=${latency}ms`,
      });
    }

    addHistory([
      { type: "text", value: "--- lasso.sec ping statistics ---", tone: "dim" },
      { type: "text", value: "4 packets transmitted, 4 received, 0% packet loss", tone: "success" },
    ]);
    playBeep();
  }, [addHistory, playBeep]);

  const handleTrace = useCallback(async () => {
    const baseTimes = [3, 12, 21, 29];
    const hops: Array<{ label: string; host: string }> = [
      { label: "Gateway", host: "192.168.1.1" },
      { label: "ISP", host: "10.44.0.1" },
      { label: "Backbone", host: "145.220.16.4" },
      { label: "Destination", host: "lasso.sec" },
    ];

    addHistory({ type: "text", value: "Tracing route to lasso.sec...", tone: "dim" });

    for (let i = 0; i < hops.length; i += 1) {
      await sleep(280 + Math.floor(Math.random() * 260));
      const delta = Math.floor(Math.random() * 5) - 2;
      const time = Math.max(1, baseTimes[i] + delta);
      addHistory({
        type: "text",
        value: ` ${i + 1}  ${hops[i].host.padEnd(18)}  ${hops[i].label.padEnd(11)}  ${time}ms`,
      });
    }

    addHistory({ type: "text", value: "Trace complete.", tone: "success" });
    playBeep();
  }, [addHistory, playBeep]);

  const processCmd = useCallback(
    async (rawCmd: string) => {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      if (cmd === "monitor") {
        setIsMonitorActive(true);
        addHistory({ type: "text", value: "[ entering monitor mode ]", tone: "success" });
        return;
      }

      if (cmd === "matrix" || cmd === commands.matrix) {
        triggerMatrix();
        addHistory({ type: "text", value: "[ RED PILL SELECTED :: MATRIX OVERRIDE ]", tone: "success" });
        return;
      }

      if (cmd === "tucan") {
        addHistory([
          { type: "ascii", art: TOUCAN_ASCII },
          { type: "text", value: "The watcher knows the path to the Lion. Command 'leo' required." },
        ]);
        return;
      }

      if (cmd === "leo") {
        addHistory([
          { type: "ascii", art: LION_ASCII },
          { type: "text", value: "Simulation breach detected. Use command 'matrix' to override reality." },
        ]);
        return;
      }

      if (cmd === commands.help) {
        addHistory({
          type: "text",
          value: `${currentTranslation.terminal.availableText}: ${[
            commands.whoami,
            commands.about,
            commands.skills,
            commands.projects,
            commands.experience,
            commands.education,
            commands.stats,
            "ping",
            "trace",
            "monitor",
            commands.socials,
            commands.all,
            commands.clear,
            commands.sudo,
            commands.mute,
            commands.unmute,
          ].join(", ")}`,
          tone: "dim",
        });
        return;
      }

      if (cmd === commands.whoami) {
        addHistory({
          type: "whoami",
          ascii: J_ASCII,
          info: [
            { label: currentTranslation.terminal.whoami.name, value: "Juan Felipe Lasso" },
            { label: currentTranslation.terminal.whoami.role, value: currentTranslation.hero.role },
            { label: currentTranslation.terminal.whoami.location, value: "Göttingen, DE" },
            { label: currentTranslation.terminal.whoami.tools, value: "Python, SQL, Linux, Next.js" },
          ],
        });
        return;
      }

      if (cmd === commands.about) {
        addHistory({ type: "text", value: currentTranslation.terminal.aboutResponse });
        return;
      }

      if (cmd === commands.skills) {
        unlockSection("tech");
        addHistory({ type: "text", value: "Accessing [TECH_STACK] ... [OK]", tone: "success" });
        return;
      }

      if (cmd === commands.projects) {
        unlockSection("projects");
        addHistory({ type: "text", value: "Accessing [PROJECTS] ... [OK]", tone: "success" });
        return;
      }

      if (cmd === commands.experience) {
        unlockSection("experience");
        addHistory({ type: "text", value: "Accessing [WORK_EXPERIENCE] ... [OK]", tone: "success" });
        return;
      }

      if (cmd === commands.education) {
        unlockSection("education");
        addHistory({ type: "text", value: "Accessing [EDUCATION] ... [OK]", tone: "success" });
        return;
      }

      if (cmd === commands.all) {
        ALL_SECTIONS.forEach(unlockSection);
        addHistory({ type: "text", value: "Unlocking all sections ... [OK]", tone: "success" });
        return;
      }

      if (cmd === commands.socials) {
        addHistory([
          { type: "text", value: "GitHub: https://github.com/Emizario10", tone: "dim" },
          { type: "text", value: "LinkedIn: https://www.linkedin.com/in/juan-felipe-lasso-rodriguez/", tone: "dim" },
        ]);
        return;
      }

      if (cmd === commands.cv) {
        window.open("/cv.pdf", "_blank");
        addHistory({ type: "text", value: "Requesting secure download... [COMPLETE]", tone: "success" });
        return;
      }

      if (cmd === commands.sudo) {
        addHistory({ type: "text", value: currentTranslation.terminal.hiring.sudoMsg, tone: "success" });
        window.setTimeout(() => window.open("mailto:juanfe13lasso@gmail.com", "_blank"), 1000);
        return;
      }

      if (cmd === commands.clear) {
        setHistory([]);
        return;
      }

      if (cmd === commands.mute) {
        setIsMuted(true);
        addHistory({ type: "text", value: "System sound muted.", tone: "dim" });
        return;
      }

      if (cmd === commands.unmute) {
        setIsMuted(false);
        addHistory({ type: "text", value: "System sound enabled.", tone: "success" });
        return;
      }

      if (cmd === commands.stats || cmd === "stats") {
        await handleStats();
        return;
      }

      if (cmd === "ping" || cmd.startsWith("ping ")) {
        await handlePing();
        return;
      }

      if (cmd === "trace") {
        await handleTrace();
        return;
      }

      addHistory({ type: "text", value: `${commands.notFound}: ${cmd}`, tone: "warn" });
    },
    [
      addHistory,
      commands,
      currentTranslation.hero.role,
      currentTranslation.terminal.aboutResponse,
      currentTranslation.terminal.availableText,
      currentTranslation.terminal.hiring.sudoMsg,
      currentTranslation.terminal.whoami.name,
      currentTranslation.terminal.whoami.role,
      currentTranslation.terminal.whoami.tools,
      handlePing,
      handleStats,
      handleTrace,
      triggerMatrix,
      unlockSection,
    ],
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (isBooting || isMonitorActive) return;

    if (event.key === "Tab") {
      event.preventDefault();
      const query = input.trim().toLowerCase();
      if (!query) return;
      const match = commandVocabulary.find((item) => item.toLowerCase().startsWith(query));
      if (match) {
        setInput(match);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      const newPointer = Math.min(historyPointer + 1, commandHistory.length - 1);
      setHistoryPointer(newPointer);
      setInput(commandHistory[newPointer] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!commandHistory.length) return;
      const newPointer = Math.max(historyPointer - 1, -1);
      setHistoryPointer(newPointer);
      setInput(newPointer === -1 ? "" : commandHistory[newPointer] ?? "");
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;
      setHistoryPointer(-1);
      setCommandHistory((prev) => [cmd, ...prev.filter((item) => item !== cmd)].slice(0, 30));
      addHistory({ type: "prompt", value: cmd });
      setInput("");
      void processCmd(cmd);
    }
  };

  const handleGreenButtonClick = () => {
    const nextClicks = ctfClicks + 1;
    setCtfClicks(nextClicks);

    if (nextClicks >= 3) {
      setCtfClicks(0);
      addHistory({
        type: "text",
        value: "[SYSTEM] EXCEPTION: Encrypted packet intercepted. Source: 'Tucan'. Use command 'tucan' to decrypt.",
        tone: "warn",
      });
      return;
    }

    addHistory({
      type: "text",
      value: `${currentTranslation.terminal.clues.clickHint} (${nextClicks}/3)`,
      tone: "dim",
    });
  };

  const lineToneClass = (tone: "normal" | "dim" | "success" | "warn" | undefined) => {
    if (tone === "success") return "text-[#00ff41]";
    if (tone === "warn") return "text-[#ff7f7f]";
    if (tone === "dim") return "text-[#94a3b8]";
    return "text-[#e0e6ed]";
  };

  return (
    <div className="terminal-shell glass-card relative z-20 mx-auto max-w-4xl overflow-hidden rounded-lg border border-[#00f3ff]/30 backdrop-blur-xl">
      <div className="grid h-[38px] grid-cols-3 items-center border-b border-[#00f3ff]/20 bg-[#111826]/75 px-4 backdrop-blur-xl">
        <div className="neon-prompt text-left font-mono text-[9px] text-[#6a737d]">v2.5.0</div>
        <div className="neon-title text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#00f3ff]">LASSO PORTFOLIO</div>
        <div className="flex items-center justify-end gap-2">
          <button
            aria-label="window-red"
            className="terminal-control red h-3 w-3 rounded-full border border-[#ff5f56]/80 bg-[#2d1616]"
            type="button"
          />
          <button
            aria-label="window-yellow"
            className="terminal-control yellow h-3 w-3 rounded-full border border-[#ffbd2e]/80 bg-[#2e2516]"
            type="button"
          />
          <button
            aria-label="window-green"
            onClick={handleGreenButtonClick}
            className="terminal-control green h-3 w-3 rounded-full border border-[#27c93f]/90 bg-[#0f3a1b]"
            type="button"
          />
        </div>
      </div>

      <div
        className="relative z-20 h-[440px] pointer-events-auto overflow-y-auto bg-[#05070a]/80 p-6 pb-10 custom-scrollbar"
        onClick={() => document.getElementById("terminal-input")?.focus()}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,243,255,0.02) 2px, rgba(0,243,255,0.02) 4px)",
          }}
        />
        <div className="relative z-10 pointer-events-auto">
          {isMonitorActive ? (
            <MonitorDashboard data={monitorData} />
          ) : (
            <>
              {history.map((item, index) => {
                if (item.type === "prompt") {
                  return (
                    <div key={`prompt-${index}`} className="mb-1 flex flex-wrap terminal-text">
                      <span className="neon-prompt text-[#00f3ff]">{currentTranslation.terminal.prompt.user}</span>
                      <span className="text-white">@</span>
                      <span className="neon-prompt text-[#00f3ff]">{currentTranslation.terminal.prompt.host}</span>
                      <span className="text-white">{currentTranslation.terminal.prompt.separator} </span>
                      <span className="text-[#e0e6ed]">${item.value}</span>
                    </div>
                  );
                }

                if (item.type === "whoami") {
                  return <WhoAmIRenderer key={`whoami-${index}`} data={item} />;
                }

                if (item.type === "ascii") {
                  return <AsciiArtRenderer key={`ascii-${index}`} data={item} />;
                }

                return (
                  <p key={`line-${index}`} className={`mb-1 whitespace-pre-wrap break-words terminal-text ${lineToneClass(item.tone)}`}>
                    {item.value}
                  </p>
                );
              })}
              <div ref={terminalEndRef} />

              {!isBooting && (
                <div className="mt-2 flex items-center terminal-text">
                  <span className="neon-prompt text-[#00f3ff]">{currentTranslation.terminal.prompt.user}</span>
                  <span className="text-white">@</span>
                  <span className="neon-prompt text-[#00f3ff]">{currentTranslation.terminal.prompt.host}</span>
                  <span className="text-white">{currentTranslation.terminal.prompt.separator} </span>
                  <input
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoFocus
                    className="ml-2 flex-1 bg-transparent text-[#00f3ff] outline-none"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 border-t border-[#00f3ff]/10 bg-[#05070a]/80 py-1 text-center font-mono text-[8px] text-[#586069]">
          [ NODE: GÖTTINGEN-01 | PROTOCOL: TCP/IP | SECURE_TUNNEL: AES-256-GCM ]
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [viewMode, setViewMode] = useState<ViewMode>("terminal");
  const [unlockedSections, setUnlockedSections] = useState<SectionId[]>([]);
  const [displayText, setDisplayText] = useState("");
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const currentTranslation = translations[language];

  const triggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
    window.setTimeout(() => setIsMatrixActive(false), 8000);
  }, []);

  useEffect(() => {
    document.title = currentTranslation.metadata.title;
    document.documentElement.lang = language;
  }, [currentTranslation.metadata.title, language]);

  useEffect(() => {
    let mounted = true;

    const animate = async () => {
      const write = async (value: string, delay: number) => {
        for (const ch of value) {
          if (!mounted) return;
          setDisplayText((prev) => prev + ch);
          await sleep(delay);
        }
      };

      const erase = async (count: number, delay: number) => {
        for (let i = 0; i < count; i += 1) {
          if (!mounted) return;
          setDisplayText((prev) => prev.slice(0, -1));
          await sleep(delay);
        }
      };

      setDisplayText("");
      await write("JUAN_LASO", 110);
      await sleep(450);
      await erase(4, 45);
      await write("LASSO", 85);
      if (mounted) setHeroAnimationComplete(true);
    };

    void animate();
    return () => {
      mounted = false;
    };
  }, []);

  const unlockSection = useCallback((section: SectionId) => {
    setUnlockedSections((prev) => {
      if (prev.includes(section)) return prev;
      return [...prev, section];
    });
    window.setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 95;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 80);
  }, []);

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === "terminal" ? "classic" : "terminal";
      setUnlockedSections(next === "classic" ? [...ALL_SECTIONS] : []);
      return next;
    });
  };

  const shouldShowSection = (id: SectionId) => viewMode === "classic" || unlockedSections.includes(id);
  const educationItems = useMemo(() => {
    const items = [...currentTranslation.education.items];
    const ausbildungFromWork = currentTranslation.workExperience.items.find((item) =>
      item.title.toLowerCase().includes("net@vision"),
    );
    const alreadyInEducation = items.some((item) => item.title.toLowerCase().includes("net@vision"));
    if (ausbildungFromWork && !alreadyInEducation) {
      items.push({
        title: ausbildungFromWork.title,
        subtitle: ausbildungFromWork.subtitle,
        date: ausbildungFromWork.date,
        description: ausbildungFromWork.description,
      });
    }
    return items;
  }, [currentTranslation.education.items, currentTranslation.workExperience.items]);

  const renderProject = (project: ProjectData, idx: number) => (
    <BoardCard
      key={`${project.title}-${idx}`}
      icon={FolderKanban}
      title={project.title}
      date={project.date}
      badges={[
        ...(project.isAiPowered && project.aiBadgeText ? [project.aiBadgeText] : []),
        ...(project.role ? [project.role] : []),
      ]}
    >
      <div
        className="mb-1 flex flex-wrap gap-2"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.9rem" }}
      >
        {project.tech.split(",").map((tag, tagIdx) => (
          <span
            key={`${project.title}-${tag.trim()}-${tagIdx}`}
            className="rounded-full border border-[#00f3ff]/35 bg-[#00f3ff]/8 px-2.5 py-1 font-['Inter'] text-[11px] text-[#b9fbff] shadow-[0_0_10px_rgba(0,243,255,0.14)]"
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid rgba(103, 232, 249, 0.45)",
              backgroundColor: "rgba(34, 211, 238, 0.12)",
              borderRadius: "9999px",
              padding: "0.28rem 0.7rem",
              color: "#d7fbff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.74rem",
              letterSpacing: "0.01em",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.16)",
            }}
          >
            {tag.trim()}
          </span>
        ))}
      </div>
      <ul className="space-y-2" style={{ display: "flex", flexDirection: "column", gap: "0.65rem", paddingLeft: "1.1rem", margin: 0 }}>
        {project.description.map((point, pointIdx) => (
          <li
            key={`${project.title}-d-${pointIdx}`}
            className="text-sm leading-relaxed text-[#dbe8f5]"
            style={{ color: "#dbe8f5", lineHeight: 1.7, fontSize: "0.97rem" }}
          >
            {point}
          </li>
        ))}
      </ul>
    </BoardCard>
  );

  const renderExperience = (item: ExperienceData, idx: number) => (
    <BoardCard key={`${item.title}-${idx}`} icon={Briefcase} title={item.title} subtitle={item.subtitle} date={item.date}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.65rem", paddingLeft: "1.1rem", margin: 0 }}>
        {item.description.map((point, pointIdx) => (
          <li
            key={`${item.title}-p-${pointIdx}`}
            className="text-sm leading-relaxed text-[#dbe8f5]"
            style={{ color: "#dbe8f5", lineHeight: 1.7, fontSize: "0.97rem" }}
          >
            {point}
          </li>
        ))}
      </ul>
    </BoardCard>
  );

  const renderEducation = (item: EducationData, idx: number) => (
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
  );

  return (
    <motion.main className="crt-effect relative min-h-screen bg-[#0a0b10] pt-6 text-[#e0e6ed] shadow-[inset_0_0_100px_rgba(0,243,255,0.03)]">
      <div className={`grid-bg circuit-bg pointer-events-none fixed inset-0 z-0 opacity-40 ${isMatrixActive ? "flicker-active" : ""}`} />

      <StatusBar viewMode={viewMode} onToggleViewMode={toggleViewMode} />
      <LanguageSelector language={language} setLanguage={setLanguage} />

      {viewMode === "classic" && (
        <div className="glass-card pointer-events-none fixed right-6 top-24 z-40 -rotate-3 bg-[#fef08a]/90 px-4 py-3 font-mono text-xs text-black shadow-xl ring-1 ring-black/20 backdrop-blur-xl">
          <p className="font-bold">ROOT ACCESS</p>
          <p className="text-[10px]">authorized // classic view</p>
        </div>
      )}

      <section className="container relative z-10 mx-auto overflow-hidden border-b border-[#2d3748]/30 px-6 pb-16 pt-28">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.span variants={sectionVariants} className="neon-prompt mb-3 block font-mono text-sm text-[#00f3ff]">
            {currentTranslation.hero.status}
          </motion.span>
          <motion.h1 variants={sectionVariants} className="mb-8 flex h-[160px] flex-col gap-1 text-6xl font-black tracking-tighter md:h-[190px] md:text-8xl">
            <span className="text-[#e0e6ed]">{displayText.split("_")[0]}</span>
            <span className="bg-gradient-to-r from-[#00f3ff] via-[#00ff41] to-[#bc13fe] bg-clip-text text-transparent">
              _{displayText.split("_")[1] ?? ""}
              <span className="terminal-cursor text-[#00f3ff]">_</span>
            </span>
          </motion.h1>
          <motion.p variants={sectionVariants} className="max-w-2xl text-base text-[#94a3b8] md:text-lg">
            {currentTranslation.hero.description}
          </motion.p>
          <motion.p variants={sectionVariants} className="neon-title mt-2 text-base text-[#00f3ff] md:text-lg">
            {currentTranslation.hero.role}
          </motion.p>
        </motion.div>
      </section>

      <section className="container relative z-20 mx-auto px-6 py-16">
        <h2 className="neon-title mb-8 font-mono text-[#00f3ff]">
          <span className="mr-2">&gt;</span>
          {currentTranslation.terminal.sectionTitle}
        </h2>
        <Terminal
          currentTranslation={currentTranslation}
          unlockSection={unlockSection}
          triggerMatrix={triggerMatrix}
          heroAnimationComplete={heroAnimationComplete}
        />
      </section>

      <AnimatePresence mode="wait">
        {shouldShowSection("tech") && (
          <motion.section id="tech" key="tech" initial="hidden" animate="visible" exit="exit" variants={sectionVariants} className="container relative z-10 mx-auto px-6 py-12">
            <h2 className="neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
              <FolderKanban className="h-5 w-5" />
              <span>&gt;</span>
              {currentTranslation.techStack.sectionTitle}
            </h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3 max-w-3xl">
              {currentTranslation.techStack.skills.map((skill, idx) => (
                <motion.div 
                  key={`${skill}-${idx}`} 
                  variants={sectionVariants} 
                  whileHover={{ x: 8, backgroundColor: "rgba(34, 211, 238, 0.24)" }} 
                  className="relative w-full overflow-hidden rounded-md border border-cyan-300/70 bg-slate-950/95 px-5 py-3 font-mono text-sm text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all hover:border-cyan-200 hover:text-white hover:shadow-[0_0_24px_rgba(34,211,238,0.5)]"
                  style={{
                    backgroundColor: "rgba(7, 12, 22, 0.96)",
                    border: "1px solid rgba(103, 232, 249, 0.75)",
                    borderRadius: "0.45rem",
                    padding: "0.8rem 1.1rem",
                    boxShadow: "0 0 18px rgba(34, 211, 238, 0.28), inset 0 0 0 1px rgba(103,232,249,0.18)",
                    color: "#d8fbff",
                  }}
                >
                  <span className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-cyan-300/80" />
                  <span className="relative z-10">{skill}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {shouldShowSection("projects") && (
          <motion.section id="projects" key="projects" initial="hidden" animate="visible" exit="exit" variants={sectionVariants} className="container relative z-10 mx-auto px-6 py-12">
            <h2 className="neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
              <FolderKanban className="h-5 w-5" />
              <span>&gt;</span>
              {currentTranslation.projects.sectionTitle}
            </h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {currentTranslation.projects.items.map(renderProject)}
            </motion.div>
          </motion.section>
        )}

        {shouldShowSection("experience") && (
          <motion.section id="experience" key="experience" initial="hidden" animate="visible" exit="exit" variants={sectionVariants} className="container relative z-10 mx-auto px-6 py-12">
            <h2 className="neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
              <Briefcase className="h-5 w-5" />
              <span>&gt;</span>
              {currentTranslation.workExperience.sectionTitle}
            </h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
              {currentTranslation.workExperience.items.map(renderExperience)}
            </motion.div>
          </motion.section>
        )}

        {shouldShowSection("education") && (
          <motion.section id="education" key="education" initial="hidden" animate="visible" exit="exit" variants={sectionVariants} className="container relative z-10 mx-auto px-6 py-12">
            <h2 className="neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
              <GraduationCap className="h-5 w-5" />
              <span>&gt;</span>
              {currentTranslation.education.sectionTitle}
            </h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {educationItems.map(renderEducation)}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {isMatrixActive && <MatrixRain />}

      <footer className="relative z-10 py-10 text-center text-sm text-[#94a3b8]">
        <p>
          {currentTranslation.footer.status} | {currentTranslation.footer.copyright}
        </p>
      </footer>
    </motion.main>
  );
}
