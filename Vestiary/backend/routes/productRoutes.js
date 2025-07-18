const express = require('express');
const router  = express.Router();
const db      = require('../models');

const ModelMap = {
  erkek: db.ErkekProduct,
  kadin: db.KadinProduct
};

// Listeleme
router.get('/:category', async (req, res) => {
  const Model = ModelMap[req.params.category];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });
  const items = await Model.findAll();
  res.json(items);
});

// Oluşturma
router.post('/:category', async (req, res) => {
  const Model = ModelMap[req.params.category];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });
  const { title, description, price, imageUrl } = req.body;
  try {
    const item = await Model.create({
      Title:       title,
      Description: description,
      Price:       price,
      ImageUrl:    imageUrl
    });
    return res.status(201).json(item);
  } catch (err) {
    // Burada gerçek SQL hatasını logluyoruz
    const sqlMessage = err.original?.message || err.message;
    console.error('Ürün oluşturma hatası:', sqlMessage);
    return res.status(500).json({ error: sqlMessage });
  }
});

// Güncelleme
router.put('/:category/:id', async (req, res) => {
  const Model = ModelMap[req.params.category];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });
  const [updated] = await Model.update(req.body, { where: { Id: req.params.id } });
  return updated ? res.sendStatus(204) : res.sendStatus(404);
});

// Silme
router.delete('/:category/:id', async (req, res) => {
  const Model = ModelMap[req.params.category];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });
  const deleted = await Model.destroy({ where: { Id: req.params.id } });
  return deleted ? res.sendStatus(204) : res.sendStatus(404);
});

module.exports = router;
