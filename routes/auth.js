const express = require('express');
const router = express.Router();
const Login = require('../models/Login');

// Halaman Login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Proses Login
router.post('/login', async (req, res) => {
  const { nama, password } = req.body;

  try {
    // Cari user dengan nama & password sekaligus
    const user = await Login.findOne({ nama, password });

    if (!user) {
      return res.render('login', { error: 'Nama atau password salah' });
    }

    // Buat session user
    req.session.user = {
      id: user._id,
      nama: user.nama,
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
