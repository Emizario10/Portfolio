"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { FolderKanban } from "lucide-react";
import { translations, type Language } from "./data/translations";
import Projects from "./components/Projects";
import SkillsChart from "./components/SkillsChart";
import { getLocalizedSkills } from "./data/skills";
import LanguageSelector from "./components/layout/LanguageSelector";
import StatusBar from "./components/layout/StatusBar";
import MatrixRain from "./components/visual/MatrixRain";
import Terminal from "./components/terminal/Terminal";
import ExperienceSection from "./components/sections/ExperienceSection";
import EducationSection from "./components/sections/EducationSection";

type ViewMode = "terminal" | "classic";
type SectionId = "tech" | "projects" | "experience" | "education";

const ALL_SECTIONS: SectionId[] = ["tech", "projects", "experience", "education"];
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.992, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.58, ease: premiumEase } },
  exit: { opacity: 0, y: 10, scale: 0.994, filter: "blur(4px)", transition: { duration: 0.26, ease: "easeInOut" } },
};






/*
function Terminal({ currentTranslation, unlockSection, triggerMatrix, heroAnimationComplete }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isMonitorActive, setIsMonitorActive] = useState(false);
  const [isThreatMapActive, setIsThreatMapActive] = useState(false);
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
    () => [...Object.values(commands), "projects", "tucan", "leo", "ping", "trace", "monitor", "threatmap", "matrix"],
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
      const projectsCommandLabel = commands.projects === "projects" ? "projects" : `${commands.projects}/projects`;

      if (cmd === "monitor") {
        setIsThreatMapActive(false);
        setIsMonitorActive(true);
        addHistory({ type: "text", value: "[ entering monitor mode ]", tone: "success" });
        return;
      }

      if (cmd === "threatmap" || cmd === commands.threatmap) {
        setIsMonitorActive(false);
        setIsThreatMapActive(true);
        addHistory({ type: "text", value: "[ opening threat map :: global telemetry ]", tone: "success" });
        return;
      }

      if (cmd === "matrix" || cmd === commands.matrix) {
        track("Matrix_Triggered", { method: "Terminal Command" });
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
            projectsCommandLabel,
            commands.experience,
            commands.education,
            commands.stats,
            "ping",
            "trace",
            "monitor",
            commands.threatmap,
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

      if (cmd === commands.projects || cmd === "projects") {
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
        track("CV_Downloaded", { location: "Terminal" });
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
      currentTranslation.terminal.whoami.location,
      currentTranslation.terminal.whoami.name,
      currentTranslation.terminal.whoami.role,
      currentTranslation.terminal.whoami.tools,
      handlePing,
      handleStats,
      handleTrace,
      setIsThreatMapActive,
      triggerMatrix,
      unlockSection,
    ],
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (isBooting || isMonitorActive || isThreatMapActive) return;

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
      track("EasterEgg_Discovered", { method: "Green Button 3 Clicks" });
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

  const handleThreatMapExit = useCallback(() => {
    setIsThreatMapActive(false);
    addHistory({ type: "text", value: "[ threat map closed ]", tone: "dim" });
  }, [addHistory]);

  return (
    <div className="terminal-shell glass-card relative z-20 mx-auto max-w-4xl overflow-hidden rounded-lg border border-[#00f3ff]/30 backdrop-blur-xl">
      <div className="grid h-[38px] grid-cols-3 items-center border-b border-[#00f3ff]/20 bg-[#111826]/75 px-4 backdrop-blur-xl">
        <div className="neon-prompt text-left font-mono text-[9px] text-[#6a737d]">v2.5.0</div>
        <div className="neon-title text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#00f3ff]">LASSO PORTFOLIO</div>
        <div className="flex items-center justify-end gap-2">
          <button
            aria-label="window-red"
            className="terminal-control micro-interactive red h-3 w-3 rounded-full border border-[#ff5f56]/80 bg-[#2d1616]"
            type="button"
          />
          <button
            aria-label="window-yellow"
            className="terminal-control micro-interactive yellow h-3 w-3 rounded-full border border-[#ffbd2e]/80 bg-[#2e2516]"
            type="button"
          />
          <button
            aria-label="window-green"
            onClick={handleGreenButtonClick}
            className="terminal-control micro-interactive green h-3 w-3 rounded-full border border-[#27c93f]/90 bg-[#0f3a1b]"
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
          ) : isThreatMapActive ? (
            <ThreatMap onExit={handleThreatMapExit} />
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
*/

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [language, setLanguage] = useState<Language>("es");
  const [viewMode, setViewMode] = useState<ViewMode>("terminal");
  const [unlockedSections, setUnlockedSections] = useState<SectionId[]>([]);
  const [displayText, setDisplayText] = useState("");
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [ctfActive, setCtfActive] = useState(false);
  const [ctfClicks, setCtfClicks] = useState(0);
  const currentTranslation = translations[language];

  const triggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
  }, []);

  const resetMatrix = useCallback(() => setIsMatrixActive(false), []);

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

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const hoverSelector = ".micro-interactive, .project-card__action, .threatmap-exit-btn";

    const handleMouseOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(hoverSelector);
      if (!target || !root.contains(target)) return;
      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;

      gsap.to(target, {
        y: -2,
        boxShadow: "0 0 14px rgba(34, 211, 238, 0.32)",
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(hoverSelector);
      if (!target || !root.contains(target)) return;
      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;

      gsap.to(target, {
        y: 0,
        scale: 1,
        boxShadow: "none",
        duration: 0.2,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(hoverSelector);
      if (!target || !root.contains(target)) return;

      gsap.to(target, {
        scale: 0.985,
        duration: 0.09,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const handleMouseUp = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(hoverSelector);
      if (!target || !root.contains(target)) return;

      gsap.to(target, {
        scale: 1,
        duration: 0.12,
        ease: "power2.out",
        overwrite: true,
      });
    };

    root.addEventListener("mouseover", handleMouseOver);
    root.addEventListener("mouseout", handleMouseOut);
    root.addEventListener("mousedown", handleMouseDown);
    root.addEventListener("mouseup", handleMouseUp);

    const ctx = gsap.context(() => {
      gsap.to(".hero-role-line", {
        textShadow: "0 0 16px rgba(0, 243, 255, 0.48)",
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".section-shell-title", {
        textShadow: "0 0 12px rgba(0, 243, 255, 0.4)",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.22,
        ease: "sine.inOut",
      });

      gsap.to(".terminal-shell", {
        boxShadow: "0 0 24px rgba(34, 211, 238, 0.3), 0 22px 38px rgba(0, 0, 0, 0.5)",
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => {
      root.removeEventListener("mouseover", handleMouseOver);
      root.removeEventListener("mouseout", handleMouseOut);
      root.removeEventListener("mousedown", handleMouseDown);
      root.removeEventListener("mouseup", handleMouseUp);
      ctx.revert();
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
        const topOffset = viewMode === "classic" ? 150 : 120;
        const top = element.getBoundingClientRect().top + window.scrollY - topOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 80);
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === "terminal" ? "classic" : "terminal";
      setUnlockedSections(next === "classic" ? [...ALL_SECTIONS] : []);
      return next;
    });
  };

  const shouldShowSection = (id: SectionId) => viewMode === "classic" || unlockedSections.includes(id);
  const localizedSkills = useMemo(() => getLocalizedSkills(language), [language]);
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

  return (
    <motion.main ref={mainRef} className="hacker-surface crt-effect relative min-h-screen bg-[#0a0b10] pt-6 text-[#e0e6ed] shadow-[inset_0_0_100px_rgba(0,243,255,0.03)]">
      <div className={`grid-bg circuit-bg pointer-events-none fixed inset-0 z-0 opacity-40 ${isMatrixActive ? "flicker-active" : ""}`} />

      <StatusBar viewMode={viewMode} onToggleViewMode={toggleViewMode} currentTranslation={currentTranslation} />
      <LanguageSelector language={language} setLanguage={setLanguage} />

      {viewMode === "classic" && (
        <div
          className="pointer-events-none fixed left-6 top-[5.75rem] z-[990]"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="rounded-2xl border border-emerald-300/35 bg-[#08140f]/90 px-4 py-3 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(6, 18, 12, 0.92)",
              border: "1px solid rgba(110, 231, 183, 0.35)",
              borderRadius: "1rem",
              padding: "0.9rem 1rem",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.18), inset 0 0 0 1px rgba(110, 231, 183, 0.12)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 12px rgba(52, 211, 153, 0.65)" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-200">Root Access</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">Classic view active</p>
            <p className="mt-1 font-mono text-[11px] text-emerald-100/80">authorized // premium GUI layer</p>
          </div>
        </div>
      )}

      <section
        className="container relative z-10 mx-auto overflow-hidden border-b border-[#2d3748]/30 px-6 pb-16"
        style={{ paddingTop: viewMode === "classic" ? "11.5rem" : "10rem" }}
      >
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
          <motion.p variants={sectionVariants} className="hero-role-line neon-title mt-2 text-base text-[#00f3ff] md:text-lg">
            {currentTranslation.hero.role}
          </motion.p>
        </motion.div>
      </section>

      <section className="container relative z-20 mx-auto px-6 py-16">
        <h2 className="section-shell-title neon-title mb-8 font-mono text-[#00f3ff]">
          <span className="mr-2">&gt;</span>
          {currentTranslation.terminal.sectionTitle}
        </h2>
        <Terminal
          currentTranslation={currentTranslation}
          unlockSection={unlockSection}
          triggerMatrix={triggerMatrix}
          heroAnimationComplete={heroAnimationComplete}
          ctfActive={ctfActive}
          setCtfActive={setCtfActive}
          ctfClicks={ctfClicks}
          setCtfClicks={setCtfClicks}
        />
      </section>

      <AnimatePresence mode="sync">
        {shouldShowSection("tech") && (
          <motion.section id="tech" key="tech" initial="hidden" animate="visible" exit="exit" variants={sectionVariants} className="container relative z-10 mx-auto px-6 py-12">
            <h2 className="section-shell-title neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
              <FolderKanban className="h-5 w-5" />
              <span>&gt;</span>
              {currentTranslation.techStack.sectionTitle}
            </h2>
            <SkillsChart title={currentTranslation.techStack.sectionTitle} skills={localizedSkills} />
          </motion.section>
        )}

        {shouldShowSection("projects") && (
          <motion.section id="projects" key="projects" initial="hidden" animate="visible" exit="exit" variants={sectionVariants} className="container relative z-10 mx-auto px-6 py-12">
            <h2 className="section-shell-title neon-title mb-8 flex items-center gap-2 font-mono text-[#00f3ff]">
              <FolderKanban className="h-5 w-5" />
              <span>&gt;</span>
              {currentTranslation.projects.sectionTitle}
            </h2>
            <Projects language={language} />
          </motion.section>
        )}

        {shouldShowSection("experience") && (
          <ExperienceSection
            key="experience"
            sectionTitle={currentTranslation.workExperience.sectionTitle}
            items={currentTranslation.workExperience.items}
            sectionVariants={sectionVariants}
            containerVariants={containerVariants}
          />
        )}

        {shouldShowSection("education") && (
          <EducationSection
            sectionTitle={currentTranslation.education.sectionTitle}
            items={educationItems}
            sectionVariants={sectionVariants}
            containerVariants={containerVariants}
          />
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
