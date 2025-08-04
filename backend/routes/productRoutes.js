// routes/productRoutes.js
const express  = require('express');
const router   = express.Router();
const db       = require('../models');
const { Op, fn, col } = require('sequelize');

const ModelMap = {
  erkek: db.ErkekProduct,
  kadin: db.KadinProduct
};

/**
 * 1) Distinct beden değerleri
 */
router.get('/:category/sizes', async (req, res, next) => {
  try {
    const key = req.params.category.toLowerCase();
    const Model = ModelMap[key];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const rows = await Model.findAll({
      attributes: [[ fn('DISTINCT', col('beden')), 'beden' ]],
      where: { beden: { [Op.ne]: null } }
    });
    return res.json(rows.map(r => r.get('beden')));
  } catch (err) {
    next(err);
  }
});

/**
 * 2) Distinct renk değerleri
 */
router.get('/:category/colors', async (req, res, next) => {
  try {
    const key = req.params.category.toLowerCase();
    const Model = ModelMap[key];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const rows = await Model.findAll({
      attributes: [[ fn('DISTINCT', col('renk')), 'renk' ]],
      where: { renk: { [Op.ne]: null } }
    });
    return res.json(rows.map(r => r.get('renk')));
  } catch (err) {
    next(err);
  }
});

/**
 * 3) Ürün listeleme + filtreler
 */
router.get('/:category', async (req, res, next) => {
  try {
    const key = req.params.category.toLowerCase();
    const Model = ModelMap[key];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const { beden, renk, minPrice, maxPrice } = req.query;

    // Basit bir where objesi inşa edelim
    const where = {};

    // --- multi-bedens ---
    if (beden) {
      const arr = beden.split(',').map(s => s.trim()).filter(Boolean);
      where.beden = { [Op.in]: arr };
    }

    // --- multi-renkler ---
    if (renk) {
      const arr = renk.split(',').map(c => c.trim()).filter(Boolean);
      where.renk = { [Op.in]: arr };
    }

    // --- fiyat aralığı ---
    if ((minPrice != null && minPrice !== '') || (maxPrice != null && maxPrice !== '')) {
      where.Price = {};
      if (minPrice != null && minPrice !== '') {
        where.Price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice != null && maxPrice !== '') {
        where.Price[Op.lte] = parseFloat(maxPrice);
      }
    }

    // (Debug) Gelen filtreyi görmek istersen:
    // console.log('WHERE OBJ:', JSON.stringify(where, null, 2));

    const items = await Model.findAll({ where });
    return res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * 4) Oluşturma
 */
router.post('/:category', async (req, res) => {
  try {
    const key = req.params.category.toLowerCase();
    const Model = ModelMap[key];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const { title, description, price, imageUrl, beden, renk } = req.body;
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
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * 5) Güncelleme
 */
router.put('/:category/:id', async (req, res, next) => {
  try {
    const key = req.params.category.toLowerCase();
    const Model = ModelMap[key];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const [updated] = await Model.update(req.body, {
      where: { Id: req.params.id }
    });
    return updated ? res.sendStatus(204) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
});

/**
 * 6) Silme
 */
router.delete('/:category/:id', async (req, res, next) => {
  try {
    const key = req.params.category.toLowerCase();
    const Model = ModelMap[key];
    if (!Model) return res.status(400).json({ error: 'Geçersiz kategori' });

    const deleted = await Model.destroy({
      where: { Id: req.params.id }
    });
    return deleted ? res.sendStatus(204) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
