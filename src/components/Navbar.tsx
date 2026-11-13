import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import eminLogo from '../assets/emin.webp';

const STYLES = {
  header: "fixed top-0 left-0 right-0 z-50 bg-[#050C0A]/80 backdrop-blur-xl border-b border-emerald-500/10",
  container: "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between",
  logoButton: "flex items-center gap-3 group text-left cursor-pointer",
  logoBox: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1915] to-[#050C0A] border border-emerald-500/15 flex items-center justify-center font-mono font-bold text-[#3CE8B5] group-hover:border-[#3CE8B5]/50 transition-all",
  logoName: "font-bold tracking-wider text-sm text-white",
  logoSub: "text-[10px] font-mono text-[#8FA8A0]",
  desktopNav: "hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider text-[#8FA8A0]",
  navButton: "hover:text-[#3CE8B5] transition-colors uppercase cursor-pointer flex items-center gap-1",
  langButton: "bg-[#0B1915] hover:bg-white/[0.08] border border-emerald-500/15 text-[#3CE8B5] font-mono text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer",
  actionButton: "bg-[#3CE8B5] hover:bg-[#3CE8B5]/90 text-[#050C0A] font-mono text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#3CE8B5]/10",
  iconButton: "w-9 h-9 rounded-xl bg-[#0B1915] border border-emerald-500/15 flex items-center justify-center text-[#8FA8A0] hover:text-[#3CE8B5] hover:border-[#3CE8B5]/50 transition-all cursor-pointer",
  drawerOverlay: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md",
  drawerContainer: "fixed top-0 left-0 bottom-0 w-80 bg-[#0B1915] border-r border-emerald-500/15 p-8 flex flex-col justify-between z-50 shadow-2xl",
  closeButton: "text-xs font-mono text-[#8FA8A0] hover:text-white cursor-pointer",
  socialLink: "flex items-center justify-between p-3 rounded-xl bg-[#050C0A] border border-emerald-500/15 hover:border-[#3CE8B5]/50 transition-all text-xs font-mono text-white",
  mobileDropdown: "lg:hidden bg-[#050C0A] border-b border-emerald-500/10 px-6 py-6 flex flex-col gap-4 font-mono text-xs",
};

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
  requestQuote: {
    tr: 'İletişime Geç',
    en: 'Contact Us',
  },
  profProfile: {
    tr: 'Sosyal Medya ve Profesyonel Hesaplarım',
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
          
          {/* Sol: Logo ve Unvan */}
          <button onClick={() => setIsProfileDrawerOpen(true)} className={STYLES.logoButton}>
            <div className={STYLES.logoBox}>
              <img 
                src={eminLogo} 
                alt="Muhammet Emin Çelebi" 
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>
            <div className="flex flex-col">
              <span className={STYLES.logoName}>Muhammet Emin ÇELEBİ</span>
              <span className={STYLES.logoSub}>
                {t(I18N_TEXTS.softwareEng.tr, I18N_TEXTS.softwareEng.en)}
              </span>
            </div>
          </button>

          {/* Orta: Navigasyon Linkleri */}
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

          {/* Sağ: İkonlar, Dil ve CTA Butonu */}
          <div className="flex items-center gap-3">
            {/* Arama İkonu */}
            <button onClick={() => scrollToSection('projects')} className={STYLES.iconButton} title="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* İletişim / Mesaj İkonu */}
            <button onClick={() => scrollToSection('contact')} className={STYLES.iconButton} title="Contact">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>

            {/* Dil Değiştirme */}
            <button onClick={toggleLang} className={STYLES.langButton}>
              🌐 {lang}
            </button>
            
            {/* Request a quote / Hızlı İletişim Butonu */}
            <button onClick={() => scrollToSection('contact')} className={STYLES.actionButton}>
              {t(I18N_TEXTS.requestQuote.tr, I18N_TEXTS.requestQuote.en)}
            </button>

            {/* Mobil Menü Butonu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2 cursor-pointer">
              ☰
            </button>
          </div>
        </div>

        {/* Mobil Dropdown */}
        {mobileMenuOpen && (
          <div className={STYLES.mobileDropdown}>
            <button onClick={() => scrollToSection('about')} className="text-left text-[#8FA8A0] hover:text-[#3CE8B5] transition-colors">
              {t(I18N_TEXTS.about.tr, I18N_TEXTS.about.en)}
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-left text-[#8FA8A0] hover:text-[#3CE8B5] transition-colors">
              {t(I18N_TEXTS.projects.tr, I18N_TEXTS.projects.en)}
            </button>
            <button onClick={() => scrollToSection('articles')} className="text-left text-[#8FA8A0] hover:text-[#3CE8B5] transition-colors">
              {t(I18N_TEXTS.articles.tr, I18N_TEXTS.articles.en)}
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-left text-[#8FA8A0] hover:text-[#3CE8B5] transition-colors">
              {t(I18N_TEXTS.contact.tr, I18N_TEXTS.contact.en)}
            </button>
          </div>
        )}
      </motion.header>

      {/* Profil Drawer (Sol açılır panel) */}
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
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-500/15">
                  <div className="font-mono text-xs text-[#3CE8B5]">
                    {t(I18N_TEXTS.profProfile.tr, I18N_TEXTS.profProfile.en)}
                  </div>
                  <button onClick={() => setIsProfileDrawerOpen(false)} className={STYLES.closeButton}>[CLOSE]</button>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src={eminLogo} 
                      alt="Muhammet Emin Çelebi" 
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl shadow-lg border border-emerald-500/20" 
                    />
                  </div>                   

                  <h3 className="text-lg font-bold mb-1 text-white">Muhammet Emin Çelebi</h3>
                  <p className="text-xs font-mono text-[#8FA8A0] mb-4">
                    {t(I18N_TEXTS.university.tr, I18N_TEXTS.university.en)}
                  </p>
                  <p className="text-xs text-[#8FA8A0] leading-relaxed">
                    {t(I18N_TEXTS.bio.tr, I18N_TEXTS.bio.en)}
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <a href="https://github.com/emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>GitHub</span><span className="text-[#3CE8B5]">↗</span></a>
                  <a href="https://linkedin.com/in/emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>LinkedIn</span><span className="text-[#3CE8B5]">↗</span></a>
                  <a href="https://twitter.com/emincelebi61" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>Twitter (X)</span><span className="text-[#3CE8B5]">↗</span></a>
                  <a href="https://instagram.com/emin.celebi61" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>Instagram</span><span className="text-[#3CE8B5]">↗</span></a>
                  <a href="https://medium.com/@emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}><span>Medium</span><span className="text-[#3CE8B5]">↗</span></a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};