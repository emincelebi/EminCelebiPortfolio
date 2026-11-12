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
    <div className="min-h-screen bg-[#080A0F] text-[#F5F7FA] flex items-center justify-center px-6 font-sans">
      <div className="bg-[#10141D] border border-white/8 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#10141D] border border-white/8 flex items-center justify-center font-mono font-bold text-[#43D9C3] mx-auto mb-4 text-lg">
            🔐
          </div>
          <span className="text-xs font-mono text-[#43D9C3] uppercase tracking-widest block mb-1">FIREBASE SECURE PORTAL</span>
          <h1 className="text-2xl font-bold tracking-tight">Yönetici Girişi</h1>
          <p className="text-xs text-[#9299A8] mt-1">Firebase hesap bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#9299A8] mb-1.5">E-POSTA ADRESİ</label>
            <input 
              type="email" 
              placeholder="admin" 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#43D9C3]"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-[#9299A8] mb-1.5">ŞİFRE</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#43D9C3]"
              required
            />
          </div>

          {errorMsg && <p className="text-xs text-red-400 font-mono">{errorMsg}</p>}

          <button type="submit" disabled={loading} className="w-full bg-[#43D9C3] text-[#080A0F] font-semibold py-3.5 rounded-xl text-xs font-mono cursor-pointer hover:bg-[#35b5a1] transition-all mt-2">
            {loading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs font-mono text-[#9299A8] hover:text-[#43D9C3] transition-colors">
            ← Ana Sayfaya Geri Dön
          </a>
        </div>
      </div>
    </div>
  );
};