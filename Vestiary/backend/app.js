// app.js
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const User = db.User;

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session konfigurasyonu (isteğe bağlı olarak secret’ı .env’e taşıyın)
const store = new SequelizeStore({ db: db.sequelize });
app.use(session({
  secret: 'çok-gizli-key',
  store,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 saat
}));
store.sync();

// Statikler
app.use('/css', express.static(path.join(__dirname, 'admin_page', 'css')));
app.use('/', express.static(path.join(__dirname, 'admin_page', 'html'), {
  index: 'login.html'
}));

// Login POST
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.redirect('/?error=1');
    }
    const ok = await bcrypt.compare(password, user.PasswordHash);
    if (!ok) {
      return res.redirect('/?error=1');
    }
    // Başarılıysa session’a kaydet
    req.session.userId = user.Id;
    req.session.username = user.Username;
    // login başarılı kısmı
    return res.redirect(`/dashboard?user=${encodeURIComponent(user.Username)}`);

  } catch (err) {
    console.error(err);
    return res.status(500).send('Sunucu hatası');
  }
});

const productRoutes = require('./routes/productRoutes');
// …
db.sequelize.authenticate()
  .then(() => db.sequelize.sync())    // ErkekProducts & KadinProducts tablolarını oluşturur
  .then(() => {
    app.use('/products', productRoutes);
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  })
  .catch(console.error);


// Dashboard (korumalı)
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(
    path.join(__dirname, 'admin_page', 'html', 'dashboard.html')
  );
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

const authRoutes = require('./routes/authRoutes');

app.use(express.json());             // JSON parse middleware
app.use('/auth', authRoutes);        // /auth/signup rotası aktif


// DB bağlantısı ve sunucu başlatma
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Veritabanı bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`🚀 Sunucu ayağa kalktı: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Veritabanına bağlanamadı:', err);
  });
