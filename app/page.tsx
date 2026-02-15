// app/page.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { translations, type Language, ProjectData, ExperienceData, EducationData } from './data/translations';

// --- CONSTANTS, TYPES, & HELPERS ---
type ViewMode = 'terminal' | 'classic';
type SectionId = 'tech' | 'projects' | 'experience' | 'education';
const ALL_SECTIONS: SectionId[] = ['tech', 'projects', 'experience', 'education'];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TOUCAN_ASCII = [ 
  '░░░░░░░░▄▄▄▀▀▀▄▄███▄░░░░░░░░░░░░░░', 
  '░░░░░▄▀▀░░░░░░░▐░▀██▌░░░░░░░░░░░░░', 
  '░░░▄▀░░░░▄▄███░▌▀▀░▀█░░░░░░░░░░░░░', 
  '░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌░░░░░░░░░░░░', 
  '░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄░░░░░░░░░░░', 
  '░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄░░░░░░', 
  '░░░░░░░░░░░░░▐░░░░▐███████████▄░░░', 
  '░░░░░░░░░░░░░░▐░░░░▐█████████████▄', 
  '░░░░░░░░░░░░░░░░▀▄░░░▐█████████████▄', 
  '░░░░░░░░░░░░░░░░░▀▄▄███████████████', 
  '░░░░░░░░░░░░░░░░░░░░░░░░█▀██████░░' ];
const LION_ASCII = [
  '      _  _      ',
  '    / \\\\/ \\\\     ',
  '   | (o)(o) |    ',
  '   )   vvv  (    ',
  '   (  _|_|_  )   ',
  '    \\\\_______/    ',
  ' [ KING OF THE SYSTEM ]'
];const J_ASCII = [
  ".......##.....######..##....##..######..########.########.##.....##",
  ".......##....##....##..##..##..##....##....##....##.......###...###",
  ".......##....##.........####...##..........##....##.......####.####",
  ".......##.....######.....##.....######.....##....######...##.###.##",
  ".##....##..........##....##..........##....##....##.......##.....##",
  ".##....##....##....##....##....##....##....##....##.......##.....##",
  "..######......######.....##.....######.....##....########.##.....##"
];

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 30 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }, exit: { opacity: 0, transition: { duration: 0.3 } } };

// --- SPECIAL RESPONSE TYPES ---
interface WhoAmIResponse { type: 'whoami'; ascii: string[]; info: { label: string; value: string; }[]; }
interface AsciiArtResponse { type: 'ascii'; art: string[]; }
type HistoryItem = string | WhoAmIResponse | AsciiArtResponse;

