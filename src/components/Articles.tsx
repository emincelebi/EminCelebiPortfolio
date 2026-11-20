
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ArticleItem {
  title: string;
  pubDate: string;
  link: string;
  categories: string[];
}

interface MediumResponse {
  status: string;
  items?: ArticleItem[];
}

const MEDIUM_USERNAME = 'emincelebi';

const RSS_API_URL =
  `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    `https://medium.com/feed/@${MEDIUM_USERNAME}`
  )}`;

const STYLES = {
  sectionContainer:
    'py-28 px-6 max-w-7xl mx-auto border-t border-emerald-500/10 relative',

  headerWrapper: 'max-w-2xl mb-12',

  sectionTag:
    'text-xs font-mono text-[#3CE8B5] uppercase tracking-widest flex items-center gap-2 mb-3',

  sectionTitle:
    'text-4xl font-bold tracking-tight mb-4 text-white',

  sectionSubtitle: 'text-[#8FA8A0]',

  cardWrapper:
    'bg-[#0B1915]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-6 flex flex-col justify-between hover:border-[#3CE8B5]/50 hover:shadow-lg hover:shadow-[#3CE8B5]/5 transition-[border-color,box-shadow,transform] duration-300 group',

  cardDate:
    'text-xs font-mono text-[#3CE8B5]/80 bg-[#3CE8B5]/10 px-2.5 py-1 rounded-md inline-block border border-[#3CE8B5]/20 mb-4 w-fit',

  cardTitle:
    'text-xl font-bold mb-3 text-white group-hover:text-[#3CE8B5] transition-colors leading-snug',

  readMore:
    'pt-5 text-xs font-mono text-[#3CE8B5] flex items-center gap-2',

  loadingText: 'text-sm font-mono text-[#8FA8A0]',

  navigationButton:
    'w-11 h-11 rounded-xl border border-emerald-500/20 bg-[#0B1915] text-[#3CE8B5] flex items-center justify-center hover:bg-[#3CE8B5]/10 hover:border-[#3CE8B5]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300',
};

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
    tr: 'Medium üzerinden yayınladığım teknik yazılarım ve makalelerim.',
    en: 'My technical writings and articles published on Medium.',
  },
  loading: {
    tr: 'Medium yazıları yükleniyor...',
    en: 'Loading articles from Medium...',
  },
  readMore: {
    tr: "Medium'da Oku",
    en: 'Read on Medium',
  },
  notFound: {
    tr: 'Yazılar yüklenemedi veya henüz yayınlanmış makale bulunmuyor.',
    en: 'Articles could not be loaded or no articles are available.',
  },
  viewAll: {
    tr: 'Tüm Yazılarımı Gör',
    en: 'View All Articles',
  },
  previous: {
    tr: 'Önceki makale',
    en: 'Previous article',
  },
  next: {
    tr: 'Sonraki makale',
    en: 'Next article',
  },
};

export const Articles: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Medium makalelerini getir
  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      try {
        const response = await fetch(RSS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: MediumResponse = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.items)) {
          throw new Error('Invalid Medium RSS response');
        }

        const validArticles = data.items.filter(
          (item) => item.title && item.link
        );

        setArticles(validArticles);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('Medium articles fetch error:', error);
        setArticles([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => controller.abort();
  }, []);

  // Kaydırma butonlarının durumunu güncelle
  const updateScrollButtons = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;

    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(
      scrollLeft + clientWidth < scrollWidth - 2
    );
  }, []);

  // Sağ ve sol kaydırma
  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>(
      '[data-article-card]'
    );

    const gap = parseFloat(
      window.getComputedStyle(slider).columnGap
    ) || 24;

    const distance = card
      ? card.getBoundingClientRect().width + gap
      : slider.clientWidth;

    slider.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  // Ekran boyutu değiştiğinde butonları güncelle
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || loading) return;

    const observer = new ResizeObserver(updateScrollButtons);

    observer.observe(slider);

    const cards = slider.querySelectorAll('[data-article-card]');
    cards.forEach((card) => observer.observe(card));

    updateScrollButtons();

    return () => observer.disconnect();
  }, [articles, loading, updateScrollButtons]);

  return (
    <section id="articles" className={STYLES.sectionContainer}>
      {/* SECTION HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={STYLES.headerWrapper}
      >
        <span className={STYLES.sectionTag}>
          <span className="w-2 h-2 rounded-full bg-[#3CE8B5] animate-pulse" />
          {t(I18N_TEXTS.tag.tr, I18N_TEXTS.tag.en)}
        </span>

        <h2 className={STYLES.sectionTitle}>
          {t(I18N_TEXTS.title.tr, I18N_TEXTS.title.en)}
        </h2>

        <p className={STYLES.sectionSubtitle}>
          {t(I18N_TEXTS.subtitle.tr, I18N_TEXTS.subtitle.en)}
        </p>
      </motion.div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[250px] rounded-2xl bg-[#0B1915]/80 border border-emerald-500/10 p-6 animate-pulse"
            >
              <div className="w-24 h-6 bg-emerald-500/10 rounded-md mb-6" />
              <div className="w-full h-5 bg-emerald-500/10 rounded-md mb-3" />
              <div className="w-3/4 h-5 bg-emerald-500/10 rounded-md mb-3" />
              <div className="w-1/2 h-5 bg-emerald-500/10 rounded-md" />
            </div>
          ))}
          <span className="sr-only">
            {t(I18N_TEXTS.loading.tr, I18N_TEXTS.loading.en)}
          </span>
        </div>
      ) : articles.length > 0 ? (
        <div className="relative">
          {/* NAVIGATION */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono text-[#8FA8A0]">
              {String(articles.length).padStart(2, '0')}{' '}
              {t('MAKALE', 'ARTICLES')}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label={t(
                  I18N_TEXTS.previous.tr,
                  I18N_TEXTS.previous.en
                )}
                className={STYLES.navigationButton}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label={t(
                  I18N_TEXTS.next.tr,
                  I18N_TEXTS.next.en
                )}
                className={STYLES.navigationButton}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* ARTICLE CAROUSEL */}
          <div
            ref={sliderRef}
            onScroll={updateScrollButtons}
            className="
              flex gap-6
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              overscroll-x-contain
              pb-6
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {articles.map((art, idx) => (
              <motion.a
                key={art.link}
                data-article-card
                href={art.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(idx * 0.08, 0.24),
                  ease: 'easeOut',
                }}
                whileHover={{ y: -5 }}
                className={`
                  ${STYLES.cardWrapper}
                  flex-none
                  w-[85%]
                  sm:w-[calc((100%-24px)/2)]
                  lg:w-[calc((100%-48px)/3)]
                  min-h-[250px]
                  snap-start
                `}
              >
                <div>
                  {/* DATE */}
                  <div className={STYLES.cardDate}>
                    {new Date(art.pubDate).toLocaleDateString(
                      t('tr-TR', 'en-US'),
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className={STYLES.cardTitle}>
                    {art.title}
                  </h3>

                  {/* CATEGORIES */}
                  {art.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {art.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="
                            text-[10px]
                            text-[#8FA8A0]
                            border border-emerald-500/15
                            bg-emerald-500/5
                            rounded-md
                            px-2 py-1
                          "
                        >
                          #{category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* READ MORE */}
                <div className={STYLES.readMore}>
                  <span>
                    {t(
                      I18N_TEXTS.readMore.tr,
                      I18N_TEXTS.readMore.en
                    )}
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </motion.a>
            ))}
          </div>

          {/* VIEW ALL ARTICLES */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-8"
          >
            <a
              href={`https://medium.com/@${MEDIUM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                px-6 py-3
                rounded-xl
                border border-emerald-500/20
                bg-[#0B1915]/80
                text-sm font-mono
                text-[#8FA8A0]
                hover:text-[#3CE8B5]
                hover:border-[#3CE8B5]/50
                hover:bg-[#3CE8B5]/5
                transition-all duration-300
                group
              "
            >
              {t(
                I18N_TEXTS.viewAll.tr,
                I18N_TEXTS.viewAll.en
              )}

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </motion.div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className={STYLES.loadingText}>
          {t(I18N_TEXTS.notFound.tr, I18N_TEXTS.notFound.en)}
        </div>
      )}
    </section>
  );
};
