const fs = require('fs');
const path = require('path');
const pool = require('../db');

const removeImage = (imagePath) => {
  if (!imagePath) return;
  fs.unlink(path.join(__dirname, '..', imagePath), () => {});
};

const validId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

// GET /api/hotels?search=&minPrice=&maxPrice=&limit=&offset=
exports.getHotels = async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 6, 50);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const conditions = [];
    const values = [];

    if (search && search.trim()) {
      values.push(`%${search.trim()}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }
    if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
      values.push(Number(minPrice));
      conditions.push(`price >= $${values.length}`);
    }
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
      values.push(Number(maxPrice));
      conditions.push(`price <= $${values.length}`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM hotels ${where}`,
      values
    );

    const dataResult = await pool.query(
      `SELECT * FROM hotels ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );

    res.json({
      total: countResult.rows[0].total,
      limit,
      offset,
      data: dataResult.rows,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/hotels/:id
exports.getHotelById = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hotel id' });
    }
    const { rows } = await pool.query('SELECT * FROM hotels WHERE id = $1', [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/hotels
exports.createHotel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ errors: [{ field: 'image', message: 'Image is required' }] });
    }
    const { title, description, latitude, longitude, price } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    const { rows } = await pool.query(
      `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, imagePath, latitude, longitude, price]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
};

// PUT /api/hotels/:id
exports.updateHotel = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'Invalid hotel id' });
    }

    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [
      req.params.id,
    ]);
    if (!existing.rows.length) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const oldImage = existing.rows[0].image_path;
    const { title, description, latitude, longitude, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : oldImage;

    const { rows } = await pool.query(
      `UPDATE hotels
       SET title = $1, description = $2, image_path = $3,
           latitude = $4, longitude = $5, price = $6
       WHERE id = $7 RETURNING *`,
      [title, description, imagePath, latitude, longitude, price, req.params.id]
    );

    if (req.file) removeImage(oldImage);

    res.json(rows[0]);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
};

// DELETE /api/hotels/:id
exports.deleteHotel = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hotel id' });
    }
    const { rows } = await pool.query(
      'DELETE FROM hotels WHERE id = $1 RETURNING image_path',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });

    removeImage(rows[0].image_path);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    next(err);
  }
};