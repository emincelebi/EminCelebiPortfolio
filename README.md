# 🚀 Full-Stack Portfolio & CRM Platform

Modern, hızlı ve ölçeklenebilir kişisel portföy web uygulaması. **React, TypeScript, Vite ve Firebase** altyapısıyla geliştirilmiştir. Gelişmiş yönetici paneli sayesinde projeler, müşteri mesajları ve site istatistikleri tamamen bulut tabanlı ve gerçek zamanlı olarak yönetilir.

---

## 🛠️ Tech Stack (Teknoloji Yığını)

### Frontend
* **React 18+ & TypeScript** - Tip güvenli, modern UI bileşenleri
* **Vite** - Çok hızlı geliştirme, derleme (build) ve HMR altyapısı
* **Tailwind CSS** - Modern ve şık stil mimarisi
* **Context API** - Global state yönetimi ve çift dil (TR/EN) desteği

### Backend & Cloud (Firebase)
* **Cloud Firestore** - Projeler, iletişim mesajları ve ziyaretçi istatistikleri için gerçek zamanlı NoSQL veritabanı
* **Firebase Authentication** - Yönetici paneli için güvenli oturum açma ve kimlik doğrulama
* **Firebase Hosting** - Hızlı, SSL sertifikalı ve CDN destekli bulut barındırma

---

## ✨ Öne Çıkan Özellikler

- 🌐 **Çift Dil Desteği (TR / EN):** Arayüz metinleri dinamik olarak Türkçe ve İngilizce arasında değiştirilebilir.
- 🚀 **Dinamik Proje Yönetimi:** Admin panelinden kategoriler, teknolojiler ve sınırsız özel bağlantı (GitHub, Canlı Demo, Figma vb.) ekleme, düzenleme ve silme.
- 💬 **Müşteri İlişkileri & İş Takibi (CRM):** Ziyaretçilerin gönderdiği mesajlar Firestore üzerinde saklanır ve e-posta adreslerine göre gruplandırılır; "Yeni", "İş Yapılıyor", "Tamamlandı" ve "Arşiv" olarak kategorize edilerek özel yönetici notları eklenebilir.
- 📊 **Canlı İstatistikler:** Toplam ziyaret ve aktif talep sayılarını takip eden analitik paneli.
- 🔒 **Güvenli Admin Paneli:** Session / Firebase kimlik doğrulaması ile korunan özel yönetim merkezi.
- ⚖️ **KVKK Uyumluluğu:** İletişim formunda yasal bilgilendirme ve detaylı aydınlatma metni modalı (pop-up) entegrasyonu.

---

## 📁 Proje Mimarisi

```text
emin-portfolio/
├── public/                 # Statik varlıklar ve favicon
├── src/                    # Kaynak kodları (React + TS)
│   ├── context/            # Portfolio & Language Context sağlayıcıları
│   ├── components/         # Arayüz bileşenleri (Projects, Contact, Admin vb.)
│   ├── App.tsx             # Ana uygulama bileşeni
│   └── main.tsx            # Uygulama giriş noktası
├── .env.example            # Örnek çevresel değişkenler şablonu
├── index.html              # HTML ana şablonu
├── package.json            # Proje bağımlılıkları ve scriptler
└── vite.config.ts          # Vite derleyici yapılandırması
