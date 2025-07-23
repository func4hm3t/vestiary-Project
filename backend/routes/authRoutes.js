// routes/authRoutes.js

const express   = require('express');
const bcrypt    = require('bcryptjs');
const { Op }    = require('sequelize');
const db        = require('../models');
const User      = db.User;

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password, privacy } = req.body;
  if (!username || !email || !password || !privacy) {
    return res.status(400).json({ error: 'Tüm alanları doldurun ve gizlilik politikasını kabul edin.' });
  }
  try {
    const exists = await User.findOne({
      where: { [Op.or]: [{ Username: username }, { Email: email }] }
    });
    if (exists) {
      return res.status(409).json({ error: 'Kullanıcı adı veya e-posta zaten kayıtlı.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      Username:     username,
      Email:        email,
      PasswordHash: hash,
      Role:         'user'
    });
    return res.status(201).json({ message: 'Kayıt başarılı.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Kullanıcı adı ve şifre gereklidir.');
  }
  try {
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.status(401).send('Geçersiz kullanıcı adı veya şifre.');
    }
    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) {
      return res.status(401).send('Geçersiz kullanıcı adı veya şifre.');
    }

    // Session’a bilgileri koy
    req.session.userId   = user.Id;
    req.session.username = user.Username;
    req.session.role     = user.Role;

    // Başarılıysa dashboard’a yönlendir
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sunucu hatası.');
  }
});

module.exports = router;
