"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ThreatMap from "../ThreatMap";
import { J_ASCII, LION_ASCII, TOUCAN_ASCII } from "../../data/ascii";
import { LEO_HINT, MATRIX_HINT, MATRIX_FINAL_MESSAGE } from "../../data/ctfMessages";
import { runDecryption } from "../../../lib/ctfCrypto";
import type { Translation } from "../../data/translations";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { track } from "@vercel/analytics";

type SectionId = "tech" | "projects" | "experience" | "education";

type HistoryEntry =
  | { type: "prompt"; value: string }
  | { type: "text"; value: React.ReactNode; tone?: "normal" | "dim" | "success" | "warn" }
  | { type: "whoami"; ascii: string[]; info: Array<{ label: string; value: string }> }
  | { type: "ascii"; art: string[] };

interface TerminalProps {
  currentTranslation: Translation;
  unlockSection: (section: SectionId) => void;
  triggerMatrix: () => void;
  heroAnimationComplete: boolean;
  ctfActive: boolean;
  setCtfActive: (v: boolean) => void;
  ctfClicks: number;
  setCtfClicks: (n: number) => void;
}

interface MonitorData {
  latency: number;
  jitter: number;
  packetLoss: number;
  traffic: number;
  bufferPool: number;
  queryTime: number;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const ALL_SECTIONS: SectionId[] = ["tech", "projects", "experience", "education"];

const WhoAmIRenderer = ({ data }: { data: Extract<HistoryEntry, { type: "whoami" }> }) => (
  <div className="mb-4 space-y-4">
    <pre className="ascii-art ascii-container whitespace-pre text-[9px] text-[#00f3ff] leading-[0.72] tracking-tighter md:text-[12px]">
      {data.ascii.join("\n")}
    </pre>
    <div className="grid grid-cols-1 gap-1 border-t border-[#2d3748] pt-3 md:grid-cols-2">
      {data.info.map((item) => (
        <p key={item.label} className="terminal-output text-xs font-mono text-[#94a3b8]">
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

export default function Terminal({ currentTranslation, unlockSection, triggerMatrix, heroAnimationComplete, ctfActive, setCtfActive, ctfClicks, setCtfClicks }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isMonitorActive, setIsMonitorActive] = useState(false);
  const [isThreatMapActive, setIsThreatMapActive] = useState(false);
  const [monitorData, setMonitorData] = useState<MonitorData>({
    latency: 14.0,
    jitter: 0.2,
    packetLoss: 0.0,
    traffic: 72,
    bufferPool: 92,
    queryTime: 0.004,
  });
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const ctfDotsRef = useRef<HTMLDivElement>(null);
  const [ctfStage, setCtfStage] = useState<number>(0); // 0 = none, 1 = tucan, 2 = leo, 3 = matrix
  const [isMatrixMode, setIsMatrixMode] = useState<boolean>(false);

  useGSAP(() => {
    if (ctfActive) {
      gsap.fromTo(".ctf-dot", { opacity: 0.3, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, { scope: ctfDotsRef, dependencies: [ctfActive] });

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
        { type: "text", value: <span>{currentTranslation.terminal.initialMessage1}<span className="loading-dots"></span></span>, tone: "dim" },
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

  const genHash = useCallback((len = 8) => {
    const chars = "abcdef0123456789";
    let s = "";
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s.toUpperCase();
  }, []);

  // runDecryption lives in lib/ctfCrypto and is imported above

    // Persist ctfStage and matrixActive to localStorage whenever stage changes
    useEffect(() => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem("lasso_ctfStage", String(ctfStage));
        if (ctfStage >= 3) {
          localStorage.setItem("lasso_matrixActive", "1");
          setIsMatrixMode(true);
        } else {
          localStorage.removeItem("lasso_matrixActive");
          setIsMatrixMode(false);
        }
      } catch (e) {
        // ignore storage errors
      }
    }, [ctfStage]);

    // Restore persisted CTF state on mount without duplicating logs
    useEffect(() => {
      if (typeof window === "undefined") return;
      try {
        const saved = Number(localStorage.getItem("lasso_ctfStage") || "0");
        const savedMatrix = localStorage.getItem("lasso_matrixActive") === "1";
        if (saved > 0) {
          setCtfStage(saved);
          setCtfActive(true);
          // Reveal ASCII artifacts for already-unlocked stages, but do not replay decryption logs
          if (saved >= 1) {
            addHistory({ type: "ascii", art: TOUCAN_ASCII });
            // If the leo hint was never shown, show it now and persist the flag
            try {
              const hintKey = "lasso_ctf_hint_leo_shown";
              const already = typeof window !== "undefined" && localStorage.getItem(hintKey) === "1";
              if (!already) {
                addHistory({ type: "text", value: LEO_HINT, tone: "dim" });
                if (typeof window !== "undefined") localStorage.setItem(hintKey, "1");
              }
            } catch (e) {
              // ignore storage errors
            }
          }
          if (saved >= 2) addHistory({ type: "ascii", art: LION_ASCII });
        }

        if (savedMatrix) {
          setCtfStage(3);
          setCtfActive(true);
          setIsMatrixMode(true);
          // Trigger matrix override silently (no extra history lines)
          try {
            triggerMatrix();
          } catch {}
        }
      } catch (e) {
        // ignore
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const handleStats = useCallback(async () => {
    addHistory({ type: "text", value: <span>{currentTranslation.terminal.apiMessages.fetching}<span className="loading-dots"></span></span>, tone: "dim" });
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
        if (!ctfActive) {
          addHistory({ type: "text", value: "CTF is inactive. Click the CTF dots to activate.", tone: "dim" });
          return;
        }
        if (ctfStage < 2) {
          addHistory({ type: "text", value: "Access denied. Decrypt 'leo' first to unlock matrix override.", tone: "warn" });
          return;
        }

        // Enter matrix mode with polished UX
        const enterMatrixMode = async (showUI = true) => {
          if (showUI) track("Matrix_Triggered", { method: "Terminal Command" });
          setCtfStage((prev) => Math.max(prev, 3));
          setIsMatrixMode(true);
          try {
            if (typeof window !== "undefined") localStorage.setItem("lasso_matrixActive", "1");
          } catch {}
          try {
            triggerMatrix();
          } catch {}
          if (showUI) addHistory({ type: "text", value: MATRIX_FINAL_MESSAGE, tone: "success" });
        };

        await enterMatrixMode(true);
        return;
      }

      if (cmd === "tucan") {
        if (!ctfActive) {
          addHistory({ type: "text", value: "CTF is inactive. Click the CTF dots to activate and obtain the encrypted payload.", tone: "dim" });
          return;
        }

        if (ctfStage >= 1) {
          addHistory({ type: "text", value: "Tucan already decrypted. 'leo' command is available.", tone: "dim" });
          return;
        }

        await runDecryption("tucan", 1, addHistory, playBeep);

        // Immediately print ASCII for tucan (handlers control ASCII display)
        addHistory({ type: "ascii", art: TOUCAN_ASCII });

        // Show the one-time hint for 'leo' (print first, then persist)
        try {
          const hintKey = "lasso_ctf_hint_leo_shown";
          const already = typeof window !== "undefined" && localStorage.getItem(hintKey) === "1";
          if (!already) {
            addHistory({ type: "text", value: LEO_HINT, tone: "dim" });
            if (typeof window !== "undefined") localStorage.setItem(hintKey, "1");
          }
        } catch (e) {
          // ignore storage errors
        }

        // Promote to next stage AFTER ASCII and hint printing
        setCtfStage((prev) => Math.max(prev, 1));

        return;
      }

      if (cmd === "leo") {
        if (!ctfActive) {
          addHistory({ type: "text", value: "CTF is inactive. Click the CTF dots to activate.", tone: "dim" });
          return;
        }

        if (ctfStage < 1) {
          addHistory({ type: "text", value: "Access denied. Decrypt 'tucan' first to obtain the next payload.", tone: "warn" });
          return;
        }

        if (ctfStage >= 2) {
          addHistory({ type: "text", value: "Leo already decrypted. 'matrix' command is available.", tone: "dim" });
          return;
        }

        await runDecryption("leo", 2, addHistory, playBeep);

        // Immediately print ASCII for leo
        addHistory({ type: "ascii", art: LION_ASCII });

        // Show the one-time hint for 'matrix' (print first, then persist)
        try {
          const hintKey = "lasso_ctf_hint_matrix_shown";
          const already = typeof window !== "undefined" && localStorage.getItem(hintKey) === "1";
          if (!already) {
            addHistory({ type: "text", value: MATRIX_HINT, tone: "dim" });
            if (typeof window !== "undefined") localStorage.setItem(hintKey, "1");
          }
        } catch (e) {
          // ignore storage errors
        }

        // Promote to next stage AFTER ASCII and hint printing
        setCtfStage((prev) => Math.max(prev, 2));

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

      if (cmd === "ctf") {
        // Report current CTF status without reprinting ASCII or hints
        const savedLeo = typeof window !== "undefined" && localStorage.getItem("lasso_ctf_hint_leo_shown") === "1";
        const savedMatrixHint = typeof window !== "undefined" && localStorage.getItem("lasso_ctf_hint_matrix_shown") === "1";
        const savedMatrix = typeof window !== "undefined" && localStorage.getItem("lasso_matrixActive") === "1";
        const nextCmd = ctfStage === 0 ? "tucan" : ctfStage === 1 ? "leo" : ctfStage === 2 ? "matrix" : "none";
        addHistory([
          { type: "text", value: `CTF stage: ${ctfStage}`, tone: "dim" },
          { type: "text", value: `Next command: ${nextCmd}`, tone: "dim" },
          { type: "text", value: `Matrix active: ${savedMatrix ? "yes" : "no"}`, tone: "dim" },
          { type: "text", value: `Hint 'leo' shown: ${savedLeo ? "yes" : "no"}`, tone: "dim" },
          { type: "text", value: `Hint 'matrix' shown: ${savedMatrixHint ? "yes" : "no"}`, tone: "dim" },
        ]);
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
      runDecryption,
      ctfActive,
      ctfStage,
      setCtfStage,
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
    // Activate CTF and show progressive hint, but DO NOT unlock stages here.
    const nextClicks = ctfClicks + 1;
    setCtfClicks(nextClicks);
    if (!ctfActive) setCtfActive(true);
    track("CTF_Activated", { method: "GreenButton" });
    addHistory({ type: "text", value: `${currentTranslation.terminal.clues.clickHint} (${nextClicks})`, tone: "dim" });
  };

  const handleCTFClick = () => {
    // Activate CTF and emit a contextual hint. Do NOT unlock stages via clicks.
    const nextClicks = ctfClicks + 1;
    setCtfClicks(nextClicks);
    if (!ctfActive) setCtfActive(true);
    track("CTF_Activated", { method: "CTF_Dot" });
    addHistory({ type: "text", value: `${currentTranslation.terminal.clues.clickHint} (${nextClicks})`, tone: "dim" });
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
    <div className={`terminal-frame terminal-shell ${isMatrixMode ? "matrix-mode" : ""}`}>
      <div className="terminal-header-container">
        <div className="terminal-header-line"></div>
          <div className="terminal-header-title-group flex items-center justify-between w-full">
            {/* Columna izquierda vacía para balance visual */}
            <div className="header-spacer w-8" />

            {/* Título centrado */}
            <span className="terminal-header-title text-center flex-1">
              {currentTranslation.metadata.title ?? "LASSO PORTFOLIO"} v2.5.0
            </span>

            {/* Puntos CTF a la derecha */}
            <div className="ctf-dots ml-4" ref={ctfDotsRef} aria-hidden={false}>
              <span
                className="ctf-dot clickable-dot"
                role="button"
                tabIndex={0}
                aria-label={currentTranslation.ui?.aiBadge ?? currentTranslation.terminal.clues.clickHint}
                onClick={handleCTFClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCTFClick();
                  }
                }}
              />
              <span className="ctf-dot" aria-hidden />
              <span className="ctf-dot" aria-hidden />
            </div>
          </div>
        <div className="terminal-header-line"></div>
      </div>

      <div
        className="relative z-20 h-[440px] pointer-events-auto overflow-y-auto custom-scrollbar p-4"
        onClick={() => document.getElementById("terminal-input")?.focus()}
      >
        <div className="relative z-10 pointer-events-auto">
          {isMonitorActive ? (
            <MonitorDashboard data={monitorData} />
          ) : isThreatMapActive ? (
            <ThreatMap onExit={handleThreatMapExit} currentTranslation={currentTranslation} />
          ) : (
            <>
              {history.map((item, index) => {
                if (item.type === "prompt") {
                  return (
                    <div key={`prompt-${index}`} className="prompt-line flex flex-wrap">
                      <span className="text-[#00f3ff]">{currentTranslation.terminal.prompt.user}</span>
                      <span>@</span>
                      <span className="text-[#00f3ff]">{currentTranslation.terminal.prompt.host}</span>
                      <span>{currentTranslation.terminal.prompt.separator} </span>
                      <span>${item.value}</span>
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
                  <p key={`line-${index}`} className={`terminal-output whitespace-pre-wrap break-words ${lineToneClass(item.tone)}`}>
                    {item.value}
                  </p>
                );
              })}
              <div ref={terminalEndRef} />

              {!isBooting && (
                <div className="prompt-line flex items-center">
                  <span className="text-[#00f3ff]">{currentTranslation.terminal.prompt.user}</span>
                  <span>@</span>
                  <span className="text-[#00f3ff]">{currentTranslation.terminal.prompt.host}</span>
                  <span>{currentTranslation.terminal.prompt.separator} </span>
                  <input
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoFocus
                    className="ml-2 flex-1 bg-transparent outline-none"
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
