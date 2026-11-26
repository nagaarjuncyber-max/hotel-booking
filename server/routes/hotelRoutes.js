const router = require('express').Router();
const upload = require('../middleware/upload');
const { hotelRules, handleValidation } = require('../middleware/validate');
const c = require('../controllers/hotelController');

router.get('/', c.getHotels);
router.get('/:id', c.getHotelById);
router.post('/', upload.single('image'), hotelRules, handleValidation, c.createHotel);
router.put('/:id', upload.single('image'), hotelRules, handleValidation, c.updateHotel);
router.delete('/:id', c.deleteHotel);

module.exports = router;