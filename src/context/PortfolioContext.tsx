import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
} from 'firebase/firestore';

import { db } from '../firebase';

// -------------------------
// TYPES
// -------------------------

export interface ProjectLink {
  url: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  descriptionTr: string;
  descriptionEn: string;
  techStack: string[];
  links?: ProjectLink[];
  githubFrontend?: string;
  projectUrl?: string;
  urlLabel?: string;
}

export interface VisitorItem {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  screenResolution: string;
  visitedAt: string;
  visitCount?: number;
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    avatarUrl: string;
    bioTr: string;
    bioEn: string;
  };

  hero: {
    headingTr: string;
    headingEn: string;
    descTr: string;
    descEn: string;
  };

  projects: Project[];

  analytics: {
    total_visits: number;
    unique_visitors: number;
    contact_submissions: number;
    last_visit: string;
  };
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  createdAt?: string;
}

export type PortfolioUpdate = Pick<
  PortfolioData,
  'profile' | 'hero' | 'projects'
>;

interface PortfolioContextType {
  data: PortfolioData | null;
  messages: MessageItem[];
  visitors: VisitorItem[];
  loading: boolean;

  updatePortfolio: (newData: PortfolioUpdate) => Promise<void>;

  sendMessage: (
    name: string,
    email: string,
    message: string
  ) => Promise<boolean>;

  fetchMessages: () => Promise<void>;
  fetchVisitors: () => Promise<void>;
}

// -------------------------
// FIREBASE DOCUMENT
// -------------------------

const PORTFOLIO_COLLECTION = 'portfolio';
const PORTFOLIO_DOCUMENT = 'main';
const MESSAGES_COLLECTION = 'messages';
const VISITORS_COLLECTION = 'visitors';

const portfolioRef = doc(
  db,
  PORTFOLIO_COLLECTION,
  PORTFOLIO_DOCUMENT
);

// -------------------------
// USER AGENT PARSER HELPER
// -------------------------

const parseUserAgent = () => {
  const ua = navigator.userAgent;
  let browser = 'Bilinmeyen Tarayıcı';
  let os = 'Bilinmeyen İşletim Sistemi';
  let deviceType = 'Masaüstü';

  if (/Mobi|Android|iPhone/i.test(ua)) {
    deviceType = /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobil';
  } else if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
  }

  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome/i.test(ua) && !/Chromium|Edg/i.test(ua)) browser = 'Google Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';

  const screenResolution = `${window.screen.width}x${window.screen.height}`;

  return { deviceType, browser, os, screenResolution };
};

// -------------------------
// DEFAULT DATA
// -------------------------

const DEFAULT_DATA: PortfolioData = {
  profile: {
    name: 'Muhammet Emin Çelebi',
    title: 'Software Engineer | Fırat University',
    avatarUrl: '',
    bioTr:
      'Flutter ile mobil, .NET ve Node.js ile ölçeklenebilir backend sistemleri geliştiriyorum.',
    bioEn:
      'Building robust mobile apps with Flutter and scalable backends with .NET & Node.js.',
  },

  hero: {
    headingTr: 'Fikirleri Dijital Ürünlere Dönüştürüyorum.',
    headingEn: 'Turning Ideas Into Digital Products.',
    descTr:
      'Modern mobil uygulamalar ve ölçeklenebilir backend sistemleri geliştiriyorum.',
    descEn:
      'I build modern mobile applications and scalable backend systems.',
  },

  projects: [],

  analytics: {
    total_visits: 0,
    unique_visitors: 0,
    contact_submissions: 0,
    last_visit: new Date().toISOString(),
  },
};

// -------------------------
// CONTEXT
// -------------------------

const PortfolioContext = createContext<
  PortfolioContextType | undefined
>(undefined);

// -------------------------
// PROVIDER
// -------------------------

