import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

const STYLES = {
  sectionContainer: "py-28 px-6 max-w-4xl mx-auto border-t border-white/8",
  headerWrapper: "text-center mb-16",
  sectionTag: "text-xs font-mono text-[#43D9C3] uppercase tracking-widest block mb-3",
  sectionTitle: "text-4xl font-bold tracking-tight mb-4",
  sectionSubtitle: "text-[#9299A8]",
  formCard: "bg-[#10141D] border border-white/8 rounded-3xl p-8 sm:p-10",
  inputField: "w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#43D9C3]",
  textAreaField: "w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#43D9C3] resize-none",
  submitButton: "w-full bg-[#43D9C3] text-[#080A0F] font-semibold py-4 rounded-xl text-sm cursor-pointer hover:bg-[#35b5a1] transition-all",
};

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { t } = useLanguage();
  const { sendMessage } = usePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const isSuccess = await sendMessage(name, email, message);

      if (!isSuccess) {
        throw new Error('Mesaj Firebase veritabanına kaydedilemedi.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err: any) {
      console.error('Mesaj gönderilemedi:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Firebase bağlantı hatası oluştu.');
    }
  };

  return (
    <section id="contact" className={STYLES.sectionContainer}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={STYLES.headerWrapper}>
        <span className={STYLES.sectionTag}>{t('İLETİŞİM', 'CONTACT')}</span>
        <h2 className={STYLES.sectionTitle}>{t('Harika Şeyler İnşa Edelim.', "Let's Build Something Great.")}</h2>
        <p className={STYLES.sectionSubtitle}>{t('Bir projeniz mi var? Doğrudan Firebase veritabanına mesaj gönderin.', 'Have an inquiry? Send a message directly to Firebase database.')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={STYLES.formCard}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input type="text" required placeholder={t('Adınız', 'Your Name')} value={name} onChange={e => setName(e.target.value)} className={STYLES.inputField} />
            <input type="email" required placeholder={t('E-posta Adresiniz', 'Email Address')} value={email} onChange={e => setEmail(e.target.value)} className={STYLES.inputField} />
          </div>
          <textarea required rows={5} placeholder={t('Mesajınız...', 'Your Message...')} value={message} onChange={e => setMessage(e.target.value)} className={STYLES.textAreaField}></textarea>
          
          {/* KVKK Bilgilendirme Metni */}
          <div className="text-xs text-[#9299A8] leading-relaxed pt-1">
            {t('Bu formu göndererek,', 'By submitting this form, you agree to our')}{' '}
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="text-[#43D9C3] underline hover:text-[#35b5a1] cursor-pointer font-medium"
            >
              {t('KVKK Aydınlatma Metni', 'Privacy Policy')}
            </button>
            {t('’ni okumuş ve kişisel verilerinizin işlenmesini kabul etmiş olursunuz.', ' and consent to the processing of your data.')}
          </div>

          <button type="submit" disabled={status === 'loading'} className={STYLES.submitButton}>
            {status === 'loading' ? t('Gönderiliyor...', 'Sending...') : status === 'success' ? t('✓ Mesaj Firebase’e Kaydedildi!', '✓ Message Saved to Firebase!') : t('Mesaj Gönder →', 'Send Message →')}
          </button>

          {status === 'error' && (
            <p className="text-xs text-red-400 font-mono text-center">
              {errorMessage || 'Mesaj gönderilirken bir hata oluştu.'}
            </p>
          )}
        </form>
      </motion.div>

      {/* KVKK Modalı (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#10141D] border border-white/10 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <h3 className="text-lg font-bold text-white">KVKK Aydınlatma ve Gizlilik Metni</h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#9299A8] hover:text-white font-mono text-sm cursor-pointer bg-white/5 px-3 py-1 rounded-xl"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#9299A8] leading-relaxed max-h-87.5 overflow-y-auto pr-2">
              <p>
                <strong>1. Veri Sorumlusunun Kimliği:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla portfolyo sahibi tarafından işlenmektedir.
              </p>
              <p>
                <strong>2. Kişisel Verilerin İşlenme Amacı:</strong> İletişim formu aracılığıyla paylaştığınız ad, e-posta adresiniz ve mesaj içeriğiniz; sizinle iletişime geçmek, taleplerinizi yanıtlamak ve olası iş/proje süreçlerini yürütmek amacıyla Firebase veritabanında güvenli bir şekilde saklanır.
              </p>
              <p>
                <strong>3. İşlenen Verilerin Aktarıldığı Yerler:</strong> Toplanan kişisel verileriniz, hukuki zorunluluklar haricinde hiçbir üçüncü şahısla paylaşılmaz; Firebase Cloud Firestore altyapısı üzerinde güvenle muhafaza edilir.
              </p>
              <p>
                <strong>4. Haklarınız:</strong> KVKK m. 11 uyarınca verilerinizin silinmesini, güncellenmesini veya işlenme amacını öğrenmeyi her zaman talep edebilirsiniz.
              </p>
            </div>

            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-[#43D9C3] text-[#080A0F] font-semibold py-3 rounded-xl text-xs font-mono cursor-pointer hover:bg-[#35b5a1] transition-all"
            >
              Anladım / Kapat
            </button>
          </div>
        </div>
      )}
    </section>
  );
};