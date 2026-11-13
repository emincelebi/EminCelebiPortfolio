import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const STYLES = {
  footerContainer: "border-t border-white/8 py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#9299A8]",
  socialWrapper: "flex items-center gap-6",
  socialLink: "hover:text-[#43D9C3] transition-colors",
  highlightText: "text-[#43D9C3]",
};

const I18N_TEXTS = {
  rights: {
    tr: 'Tüm hakları saklıdır.',
    en: 'All rights reserved.',
  },
  localTime: {
    tr: 'Yerel Saat:',
    en: 'Local Time:',
  },
  location: {
    tr: 'UTC+3 (Türkiye)',
    en: 'UTC+3 (Turkey)',
  },
};

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className={STYLES.footerContainer}>
      <div>
        &copy; {new Date().getFullYear()} Muhammet Emin Çelebi. {t(I18N_TEXTS.rights.tr, I18N_TEXTS.rights.en)}
      </div>
      <div className={STYLES.socialWrapper}>
        <a href="https://github.com/emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}>
          GitHub
        </a>
        <a href="https://linkedin.com/in/emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}>
          LinkedIn
        </a>
        <a href="https://medium.com/@emincelebi" target="_blank" rel="noreferrer" className={STYLES.socialLink}>
          Medium
        </a>
      </div>
      <div>
        {t(I18N_TEXTS.localTime.tr, I18N_TEXTS.localTime.en)}{' '}
        <span className={STYLES.highlightText}>
          {t(I18N_TEXTS.location.tr, I18N_TEXTS.location.en)}
        </span>
      </div>
    </footer>
  );
};