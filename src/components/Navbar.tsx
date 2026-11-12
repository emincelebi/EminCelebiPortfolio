import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import  eminLogo  from '../assets/emin.png';

// --- DESIGN TOKENS & STYLING VARIABLES ---
const STYLES = {
  header: "fixed top-0 left-0 right-0 z-50 bg-[#080A0F]/80 backdrop-blur-xl border-b border-white/8",
  container: "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between",
  logoButton: "flex items-center gap-3 group text-left cursor-pointer",
  logoBox: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#10141D] to-[#080A0F] border border-white/8 flex items-center justify-center font-mono font-bold text-[#43D9C3] group-hover:border-[#43D9C3]/50 transition-all",
  logoName: "font-bold tracking-wider text-sm",
  logoSub: "text-[10px] font-mono text-[#9299A8]",
  desktopNav: "hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider text-[#9299A8]",
  navButton: "hover:text-[#43D9C3] transition-colors uppercase cursor-pointer",
  langButton: "bg-[#10141D] hover:bg-white/[0.08] border border-white/8 text-[#43D9C3] font-mono text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer",
  drawerOverlay: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md",
  drawerContainer: "fixed top-0 left-0 bottom-0 w-80 bg-[#10141D] border-r border-white/8 p-8 flex flex-col justify-between z-50 shadow-2xl",
  closeButton: "text-xs font-mono text-[#9299A8] hover:text-white cursor-pointer",
  socialLink: "flex items-center justify-between p-3 rounded-xl bg-[#080A0F] border border-white/8 hover:border-[#43D9C3]/50 transition-all text-xs font-mono text-[#F5F7FA]",
  mobileDropdown: "lg:hidden bg-[#080A0F] border-b border-white/8 px-6 py-6 flex flex-col gap-4 font-mono text-xs",
};

// --- I18N TEXT DICTIONARY ---
const I18N_TEXTS = {
  softwareEng: {
    tr: 'Yazılım Mühendisi',
    en: 'Software Engineer',
  },
  about: {
    tr: 'Hakkımda',
    en: 'About',
  },
  projects: {
    tr: 'Projeler',
    en: 'Projects',
  },
  articles: {
    tr: 'Yazılar',
    en: 'Articles',
  },
  contact: {
    tr: 'İletişim',
    en: 'Contact',
  },
  profProfile: {
    tr: 'Benim Sosyal Medya ve Profesyonel Hesaplarım',
    en: 'My Social Media & Professional Accounts',
  },
  university: {
    tr: 'Fırat Üniversitesi - Yazılım Mühendisliği',
    en: 'Fırat University - Software Engineering',
  },
  bio: {
    tr: 'Flutter ile mobil, .NET ve Node.js ile ölçeklenebilir backend sistemleri geliştiriyorum.',
    en: 'Building robust mobile apps with Flutter and scalable backends with .NET & Node.js.',
  },
};

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={STYLES.header}
      >
        <div className={STYLES.container}>
          
          <button onClick={() => setIsProfileDrawerOpen(true)} className={STYLES.logoButton}>
            <div className={STYLES.logoBox}>
              <img 
                src={eminLogo} 
                alt="Muhammet Emin Çelebi" 
                className="w-full h-full object-cover rounded-2xl" 
              />
            </div>
            <div className="flex flex-col">
              <span className={STYLES.logoName}>Muhammet Emin ÇELEBİ</span>
              <span className={STYLES.logoSub}>
                {t(I18N_TEXTS.softwareEng.tr, I18N_TEXTS.softwareEng.en)}
              </span>
            </div>
          </button>

          <nav className={STYLES.desktopNav}>
            <button onClick={() => scrollToSection('about')} className={STYLES.navButton}>
              {t(I18N_TEXTS.about.tr, I18N_TEXTS.about.en)}
            </button>
            <button onClick={() => scrollToSection('projects')} className={STYLES.navButton}>
              {t(I18N_TEXTS.projects.tr, I18N_TEXTS.projects.en)}
            </button>
            <button onClick={() => scrollToSection('articles')} className={STYLES.navButton}>
              {t(I18N_TEXTS.articles.tr, I18N_TEXTS.articles.en)}
            </button>
            <button onClick={() => scrollToSection('contact')} className={STYLES.navButton}>
              {t(I18N_TEXTS.contact.tr, I18N_TEXTS.contact.en)}
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Dil Değiştirme Butonu */}
            <button onClick={toggleLang} className={STYLES.langButton}>
              🌐 {lang}
            </button>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2 cursor-pointer">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className={STYLES.mobileDropdown}>
            <button onClick={() => scrollToSection('about')} className="text-left text-[#9299A8] cursor-pointer">
              {t(I18N_TEXTS.about.tr, I18N_TEXTS.about.en)}
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-left text-[#9299A8] cursor-pointer">
              {t(I18N_TEXTS.projects.tr, I18N_TEXTS.projects.en)}
            </button>
            <button onClick={() => scrollToSection('articles')} className="text-left text-[#9299A8] cursor-pointer">
              {t(I18N_TEXTS.articles.tr, I18N_TEXTS.articles.en)}
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-left text-[#9299A8] cursor-pointer">
              {t(I18N_TEXTS.contact.tr, I18N_TEXTS.contact.en)}
            </button>
          </div>
        )}
      </motion.header>

      {/* Profil Drawer */}
      <AnimatePresence>
        {isProfileDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsProfileDrawerOpen(false)} 
              className={STYLES.drawerOverlay} 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className={STYLES.drawerContainer}
            >
              <div>
  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/8">
    <div className="font-mono text-xs text-[#43D9C3]">
      {t(I18N_TEXTS.profProfile.tr, I18N_TEXTS.profProfile.en)}
    </div>
    <button onClick={() => setIsProfileDrawerOpen(false)} className={STYLES.closeButton}>[CLOSE]</button>
  </div>
  
  <div className="mb-8">
    <div className="flex items-center justify-center mb-4">
      <img 
        src={eminLogo} 
        alt="Muhammet Emin Çelebi" 
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl shadow-lg border border-white/10" 
      />
    </div>                  

    <h3 className="text-lg font-bold mb-1">Muhammet Emin Çelebi</h3>
    <p className="text-xs font-mono text-[#9299A8] mb-4">
      {t(I18N_TEXTS.university.tr, I18N_TEXTS.university.en)}
    </p>
    <p className="text-xs text-[#9299A8] leading-relaxed">
      {t(I18N_TEXTS.bio.tr, I18N_TEXTS.bio.en)}
    </p>
  </div>

  <div className="space-y-3 font-mono text-xs">
    <a href="https://github.com/emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>GitHub</span><span className="text-[#43D9C3]">↗</span></a>
    <a href="https://linkedin.com/in/emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>LinkedIn</span><span className="text-[#43D9C3]">↗</span></a>
    <a href="https://twitter.com/emincelebi61" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>Twitter (X)</span><span className="text-[#43D9C3]">↗</span></a>
    <a href="https://instagram.com/emin.celebi61" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>Instagram</span><span className="text-[#43D9C3]">↗</span></a>
    <a href="https://medium.com/@emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>Medium</span><span className="text-[#43D9C3]">↗</span></a>
  </div>
</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};