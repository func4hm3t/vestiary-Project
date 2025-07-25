// app.js
'use strict';
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const cors = require('cors');
const User = db.User;

const app = express();
const PORT = process.env.PORT || 3000;

// 1b) CORS’i etkinleştir
// Angular’ın çalıştığı origin’i burada belirtin:
app.use(cors({
  origin: 'http://localhost:4200',
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 2) Session
const store = new SequelizeStore({ db: db.sequelize });
app.use(session({
  secret: 'çok-gizli-key',
  store,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));
store.sync();

// 3) JSON API’yi mount et **statik’ten önce**
console.log('⚙️ Mounting productRoutes at /api/products');
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

console.log('⚙️ Mounting authRoutes at /auth');
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// 4) Statik dosyalar ve dashboard HTML
app.use('/css', express.static(path.join(__dirname, 'admin_page', 'css')));
app.use('/', express.static(path.join(__dirname, 'admin_page', 'html'), {
  index: 'login.html'
}));

// 5) Login POST (admin paneli)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { Username: username } });
  if (!user || !await bcrypt.compare(password, user.PasswordHash)) {
    return res.redirect('/?error=1');          // kullanıcı yok veya yanlış şifre
  }
  if (user.Role !== 'admin') {
    return res.redirect('/?error=2');          // yetkisiz kullanıcı
  }
  // artık admin onaylı:
  req.session.userId   = user.Id;
  req.session.username = user.Username;
  req.session.role     = user.Role;
  return res.redirect('/dashboard');
});

// 6) Dashboard (korumalı HTML)
app.get('/dashboard', (req, res) => {
  if (req.session.role !== 'admin') {
    // admin olmayanı ana sayfaya gönder
    return res.redirect('/');
  }
  // sadece adminler buraya gelir
  res.sendFile(path.join(__dirname, 'admin_page', 'html', 'dashboard.html'));
});

// 7) Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// 8) DB sync & server start
db.sequelize.authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {
    console.log('✅ DB bağlantısı ve sync başarılı');
    app.listen(PORT, () => console.log(`🚀 Sunucu ayağa kalktı: http://localhost:${PORT}`));
  })
  .catch(err => console.error('🔴 DB hatası:', err));
