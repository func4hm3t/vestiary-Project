// index.js
const express = require('express');
const path    = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) CSS dosyaları için statik rota
app.use('/css', express.static(path.join(__dirname, 'admin_page', 'css')));

// 2) HTML dosyaları için statik rota; index: 'login.html' diyerek köke ilk olarak bu dosyayı atıyoruz
app.use('/', express.static(path.join(__dirname, 'admin_page', 'html'), {
  index: 'login.html'
}));

// 3) (İsteğe bağlı) Eğer form POST edilecekse body-parser ya da express.json ekleyin
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4) POST /login gibi rotalarınızı buraya yazabilirsiniz
// app.post('/login', (req, res) => { /* kimlik doğrulama */ });

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ayağa kalktı: http://localhost:${PORT}`);
});
