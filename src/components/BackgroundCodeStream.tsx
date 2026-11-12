import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

const lifeJourneyCodeLines = [
  "// MUHAMMET EMIN ÇELEBI — LIFETIME_JOURNEY.ts",
  "const engineer = {",
  "  name: 'Muhammet Emin Çelebi',",
  "  role: 'Software Engineer',",
  "  education: 'Fırat University - Software Engineering',",
  "  status: 'Always Building & Learning'",
  "};",
  "",
  "// CHAPTER I: THE FOUNDATION",
  "function initializeAcademicRoots() {",
  "  const university = 'Fırat University';",
  "  const focus = ['Algorithms', 'OOP', 'Software Architecture'];",
  "  return 'Theoretical & practical mastery acquired';",
  "}",
  "",
  "// CHAPTER II: REAL-WORLD PRODUCTS",
  "class ProjectRegistry {",
  "  constructor() {",
  "    this.addProject('Swift Talk', ['Flutter', 'Node.js', 'WebSockets']);",
  "    this.addProject('Yeşil Piyasa', ['TÜBİTAK 2209-A', 'Firebase', 'MVVM']);",
  "  }",
  "}",
  "",
  "// CHAPTER III: CURRENT EVOLUTION",
  "const expansionPack = {",
  "  from: 'Mobile Specialist (Flutter & Dart)',",
  "  to: 'Full-Stack Ecosystem (React, TypeScript, .NET)',",
  "  architecture: 'Clean Code & Scalable Systems'",
  "};",
  "",
  "// COMPILING LIFETIME REPOSITORY...",
  "// STATUS: EVOLUTION IN PROGRESS — SUCCESS [0 ERRORS]"
];

export const BackgroundCodeStream: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isFullyCompiled, setIsFullyCompiled] = useState<boolean>(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const lines = Math.floor(latest * (lifeJourneyCodeLines.length - 6)) + 6;
      setVisibleCount(Math.min(lines, lifeJourneyCodeLines.length));

      if (latest > 0.85) {
        setIsFullyCompiled(true);
      } else {
        setIsFullyCompiled(false);
      }
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-end pr-12 pt-32 opacity-15 select-none lg:flex">
      <div className="font-mono text-[11px] leading-relaxed text-right space-y-1 w-162.5">
        {lifeJourneyCodeLines.slice(0, visibleCount).map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={
              line.includes('//') 
                ? 'text-emerald-400 font-bold' 
                : line.includes('class') || line.includes('function') || line.includes('const') 
                ? 'text-[#7C83FF]' 
                : 'text-[#43D9C3]'
            }
          >
            {line}
          </motion.div>
        ))}

        {isFullyCompiled && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4 text-emerald-400 font-bold tracking-widest text-xs"
          >
            ⚡ LIFETIME REPOSITORY COMPILED — READY FOR THE NEXT CHAPTER
          </motion.div>
        )}
      </div>
    </div>
  );
};