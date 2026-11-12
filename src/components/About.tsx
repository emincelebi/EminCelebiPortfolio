import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const STYLES = {
  sectionContainer: "py-28 px-6 max-w-7xl mx-auto border-t border-white/8",
  headerWrapper: "max-w-3xl mb-16",
  sectionTag: "text-xs font-mono text-[#43D9C3] uppercase tracking-widest block mb-3",
  sectionTitle: "text-4xl font-bold tracking-tight mb-6",
  bioText: "text-[#9299A8] text-base leading-relaxed",
  cardWrapper: "bg-[#10141D] border border-white/8 rounded-2xl p-6 hover:border-[#43D9C3]/40 transition-all",
  cardTitle: "text-lg font-bold mb-4 text-[#43D9C3]",
  listWrapper: "space-y-2 text-sm text-[#9299A8]",
  listItem: "flex items-center gap-2",
  listDot: "w-1.5 h-1.5 rounded-full bg-[#7C83FF]",
};

const SKILL_CATEGORIES = [
  { title: { tr: "Mobil Geliştirme", en: "Mobile Development" }, items: ["Flutter", "Dart", "BLoC / Riverpod", "REST API"] },
  { title: { tr: "Backend Sistemler", en: "Backend Systems" }, items: ["C# & .NET", "ASP.NET Core", "Node.js & Express", "TypeScript"] },
  { title: { tr: "Veritabanı & Altyapı", en: "Database & Infra" }, items: ["PostgreSQL", "SQL Server", "Firebase", "SQLite"] },
  { title: { tr: "Mühendislik", en: "Engineering" }, items: ["OOP & SOLID", "Clean Architecture", "MVVM", "Git Workflow"] },
];

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className={STYLES.sectionContainer}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={STYLES.headerWrapper}
      >
        <span className={STYLES.sectionTag}>
          {t('ARKA PLAN & UZMANLIK', 'BACKGROUND & EXPERTISE')}
        </span>
        <h2 className={STYLES.sectionTitle}>
          {t('Kod Yazmanın Ötesinde.', 'Beyond Writing Code.')}
        </h2>
        <p className={STYLES.bioText}>
          {t('Yazılım Mühendisliği alanında sistem tasarımı ve temiz mimari üzerine çalışıyorum.', 'Working on system design and clean architecture in software engineering.')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={STYLES.cardWrapper}
          >
            <h3 className={STYLES.cardTitle}>
              {t(cat.title.tr, cat.title.en)}
            </h3>
            <ul className={STYLES.listWrapper}>
              {cat.items.map((item, i) => (
                <li key={i} className={STYLES.listItem}>
                  <span className={STYLES.listDot}></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};