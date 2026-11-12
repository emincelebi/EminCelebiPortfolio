
import React, { useState, useEffect } from 'react';

import { usePortfolio } from '../context/PortfolioContext';

import type {
  ContactGroup,
  ContactState,
  ContactStatus,
  AdminTab,
  StatusFilter,
} from '../pages/types/admin';

import { LoginForm } from '../pages/components/AdminLoginForm';
import { AnalyticsTab } from '../pages/components/AdminAnalyticsTab';
import {
  ProjectsTab,
  type NewProject,
} from '../pages/components/AdminProjectsTab';
import { MessagesTab } from '../pages/components/AdminMessagesTab';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '1234';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalProjects: number;
  totalMessages: number;
  visitChangePercentage: number;
}

export const Admin: React.FC = () => {
  const {
    data,
    messages,
    fetchMessages,
    updatePortfolio,
  } = usePortfolio();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('admin_auth') === 'true'
  );

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVisits: data?.analytics?.total_visits || 0,
    uniqueVisitors: 0,
    totalProjects: data?.projects?.length || 0,
    totalMessages: messages.length,
    visitChangePercentage: 0,
  });

  const [contactStates, setContactStates] = useState<
    Record<string, ContactState>
  >(() => {
    try {
      const saved = localStorage.getItem('admin_contact_states');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, fetchMessages]);

  useEffect(() => {
    setAnalyticsData({
      totalVisits: data?.analytics?.total_visits || 0,
      uniqueVisitors: 0,
      totalProjects: data?.projects?.length || 0,
      totalMessages: messages.length,
      visitChangePercentage: 0,
    });

    if (messages.length > 0 && !selectedEmail) {
      setSelectedEmail(messages[0].email);
    }
  }, [data, messages, selectedEmail]);

  useEffect(() => {
    localStorage.setItem(
      'admin_contact_states',
      JSON.stringify(contactStates)
    );
  }, [contactStates]);

  const handleLogin = (username: string, password: string): boolean => {
    if (
      username.trim() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const handleAddProject = async (newProject: NewProject): Promise<void> => {
    if (!data) {
      throw new Error('Portfolio verileri henüz yüklenmedi.');
    }

    const newProjectWithId = {
      ...newProject,
      id: crypto.randomUUID(),
    };

    const updatedProjects = [
      ...(data.projects || []),
      newProjectWithId,
    ];

    await updatePortfolio({
      profile: data.profile,
      hero: data.hero,
      projects: updatedProjects,
    });
  };

  const handleDeleteProject = async (projectId: string): Promise<void> => {
    if (!data) {
      throw new Error('Portfolio verileri henüz yüklenmedi.');
    }

    const projectExists = data.projects?.some(
      (project) => project.id === projectId
    );

    if (!projectExists) {
      throw new Error('Silinmek istenen proje bulunamadı.');
    }

    const updatedProjects = data.projects.filter(
      (project) => project.id !== projectId
    );

    await updatePortfolio({
      profile: data.profile,
      hero: data.hero,
      projects: updatedProjects,
    });
  };

  const updateContactStatus = (
    email: string,
    newStatus: ContactStatus
  ) => {
    setContactStates((prev) => ({
      ...prev,
      [email]: {
        ...(prev[email] || { notes: '' }),
        status: newStatus,
      },
    }));
  };

  const updateContactNotes = (email: string, newNotes: string) => {
    setContactStates((prev) => ({
      ...prev,
      [email]: {
        ...(prev[email] || { status: 'yeni' }),
        notes: newNotes,
      },
    }));
  };

  const groupedContacts: ContactGroup[] = Object.values(
    messages.reduce((acc, message) => {
      if (!acc[message.email]) {
        const savedState = contactStates[message.email] || {
          status: 'yeni',
          notes: '',
        };

        acc[message.email] = {
          email: message.email,
          name: message.name,
          status: savedState.status,
          notes: savedState.notes,
          items: [],
        };
      }

      acc[message.email].items.push(message);

      return acc;
    }, {} as Record<string, ContactGroup>)
  );

  const activeContacts = groupedContacts.filter(
    (group) => group.status !== 'arsiv'
  );

  const filteredContacts = groupedContacts.filter((group) => {
    if (statusFilter === 'all') {
      return group.status !== 'arsiv';
    }

    return group.status === statusFilter;
  });

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#080A0F] text-[#F5F7FA] pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Üst Bar */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/8">
          <div>
            <span className="text-xs font-mono text-[#43D9C3] uppercase tracking-widest block mb-1">
              FIREBASE ADMIN PANEL
            </span>

            <h1 className="text-3xl font-bold tracking-tight">
              Portfolyo Yönetim Merkezi
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Çıkış Yap
            </button>

            <a
              href="/"
              className="text-xs font-mono bg-[#10141D] border border-white/8 hover:border-[#43D9C3]/50 px-4 py-2 rounded-xl transition-all"
            >
              Siteye Dön
            </a>
          </div>
        </div>

        {/* Sekme Butonları */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-white/8 pb-4">

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#43D9C3] text-[#080A0F] font-bold'
                : 'bg-[#10141D] text-[#9299A8]'
            }`}
          >
            📊 İstatistikler
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#43D9C3] text-[#080A0F] font-bold'
                : 'bg-[#10141D] text-[#9299A8]'
            }`}
          >
            🚀 Projeler
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#43D9C3] text-[#080A0F] font-bold'
                : 'bg-[#10141D] text-[#9299A8]'
            }`}
          >
            💬 Müşteri & İş Takibi ({messages.length})
          </button>

        </div>

        {/* İstatistikler */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            initialData={analyticsData}
            activeContactsCount={activeContacts.length}
          />
        )}

        {/* Projeler */}
        {activeTab === 'projects' && (
          <ProjectsTab
            projects={data?.projects}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {/* Mesajlar */}
        {activeTab === 'messages' && (
          <MessagesTab
            filteredContacts={filteredContacts}
            activeContactsCount={activeContacts.length}
            selectedEmail={selectedEmail}
            statusFilter={statusFilter}
            onSelectEmail={setSelectedEmail}
            onSetStatusFilter={setStatusFilter}
            onUpdateStatus={updateContactStatus}
            onUpdateNotes={updateContactNotes}
          />
        )}

      </div>
    </div>
  );
};
