import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface ArticleItem {
  title: string;
  pubDate: string;
  link: string;
  categories: string[];
}

// --- DESIGN TOKENS & STYLING VARIABLES ---
const STYLES = {
  sectionContainer: "py-28 px-6 max-w-7xl mx-auto border-t border-white/8",
  headerWrapper: "max-w-2xl mb-16",
  sectionTag: "text-xs font-mono text-[#43D9C3] uppercase tracking-widest block mb-3",
  sectionTitle: "text-4xl font-bold tracking-tight mb-4",
  sectionSubtitle: "text-[#9299A8]",
  cardWrapper: "bg-[#10141D] border border-white/8 rounded-2xl p-6 flex flex-col justify-between hover:border-[#43D9C3]/50 transition-all group",
  cardDate: "text-xs font-mono text-[#9299A8] mb-4",
  cardTitle: "text-xl font-bold mb-3 group-hover:text-[#43D9C3] transition-colors",
  readMore: "pt-4 text-xs font-mono text-[#43D9C3]",
  loadingText: "text-xs font-mono text-[#9299A8]",
};

// --- I18N TEXT DICTIONARY ---
const I18N_TEXTS = {
  tag: {
    tr: 'MEDIUM & YAZILAR',
    en: 'MEDIUM & ARTICLES',
  },
  title: {
    tr: 'Düşünceler, Notlar ve Mühendislik.',
    en: 'Thoughts, Notes & Engineering.',
  },
  subtitle: {
    tr: 'Medium üstünden yayınladığım teknik yazılarım ve makalelerim.',
    en: 'My technical writings and articles published on Medium.',
  },
  loading: {
    tr: 'Medium yazıları yükleniyor...',
    en: 'Loading articles from Medium...',
  },
  readMore: {
    tr: "Medium'da Oku →",
    en: "Read on Medium →",
  },
  notFound: {
    tr: 'Yazı bulunamadı veya API sınırına ulaşıldı.',
    en: 'No articles found or API limit reached.',
  },
};

const MEDIUM_USERNAME = 'emincelebi';
const RSS_API_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`;

export const Articles: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetch(RSS_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setArticles(data.items.slice(0, 3));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="articles" className={STYLES.sectionContainer}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={STYLES.headerWrapper}
      >
        <span className={STYLES.sectionTag}>
          {t(I18N_TEXTS.tag.tr, I18N_TEXTS.tag.en)}
        </span>
        <h2 className={STYLES.sectionTitle}>
          {t(I18N_TEXTS.title.tr, I18N_TEXTS.title.en)}
        </h2>
        <p className={STYLES.sectionSubtitle}>
          {t(I18N_TEXTS.subtitle.tr, I18N_TEXTS.subtitle.en)}
        </p>
      </motion.div>

      {loading ? (
        <div className={STYLES.loadingText}>
          {t(I18N_TEXTS.loading.tr, I18N_TEXTS.loading.en)}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <motion.a
              key={idx}
              href={art.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={STYLES.cardWrapper}
            >
              <div>
                <div className={STYLES.cardDate}>
                  {new Date(art.pubDate).toLocaleDateString()}
                </div>
                <h3 className={STYLES.cardTitle}>{art.title}</h3>
              </div>
              <div className={STYLES.readMore}>
                {t(I18N_TEXTS.readMore.tr, I18N_TEXTS.readMore.en)}
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className={STYLES.loadingText}>
          {t(I18N_TEXTS.notFound.tr, I18N_TEXTS.notFound.en)}
        </div>
      )}
    </section>
  );
};