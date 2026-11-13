import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

interface LoginFormProps {
  onLogin?: (user: string, pass: string) => boolean | Promise<boolean>;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      sessionStorage.setItem('admin_auth', 'true');
      window.location.reload(); 
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setErrorMsg('Geçersiz e-posta veya şifre!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050C0A] text-white flex items-center justify-center px-6 font-sans relative">
      <div className="bg-[#0B1915]/80 backdrop-blur-xl border border-emerald-500/15 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0B1915] border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-[#3CE8B5] mx-auto mb-4 text-lg shadow-sm">
            🔐
          </div>
          <span className="text-xs font-mono text-[#3CE8B5] uppercase tracking-widest block mb-1 items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3CE8B5] animate-pulse"></span>
            SECURE PORTAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Yönetici Girişi</h1>
          <p className="text-xs text-[#8FA8A0] mt-1">Hesap bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#8FA8A0] mb-1.5">E-POSTA ADRESİ</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              className="w-full bg-[#050C0A] border border-emerald-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3CE8B5] transition-all"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-[#8FA8A0] mb-1.5">ŞİFRE</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              className="w-full bg-[#050C0A] border border-emerald-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3CE8B5] transition-all"
              required
            />
          </div>

          {errorMsg && <p className="text-xs text-red-400 font-mono">{errorMsg}</p>}

          <button type="submit" disabled={loading} className="w-full bg-[#3CE8B5] text-[#050C0A] font-semibold py-3.5 rounded-xl text-xs font-mono cursor-pointer hover:bg-[#3CE8B5]/90 transition-all mt-2 shadow-lg shadow-[#3CE8B5]/10">
            {loading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs font-mono text-[#8FA8A0] hover:text-[#3CE8B5] transition-colors">
            ← Ana Sayfaya Geri Dön
          </a>
        </div>
      </div>
    </div>
  );
};