export const PortfolioProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // INITIALIZE PORTFOLIO & ANALYTICS
  // -------------------------

  useEffect(() => {
    let isMounted = true;

    const initializePortfolio = async () => {
      try {
        const snapshot = await getDoc(portfolioRef);

        if (!snapshot.exists()) {
          await setDoc(portfolioRef, DEFAULT_DATA);

          if (isMounted) {
            setData(DEFAULT_DATA);
          }
        } else {
          const firestoreData = snapshot.data();

          const portfolioData: PortfolioData = {
            ...DEFAULT_DATA,
            ...firestoreData,

            profile: {
              ...DEFAULT_DATA.profile,
              ...firestoreData.profile,
            },

            hero: {
              ...DEFAULT_DATA.hero,
              ...firestoreData.hero,
            },

            projects: Array.isArray(firestoreData.projects)
              ? firestoreData.projects
              : [],

            analytics: {
              ...DEFAULT_DATA.analytics,
              ...firestoreData.analytics,
            },
          };

          if (isMounted) {
            setData(portfolioData);
          }

          try {
            const visitorInfo = parseUserAgent();
            const lastVisit = new Date().toISOString();
            const hasVisitedBefore = localStorage.getItem('portfolio_unique_visitor');

            const updatePayload: Record<string, any> = {
              'analytics.total_visits': increment(1),
              'analytics.last_visit': lastVisit,
            };

            let uniqueIncrementValue = 0;

            if (!hasVisitedBefore) {
              localStorage.setItem('portfolio_unique_visitor', 'true');
              updatePayload['analytics.unique_visitors'] = increment(1);
              uniqueIncrementValue = 1;
            }

            await updateDoc(portfolioRef, updatePayload);

            // Cihaz adına benzersiz bir ID oluştur (Örn: windows_google_chrome_1920x1080)
            const deviceKey = `${visitorInfo.os}_${visitorInfo.browser}_${visitorInfo.screenResolution}`
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '_');

            // Aynı cihaz daha önce kayıtlıysa üzerine yazar (visitedAt güncellenir, tekrar oluşmaz)
            const visitorDocRef = doc(db, VISITORS_COLLECTION, deviceKey);
            await setDoc(
              visitorDocRef,
              {
                ...visitorInfo,
                visitedAt: lastVisit,
                visitCount: increment(1),
              },
              { merge: true }
            );

            if (isMounted) {
              setData((prev) => {
                if (!prev) return prev;

                return {
                  ...prev,
                  analytics: {
                    ...prev.analytics,
                    total_visits: prev.analytics.total_visits + 1,
                    unique_visitors: prev.analytics.unique_visitors + uniqueIncrementValue,
                    last_visit: lastVisit,
                  },
                };
              });
            }
          } catch (analyticsError) {
            console.error(
              'Ziyaretçi istatistiği veya logu güncellenemedi:',
              analyticsError
            );
          }
        }
      } catch (error) {
        console.error(
          'Portfolio başlatma hatası:',
          error
        );

        if (isMounted) {
          setData(DEFAULT_DATA);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializePortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------
  // UPDATE PORTFOLIO
  // -------------------------

  const updatePortfolio = useCallback(
    async (newData: PortfolioUpdate): Promise<void> => {
      try {
        await setDoc(
          portfolioRef,
          {
            profile: newData.profile,
            hero: newData.hero,
            projects: newData.projects,
          },
          { merge: true }
        );

        setData((prev) => {
          if (!prev) {
            return {
              ...DEFAULT_DATA,
              ...newData,
            };
          }

          return {
            ...prev,
            ...newData,
          };
        });

      } catch (error) {
        console.error(
          'Portfolio güncelleme hatası:',
          error
        );

        throw new Error(
          'Portfolyo Firebase veritabanına kaydedilemedi.'
        );
      }
    },
    []
  );

  // -------------------------
  // SEND MESSAGE
  // -------------------------

  const sendMessage = useCallback(
    async (
      name: string,
      email: string,
      message: string
    ): Promise<boolean> => {
      try {
        const timestamp = new Date().toISOString();

        await addDoc(
          collection(db, MESSAGES_COLLECTION),
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            createdAt: timestamp,
            created_at: timestamp,
          }
        );

        try {
          await updateDoc(portfolioRef, {
            'analytics.contact_submissions': increment(1),
          });

          setData((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              analytics: {
                ...prev.analytics,
                contact_submissions:
                  prev.analytics.contact_submissions + 1,
              },
            };
          });
        } catch (analyticsError) {
          console.error(
            'Mesaj istatistiği güncellenemedi:',
            analyticsError
          );
        }

        return true;
      } catch (error) {
        console.error(
          'Mesaj gönderme hatası:',
          error
        );

        return false;
      }
    },
    []
  );

  // -------------------------
  // FETCH MESSAGES
  // -------------------------

  const fetchMessages = useCallback(
    async (): Promise<void> => {
      try {
        const messagesQuery = query(
          collection(db, MESSAGES_COLLECTION),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(messagesQuery);

        const fetchedMessages: MessageItem[] =
          snapshot.docs.map((messageDoc) => {
            const messageData = messageDoc.data();

            const timestamp =
              messageData.createdAt ||
              messageData.created_at ||
              '';

            return {
              id: messageDoc.id,
              name: messageData.name || '',
              email: messageData.email || '',
              message: messageData.message || '',
              createdAt: timestamp,
              created_at: timestamp,
            };
          });

        setMessages(fetchedMessages);

      } catch (error) {
        console.error(
          'Mesajlar yüklenemedi:',
          error
        );

        throw error;
      }
    },
    []
  );

  // -------------------------
  // FETCH VISITORS
  // -------------------------

  const fetchVisitors = useCallback(
    async (): Promise<void> => {
      try {
        const visitorsQuery = query(
          collection(db, VISITORS_COLLECTION),
          orderBy('visitedAt', 'desc')
        );

        const snapshot = await getDocs(visitorsQuery);

        const fetchedVisitors: VisitorItem[] =
          snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              deviceType: d.deviceType || 'Bilinmiyor',
              browser: d.browser || 'Bilinmiyor',
              os: d.os || 'Bilinmiyor',
              screenResolution: d.screenResolution || '-',
              visitedAt: d.visitedAt || new Date().toISOString(),
              visitCount: d.visitCount || 1,
            };
          });

        setVisitors(fetchedVisitors);

      } catch (error) {
        console.error(
          'Ziyaretçi logları alınamadı:',
          error
        );
      }
    },
    []
  );

  // -------------------------
  // PROVIDER VALUE
  // -------------------------

  return (
    <PortfolioContext.Provider
      value={{
        data,
        messages,
        visitors,
        loading,
        updatePortfolio,
        sendMessage,
        fetchMessages,
        fetchVisitors,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// -------------------------
// CUSTOM HOOK
// -------------------------

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error(
      'usePortfolio must be used within a PortfolioProvider'
    );
  }

  return context;
};