import React, { createContext, useContext, useState } from 'react';

type Language = 'TR' | 'EN';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (trText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('EN');
  const toggleLang = () => {
    setLang((prev) => (prev === 'EN' ? 'TR' : 'EN'));
  };

  const t = (trText: string, enText: string) => (lang === 'TR' ? trText : enText);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};