// --- RENDERER & SPECIAL COMPONENTS ---
const WhoAmIRenderer: React.FC<{data: WhoAmIResponse}> = ({ data }) => (
  <div className="flex flex-col gap-4 mb-4">
    {/* Banner JSYSTEM en grande */}
    <div className="whitespace-pre font-mono text-[#00f3ff] leading-none overflow-x-auto pb-2">
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
const AsciiArtRenderer: React.FC<{data: AsciiArtResponse}> = ({ data }) => ( <div className="whitespace-pre text-[#00f3ff] leading-none mb-1">{data.art.join('\n')}</div> );

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
  return ( <div className="fixed top-0 left-0 right-0 z-50 h-6 bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 flex items-center justify-between"><div className="flex items-center gap-4 text-xs font-mono text-[#00f3ff]"><span>[ SYSTEM: ONLINE ]</span><span>[ LOC: GÖTTINGEN, DE ]</span></div><div className="flex items-center gap-4 text-xs font-mono"><button onClick={onViewModeChange} className="text-[#00f3ff] hover:bg-[#00f3ff]/20 px-2 rounded">[ MODE: {viewMode.toUpperCase()} ]</button><span className="text-[#00f3ff]">[ USER: GUEST_SESSION ]</span><span className="text-[#00f3ff]">[ {time} ]</span></div></div> );
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
    const sequence = async () => { setDisplayText(""); await type("JUAN_LASO", 150); await sleep(800); await del(4, 50); await type("LASSO", 120); setHeroAnimationComplete(true); };
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
  const MemoizedTerminal = useCallback(() => ( <Terminal currentTranslation={currentTranslation} unlockSection={unlockSection} heroAnimationComplete={heroAnimationComplete} triggerMatrix={triggerMatrix} /> ), [currentTranslation, unlockSection, heroAnimationComplete, triggerMatrix]);

  return (
    <motion.main initial={false} className="crt-effect min-h-screen bg-[#0a0b10] text-[#e0e6ed] selection:bg-[#00f3ff] selection:text-black relative pt-6">
      <StatusBar viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      <LanguageSelector currentLanguage={language} setLanguage={setLanguage} />
      <motion.section className="container mx-auto px-6 pt-32 pb-20 border-b border-[#2d3748]/30" variants={containerVariants} initial="hidden" animate="visible">
        <div className="relative"><motion.span className="text-[#00f3ff] font-mono text-sm mb-4 block animate-pulse" variants={itemVariants}>{currentTranslation.hero.status}</motion.span><motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 flex flex-col gap-2 h-[160px] md:h-[200px]"><span className="text-[#e0e6ed]">{displayText.split('_')[0]}</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bc13fe]">_{displayText.split('_')[1] || ""}<span className="terminal-cursor text-[#00f3ff]">_</span></span></motion.h1><motion.p variants={itemVariants} className="max-w-xl text-lg text-[#94a3b8] font-light leading-relaxed">{currentTranslation.hero.description}</motion.p><motion.p variants={itemVariants} className="max-w-xl text-lg text-[#00f3ff] font-light leading-relaxed mt-2">{currentTranslation.hero.role}</motion.p></div>
      </motion.section>
      <motion.section initial="hidden" animate="visible" variants={containerVariants} className="container mx-auto px-6 py-20"><motion.h2 variants={itemVariants} className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.terminal.sectionTitle}</motion.h2><motion.div variants={itemVariants}><MemoizedTerminal /></motion.div></motion.section>
      <AnimatePresence>{(viewMode === 'classic' || unlockedSections.includes('tech')) && ( <motion.section id="tech" key="tech" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20"><h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.techStack.sectionTitle}</h2><motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>{currentTranslation.techStack.skills.map((skill: string, index: number) => ( <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="skill-item p-4 border border-[#2d3748] bg-white/5 backdrop-blur-sm text-center font-mono text-sm text-[#00f3ff] hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-300">{skill}</motion.div>))}</motion.div></motion.section> )}{(viewMode === 'classic' || unlockedSections.includes('projects')) && ( <motion.section id="projects" key="projects" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20"><h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.projects.sectionTitle}</h2><motion.div className="space-y-6" variants={containerVariants}>{currentTranslation.projects.items.map((project: ProjectData, index: number) => ( <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className={`card ${project.isAiPowered ? 'ai-glow' : ''}`}><div className="card-header flex justify-between items-start mb-4"><h3 className="text-xl font-bold">{project.title}</h3><div className="flex items-center space-x-2">{project.isAiPowered && (<span className="bg-[#bc13fe] text-white text-xs px-2 py-1 rounded-full font-mono">{project.aiBadgeText}</span>)}{project.role && (<span className="bg-[#00f3ff] text-black text-xs px-2 py-1 rounded-full font-mono">{project.role}</span>)}<span className="font-mono text-xs text-[#bc13fe]">{project.date}</span></div></div><div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{project.tech}</div><ul className="space-y-2">{project.description.map((item, i) => <li key={i} className="text-[#94a3b8] text-sm flex items-start"><span className="text-[#bc13fe] mr-2">/</span> {item}</li>)}</ul></motion.div>))}</motion.div></motion.section> )}{(viewMode === 'classic' || unlockedSections.includes('experience')) && ( <motion.section id="experience" key="experience" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20"><h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.workExperience.sectionTitle}</h2><motion.div className="space-y-6" variants={containerVariants}>{currentTranslation.workExperience.items.map((exp: ExperienceData, index: number) => ( <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card"><div className="card-header flex justify-between items-start mb-4"><h3 className="text-xl font-bold">{exp.title}</h3>{exp.date && (<span className="font-mono text-xs text-[#bc13fe]">{exp.date}</span>)}</div><div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{exp.subtitle}</div><ul className="space-y-2">{exp.description.map((item, i) => <li key={i} className="text-[#94a3b8] text-sm flex items-start"><span className="text-[#bc13fe] mr-2">/</span> {item}</li>)}</ul></motion.div>))}</motion.div></motion.section> )}{(viewMode === 'classic' || unlockedSections.includes('education')) && ( <motion.section id="education" key="education" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20"><h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.education.sectionTitle}</h2><motion.div className="space-y-6" variants={containerVariants}>{currentTranslation.education.items.map((edu: EducationData, index: number) => ( <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card"><div className="card-header flex justify-between items-start mb-4"><h3 className="text-xl font-bold">{edu.title}</h3>{edu.date && (<span className="font-mono text-xs text-[#bc13fe]">{edu.date}</span>)}</div>{edu.subtitle && (<div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{edu.subtitle}</div>)}{edu.description && edu.description.length > 0 && (<ul className="space-y-2">{edu.description.map((item, i) => <li key={i} className="text-[#94a3b8] text-sm flex items-start"><span className="text-[#bc13fe] mr-2">/</span> {item}</li>)}</ul>)}</motion.div>))}</motion.div></motion.section> )}</AnimatePresence>
      {isMatrixActive && <MatrixRain />}
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

  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  
  useEffect(() => {
    let isMounted = true;
    const boot = async () => {
      setIsBooting(true);
      setHistory([]);
      const bootSequence = [ ...J_ASCII, currentTranslation.terminal.initialMessage1, currentTranslation.terminal.initialMessage2];
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
    const allCommands = [...Object.values(currentTranslation.terminal.commands), 'tucan', 'leo'];
    if (e.key === 'Tab') { e.preventDefault(); const currentInput = input.trim().toLowerCase(); if (currentInput === "") return; const foundCommand = allCommands.find(c => c && String(c).startsWith(currentInput)); if (foundCommand) { setInput(String(foundCommand)); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (commandHistory.length > 0 && historyPointer < commandHistory.length - 1) { const newPointer = historyPointer + 1; setHistoryPointer(newPointer); setInput(commandHistory[newPointer]); } } 
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (historyPointer > -1) { const newPointer = historyPointer - 1; setHistoryPointer(newPointer); setInput(newPointer === -1 ? "" : commandHistory[newPointer]); } } 
    else if (e.key === 'Enter') {
      if (isBooting) return;
      const currentInput = input.trim();
      if (currentInput === "" && contactStep === 0) return;
      const cmd = currentInput.toLowerCase();
      // Logic to allow known commands to interrupt contact flow
      if (contactStep > 0 && allCommands.includes(cmd)) { 
        setContactStep(0); // Exit contact flow
      }
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
    if (cmd === commands.matrix) { triggerMatrix(); response = "[ RED PILL SELECTED: REWRITING REALITY... ]"; }
    else if (cmd === commands.contact) { setContactStep(1); response = currentTranslation.terminal.contact.askName; } 
    else if (cmd === commands.whoami) { response = { type: 'whoami', ascii: J_ASCII, info: [ { label: whoami.name, value: "Juan Felipe Lasso" }, { label: whoami.role, value: "Data Analyst & Developer" }, { label: whoami.location, value: "Göttingen, DE" }, { label: whoami.tools, value: "Python, SQL, Linux, JS" }, ]}; } 
    else if (cmd === commands.cv) { response = "Requesting secure download... 100% [COMPLETE]"; window.open('/cv.pdf', '_blank'); }
    else if (cmd === commands.mute) { setIsMuted(true); response = "System sound muted."; } 
    else if (cmd === commands.unmute) { setIsMuted(false); response = "System sound enabled."; playBeep(); } 
    else if (cmd === commands.help) { const commandList = [commands.whoami, commands.cv, commands.contact, commands.matrix, commands.about, commands.skills, commands.projects, commands.experience, commands.education, commands.socials, commands.all, 'tucan', 'leo', commands.clear, commands.sudo, commands.mute, commands.unmute]; response = `${currentTranslation.terminal.availableText}: ${commandList.join(', ')}`; } 
    else if (cmd === commands.about) { response = currentTranslation.terminal.aboutResponse; } 
    else if (cmd === commands.skills) { unlockSection('tech'); response = `Accessing [TECH_STACK] modules... [OK]`; } 
    else if (cmd === commands.projects) { unlockSection('projects'); response = `Accessing [PROJECTS] modules... [OK]`; } 
    else if (cmd === commands.experience) { unlockSection('experience'); response = `Accessing [WORK_EXPERIENCE] modules... [OK]`; } 
    else if (cmd === commands.education) { unlockSection('education'); response = `Accessing [EDUCATION] modules... [OK]`; } 
    else if (cmd === commands.all) { ALL_SECTIONS.forEach(unlockSection); response = `Unlocking all sections...`; } 
    else if (cmd === commands.socials) { response = ['> GitHub:   <a href="https://github.com/Emizario10" target="_blank" class="text-[#00f3ff] hover:underline">github.com/Emizario10</a>', '> LinkedIn: <a href="https://www.linkedin.com/in/juan-felipe-lasso-rodriguez/" target="_blank" class="text-[#00f3ff] hover:underline">linkedin.com/in/juan-felipe-lasso-rodriguez/</a>']; } 
    else if (cmd === commands.sudo) { response = 'Nice try, but you don\'t have root privileges.'; } 
    else if (cmd === 'tucan') { response = { type: 'ascii', art: TOUCAN_ASCII }; } 
    else if (cmd === 'leo') { response = { type: 'ascii', art: LION_ASCII }; } 
    else if (cmd === commands.clear) { setHistory([]); return; } 
    else { response = `${commands.notFound}: ${cmd}`; }
    setTimeout(() => { const linesToAdd = Array.isArray(response) ? response : [response]; setHistory(prev => [...prev, ...linesToAdd]); playBeep(); }, 100);
  };
  
  return (
    <div className="bg-[#13151c]/80 backdrop-blur-sm border border-[#2d3748] rounded-lg overflow-hidden shadow-2xl shadow-cyan-900/10">
      <div className="bg-[#1c1f26] px-4 py-2 border-b border-[#2d3748] flex gap-2"><div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]"></div></div>
      <div className="p-6 font-mono text-sm h-64 overflow-y-auto overflow-x-auto" onClick={() => document.getElementById('terminal-input')?.focus()}>
        {history.map((item, i) => {
          if (typeof item === 'object' && item.type === 'whoami') { return <WhoAmIRenderer key={i} data={item} />; }
          if (typeof item === 'object' && item.type === 'ascii') { return <AsciiArtRenderer key={i} data={item} />; }
          const line = item as string;
          if (line.startsWith('PROMPT::')) { const userInput = line.substring(8); return ( <div key={i} className="mb-1 whitespace-pre flex"><span className="text-[#00ff41]">{currentTranslation.terminal.prompt.user}</span><span className="text-white">@</span><span className="text-[#00f3ff]">{currentTranslation.terminal.prompt.host}</span><span className="text-white">{currentTranslation.terminal.prompt.separator}&nbsp;</span><span>{userInput}</span></div> ) }
          const isDim = line.startsWith('>');
          return ( <div key={i} className={`mb-1 whitespace-pre ${isDim ? 'text-[#94a3b8]' : ''}`}><span dangerouslySetInnerHTML={{ __html: line }} /></div> );
        })}
        <div ref={terminalEndRef} />
        {!isBooting && (
          <div className="flex">
            {contactStep === 0 ? ( <> <span className="text-[#00ff41]">{currentTranslation.terminal.prompt.user}</span><span className="text-white">@</span><span className="text-[#00f3ff]">{currentTranslation.terminal.prompt.host}</span><span className="text-white">{currentTranslation.terminal.prompt.separator} </span> </> ) : ( <span className="text-white mr-2">&gt; </span> )}
            <input id="terminal-input" type="text" className="bg-transparent outline-none flex-1 text-[#00f3ff]" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} autoFocus disabled={isBooting} />
          </div>
        )}
      </div>
    </div>
  );
}
