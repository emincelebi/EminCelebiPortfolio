import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalProjects?: number;
  totalMessages?: number;
}

interface AnalyticsTabProps {
  initialData?: AnalyticsData;
  activeContactsCount: number;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ initialData, activeContactsCount }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialData || {
    totalVisits: 0,
    uniqueVisitors: 0,
    totalProjects: 0,
    totalMessages: 0,
  });

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [isLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setAnalytics(initialData);
      setLastUpdated(new Date().toLocaleTimeString('tr-TR'));
    }
  }, [initialData]);

  return (
    <div className="space-y-6">
      {/* Üst Bar: Başlık ve Zaman Filtresi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#43D9C3]">Ziyaretçi ve Site İstatistikleri</h2>
          {lastUpdated && (
            <span className="text-[10px] font-mono text-[#9299A8] block mt-0.5">
              Son Güncelleme: {lastUpdated}
            </span>
          )}
        </div>

        {/* Zaman Aralığı Seçici */}
        <div className="flex items-center gap-1.5 bg-[#10141D] p-1.5 rounded-xl border border-white/8 text-xs font-mono">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-[#43D9C3] text-[#080A0F] font-bold'
                  : 'text-[#9299A8] hover:text-white'
              }`}
            >
              {range === '7d' ? 'Son 7 Gün' : range === '30d' ? 'Son 30 Gün' : 'Tüm Zamanlar'}
            </button>
          ))}
        </div>
      </div>

      {/* İstatistik Kartları */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#10141D] border border-white/8 rounded-3xl p-6 animate-pulse h-32 flex flex-col justify-between">
              <div className="w-24 h-3 bg-white/10 rounded"></div>
              <div className="w-16 h-8 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Toplam Ziyaret */}
          <div className="bg-[#10141D] border border-white/8 rounded-3xl p-6 relative overflow-hidden group hover:border-[#43D9C3]/40 transition-all">
            <span className="text-xs font-mono text-[#9299A8] uppercase tracking-wider block mb-2">TOPLAM ZİYARET</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-[#43D9C3]">
                {(analytics.totalVisits || 0).toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {/* Tekil Ziyaretçi */}
          <div className="bg-[#10141D] border border-white/8 rounded-3xl p-6 relative overflow-hidden group hover:border-[#7C83FF]/40 transition-all">
            <span className="text-xs font-mono text-[#9299A8] uppercase tracking-wider block mb-2">TEKİL ZİYARETÇİ</span>
            <span className="text-3xl font-bold font-mono text-[#7C83FF]">
              {(analytics.uniqueVisitors || 0).toLocaleString('tr-TR')}
            </span>
          </div>

          {/* Aktif Talep / Kişi */}
          <div className="bg-[#10141D] border border-white/8 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
            <span className="text-xs font-mono text-[#9299A8] uppercase tracking-wider block mb-2">AKTİF TALEP / KİŞİ</span>
            <span className="text-3xl font-bold font-mono text-white">
              {activeContactsCount}
            </span>
          </div>

          {/* Toplam Mesaj */}
          <div className="bg-[#10141D] border border-white/8 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <span className="text-xs font-mono text-[#9299A8] uppercase tracking-wider block mb-2">TOPLAM MESAJ</span>
            <span className="text-3xl font-bold font-mono text-amber-400">
              {analytics.totalMessages || 0}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};