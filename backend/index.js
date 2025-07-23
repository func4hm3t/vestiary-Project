// index.js

require('dotenv').config();
const express   = require('express');
const path      = require('path');
const session   = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors      = require('cors');
const helmet    = require('helmet');

const db            = require('./models');
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Güvenlik başlıkları (geliştirme için CSP kapalı)
app.use(helmet({ contentSecurityPolicy: false }));

// CORS & body parsing
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session store
const store = new SequelizeStore({ db: db.sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'çokgizli',
  store,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 }
}));
store.sync();

// API rotaları
// (!) authRoutes’ı köke mount ediyoruz, böylece
//     POST /signup ve POST /login direkt çalışır
app.use('/', authRoutes);
app.use('/products', productRoutes);

// Statik dosyalarınız (CSS, JS, resimler)
app.use('/css',    express.static(path.join(__dirname, 'admin_page/css')));
app.use('/assets', express.static(path.join(__dirname, 'admin_page/assets')));

// Login sayfası
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin_page/html/login.html'));
});

// Dashboard (oturumlu kullanıcı)
function isUser(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  next();
}
app.get('/dashboard', isUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin_page/html/dashboard.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Sunucu başlat
const PORT = process.env.PORT || 3000;
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ DB bağlantısı başarılı');
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('🔴 DB bağlantı hatası:', err);
  });
