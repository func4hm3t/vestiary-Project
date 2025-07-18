const express = require('express');
const bcrypt  = require('bcryptjs');
const { Op }  = require('sequelize');
const db      = require('../models');
const jwt     = require('jsonwebtoken');
const User    = db.User;

const router = express.Router();

// JSON body parsing middleware kütüphanan varsa zaten app.js'te app.use(express.json()) ekli olmalı.

router.post('/signup', async (req, res) => {
  const { username, email, password, privacy } = req.body;

  // 1) Tüm alanlar dolu mu?
  if (!username || !email || !password || !privacy) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun ve gizlilik politikasını kabul edin.' });
  }

  try {
    // 2) Aynı kullanıcı adı veya e-posta önceden var mı?
    const exists = await User.findOne({
      where: {
        [Op.or]: [
          { Username: username },
          { Email: email }
        ]
      }
    });
    if (exists) {
      return res.status(409).json({ error: 'Kullanıcı adı veya e-posta zaten kayıtlı.' });
    }

    // 3) Şifreyi hash’le
    const hash = await bcrypt.hash(password, 10);

    // 4) Yeni kullanıcıyı oluştur
    await User.create({
      Username:     username,
      Email:        email,
      PasswordHash: hash,
      Role:         'user'
      // Id, CreatedAt, UpdatedAt modellerinizde otomatik üretilecektir
    });

    return res.status(201).json({ message: 'Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz.' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası, lütfen daha sonra tekrar deneyin.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1) Alanlar dolu mu?
  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur.' });
  }

  try {
    // 2) Kullanıcı var mı?
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    // 3) Şifreyi karşılaştır
    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    // 4) JWT oluştur (isteğe bağlı, oturum yönetimi için)
    const token = jwt.sign(
      { id: user.Id, username: user.Username },
      process.env.JWT_SECRET || 'GizliAnahtar',
      { expiresIn: '2h' }
    );

    // 5) Yanıtı dön
    return res.json({
      message:  'Giriş başarılı.',
      token,                            // frontend tarafı saklayabilir
      username: user.Username
    });
  } catch (err) {
    console.error('Login hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası, lütfen daha sonra tekrar deneyin.' });
  }
});

module.exports = router;
