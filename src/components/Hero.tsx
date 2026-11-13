import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

const STYLES = {
  sectionContainer: "min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center relative",
  mainHeading: "text-5xl sm:text-7xl font-bold tracking-tight leading-[1.08] mb-6",
  gradientText: "bg-gradient-to-r from-[#43D9C3] to-[#7C83FF] bg-clip-text text-transparent",
  descriptionText: "text-[#9299A8] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mb-10",
  primaryButton: "bg-[#43D9C3] text-[#080A0F] font-semibold px-8 py-4 rounded-xl hover:bg-[#35b5a1] transition-all shadow-lg shadow-[#43D9C3]/10 text-sm cursor-pointer",
  secondaryButton: "bg-[#10141D] hover:bg-white/[0.04] border border-white/8 text-[#F5F7FA] font-semibold px-8 py-4 rounded-xl transition-all text-sm cursor-pointer",
  codeCard: "w-full aspect-square bg-[#10141D]/60 border border-white/8 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl",
  codeHeader: "flex items-center justify-between border-b border-white/8 pb-4",
  codeBody: "font-mono text-xs text-[#9299A8] space-y-3 py-6",
  codeFooter: "border-t border-white/8 pt-4 flex items-center justify-between text-[11px] font-mono text-[#9299A8]",
};

export const Hero: React.FC = () => {
  const { t } = useLanguage(); 
  const { data } = usePortfolio();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroData = data?.hero || {
    headingTr: "Fikirleri Dijital Ürünlere Dönüştürüyorum.",
    headingEn: "Turning Ideas Into Digital Products.",
    descTr: "Modern mobil uygulamalar ve ölçeklenebilir backend sistemleri geliştiriyorum.",
    descEn: "I build modern mobile applications and scalable backend systems."
  };

  return (
    <section id="hero" className={STYLES.sectionContainer}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          <h1 className={STYLES.mainHeading}>
            <span className={STYLES.gradientText}>
              {t(heroData.headingTr, heroData.headingEn)}
            </span>
          </h1>

          <p className={STYLES.descriptionText}>
            {t(heroData.descTr, heroData.descEn)}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button onClick={() => scrollToSection('projects')} className={STYLES.primaryButton}>
              {t('Projelerimi Gör →', 'View My Work →')}
            </button>
            <button onClick={() => scrollToSection('contact')} className={STYLES.secondaryButton}>
              {t('İletişime Geç', "Let's Talk")}
            </button>
          </div>
        </motion.div>

        {/* Code Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className={STYLES.codeCard}>
            <div className={STYLES.codeHeader}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            
           
            <div className={STYLES.codeBody}>
              <p className="text-[#43D9C3]">// Core System Architecture</p>
              <p><span className="text-[#7C83FF]">class</span> <span className="text-white">EminCelebi</span> &#123;</p>
              <p className="pl-4">name: <span className="text-[#43D9C3]">{`'${data?.profile.name || 'Muhammet Emin Çelebi'}'`}</span>,</p>
              <p className="pl-4">role: <span className="text-[#7C83FF]">'Software Engineer'</span>,</p>
              <p className="pl-4">frontend: <span className="text-[#43D9C3]">['Flutter', 'React']</span>,</p>
              <p className="pl-4">backend: <span className="text-[#43D9C3]">['.NET', 'Node.js']</span>,</p>
              <p className="pl-4">database: <span className="text-[#43D9C3]">['PostgreSQL', 'SQLite', 'Firebase']</span>,</p>
              <p className="pl-4">architecture: <span className="text-[#7C83FF]">'Clean Architecture'</span>,</p>
              <p>&#125;</p>
            </div>


            <div className={STYLES.codeFooter}>
              <span>Fırat University</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};