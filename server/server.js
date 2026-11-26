require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/hotels', hotelRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.startsWith('Only image')) {
    return res
      .status(400)
      .json({ errors: [{ field: 'image', message: err.message }] });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));