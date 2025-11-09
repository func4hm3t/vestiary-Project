# Vestiary

Modern bir giyim e‑ticaret örneği. Angular 20 ile yazılmış bir frontend ve Node.js/Express + Sequelize (MSSQL) tabanlı bir backend içerir. Oturum (session) tabanlı kimlik doğrulama, kadın/erkek ürünleri için filtreleme (beden, renk, fiyat), ve basit bir admin paneli bulunur.

## İçerik
- Proje Özeti ve Özellikler
- Mimari ve Teknolojiler
- Kurulum (Backend ve Frontend)
- Geliştirme Ortamında Çalıştırma
- API Uç Noktaları
- Admin Paneli
- Üretim ve Güvenlik Notları

## Özellikler
- Kullanıcı kayıt ve oturum açma (session tabanlı)
- Ürün listeleme ve filtreleme (kategori: erkek/kadın; beden, renk, fiyat)
- Favoriler, sepet ve ödeme akışına uygun frontend sayfaları
- Admin paneli (oturum korumalı dashboard)

## Mimari ve Teknolojiler
- Frontend: Angular 20, RxJS, Tailwind/PostCSS, Bootstrap, Flowbite
  - Geliştirme sunucusu: `http://localhost:4200`
  - Backend’e proxy: `frontend/src/proxy.conf.json` üzerinden `/products` ve `/auth` yolları `http://localhost:3000`’a yönlenir
- Backend: Node.js (Express 5), Sequelize, MSSQL (tedious), express‑session, connect‑session‑sequelize, bcrypt, CORS, Helmet
  - Varsayılan port: `3000`
  - Veritabanı yapılandırması: `backend/config/config.json`

## Önkoşullar
- Node.js (LTS önerilir) ve npm
- Microsoft SQL Server (lokalde `SQLEXPRESS` örneği varsayılmış)
  - Veritabanı adı: `Vestiary`
  - `backend/config/config.json` içindeki kullanıcı/şifre/host bilgilerini kendi ortamınıza göre güncelleyin

## Kurulum
1) Bağımlılıkları kurun

```bash
cd backend
npm install

cd ../frontend
npm install
```

2) Veritabanını hazırlayın
- SQL Server’ınızda `Vestiary` veritabanını oluşturun.
- `backend/config/config.json` dosyasındaki bilgileri kendi ortamınıza göre düzenleyin (kullanıcı adı, parola, instanceName vb.).
- Not: Repoda migration dosyaları yoktur. Tablolarınız hazır değilse Sequelize CLI ile migration oluşturabilir veya geliştirme amaçlı `sequelize.sync()` yaklaşımını projeye eklemeyi düşünebilirsiniz.

3) Ortam değişkenleri (önerilir)
`backend` dizininde bir `.env` dosyası oluşturup gizli bilgileri burada tutun:

```env
SESSION_SECRET=super-gizli-bir-anahtar
# Kendi akışınıza göre genişletebilirsiniz.
```

> Güvenlik: `backend/config/config.json` içinde kullanıcı adı/şifre gibi gizli bilgileri repoya koymayın. Üretimde şifreleri mutlaka ortam değişkenlerinde yönetin.

## Geliştirme Ortamında Çalıştırma
- Backend (port 3000):

```bash
cd backend
# Seçenek A: app.js (proxy ile uyumlu yol ön ekleri: /auth ve /api/products)
npm start

# Seçenek B: index.js (geliştirme akışı; yollar / ve /products)
npm run dev
```

- Frontend (port 4200):

```bash
cd frontend
npm start
```

Proxy eşlemesi (`frontend/src/proxy.conf.json`):

```json
{
  "/products": { "target": "http://localhost:3000" },
  "/auth":     { "target": "http://localhost:3000" }
}
```

Not: `npm start` ile backend `app.js` kullanılır ve `/auth`, `/api/products` yollarına publish eder. Frontend proxy’si `/products` beklediği için iki tarafta yol ön eklerinin uyumlu olduğundan emin olun. Geliştirmede en az sürtünme için ya backend’i `app.js` ile `/auth` ve `/api/products` altında çalıştırın, ya da proxy/route ön eklerini eşitleyin.

## API Uç Noktaları (özet)
- Kimlik Doğrulama (app.js ile):
  - `POST /auth/signup` — Kullanıcı oluşturur
  - `POST /auth/login` — Oturum açar ve session başlatır

- Ürünler:
  - `GET /products/:category` — Ürün listesi (query: `beden`, `renk`, `minPrice`, `maxPrice`)
  - `GET /products/:category/sizes` — Mevcut bedenlerin listesi
  - `GET /products/:category/colors` — Mevcut renklerin listesi
  - `POST /products/:category` — Ürün oluşturur
  - `PUT /products/:category/:id` — Ürün günceller
  - `DELETE /products/:category/:id` — Ürün siler

Kategori: `erkek` veya `kadin`

Örnek filtreleme:

```
GET /products/erkek?beden=M,L&renk=siyah,beyaz&minPrice=100&maxPrice=500
```

## Admin Paneli
- Giriş sayfası ve dashboard statik olarak backend tarafından servis edilir.
- Giriş: `GET /` (form post: `/login`)
- Başarılı giriş sonrası: `GET /dashboard` (yalnızca session’ı olan kullanıcılar)
- Çıkış: `GET /logout`
- Admin yetkisi için `Users` tablosunda `Role = 'admin'` bir kullanıcı bulunmalıdır.

## Dizin Yapısı (kısa)
- `frontend/` — Angular uygulaması, proxy ve asset’ler
- `backend/` — Express uygulaması, Sequelize modelleri ve rotalar
  - `routes/` — `authRoutes.js`, `productRoutes.js`
  - `models/` — `Users.js`, `erkekProduct.js`, `kadinProduct.js`
  - `config/config.json` — Sequelize veritabanı ayarları (MSSQL)
  - `admin_page/` — Admin login/dashboard statik dosyaları

## Üretim ve Güvenlik Notları
- Gizli bilgileri (parola, anahtarlar) repoya koymayın; `.env` veya gizli yönetimi kullanın.
- CORS ayarlarını üretim domain’inize göre güncelleyin.
- `helmet` yapılandırmasını sıkılaştırın; `contentSecurityPolicy`’i etkinleştirin.
- SQL Server bağlantınızda şifrelemeyi etkinleştirin (ör. `encrypt: true`, `trustServerCertificate: false`).
- Docker: `backend/Dockerfile` mevcuttur; imaj oluşturup `-p 3000:3000` ile çalıştırabilirsiniz.

## Katkı ve Lisans
Bu repo bireysel/öğrenme amaçlıdır. İsterseniz issue/pull request açabilirsiniz.

