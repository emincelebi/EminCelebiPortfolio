import React from 'react';
import type { VisitorItem } from '../../context/PortfolioContext';

interface AdminVisitorsTabProps {
  visitors: VisitorItem[];
}

export const AdminVisitorsTab: React.FC<AdminVisitorsTabProps> = ({ visitors }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3CE8B5]"></span>
          Site Ziyaretçileri ve Cihaz Bilgileri ({visitors.length})
        </h2>
      </div>

      <div className="bg-[#0B1915]/80 backdrop-blur-xl border border-emerald-500/15 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-emerald-500/15 text-[#8FA8A0] bg-[#050C0A]/50">
                <th className="p-4 uppercase tracking-wider">Cihaz Tipi</th>
                <th className="p-4 uppercase tracking-wider">İşletim Sistemi</th>
                <th className="p-4 uppercase tracking-wider">Tarayıcı</th>
                <th className="p-4 uppercase tracking-wider">Ekran Çözünürlüğü</th>
                <th className="p-4 uppercase tracking-wider">Ziyaret Zamanı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-white">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#8FA8A0]">
                    Henüz kayıtlı ziyaretçi verisi bulunmuyor.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-4 font-bold text-[#3CE8B5] flex items-center gap-2">
                      {v.deviceType === 'Mobil' ? '📱' : v.deviceType === 'Tablet' ? '📟' : '💻'} 
                      {v.deviceType}
                    </td>
                    <td className="p-4">{v.os}</td>
                    <td className="p-4 text-teal-300">{v.browser}</td>
                    <td className="p-4 text-[#8FA8A0]">{v.screenResolution}</td>
                    <td className="p-4 text-[#8FA8A0]">
                      {new Date(v.visitedAt).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};