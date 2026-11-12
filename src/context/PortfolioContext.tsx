
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
  addDoc,
  getDocs,
  orderBy,
  query,
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
  loading: boolean;

  updatePortfolio: (newData: PortfolioUpdate) => Promise<void>;

  sendMessage: (
    name: string,
    email: string,
    message: string
  ) => Promise<boolean>;

  fetchMessages: () => Promise<void>;
}

// -------------------------
// FIREBASE DOCUMENT
// -------------------------

const PORTFOLIO_COLLECTION = 'portfolio';
const PORTFOLIO_DOCUMENT = 'main';
const MESSAGES_COLLECTION = 'messages';

const portfolioRef = doc(
  db,
  PORTFOLIO_COLLECTION,
  PORTFOLIO_DOCUMENT
);

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
    headingTr: 'Fikirleri Dijital Deneyimlere Dönüştürüyorum.',
    headingEn: 'Turning Ideas Into Digital Experiences.',
    descTr:
      'Modern mobil uygulamalar ve ölçeklenebilir backend sistemleri geliştiriyorum.',
    descEn:
      'I build modern mobile applications and scalable backend systems.',
  },

  projects: [],

  analytics: {
    total_visits: 0,
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
  const [loading, setLoading] = useState(true);

  // -------------------------
  // INITIALIZE PORTFOLIO
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
            const lastVisit = new Date().toISOString();

            await updateDoc(portfolioRef, {
              'analytics.total_visits': increment(1),
              'analytics.last_visit': lastVisit,
            });

            if (isMounted) {
              setData((prev) => {
                if (!prev) return prev;

                return {
                  ...prev,
                  analytics: {
                    ...prev.analytics,
                    total_visits:
                      prev.analytics.total_visits + 1,
                    last_visit: lastVisit,
                  },
                };
              });
            }
          } catch (analyticsError) {
            console.error(
              'Ziyaretçi istatistiği güncellenemedi:',
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
  // PROVIDER VALUE
  // -------------------------

  return (
    <PortfolioContext.Provider
      value={{
        data,
        messages,
        loading,
        updatePortfolio,
        sendMessage,
        fetchMessages,
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
