const express = require('express');
const router = express.Router();

// ambil schema di db
const Images = require('../models/Images');

router.get('/picture', async (req, res) => {
  try {
    const images = await Images.find();
    res.render('picture', { images, path: '/picture' });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

module.exports = router;
