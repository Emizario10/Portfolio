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
  '░░░░░░░░░░░░░░░░░░░░░░░░█▀██████░░'
];

const LION_ASCII = [
  '      _  _      ',
  '    / \\/ \\     ',
  '   | (o)(o) |    ',
  '   )   vvv  (    ',
  '   (  _|_|_  )   ',
  '    \\_______/    ',
  ' [ KING OF THE SYSTEM ]'
];



// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// --- UI COMPONENTS ---
const StatusBar: React.FC<{ viewMode: ViewMode; onViewModeChange: () => void; }> = ({ viewMode, onViewModeChange }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('de-DE')), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-6 bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4 text-xs font-mono text-[#00f3ff]">
        <span>[ SYSTEM: ONLINE ]</span>
        <span>[ LOC: GÖTTINGEN, DE ]</span>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono">
        <button onClick={onViewModeChange} className="text-[#00f3ff] hover:bg-[#00f3ff]/20 px-2 rounded">
          [ MODE: {viewMode.toUpperCase()} ]
        </button>
        <span className="text-[#00f3ff]">[ USER: GUEST_SESSION ]</span>
        <span className="text-[#00f3ff]">[ {time} ]</span>
      </div>
    </div>
  );
};

const LanguageSelector: React.FC<{ currentLanguage: Language; setLanguage: (lang: Language) => void; }> = ({ currentLanguage, setLanguage }) => {
    return (
        <div className="fixed top-10 right-6 z-50 flex gap-4 bg-[#0a0b10]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#2d3748] shadow-lg shadow-cyan-500/20">
            {(['es', 'en', 'de'] as Language[]).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={`px-3 py-1 text-sm font-mono uppercase rounded-full transition-all duration-300 ${currentLanguage === lang ? 'bg-[#00f3ff] text-black shadow-md shadow-[#00f3ff]/50' : 'text-[#94a3b8] hover:text-white'}`}>
                    {lang}
                </button>
            ))}
        </div>
    );
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const [displayText, setDisplayText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [unlockedSections, setUnlockedSections] = useState<SectionId[]>([]);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false); // New state for synchronization
  const currentTranslation = translations[language];

  // Restored Typo-Correction Animation
  useEffect(() => {
    const type = async (text: string, delay: number) => {
      for (let i = 0; i < text.length; i++) {
        setDisplayText(prev => prev + text[i]);
        await sleep(delay);
      }
    };
    const del = async (count: number, delay: number) => {
      for (let i = 0; i < count; i++) {
        setDisplayText(prev => prev.slice(0, -1));
        await sleep(delay);
      }
    };
    
    const sequence = async () => {
      setDisplayText("");
      await type("JUAN_LASO", 150);
      await sleep(800);
      await del(4, 50);
      await type("LASSO.", 120);
      setHeroAnimationComplete(true); // Signal Hero animation is complete
    };
    sequence();
  }, []); // Empty dependency array ensures it runs only once

  useEffect(() => {
    document.title = currentTranslation.metadata.title;
    document.documentElement.lang = language;
  }, [language, currentTranslation.metadata]);

  const unlockSection = (sectionId: SectionId) => {
    setUnlockedSections(prev => {
      if (prev.includes(sectionId)) { // If already unlocked, just scroll to it
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return prev;
      }
      const newUnlocked = [...prev, sectionId];
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return newUnlocked;
    });
  };
  
  const handleViewModeChange = () => {
    const newMode = viewMode === 'terminal' ? 'classic' : 'terminal';
    setViewMode(newMode);
    if (newMode === 'classic') {
      setUnlockedSections(ALL_SECTIONS);
    } else {
      setUnlockedSections([]); // Lock all sections again if returning to terminal mode
    }
  };

  const MemoizedTerminal = useCallback(() => (
    <Terminal 
      currentTranslation={currentTranslation.terminal}
      unlockSection={unlockSection}
      heroAnimationComplete={heroAnimationComplete} // Pass new state
    />
  ), [currentTranslation.terminal, unlockSection, heroAnimationComplete]); // Added heroAnimationComplete to dependencies

  return (
    <motion.main initial={false} className="min-h-screen bg-[#0a0b10] text-[#e0e6ed] selection:bg-[#00f3ff] selection:text-black relative pt-6">
      <StatusBar viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      <LanguageSelector currentLanguage={language} setLanguage={setLanguage} />

      <motion.section className="container mx-auto px-6 pt-32 pb-20 border-b border-[#2d3748]/30" variants={containerVariants} initial="hidden" animate="visible">
        <div className="relative">
          <motion.span className="text-[#00f3ff] font-mono text-sm mb-4 block animate-pulse" variants={itemVariants}>
            {currentTranslation.hero.status}
          </motion.span>
          <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 flex flex-col gap-2 h-[160px] md:h-[200px]">
            <span className="text-[#e0e6ed]">{displayText.split('_')[0]}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bc13fe]">
              _{displayText.split('_')[1] || ""}<span className="terminal-cursor text-[#00f3ff]">_</span>
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-xl text-lg text-[#94a3b8] font-light leading-relaxed">{currentTranslation.hero.description}</motion.p>
          <motion.p variants={itemVariants} className="max-w-xl text-lg text-[#00f3ff] font-light leading-relaxed mt-2">{currentTranslation.hero.role}</motion.p>
        </div>
      </motion.section>

      <motion.section initial="hidden" animate="visible" variants={containerVariants} className="container mx-auto px-6 py-20">
        <motion.h2 variants={itemVariants} className="font-mono text-[#00f3ff] mb-8 flex items-center">
          <span className="mr-2">&gt;</span> {currentTranslation.terminal.sectionTitle}
        </motion.h2>
        <motion.div variants={itemVariants}>
          <MemoizedTerminal />
        </motion.div>
      </motion.section>
      
      <AnimatePresence mode="wait"> {/* Use AnimatePresence for conditional rendering */}
        {(viewMode === 'classic' || unlockedSections.includes('tech')) && (
          <motion.section id="tech" key="tech" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.techStack.sectionTitle}</h2>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>
              {currentTranslation.techStack.skills.map((skill: string, index: number) => (
                <motion.div whileHover={{ scale: 1.02 }} key={index} variants={itemVariants} className="skill-item p-4 border border-[#2d3748] bg-white/5 backdrop-blur-sm text-center font-mono text-sm text-[#00f3ff] hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-300">
                  {skill}
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
        {(viewMode === 'classic' || unlockedSections.includes('projects')) && (
          <motion.section id="projects" key="projects" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.projects.sectionTitle}</h2>
            <motion.div className="space-y-6" variants={containerVariants}>
              {currentTranslation.projects.items.map((project: ProjectData, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className={`card ${project.isAiPowered ? 'ai-glow' : ''}`}>
                  <div className="card-header flex justify-between items-start mb-4"><h3 className="text-xl font-bold">{project.title}</h3><div className="flex items-center space-x-2">{project.isAiPowered && (<span className="bg-[#bc13fe] text-white text-xs px-2 py-1 rounded-full font-mono">{project.aiBadgeText}</span>)}{project.role && (<span className="bg-[#00f3ff] text-black text-xs px-2 py-1 rounded-full font-mono">{project.role}</span>)}<span className="font-mono text-xs text-[#bc13fe]">{project.date}</span></div></div>
                  <div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{project.tech}</div>
                  <ul className="space-y-2">{project.description.map((item, i) => <li key={i} className="text-[#94a3b8] text-sm flex items-start"><span className="text-[#bc13fe] mr-2">/</span> {item}</li>)}</ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
        {(viewMode === 'classic' || unlockedSections.includes('experience')) && (
          <motion.section id="experience" key="experience" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.workExperience.sectionTitle}</h2>
            <motion.div className="space-y-6" variants={containerVariants}>
              {currentTranslation.workExperience.items.map((exp: ExperienceData, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card">
                  <div className="card-header flex justify-between items-start mb-4"><h3 className="text-xl font-bold">{exp.title}</h3><span className="font-mono text-xs text-[#bc13fe]">{exp.date}</span></div>
                  <div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{exp.subtitle}</div>
                  <ul className="space-y-2">{exp.description.map((item, i) => <li key={i} className="text-[#94a3b8] text-sm flex items-start"><span className="text-[#bc13fe] mr-2">/</span> {item}</li>)}</ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
        {(viewMode === 'classic' || unlockedSections.includes('education')) && (
          <motion.section id="education" key="education" initial="hidden" animate="visible" exit="exit" variants={itemVariants} className="container mx-auto px-6 py-20">
            <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center"><span className="mr-2">&gt;</span> {currentTranslation.education.sectionTitle}</h2>
            <motion.div className="space-y-6" variants={containerVariants}>
              {currentTranslation.education.items.map((edu: EducationData, index: number) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} variants={itemVariants} className="card">
                  <div className="card-header flex justify-between items-start mb-4"><h3 className="text-xl font-bold">{edu.title}</h3><span className="font-mono text-xs text-[#bc13fe]">{edu.date}</span></div>
                  {edu.subtitle && (<div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{edu.subtitle}</div>)}
                  {edu.description && edu.description.length > 0 && (<ul className="space-y-2">{edu.description.map((item, i) => <li key={i} className="text-[#94a3b8] text-sm flex items-start"><span className="text-[#bc13fe] mr-2">/</span> {item}</li>)}</ul>)}
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="text-center py-10 text-[#94a3b8] text-sm border-t border-[#2d3748]/30">
        <p>{currentTranslation.footer.status} | {currentTranslation.footer.copyright}</p>
      </footer>
    </motion.main>
  );
}

interface TerminalProps {
  currentTranslation: typeof translations['es']['terminal'];
  unlockSection: (sectionId: SectionId) => void;
  heroAnimationComplete: boolean; // New prop
}

const asciiArt = ['    _     _ ', '   | |   | |', '   | |   | |', '   | |   | |', '_  | |___| |', '\\/ |_____| '];

function Terminal({ currentTranslation, unlockSection, heroAnimationComplete }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    let isMounted = true;
    const boot = async () => {
      setIsBooting(true);
      setHistory([]);
      const bootSequence = [...asciiArt, currentTranslation.initialMessage1, currentTranslation.initialMessage2];
      for (const line of bootSequence) {
        if (!isMounted) return;
        setHistory(prev => [...prev, line]);
        await sleep(100);
      }
      // Wait for hero animation to complete
      while(isMounted && !heroAnimationComplete) {
          await sleep(200);
      }
      if (isMounted) setIsBooting(false);
    };
    boot();
    return () => { isMounted = false; };
  }, [currentTranslation, heroAnimationComplete]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || isBooting) return;
    const cmd = input.toLowerCase().trim();
    const { commands } = currentTranslation;
    let response: string | string[] = "";
    
    setHistory(prev => [...prev, `${currentTranslation.prompt} ${input}`]);
    setInput("");

    const processCommand = () => {
      if (cmd === commands.help) {
        const commandList = [
            commands.about, commands.skills, commands.projects, commands.experience, commands.education, 
            commands.socials, commands.all, commands.sudo, 'tucan', 'leo', commands.clear
        ];
        response = `${currentTranslation.availableText}: ${commandList.join(', ')}`;
      } else if (cmd === commands.about) {
        response = currentTranslation.aboutResponse;
      } else if (cmd === commands.skills) { // Use commands.skills for language sensitivity
        unlockSection('tech');
        response = `Accessing [TECH_STACK] modules... [OK]`;
      } else if (cmd === commands.projects) { // Use commands.projects
        unlockSection('projects');
        response = `Accessing [PROJECTS] modules... [OK]`;
      } else if (cmd === commands.experience) { // Use commands.experience
        unlockSection('experience');
        response = `Accessing [WORK_EXPERIENCE] modules... [OK]`;
      } else if (cmd === commands.education) { // Use commands.education
        unlockSection('education');
        response = `Accessing [EDUCATION] modules... [OK]`;
      } else if (cmd === commands.all) { // Use commands.all
        ALL_SECTIONS.forEach(unlockSection);
        response = `Unlocking all sections...`;
      } else if (cmd === commands.socials) { // Use commands.socials
        response = ['> GitHub:   <a href="https://github.com/Emizario10" target="_blank" class="text-[#00f3ff] hover:underline">github.com/Emizario10</a>', '> LinkedIn: <a href="https://www.linkedin.com/in/juan-felipe-lasso-rodriguez/" target="_blank" class="text-[#00f3ff] hover:underline">linkedin.com/in/juan-felipe-lasso-rodriguez/</a>'];
      } else if (cmd === commands.sudo) { // Now language sensitive
        response = 'Nice try, but you don\'t have root privileges.';
      } else if (cmd === 'tucan') { // These are hardcoded as per previous instruction
        response = TOUCAN_ASCII;
      } else if (cmd === 'leo') { // These are hardcoded as per previous instruction
        response = LION_ASCII;
      } else if (cmd === commands.clear) { // Use commands.clear
        setHistory([]);
        return;
      } else {
        response = `${commands.notFound}: ${cmd}`;
      }

      if (Array.isArray(response)) {
        setHistory(prev => [...prev, ...response]);
      } else {
        setHistory(prev => [...prev, response]);
      }
    };
    setTimeout(processCommand, 300);
  };

  return (
    <div className="bg-[#13151c]/80 backdrop-blur-sm border border-[#2d3748] rounded-lg overflow-hidden shadow-2xl shadow-cyan-900/10">
      <div className="bg-[#1c1f26] px-4 py-2 border-b border-[#2d3748] flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>
      <div className="p-6 font-mono text-sm h-64 overflow-y-auto" onClick={() => document.getElementById('terminal-input')?.focus()}>
        {history.map((line, i) => <div key={i} className="mb-1 whitespace-pre" dangerouslySetInnerHTML={{ __html: line }} />)}
        <div ref={terminalEndRef} />
        {!isBooting && (
          <div className="flex">
            <span className="text-[#bc13fe] mr-2">{currentTranslation.prompt}</span>
            <input id="terminal-input" type="text" className="bg-transparent outline-none flex-1 text-[#00f3ff]" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus disabled={isBooting} />
          </div>
        )}
      </div>
    </div>
  );
}
