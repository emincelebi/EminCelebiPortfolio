import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

const STYLES = {
  sectionContainer: "py-28 px-6 max-w-7xl mx-auto border-t border-emerald-500/10 relative",
  headerWrapper: "max-w-2xl mb-16",
  sectionTag: "text-xs font-mono text-[#3CE8B5] uppercase tracking-widest block mb-3 flex items-center gap-2",
  sectionTitle: "text-4xl font-bold tracking-tight mb-4 text-white",
  sectionSubtitle: "text-[#8FA8A0]",
  cardWrapper: "bg-[#0B1915]/80 backdrop-blur-xl border border-emerald-500/15 rounded-3xl p-8 flex flex-col justify-between hover:border-[#3CE8B5]/50 hover:shadow-xl hover:shadow-[#3CE8B5]/5 transition-all relative overflow-hidden group",
  cardHeader: "flex items-center justify-between mb-6",
  projectNumber: "text-xs font-mono text-[#3CE8B5]",
  categoryBadge: "text-xs font-mono bg-[#3CE8B5]/10 border border-[#3CE8B5]/20 px-3 py-1 rounded-full text-[#3CE8B5]",
  projectTitle: "text-2xl font-bold mb-3 text-white group-hover:text-[#3CE8B5] transition-colors",
  projectDescription: "text-[#8FA8A0] text-sm leading-relaxed mb-6",
  techBadge: "text-xs font-mono bg-[#050C0A] border border-emerald-500/15 px-3 py-1 rounded-lg text-white",
  cardFooter: "pt-6 border-t border-emerald-500/15 flex items-center justify-between flex-wrap gap-3",
  linkButton: "text-xs font-mono font-semibold bg-[#3CE8B5]/10 border border-[#3CE8B5]/30 text-[#3CE8B5] hover:bg-[#3CE8B5] hover:text-[#050C0A] px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm",
};

export const Projects: React.FC = () => {
  const { t } = useLanguage();
  const { data } = usePortfolio();

  const projects = data?.projects || [];

  return (
    <section id="projects" className={STYLES.sectionContainer}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className={STYLES.headerWrapper}
      >
        <span className={STYLES.sectionTag}>
          <span className="w-2 h-2 rounded-full bg-[#3CE8B5] animate-pulse"></span>
          {t('PORTFÖY', 'PORTFOLIO')}
        </span>
        <h2 className={STYLES.sectionTitle}>
          {t('Projelerim', 'My Projects')}
        </h2>
        <p className={STYLES.sectionSubtitle}>
          {t('GitHub’da yayınladığım projeler ve mimari yapılar.', 'Projects and architectural structures I have published on GitHub.')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <motion.div 
            key={project.id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className={STYLES.cardWrapper}
          >
            <div>
              <div className={STYLES.cardHeader}>
                <span className={STYLES.projectNumber}>PROJECT {String(idx + 1).padStart(2, '0')}</span>
                <span className={STYLES.categoryBadge}>{project.category}</span>
              </div>
              <h3 className={STYLES.projectTitle}>{project.title}</h3>
              <p className={STYLES.projectDescription}>
                {t(project.descriptionTr, project.descriptionEn)}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack?.map((tech, i) => (
                  <span key={i} className={STYLES.techBadge}>{tech}</span>
                ))}
              </div>
            </div>

            {/* Çoklu Bağlantı Butonları Alanı */}
            <div className={STYLES.cardFooter}>
              {project.links && project.links.length > 0 ? (
                <div className="flex flex-wrap gap-2 w-full">
                  {project.links.map((link, linkIdx) => (
                    <a 
                      key={linkIdx}
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={STYLES.linkButton}
                    >
                      🔗 {link.label || t('Bağlantı', 'Link')} ↗
                    </a>
                  ))}
                </div>
              ) : project.projectUrl ? (
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={STYLES.linkButton}
                >
                  🔗 {project.urlLabel || t('Projeyi İncele', 'View Project')} ↗
                </a>
              ) : (
                <span className="text-xs font-mono text-[#8FA8A0]">
                  {t('Geliştirme aşamasında', 'In development')}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};