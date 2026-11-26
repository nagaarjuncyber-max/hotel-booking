const { body, validationResult } = require('express-validator');
const fs = require('fs');

const hotelRules = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be under 255 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('latitude').isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude').isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { hotelRules, handleValidation };