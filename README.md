# Emlak Değerleme Uygulaması

Bu uygulama, kullanıcıların mülklerinin tahmini değerini hesaplamalarına yardımcı olmak için geliştirilmiş bir araçtır. Uygulama, benzer özelliklere sahip mülklerin verilerini analiz ederek, kullanıcının girdiği özelliklere en yakın mülkleri bulur ve bu mülklerin fiyatlarına dayalı olarak bir değerleme tahmini sunar.

## Özellikler

- Kullanıcı dostu arayüz ile mülk özelliklerini giriş yapma
- Konum, alan, oda sayısı, bina yaşı ve diğer özelliklere göre değerleme
- Benzer mülklerin karşılaştırmalı analizi
- Görsel grafikler ile sonuçların sunumu
- Mobil uyumlu tasarım

## Teknolojiler

### Frontend
- React
- TypeScript
- Material UI
- React Router
- Chart.js
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- CORS
- Dotenv

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- PostgreSQL (v12 veya üzeri)

### Veritabanı Kurulumu

1. PostgreSQL'i yükleyin ve çalıştırın
2. `server/schema.sql` dosyasını PostgreSQL'de çalıştırarak veritabanını ve tabloları oluşturun:

```bash
psql -U postgres -f server/schema.sql
```

### Backend Kurulumu

1. Server klasörüne gidin:
```bash
cd server
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını düzenleyin ve veritabanı bağlantı bilgilerinizi girin.

4. Sunucuyu başlatın:
```bash
npm run dev
```

### Frontend Kurulumu

1. Ana proje klasöründe bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm start
```

## Kullanım

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. "Değerleme" sayfasına gidin
3. Değerlemek istediğiniz mülkün özelliklerini girin
4. "Değerleme Yap" butonuna tıklayın
5. Sonuçları inceleyin

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
