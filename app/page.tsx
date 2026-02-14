// app/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { translations, type Language, ProjectData, ExperienceData, EducationData } from './data/translations'; // Correct RELATIVE IMPORT

// LanguageSelector Component
interface LanguageSelectorProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, setLanguage }) => {
    return (
        <div className="fixed top-6 right-6 z-50 flex gap-4 bg-[#0a0b10]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#2d3748] shadow-lg shadow-cyan-500/20">
            {(['es', 'en', 'de'] as Language[]).map((lang) => (
                <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-sm font-mono uppercase rounded-full transition-all duration-300 ${
                        currentLanguage === lang
                            ? 'bg-[#00f3ff] text-black shadow-md shadow-[#00f3ff]/50'
                            : 'text-[#94a3b8] hover:text-white'
                    }`}
                >
                    {lang}
                </button>
            ))}
        </div>
    );
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const currentTranslation = translations[language];

  useEffect(() => {
    document.title = currentTranslation.metadata.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', currentTranslation.metadata.description);
    }
    document.documentElement.lang = language;
  }, [language, currentTranslation.metadata]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const MemoizedTerminal = useCallback(() => (
    <Terminal currentTranslation={currentTranslation.terminal} />
  ), [currentTranslation.terminal]);

  return (
    <main className="min-h-screen bg-[#0a0b10] text-[#e0e6ed] selection:bg-[#00f3ff] selection:text-black relative">
      
      <LanguageSelector currentLanguage={language} setLanguage={setLanguage} />

      {/* HERO SECTION */}
      <motion.section
        className="container mx-auto px-6 pt-32 pb-20 border-b border-[#2d3748]/30"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          <motion.span className="text-[#00f3ff] font-mono text-sm mb-4 block animate-pulse" variants={itemVariants}>
            {currentTranslation.hero.status}
          </motion.span>
          <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 whitespace-pre-line" variants={itemVariants}>
            {currentTranslation.hero.name}
          </motion.h1>
          <motion.p className="max-w-xl text-lg text-[#94a3b8] font-light leading-relaxed" variants={itemVariants}>
            {currentTranslation.hero.description}
          </motion.p>
          <motion.p className="max-w-xl text-lg text-[#00f3ff] font-light leading-relaxed mt-2" variants={itemVariants}>
            {currentTranslation.hero.role}
          </motion.p>
        </div>
      </motion.section>

      {/* TERMINAL INTERACTIVA */}
      <div key={`terminal-${language}`}>
        <section className="container mx-auto px-6 py-20">
          <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center">
            <span className="mr-2">01.</span> {currentTranslation.terminal.sectionTitle}
          </h2>
          <MemoizedTerminal />
        </section>
      </div>

      {/* TECH STACK */}
      <motion.section 
        key={`tech-${language}`}
        className="container mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center">
          <span className="mr-2">02.</span> {currentTranslation.techStack.sectionTitle}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentTranslation.techStack.skills.map((skill: string) => (
            <motion.div key={skill} variants={itemVariants} className="skill-item p-4 border border-[#2d3748] bg-white/5 backdrop-blur-sm text-center font-mono text-sm text-[#00f3ff] hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-300">
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* PROJECTS */}
      <motion.section 
        key={`projects-${language}`}
        className="container mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center">
          <span className="mr-2">03.</span> {currentTranslation.projects.sectionTitle}
        </h2>
        <div className="space-y-6">
          {currentTranslation.projects.items.map((project: ProjectData) => (
            <motion.div key={project.title} variants={itemVariants} className={`card ${project.isAiPowered ? 'ai-glow' : ''}`}>
              <div className="card-header flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <div className="flex items-center space-x-2">
                  {project.isAiPowered && (
                    <span className="bg-[#bc13fe] text-white text-xs px-2 py-1 rounded-full font-mono">{project.aiBadgeText}</span>
                  )}
                  {project.role && (
                    <span className="bg-[#00f3ff] text-black text-xs px-2 py-1 rounded-full font-mono">{project.role}</span>
                  )}
                  <span className="font-mono text-xs text-[#bc13fe]">{project.date}</span>
                </div>
              </div>
              <div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{project.tech}</div>
              <ul className="space-y-2">
                {project.description.map((item, i) => (
                  <li key={i} className="text-[#94a3b8] text-sm flex items-start">
                    <span className="text-[#bc13fe] mr-2">/</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* WORK EXPERIENCE */}
      <motion.section
        key={`experience-${language}`}
        className="container mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center">
          <span className="mr-2">04.</span> {currentTranslation.workExperience.sectionTitle}
        </h2>
        <div className="space-y-6">
          {currentTranslation.workExperience.items.map((exp: ExperienceData) => (
            <motion.div key={exp.title} variants={itemVariants} className="card">
              <div className="card-header flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{exp.title}</h3>
                <span className="font-mono text-xs text-[#bc13fe]">{exp.date}</span>
              </div>
              <div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{exp.subtitle}</div>
              <ul className="space-y-2">
                {exp.description.map((item, i) => (
                  <li key={i} className="text-[#94a3b8] text-sm flex items-start">
                    <span className="text-[#bc13fe] mr-2">/</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* EDUCATION */}
      <motion.section
        key={`education-${language}`}
        className="container mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="font-mono text-[#00f3ff] mb-8 flex items-center">
          <span className="mr-2">05.</span> {currentTranslation.education.sectionTitle}
        </h2>
        <div className="space-y-6">
          {currentTranslation.education.items.map((edu: EducationData) => (
            <motion.div key={edu.title} variants={itemVariants} className="card">
              <div className="card-header flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{edu.title}</h3>
                <span className="font-mono text-xs text-[#bc13fe]">{edu.date}</span>
              </div>
              {edu.subtitle && (
                <div className="text-sm text-[#00f3ff] font-mono mb-4 italic">{edu.subtitle}</div>
              )}
              {edu.description && edu.description.length > 0 && (
                <ul className="space-y-2">
                  {edu.description.map((item, i) => (
                    <li key={i} className="text-[#94a3b8] text-sm flex items-start">
                      <span className="text-[#bc13fe] mr-2">/</span> {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <footer className="text-center py-10 text-[#94a3b8] text-sm border-t border-[#2d3748]/30">
        <p>{currentTranslation.footer.status} | {currentTranslation.footer.copyright}</p>
      </footer>
    </main>
  );
}

interface TerminalProps {
  currentTranslation: typeof translations['es']['terminal'];
}

function Terminal({ currentTranslation }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([currentTranslation.initialMessage1, currentTranslation.initialMessage2]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const cmd = input.toLowerCase().trim();
      const { commands, aboutResponse, skillsResponse, contactResponse, notFound } = currentTranslation;
      let response = "";
      if (cmd === commands.help) response = `Available: ${Object.values(commands).join(', ')}`;
      else if (cmd === commands.about) response = aboutResponse;
      else if (cmd === commands.skills) response = skillsResponse;
      else if (cmd === commands.contact) response = contactResponse;
      else if (cmd === commands.clear) { setHistory([]); setInput(""); return; }
      else response = `${notFound}: ${cmd}`;
      setHistory((prev) => [...prev, `${currentTranslation.prompt} ${input}`, response]);
      setInput("");
    }
  };

  return (
    <div className="bg-[#13151c] border border-[#2d3748] rounded-lg overflow-hidden shadow-2xl shadow-cyan-900/10">
      <div className="bg-[#1c1f26] px-4 py-2 border-b border-[#2d3748] flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>
      <div className="p-6 font-mono text-sm h-64 overflow-y-auto">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith(currentTranslation.prompt) ? "text-[#00f3ff]" : "text-[#94a3b8] mb-2"}>
            {line}
          </div>
        ))}
        <div className="flex">
          <span className="text-[#bc13fe] mr-2">{currentTranslation.prompt}</span>
          <input type="text" className="bg-transparent outline-none flex-1 text-[#00f3ff]" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus />
        </div>
      </div>
    </div>
  );
}
