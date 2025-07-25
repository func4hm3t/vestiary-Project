// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op, fn, col } = require('sequelize');

const ModelMap = {
  erkek: db.ErkekProduct,
  kadin: db.KadinProduct
};

// ─── 1) Distinct 'beden' değerleri ───────────────────────────────────────
router.get('/:category/sizes', async (req, res, next) => {
  try {
    const Model = ModelMap[req.params.category.toLowerCase()];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const rows = await Model.findAll({
      attributes: [[fn('DISTINCT', col('beden')), 'beden']],
      where: { beden: { [Op.ne]: null } }
    });
    return res.json(rows.map(r => r.get('beden')));
  } catch (err) {
    next(err);
  }
});

// ─── 2) Distinct 'renk' değerleri ────────────────────────────────────────
router.get('/:category/colors', async (req, res, next) => {
  try {
    const Model = ModelMap[req.params.category.toLowerCase()];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const rows = await Model.findAll({
      attributes: [[fn('DISTINCT', col('renk')), 'renk']],
      where: { renk: { [Op.ne]: null } }
    });
    return res.json(rows.map(r => r.get('renk')));
  } catch (err) {
    next(err);
  }
});

// ─── 3) Ürün listeleme + filtre (generic) ────────────────────────────────
router.get('/:category', async (req, res, next) => {
  try {
    const Model = ModelMap[req.params.category.toLowerCase()];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const { beden, renk } = req.query;
    const andClauses = [];

    // Çoklu beden filtresi
    if (beden) {
      const sizes = beden.split(',').map(s => s.trim()).filter(s => s);
      andClauses.push({
        [Op.or]: sizes.map(s => ({
          beden: { [Op.like]: `%${s}%` }
        }))
      });
    }

    // Çoklu renk filtresi
    if (renk) {
      const colors = renk.split(',').map(c => c.trim()).filter(c => c);
      andClauses.push({
        [Op.or]: colors.map(c => ({
          renk: { [Op.like]: `%${c}%` }
        }))
      });
    }

    const items = await Model.findAll({
      where: andClauses.length
        ? { [Op.and]: andClauses }
        : {}  // filtre yoksa tüm kayıtlar
    });
    return res.json(items);
  } catch (err) {
    next(err);
  }
});

// ─── 4) Oluşturma ─────────────────────────────────────────────────────────
router.post('/:category', async (req, res) => {
  console.log('🔔 POST /api/products/' + req.params.category, req.body);
  const Model = ModelMap[req.params.category.toLowerCase()];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

  const { title, description, price, imageUrl, beden, renk } = req.body;
  try {
    const item = await Model.create({
      Title: title,
      Description: description,
      Price: price,
      ImageUrl: imageUrl,
      beden,
      renk
    });
    return res.status(201).json(item);
  } catch (err) {
    console.error('Ürün oluşturma hatası:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ─── 5) Güncelleme ────────────────────────────────────────────────────────
router.put('/:category/:id', async (req, res) => {
  const Model = ModelMap[req.params.category.toLowerCase()];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

  const [updated] = await Model.update(req.body, {
    where: { Id: req.params.id }
  });
  return updated ? res.sendStatus(204) : res.sendStatus(404);
});

// ─── 6) Silme ──────────────────────────────────────────────────────────────
router.delete('/:category/:id', async (req, res) => {
  const Model = ModelMap[req.params.category.toLowerCase()];
  if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

  const deleted = await Model.destroy({
    where: { Id: req.params.id }
  });
  return deleted ? res.sendStatus(204) : res.sendStatus(404);
});

module.exports = router;
