import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

const lifeJourneyCodeLines = [
  "// MUHAMMET EMIN ÇELEBI — LIFETIME_JOURNEY.ts",
  "const engineer = {",
  "   name: 'Muhammet Emin Çelebi',",
  "   role: 'Software Engineer',",
  "   education: 'Fırat University - Software Engineering',",
  "   status: 'Always Building & Learning'",
  "};",
  "",
  "// CHAPTER I: THE FOUNDATION",
  "function initializeAcademicRoots() {",
  "   const university = 'Fırat University';",
  "   const focus = ['Algorithms', 'OOP', 'Software Architecture'];",
  "   return 'Theoretical & practical mastery acquired';",
  "}",
  "",
  "// CHAPTER II: REAL-WORLD PRODUCTS",
  "class ProjectRegistry {",
  "   constructor() {",
  "     this.addProject('Swift Talk', ['Flutter', 'Node.js', 'WebSockets']);",
  "     this.addProject('Yeşil Piyasa', ['TÜBİTAK 2209-A', 'Firebase', 'MVVM']);",
  "   }",
  "}",
  "",
  "// CHAPTER III: CURRENT EVOLUTION",
  "const expansionPack = {",
  "   from: 'Mobile Specialist (Flutter & Dart)',",
  "   to: 'Full-Stack Ecosystem (React, TypeScript, .NET)',",
  "   architecture: 'Clean Code & Scalable Systems'",
  "};",
  "",
  "// COMPILING LIFETIME REPOSITORY...",
  "// STATUS: EVOLUTION IN PROGRESS — SUCCESS [0 ERRORS]"
];

// Farklı boyut, ton ve opaklıklara sahip dinamik, karışık kare bloklar (Mosaic / Organic Grid)
const OrganicGridMosaic: React.FC = () => {
  // Rastgele ama kontrollü ve estetik dağılım için önceden belirlenmiş mozaik kutular
  const mosaicBoxes = [
    { top: '5%', left: '10%', size: 'w-24 h-24', border: 'border-[#3CE8B5]/15', bg: 'bg-[#3CE8B5]/[0.02]' },
    { top: '15%', left: '35%', size: 'w-16 h-16', border: 'border-emerald-400/10', bg: 'bg-transparent' },
    { top: '8%', left: '70%', size: 'w-32 h-32', border: 'border-teal-400/10', bg: 'bg-teal-400/[0.01]' },
    { top: '30%', left: '20%', size: 'w-20 h-20', border: 'border-[#3CE8B5]/10', bg: 'bg-[#3CE8B5]/[0.01]' },
    { top: '45%', left: '55%', size: 'w-40 h-40', border: 'border-emerald-500/10', bg: 'bg-transparent' },
    { top: '25%', left: '85%', size: 'w-28 h-28', border: 'border-teal-300/15', bg: 'bg-teal-300/[0.02]' },
    { top: '65%', left: '12%', size: 'w-36 h-36', border: 'border-[#3CE8B5]/10', bg: 'bg-transparent' },
    { top: '55%', left: '75%', size: 'w-20 h-20', border: 'border-emerald-400/15', bg: 'bg-[#3CE8B5]/[0.02]' },
    { top: '80%', left: '40%', size: 'w-28 h-28', border: 'border-teal-400/10', bg: 'bg-transparent' },
    { top: '75%', left: '82%', size: 'w-32 h-32', border: 'border-[#3CE8B5]/10', bg: 'bg-teal-500/[0.01]' },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {mosaicBoxes.map((box, i) => (
        <div
          key={i}
          style={{ top: box.top, left: box.left }}
          className={`absolute ${box.size} ${box.border} ${box.bg} border rounded-xl backdrop-blur-[1px] transition-all duration-700`}
        />
      ))}
    </div>
  );
};

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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-end pr-12 pt-32 select-none lg:flex">
      {/* 1. KARIŞIK TONLARDA VE FARKLI BOYUTLARDA ORGANİK KARE MOSAİK */}
      <OrganicGridMosaic />

      {/* 2. KOD AKIŞI */}
      <div className="font-mono text-[11px] leading-relaxed text-right space-y-1 w-[650px] relative z-10 opacity-20">
        {lifeJourneyCodeLines.slice(0, visibleCount).map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={
              line.includes('//') 
                ? 'text-[#3CE8B5] font-bold' 
                : line.includes('class') || line.includes('function') || line.includes('const') 
                ? 'text-emerald-400' 
                : 'text-[#8FA8A0]'
            }
          >
            {line}
          </motion.div>
        ))}

        {isFullyCompiled && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4 text-[#3CE8B5] font-bold tracking-widest text-xs"
          >
            ⚡ LIFETIME REPOSITORY COMPILED — READY FOR THE NEXT CHAPTER
          </motion.div>
        )}
      </div>
    </div>
  );
};