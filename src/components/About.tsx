import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const STYLES = {
  sectionContainer: "py-28 px-6 max-w-7xl mx-auto border-t border-emerald-500/10 relative",
  headerWrapper: "max-w-3xl mb-16",
  sectionTag: "text-xs font-mono text-[#3CE8B5] uppercase tracking-widest block mb-3 flex items-center gap-2",
  sectionTitle: "text-4xl font-bold tracking-tight mb-6 text-white",
  bioText: "text-[#8FA8A0] text-base leading-relaxed",
  cardWrapper: "bg-[#0B1915]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-6 hover:border-[#3CE8B5]/50 hover:shadow-lg hover:shadow-[#3CE8B5]/5 transition-all group",
  cardTitle: "text-lg font-bold mb-4 text-white group-hover:text-[#3CE8B5] transition-colors flex items-center justify-between",
  listWrapper: "space-y-3 text-sm text-[#8FA8A0]",
  listItem: "flex items-center gap-3 font-mono text-xs",
  listDot: "w-1.5 h-1.5 rounded-full bg-[#3CE8B5]",
};

const SKILL_CATEGORIES = [
  { 
    title: { tr: "Mobil Geliştirme", en: "Mobile Development" }, 
    items: ["Flutter", "Dart", "BLoC / Riverpod", "REST API"],
    tag: "MOBILE"
  },
  { 
    title: { tr: "Backend Sistemler", en: "Backend Systems" }, 
    items: ["C# & .NET", "ASP.NET Core", "Node.js & Express", "TypeScript"],
    tag: "BACKEND"
  },
  { 
    title: { tr: "Veritabanı & Altyapı", en: "Database & Infra" }, 
    items: ["PostgreSQL", "SQL Server", "Firebase", "SQLite"],
    tag: "INFRA"
  },
  { 
    title: { tr: "Mühendislik", en: "Engineering" }, 
    items: ["OOP & SOLID", "Clean Architecture", "MVVM", "Git Workflow"],
    tag: "SYSTEM"
  },
];

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className={STYLES.sectionContainer}>
      {/* Bölüm Başlığı */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={STYLES.headerWrapper}
      >
        <span className={STYLES.sectionTag}>
          <span className="w-2 h-2 rounded-full bg-[#3CE8B5] animate-pulse"></span>
          {t('ARKA PLAN & UZMANLIK', 'BACKGROUND & EXPERTISE')}
        </span>
        <h2 className={STYLES.sectionTitle}>
          {t('Kod Yazmanın Ötesinde.', 'Beyond Writing Code.')}
        </h2>
        <p className={STYLES.bioText}>
          {t(
            'Fırat Üniversitesi Yazılım Mühendisliği altyapısıyla; modern mobil uygulamalar, ölçeklenebilir backend sistemleri ve temiz mimari standartlarında çözümler üretiyorum.',
            'Building modern mobile apps, scalable backend systems, and clean architecture solutions backed by Software Engineering at Fırat University.'
          )}
        </p>
      </motion.div>

      {/* Yetkinlik Kartları (SaaS Grid Yapısı) */}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className={STYLES.cardTitle}>
                {t(cat.title.tr, cat.title.en)}
              </h3>
              <span className="text-[10px] font-mono text-[#3CE8B5]/80 bg-[#3CE8B5]/10 px-2 py-0.5 rounded border border-[#3CE8B5]/20">
                {cat.tag}
              </span>
            </div>
            
            <ul className={STYLES.listWrapper}>
              {cat.items.map((item, i) => (
                <li key={i} className={STYLES.listItem}>
                  <span className={STYLES.listDot}></span>
                  <span className="hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};