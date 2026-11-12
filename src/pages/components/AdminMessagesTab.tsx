import React from 'react';
import type { ContactGroup, ContactStatus, StatusFilter } from '../types/admin';

interface MessagesTabProps {
  filteredContacts: ContactGroup[];
  activeContactsCount: number;
  selectedEmail: string | null;
  statusFilter: StatusFilter;
  onSelectEmail: (email: string) => void;
  onSetStatusFilter: (filter: StatusFilter) => void;
  onUpdateStatus: (email: string, status: ContactStatus) => void;
  onUpdateNotes: (email: string, notes: string) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  filteredContacts,
  activeContactsCount,
  selectedEmail,
  statusFilter,
  onSelectEmail,
  onSetStatusFilter,
  onUpdateStatus,
  onUpdateNotes,
}) => {
  const activeGroup = filteredContacts.find(g => g.email === selectedEmail);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#43D9C3]">Müşteri İstekleri & İş Akışı</h2>
        
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button onClick={() => onSetStatusFilter('all')} className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-[#43D9C3] text-[#080A0F] border-[#43D9C3]' : 'bg-[#10141D] text-[#9299A8] border-white/8'}`}>Aktif Tümü ({activeContactsCount})</button>
          <button onClick={() => onSetStatusFilter('yeni')} className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${statusFilter === 'yeni' ? 'bg-amber-400 text-[#080A0F] border-amber-400' : 'bg-[#10141D] text-[#9299A8] border-white/8'}`}>📥 Yeni</button>
          <button onClick={() => onSetStatusFilter('devam')} className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${statusFilter === 'devam' ? 'bg-indigo-400 text-[#080A0F] border-indigo-400' : 'bg-[#10141D] text-[#9299A8] border-white/8'}`}>⏳ İş Yapılıyor</button>
          <button onClick={() => onSetStatusFilter('tamamlandi')} className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${statusFilter === 'tamamlandi' ? 'bg-emerald-400 text-[#080A0F] border-emerald-400' : 'bg-[#10141D] text-[#9299A8] border-white/8'}`}>✅ Yapılmışlar</button>
          <button onClick={() => onSetStatusFilter('arsiv')} className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${statusFilter === 'arsiv' ? 'bg-gray-400 text-[#080A0F] border-gray-400' : 'bg-[#10141D] text-[#9299A8] border-white/8'}`}>📁 Arşiv</button>
        </div>
      </div>
      
      {filteredContacts.length === 0 ? (
        <div className="bg-[#10141D] border border-white/8 rounded-3xl p-12 text-center text-[#9299A8] font-mono text-xs">
          Bu kategoride henüz kayıtlı kişi bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sol Sütun: Kişi Listesi */}
          <div className="md:col-span-1 bg-[#10141D] border border-white/8 rounded-3xl p-4 space-y-2 h-fit max-h-150 overflow-y-auto">
            <span className="text-[10px] font-mono text-[#9299A8] uppercase tracking-widest block px-2 mb-2">KİŞİLER ({filteredContacts.length})</span>
            {filteredContacts.map((group) => {
              const isSelected = group.email === selectedEmail;
              
              const badgeColor = 
                group.status === 'tamamlandi' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                group.status === 'devam' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                group.status === 'arsiv' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                'bg-amber-500/10 text-amber-400 border-amber-500/20';

              const statusText = 
                group.status === 'tamamlandi' ? 'Yapıldı' :
                group.status === 'devam' ? 'İş Yapılıyor' :
                group.status === 'arsiv' ? 'Arşiv' : 'Yeni';

              return (
                <button
                  key={group.email}
                  onClick={() => onSelectEmail(group.email)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected 
                      ? 'bg-[#43D9C3]/10 border border-[#43D9C3]/40 text-white' 
                      : 'hover:bg-white/5 text-[#9299A8] border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white truncate">{group.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${badgeColor}`}>
                      {statusText}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono truncate text-[#9299A8]">{group.email}</span>
                </button>
              );
            })}
          </div>

          {/* Sağ Sütun: Detay ve Mesaj Akışı */}
          <div className="md:col-span-2 space-y-4">
            {activeGroup ? (
              <div className="bg-[#10141D] border border-white/8 rounded-3xl p-6 space-y-6">
                <div className="border-b border-white/8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeGroup.name}</h3>
                    <span className="text-xs font-mono text-[#43D9C3]">{activeGroup.email}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#080A0F] p-1.5 rounded-xl border border-white/8 text-[11px] font-mono">
                    {(['yeni', 'devam', 'tamamlandi', 'arsiv'] as ContactStatus[]).map(status => (
                      <button 
                        key={status}
                        onClick={() => onUpdateStatus(activeGroup.email, status)}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          activeGroup.status === status 
                            ? status === 'yeni' ? 'bg-amber-400 text-[#080A0F] font-bold' :
                              status === 'devam' ? 'bg-indigo-400 text-[#080A0F] font-bold' :
                              status === 'tamamlandi' ? 'bg-emerald-400 text-[#080A0F] font-bold' :
                              'bg-gray-400 text-[#080A0F] font-bold'
                            : 'text-[#9299A8] hover:text-white'
                        }`}
                      >
                        {status === 'yeni' ? 'Yeni' : status === 'devam' ? 'İş Yapılıyor' : status === 'tamamlandi' ? 'Yapıldı' : 'Arşiv'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-mono text-[#9299A8] uppercase tracking-wider">YÖNETİCİ NOTU / PROJE DETAYI</label>
                  <input 
                    type="text"
                    value={activeGroup.notes}
                    onChange={(e) => onUpdateNotes(activeGroup.email, e.target.value)}
                    placeholder="Bu kişiyle ilgili özel bir not ekle..."
                    className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#43D9C3]"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-mono text-[#9299A8] uppercase tracking-wider block">GÖNDERİLEN MESAJLAR ({activeGroup.items.length})</span>
                  <div className="space-y-3 max-h-95 overflow-y-auto pr-2">
                    {activeGroup.items.map((msg, index) => (
                      <div key={msg.id} className="bg-[#080A0F] border border-white/8 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#9299A8]">
                          <span>Mesaj #{activeGroup.items.length - index}</span>
                          <span>{msg.created_at}</span>
                        </div>
                        <p className="text-xs text-[#F5F7FA] leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-[#10141D] border border-white/8 rounded-3xl p-12 text-center text-[#9299A8] font-mono text-xs">
                Sol taraftan bir kişi seçin.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};