// app/page.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { translations, type Language, ProjectData, ExperienceData, EducationData } from './data/translations';
import { TOUCAN_ASCII, LION_ASCII, J_ASCII } from './data/ascii';

// --- CONSTANTS, TYPES, & HELPERS ---
type ViewMode = 'terminal' | 'classic';
type SectionId = 'tech' | 'projects' | 'experience' | 'education';
const ALL_SECTIONS: SectionId[] = ['tech', 'projects', 'experience', 'education'];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const sectionContainerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 30 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }, exit: { opacity: 0, transition: { duration: 0.3 } } };

// --- SPECIAL RESPONSE TYPES ---
interface WhoAmIResponse { type: 'whoami'; ascii: string[]; info: { label: string; value: string; }[]; }
interface AsciiArtResponse { type: 'ascii'; art: string[]; }
type HistoryItem = string | WhoAmIResponse | AsciiArtResponse;

// --- RENDERER & SPECIAL COMPONENTS ---
const WhoAmIRenderer: React.FC<{data: WhoAmIResponse}> = ({ data }) => (
  <div className="flex flex-col gap-4 mb-4">
    {/* Banner JSYSTEM en grande */}
    <div className="ascii-art whitespace-pre text-[#00f3ff] leading-none text-[10px] md:text-[14px]">
      {data.ascii.join('\n')}
    </div>
    
    {/* Información debajo con estilo de lista técnica */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 border-t border-[#2d3748] pt-4">
      {data.info.map((item, idx) => (
        <p key={idx} className="text-sm font-mono">
          <span className="text-[#00ff41]">{item.label}:</span>{" "}
          <span className="text-[#94a3b8]">{item.value}</span>
        </p>
      ))}
    </div>
  </div>
);
const AsciiArtRenderer: React.FC<{data: AsciiArtResponse}> = ({ data }) => ( <div className="ascii-art whitespace-pre text-[#00f3ff] leading-none text-[10px] md:text-[14px]">{data.art.join('\n')}</div> );

const MatrixRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;
        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const numbers = '0123456789';
        const alphabet = katakana + numbers;
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        const rainDrops: number[] = Array.from({ length: columns }).map(() => 1);
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px monospace`;
            for(let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                if(rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resizeCanvas); cancelAnimationFrame(animationFrameId); }
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[60] pointer-events-none" />;
};

// --- UI COMPONENTS ---
const StatusBar: React.FC<{ viewMode: ViewMode; onViewModeChange: () => void; }> = ({ viewMode, onViewModeChange }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('de-DE')), 1000);
    return () => clearInterval(timer);
  }, []);
  return ( <div className="fixed top-0 left-0 right-0 z-50 h-6 bg-black/30 backdrop-blur-sm border-b border-[#2d3748]/10 px-4 flex items-center justify-between"><div className="flex items-center gap-4 text-xs font-mono text-[#00f3ff]"><span>[ SYSTEM: ONLINE ]</span><span>[ LOC: GÖTTINGEN, DE ]</span></div><div className="flex items-center gap-4 text-xs font-mono"><div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]"></div></div><div className="flex items-center gap-4 text-xs font-mono"><button onClick={onViewModeChange} className="text-[#00f3ff] hover:bg-[#00f3ff]/20 px-2 rounded">[ MODE: {viewMode.toUpperCase()} ]</button><span className="text-[#00f3ff]">[ USER: GUEST_SESSION ]</span><span className="text-[#00f3ff]">[ {time} ]</span></div></div> );
};

const LanguageSelector: React.FC<{ currentLanguage: Language; setLanguage: (lang: Language) => void; }> = ({ currentLanguage, setLanguage }) => ( <div className="fixed top-10 right-6 z-50 flex gap-4 bg-[#0a0b10]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#2d3748] shadow-lg shadow-cyan-500/20">{(['es', 'en', 'de'] as Language[]).map((lang) => ( <button key={lang} onClick={() => setLanguage(lang)} className={`px-3 py-1 text-sm font-mono uppercase rounded-full transition-all duration-300 ${currentLanguage === lang ? 'bg-[#00f3ff] text-black shadow-md shadow-[#00f3ff]/50' : 'text-[#94a3b8] hover:text-white'}`}>{lang}</button>))}</div> );

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const [displayText, setDisplayText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [unlockedSections, setUnlockedSections] = useState<SectionId[]>([]);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const currentTranslation = translations[language];

  const triggerMatrix = () => {
    if (isMatrixActive) return;
    setIsMatrixActive(true);
    setTimeout(() => setIsMatrixActive(false), 8000);
  };

  useEffect(() => {
    const type = async (text: string, delay: number) => { for (let i = 0; i < text.length; i++) { setDisplayText(prev => prev + text[i]); await sleep(delay); }};
    const del = async (count: number, delay: number) => { for (let i = 0; i < count; i++) { setDisplayText(prev => prev.slice(0, -1)); await sleep(delay); }};
    const sequence = async () => { setDisplayText(""); await type("JUAN_LASO", 120); await sleep(600); await del(4, 40); await type("LASSO", 90); setHeroAnimationComplete(true); };
    sequence();
  }, []);

  useEffect(() => {
    document.title = currentTranslation.metadata.title;
    document.documentElement.lang = language;
  }, [language, currentTranslation.metadata]);

  const unlockSection = (sectionId: SectionId) => {
    setUnlockedSections(prev => {
      const element = document.getElementById(sectionId);
      const scrollTo = () => {
        if (element) { const elementPosition = element.getBoundingClientRect().top + window.pageYOffset; window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' }); }
      };
      if (prev.includes(sectionId)) { scrollTo(); return prev; }
      const newUnlocked = [...prev, sectionId];
      setTimeout(scrollTo, 100);
      return newUnlocked;
    });
  };
  
  const handleViewModeChange = () => { const newMode = viewMode === 'terminal' ? 'classic' : 'terminal'; setViewMode(newMode); if (newMode === 'classic') setUnlockedSections(ALL_SECTIONS); else setUnlockedSections([]); };

  return (
    <motion.main initial={false} className="crt-effect min-h-screen bg-[#0a0b10] text-[#e0e6ed] selection:bg-[#00f3ff] selection:text-black relative pt-6 shadow-[inset_0_0_100px_rgba(0,243,255,0.03)]">
      <StatusBar viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      <LanguageSelector currentLanguage={language} setLanguage={setLanguage} />
      <motion.section className="container mx-auto px-6 pt-32 pb-20 border-b border-[#2d3748]/30 relative overflow-hidden" variants={containerVariants} initial="hidden" animate="visible">
        {/* Optional: Space for background GIF or dynamic element */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br from-[#00f3ff] via-transparent to-[#bc13fe]" />
        
        {/* Scanline Effect - Monitor CRT Simulation */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 243, 255, 0.3) 2px, rgba(0, 243, 255, 0.3) 4px)',
            backgroundSize: '100% 4px'
          }}
        />
        
        <div className="relative z-10">
          <motion.span className="text-[#00f3ff] font-mono text-sm mb-4 block animate-pulse" variants={itemVariants}>
            {currentTranslation.hero.status}
          </motion.span>
          
          <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 flex flex-col gap-2 h-[160px] md:h-[200px]" style={{ letterSpacing: '0.1em' }}>
            <span className="text-[#e0e6ed] drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">{displayText.split('_')[0]}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#00ff41] to-[#bc13fe] drop-shadow-[0_0_20px_rgba(188,19,254,0.5)]">
              _{displayText.split('_')[1] || ""}<span className="terminal-cursor text-[#00f3ff]">_</span>
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-xl text-lg text-[#94a3b8] font-light leading-relaxed">
            {currentTranslation.hero.description}
          </motion.p>
          
          <motion.p variants={itemVariants} className="max-w-xl text-lg text-[#00f3ff] font-light leading-relaxed mt-2 drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
            {currentTranslation.hero.role}
          </motion.p>
        </div>
      </motion.section>
      <section className="container mx-auto px-6 py-20">
        <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center">
          <span className="mr-2">&gt;</span> {currentTranslation.terminal.sectionTitle}
        </h2>
        <Terminal 
          currentTranslation={currentTranslation} 
          unlockSection={unlockSection} 
          heroAnimationComplete={heroAnimationComplete} 
          triggerMatrix={triggerMatrix} 
        />
      </section>
      <AnimatePresence>
        {(viewMode === 'classic' || unlockedSections.includes('tech')) && (
          <motion.section id="tech" key="tech" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center" style={{ letterSpacing: '0.1em' }}>
              <span className="mr-2">&gt;</span> {currentTranslation.techStack.sectionTitle}
            </h2>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>
              {currentTranslation.techStack.skills.map((skill: string, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="skill-item p-4 border border-[#2d3748] bg-white/5 backdrop-blur-md text-center font-mono text-sm text-[#00f3ff] hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-300">
                  {skill}
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
        {(viewMode === 'classic' || unlockedSections.includes('projects')) && (
          <motion.section id="projects" key="projects" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center" style={{ letterSpacing: '0.1em' }}>
              <span className="mr-2">&gt;</span> {currentTranslation.projects.sectionTitle}
            </h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={sectionContainerVariants}>
              {currentTranslation.projects.items.map((project: ProjectData, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card backdrop-blur-md border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_25px_rgba(0,243,255,0.3)]" style={{ transition: 'all 0.3s ease' }}>
                  <div className="card-header flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <div className="flex items-center space-x-2">
                      {project.isAiPowered && (<span className="bg-[#bc13fe] text-white text-xs px-2 py-1 rounded-full font-mono">{project.aiBadgeText}</span>)}
                      {project.role && (<span className="bg-[#00f3ff] text-black text-xs px-2 py-1 rounded-full font-mono">{project.role}</span>)}
                      <span className="font-mono text-sm text-[#94a3b8]">{project.date}</span>
                    </div>
                  </div>
                  <p className="text-[#94a3b8] mb-4">{project.description}</p>
                  <div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{project.tech}</div>

                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
        {(viewMode === 'classic' || unlockedSections.includes('experience')) && (
          <motion.section id="experience" key="experience" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center" style={{ letterSpacing: '0.1em' }}>
              <span className="mr-2">&gt;</span> {currentTranslation.workExperience.sectionTitle}
            </h2>
            <motion.div className="space-y-6" variants={containerVariants}>
              {currentTranslation.workExperience.items.map((job: ExperienceData, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card shadow-[0_0_15px_rgba(188,19,254,0.1)] hover:shadow-[0_0_25px_rgba(188,19,254,0.3)]" style={{ transition: 'all 0.3s ease' }}>
                  <div className="card-header">
                    <h3 className="card-title">{job.title} - {job.subtitle}</h3>
                    <span className="card-date">{job.date}</span>
                  </div>

                  <ul className="list-disc list-inside text-[#e0e6ed]">
                    {job.description.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
        {(viewMode === 'classic' || unlockedSections.includes('education')) && (
          <motion.section id="education" key="education" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center" style={{ letterSpacing: '0.1em' }}>
              <span className="mr-2">&gt;</span> {currentTranslation.education.sectionTitle}
            </h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={sectionContainerVariants}>
              {currentTranslation.education.items.map((edu: EducationData, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card backdrop-blur-md border-white/10 shadow-[0_0_15px_rgba(0,255,65,0.1)] hover:shadow-[0_0_25px_rgba(0,255,65,0.3)]" style={{ transition: 'all 0.3s ease' }}>
                  <div className="card-header">
                    <h3 className="card-title">{edu.title} - {edu.subtitle}</h3>
                    <span className="card-date">{edu.date}</span>
                  </div>

                  <p className="text-[#e0e6ed]">{edu.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {isMatrixActive && <div style={{ zIndex: 5 }}><MatrixRain /></div>}
      <footer className="text-center py-10 text-[#94a3b8] text-sm border-t border-[#2d3748]/30"><p>{currentTranslation.footer.status} | {currentTranslation.footer.copyright}</p></footer>
    </motion.main>
  );
}

interface TerminalProps { currentTranslation: any; unlockSection: (id: SectionId) => void; triggerMatrix: () => void; heroAnimationComplete: boolean; }

function Terminal({ currentTranslation, unlockSection, triggerMatrix, heroAnimationComplete }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [contactStep, setContactStep] = useState(0);
  const [contactData, setContactData] = useState<{name: string; email: string; message: string}>({ name: '', email: '', message: '' });
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // State for the new monitor feature
  const [isMonitorActive, setIsMonitorActive] = useState(false);
  const [monitorData, setMonitorData] = useState({
    latency: 14.0,
    jitter: 0.2,
    packetLoss: 0.00,
    traffic: 68,
    bufferPool: 92,
    queryTime: 0.004,
  });

  // Effect for handling monitor mode (data updates and exit listener)
  useEffect(() => {
    if (!isMonitorActive) return;

    const interval = setInterval(() => {
      setMonitorData({
        latency: 12 + Math.random() * 4, // 12-16ms
        jitter: 0.1 + Math.random() * 0.3, // 0.1-0.4ms
        packetLoss: Math.random() < 0.01 ? 0.01 : 0.00, // Rarely show packet loss
        traffic: Math.floor(Math.random() * 40) + 60, // 60-100%
        bufferPool: Math.floor(Math.random() * 10) + 90, // 90-100%
        queryTime: 0.002 + Math.random() * 0.005, // 0.002-0.007s
      });
    }, 800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c')) {
        setIsMonitorActive(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to prevent memory leaks
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMonitorActive]);


  useEffect(() => {
    console.log('--- TERMINAL MONTADA ---');
    console.log('Terminal Component Mounted Successfully');
  }, []);

  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, isMonitorActive]);
  
  useEffect(() => {
    let isMounted = true;
    const boot = async () => {
      setIsBooting(true);
      setHistory([]);
      const bootSequence: HistoryItem[] = [ 
        { type: 'ascii', art: J_ASCII }, 
        currentTranslation.terminal.initialMessage1, 
        currentTranslation.terminal.initialMessage2
      ];
      for (const line of bootSequence) {
        if (!isMounted) return;
        setHistory(prev => [...prev, line]);
        await sleep(100);
      }
      while(isMounted && !heroAnimationComplete) {
          await sleep(200);
      }
      if (isMounted) setIsBooting(false);
    };
    boot();
    return () => { isMounted = false; };
  }, [currentTranslation, heroAnimationComplete]);

  const playBeep = () => { if(isMuted) return; const audioContext = new (window.AudioContext)(); const oscillator = audioContext.createOscillator(); oscillator.type = 'square'; oscillator.frequency.setValueAtTime(800, audioContext.currentTime); oscillator.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + 0.1); };

  const handleContactFlow = (input: string) => {
    let response: string = '';
    let nextStep = contactStep;
    switch(contactStep) {
        case 1:
            setContactData((prev: typeof contactData) => ({...prev, name: input}));
            response = currentTranslation.terminal.contact.askEmail;
            nextStep = 2;
            break;
        case 2:
            setContactData((prev: typeof contactData) => ({...prev, email: input}));
            response = currentTranslation.terminal.contact.askMessage;
            nextStep = 3;
            break;
        case 3:
            setContactData((prev: typeof contactData) => ({...prev, message: input}));
            setHistory(prev => [...prev, currentTranslation.terminal.contact.uploading, currentTranslation.terminal.contact.success]);
            nextStep = 0;
            break;
    }
    if (response) setHistory(prev => [...prev, response]);
    setContactStep(nextStep);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allCommands = [...Object.values(currentTranslation.terminal.commands), 'tucan', 'leo', 'leon', 'matrix', 'ping', 'query', 'sql', 'trace', 'monitor'];
    if (e.key === 'Tab') { e.preventDefault(); const currentInput = input.trim().toLowerCase(); if (currentInput === "") return; const foundCommand = allCommands.find(c => c && String(c).startsWith(currentInput)); if (foundCommand) { setInput(String(foundCommand)); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (commandHistory.length > 0 && historyPointer < commandHistory.length - 1) { const newPointer = historyPointer + 1; setHistoryPointer(newPointer); setInput(commandHistory[newPointer]); } } 
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (historyPointer > -1) { const newPointer = historyPointer - 1; setHistoryPointer(newPointer); setInput(newPointer === -1 ? "" : commandHistory[newPointer]); } } 
    else if (e.key === 'Enter') {
      if (isBooting) return;
      const currentInput = input.trim();
      if (currentInput === "" && contactStep === 0) return;
      const cmd = currentInput.toLowerCase();
      if (contactStep > 0 && allCommands.includes(cmd)) { setContactStep(0); }
      if(contactStep === 0 && currentInput !== "") { setCommandHistory(prev => [currentInput, ...prev.filter(c => c !== currentInput)].slice(0, 20)); }
      setHistoryPointer(-1);
      setHistory(prev => [...prev, `PROMPT::${currentInput}`]);
      setInput("");
      if (contactStep > 0) { handleContactFlow(currentInput); return; }
      processCommand(cmd);
    }
  };

  const processCommand = (cmd: string) => {
    let response: HistoryItem | HistoryItem[] = "";
    const { commands, whoami } = currentTranslation.terminal;
    if (cmd === 'monitor') {
        setIsMonitorActive(true);
        return;
    }
    if (cmd === 'matrix') { triggerMatrix(); response = "[ RED PILL SELECTED: REWRITING REALITY... ]"; }
    else if (cmd === 'tucan') { response = [{ type: 'ascii', art: TOUCAN_ASCII }, currentTranslation.terminal.clues.tucanHint]; } 
    else if (cmd === 'leo' || cmd === 'leon') { response = [{ type: 'ascii', art: LION_ASCII }, currentTranslation.terminal.clues.leoHint]; } 
    else if (cmd === commands.contact) { setContactStep(1); response = currentTranslation.terminal.contact.askName; } 
    else if (cmd === commands.whoami) { response = { type: 'whoami', ascii: J_ASCII, info: [ { label: whoami.name, value: "Juan Felipe Lasso" }, { label: whoami.role, value: "Data Analyst & Developer" }, { label: whoami.location, value: "Göttingen, DE" }, { label: whoami.tools, value: "Python, SQL, Linux, JS" }, ]}; } 
    else if (cmd === commands.cv) { response = "Requesting secure download... 100% [COMPLETE]"; window.open('/cv.pdf', '_blank'); }
    else if (cmd === commands.mute) { setIsMuted(true); response = "System sound muted."; } 
    else if (cmd === commands.unmute) { setIsMuted(false); response = "System sound enabled."; playBeep(); } 
    else if (cmd === 'trace') {
        const runTrace = async () => {
            playBeep();
            setHistory(prev => [...prev, `Tracing route to Juan Felipe Lasso's server...`]);
            await sleep(500);

            const hops = [
                ` 1  192.168.1.1 (gateway) [Göttingen, Germany]      2.4 ms`,
                ` 2  10.0.42.1 (GÖTTINGEN-IXP)                      15.8 ms`,
                ` 3  81.12.128.4 (PROVIDER-BACKBONE)               22.1 ms`,
                ` 4  216.58.208.78 (LASSO-BACKBONE)                 24.2 ms`,
                ` 5  [LASSO-CORE-01] (DESTINATION)                  31.5 ms`,
            ];

            for (const hop of hops) {
                setHistory(prev => [...prev, hop]);
                await sleep(Math.random() * 300 + 300);
            }

            await sleep(500);
            setHistory(prev => [...prev, 'Trace complete. Connection to Lasso Portfolio is SECURE.']);
            playBeep();
        };
        runTrace();
        return;
    }
    else if (cmd === commands.stats) {
      setHistory(prev => [...prev, currentTranslation.terminal.apiMessages.fetching]);
      fetch('https://api.github.com/users/Emizario10')
        .then(res => res.json())
        .then(data => {
          if (data.message === "Not Found") { throw new Error("User not found"); }
          const statsOutput = `
            <div class="my-3 p-4 border border-[#00f3ff]/20 bg-[#05070a] rounded-md font-mono text-xs" style="box-shadow: 0 0 15px rgba(0,0,0,0.5);">
              <div class="text-[#00f3ff] mb-2 font-bold underline">&gt;&gt; GITHUB_DATA_RETRIEVED:</div>
              <div class="grid grid-cols-1 gap-1">
                <div>USUARIO: <span class="text-white">Emizario10</span></div>
                <div>REPOS: <span class="text-[#00ff41]">${data.public_repos}</span></div>
                <div>FOLLOWERS: <span class="text-[#bc13fe]">${data.followers}</span></div>
              </div>
              <div class="mt-3 pt-3 border-t border-[#00f3ff]/10">
                <div class="text-[#00f3ff] mb-2 text-[10px]">TECH STACK DISTRIBUTION:</div>
                <div class="text-[10px] leading-relaxed">
                  <div>Python&nbsp;&nbsp;<span class="text-[#00ff41]">██████████</span> 85%</div>
                  <div>SQL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-[#00ff41]">████████</span> 70%</div>
                  <div>JS/TS&nbsp;&nbsp;&nbsp;<span class="text-[#00ff41]">██████</span> 55%</div>
                </div>
              </div>
              <div class="mt-2 text-[10px] text-[#586069] italic">Status: Secure Connection Verified</div>
            </div>
          `.trim();
          setHistory(prev => [...prev, statsOutput]);
          playBeep();
        })
        .catch(() => {
          setHistory(prev => [...prev, currentTranslation.terminal.apiMessages.error]);
        });
      return;
    }
    else if (cmd.startsWith('ping ')) {
      const target = cmd.split(' ')[1] || 'unknown';
      const pingLines = [];
      pingLines.push(`PING ${target} (8.8.8.8): 56 data bytes`);
      for (let i = 1; i <= 4; i++) {
        const time = (Math.random() * 20 + 10).toFixed(1);
        pingLines.push(`64 bytes from 8.8.8.8: icmp_seq=${i} ttl=117 time=${time} ms`);
      }
      pingLines.push(``);
      pingLines.push(`--- ${target} ping statistics ---`);
      pingLines.push(`4 packets transmitted, 4 received, 0% packet loss`);
      response = pingLines;
    }
    else if (cmd === 'query projects' || cmd === 'sql projects') {
      const queryOutput = `
        <div class="my-3 font-mono text-xs">
          <div class="text-[#00ff41] mb-2">&gt; SELECT title, tech FROM projects LIMIT 3;</div>
          <div class="border border-[#00f3ff]/20 bg-[#05070a] p-3 rounded">
            <div class="grid grid-cols-2 gap-2 pb-2 border-b border-[#00f3ff]/20 text-[#00f3ff] font-bold">
              <div>TITLE</div>
              <div>TECH</div>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-2 text-[#94a3b8]">
              <div>Portfolio Website</div>
              <div>Next.js, TypeScript</div>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1 text-[#94a3b8]">
              <div>Data Pipeline</div>
              <div>Python, SQL, Airflow</div>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1 text-[#94a3b8]">
              <div>Network Monitor</div>
              <div>Python, Docker</div>
            </div>
          </div>
          <div class="mt-2 text-[#586069] text-[10px]">3 rows returned (0.12s)</div>
        </div>
      `.trim();
      response = queryOutput;
    }
    else if (cmd === commands.help) { 
      const commandList = [commands.whoami, commands.cv, commands.contact, commands.about, commands.skills, commands.projects, commands.experience, commands.education, commands.stats, 'ping', 'query projects', 'trace', 'monitor', commands.socials, commands.all, commands.clear, commands.sudo, commands.mute, commands.unmute]; 
      response = `${currentTranslation.terminal.availableText}: ${commandList.join(', ')}`; 
    }
    else if (cmd.startsWith('sudo')) {
      response = currentTranslation.terminal.hiring.sudoMsg;
      setTimeout(() => { window.open('mailto:juanfelipelassor@gmail.com', '_blank'); }, 1500);
    }
    else if (cmd === commands.about) { response = currentTranslation.terminal.aboutResponse; } 
    else if (cmd === commands.skills) { unlockSection('tech'); response = `Accessing [TECH_STACK] modules... [OK]`; } 
    else if (cmd === commands.projects) { unlockSection('projects'); response = `Accessing [PROYECTOS] modules... [OK]`; } 
    else if (cmd === commands.experience) { unlockSection('experience'); response = `Accessing [WORK_EXPERIENCE] modules... [OK]`; } 
    else if (cmd === commands.education) { unlockSection('education'); response = `Accessing [EDUCATION] modules... [OK]`; } 
    else if (cmd === commands.all) { ALL_SECTIONS.forEach(unlockSection); response = `Unlocking all sections...`; } 
    else if (cmd === commands.socials) { response = [`> GitHub: <a href="https://github.com/Emizario10" target="_blank" class="text-[#00f3ff] hover:underline">github.com/Emizario10</a>`, `> LinkedIn: <a href="https://www.linkedin.com/in/juan-felipe-lasso-rodriguez/" target="_blank" class="text-[#00f3ff] hover:underline">linkedin.com/in/juan-felipe-lasso-rodriguez/</a>`]; } 
    else if (cmd === commands.clear) { setHistory([]); return; } 
    else { response = `${commands.notFound}: ${cmd}`; }
    setTimeout(() => { const linesToAdd = Array.isArray(response) ? response : [response]; setHistory(prev => [...prev, ...linesToAdd]); playBeep(); }, 100);
  };
  
  return (
    <div 
      className="rounded-lg border border-[#00f3ff]/30 shadow-2xl max-w-4xl mx-auto font-mono"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0, 60, 100, 0.4), 0 0 80px rgba(0, 60, 100, 0.2), 0 20px 50px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* WINDOW HEADER - LASSO PORTFOLIO */}
      <div 
        className="grid w-full bg-[#161b22] border-b border-[#00f3ff]/20 flex-none"
        style={{ 
          height: '38px', 
          minHeight: '38px', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          alignItems: 'center',
          padding: '0 16px'
        }}
      >
        {/* CELDA 1: IZQUIERDA */}
        <div style={{ textAlign: 'left', fontSize: '9px', fontFamily: 'monospace', color: '#6a737d' }}>
          v1.4.2
        </div>

        {/* CELDA 2: CENTRO */}
        <div style={{ textAlign: 'center', fontSize: '10px', fontFamily: 'monospace', color: '#00f3ff', textTransform: 'uppercase', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
          LASSO PORTFOLIO
        </div>

        {/* CELDA 3: DERECHA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px solid rgba(0, 243, 255, 0.3)' }}></div>
          <div 
            onClick={() => setHistory(prev => [...prev, currentTranslation.terminal.clues.clickHint])}
            className="animate-pulse" 
            style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#00f3ff', boxShadow: '0 0 8px #00f3ff', cursor: 'pointer' }}
          ></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px solid rgba(0, 243, 255, 0.3)' }}></div>
        </div>
      </div>

      {/* ÁREA DE CONTENIDO - Body */}
      <div 
        className="flex-1 p-6 overflow-y-auto bg-[#05070a] custom-scrollbar relative" 
        onClick={() => { if (!isMonitorActive) document.getElementById('terminal-input')?.focus() }}
      >
        {/* Scanline Effect - CRT Professional */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 243, 255, 0.02) 2px, rgba(0, 243, 255, 0.02) 4px)',
            backgroundSize: '100% 4px',
            opacity: 0.6
          }}
        />
        {isMonitorActive ? (
            <MonitorDashboard data={monitorData} />
        ) : (
          <>
            {history.map((item, i) => {
              if (typeof item === 'object' && item.type === 'whoami') { return <WhoAmIRenderer key={i} data={item} />; }
              if (typeof item === 'object' && item.type === 'ascii') { return <AsciiArtRenderer key={i} data={item} />; }
              const line = item as string;
              if (line.startsWith('PROMPT::')) { 
                const userInput = line.substring(8); 
                return ( 
                  <div key={i} className="mb-1 whitespace-pre-wrap flex flex-wrap terminal-text">
                    <span className="text-[#00f3ff]" style={{ textShadow: '0 0 5px rgba(0, 243, 255, 0.5)' }}>
                      {currentTranslation.terminal.prompt.user}
                    </span>
                    <span className="text-white">@</span>
                    <span className="text-[#00f3ff]" style={{ textShadow: '0 0 5px rgba(0, 243, 255, 0.5)' }}>
                      {currentTranslation.terminal.prompt.host}
                    </span>
                    <span className="text-white">{currentTranslation.terminal.prompt.separator}&nbsp;</span>
                    <span className="text-[#e0e6ed]" style={{ textShadow: '0 0 3px rgba(224, 230, 237, 0.3)' }}>
                      ${userInput}
                    </span>
                  </div> 
                ) 
              }
              const isDim = line.startsWith('>');
              return ( 
                <div 
                  key={i} 
                  className={`mb-1 whitespace-pre-wrap break-words terminal-text ${isDim ? 'text-[#94a3b8]' : 'text-[#e0e6ed]'}`}
                  style={{ textShadow: isDim ? 'none' : '0 0 3px rgba(224, 230, 237, 0.2)' }}
                >
                  <span dangerouslySetInnerHTML={{ __html: line }} />
                </div> 
              );
            })}
            <div ref={terminalEndRef} />
            
            {!isBooting && (
              <div className="flex items-center terminal-text">
                {contactStep === 0 ? ( 
                  <> 
                    <span className="text-[#00f3ff]" style={{ textShadow: '0 0 5px rgba(0, 243, 255, 0.5)' }}>
                      {currentTranslation.terminal.prompt.user}
                    </span>
                    <span className="text-white">@</span>
                    <span className="text-[#00f3ff]" style={{ textShadow: '0 0 5px rgba(0, 243, 255, 0.5)' }}>
                      {currentTranslation.terminal.prompt.host}
                    </span>
                    <span className="text-white">{currentTranslation.terminal.prompt.separator} </span> 
                  </> 
                ) : ( 
                  <span className="text-white mr-2">&gt; </span> 
                )}
                <input 
                  id="terminal-input" 
                  type="text" 
                  className="bg-transparent outline-none flex-1 text-[#00f3ff] border-none p-0 focus:ring-0 shadow-none ml-2" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  autoFocus 
                  disabled={isBooting} 
                  autoComplete="off" 
                />
              </div>
            )}
          </>
        )}
        
        {/* Infrastructure Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 text-center py-2 text-[8px] font-mono text-[#586069] bg-[#05070a]/80 border-t border-[#00f3ff]/10"
          style={{ opacity: 0.6 }}
        >
          [ NODE: GÖTTINGEN-01 | PROTOCOL: TCP/IP | SECURE_TUNNEL: AES-256-GCM ]
        </div>
      </div>
    </div>
  );
}

// Separate component for the Monitor Dashboard
const MonitorDashboard = ({ data }: { data: any }) => {
    const trafficBarLength = 20;
    const filledLength = Math.round((data.traffic / 100) * trafficBarLength);
    const emptyLength = trafficBarLength - filledLength;
    const trafficBar = `[${'|'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

    return (
        <div className="font-mono text-xs text-[#e0e6ed]">
            <div className="text-center text-[#00f3ff] mb-4">[ LASSO SYSTEMS - NETWORK OPERATIONS CENTER ]</div>
            
            <div className="border-t border-b border-[#00f3ff]/20 py-2 mb-4">
                <div className="grid grid-cols-2 gap-x-8">
                    <div><span className="text-[#94a3b8]">LATENCY:</span> <span className="text-[#00f3ff]">{data.latency.toFixed(1)}ms</span> <span className="text-[#94a3b8]">(Jitter: {data.jitter.toFixed(2)}ms)</span></div>
                    <div><span className="text-[#94a3b8]">PACKET_LOSS:</span> <span className="text-[#00f3ff]">{data.packetLoss.toFixed(2)}%</span></div>
                </div>
                <div><span className="text-[#94a3b8]">ACTIVE_NODES:</span> <span className="text-[#00f3ff]">4 [Göttingen, Frankfurt, Berlin, Seattle]</span></div>
            </div>

            <div className="py-2">
                <div><span className="text-[#94a3b8]">TRAFFIC:</span> <span className="text-[#00f3ff]">{trafficBar} {data.traffic}%</span></div>
                <div className="grid grid-cols-2 gap-x-8">
                    <div><span className="text-[#94a3b8]">DB_BUFFER_POOL:</span> <span className="text-[#00f3ff]">{data.bufferPool}%</span></div>
                    <div><span className="text-[#94a3b8]">QUERY_EXEC_TIME:</span> <span className="text-[#00f3ff]">{data.queryTime.toFixed(4)}s</span></div>
                </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 text-center text-[#94a3b8] text-[10px]">
                Press ESC or Ctrl+C to exit monitor
            </div>
        </div>
    );
};
