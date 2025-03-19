const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ambil schema di db
const Blog = require('../models/Blog');

// middlewares
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Folder penyimpanan
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Filter jenis file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Tampilkan data Blog
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find(); // Ambil data dari database
    const successMessage = req.query.success || null; // Ambil pesan sukses dari query

    res.render('dashboard', { blogs, title: 'Dashboard Blog', success: successMessage });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
    console.log(error);
  }
});

// Tambah Blog
router.post('/artikel/tambah', ensureAuthenticated, upload.single('gambar'), async (req, res) => {
  try {
    const newArticle = {
      judul: req.body.judul,
      konten: req.body.konten,
      gambar: req.file ? req.file.filename : null, // Simpan nama file ke database
    };

    await Blog.create(newArticle);
    res.redirect('/dashboard?success=Blog berhasil ditambah');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server.');
    console.log(error);
  }
});

// Edit Project
router.put('/artikel/:id', ensureAuthenticated, upload.single('gambar'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send('Blog tidak ditemukan');
    }

    const updatedData = {
      judul: req.body.judul,
      konten: req.body.konten,
      gambar: req.file ? req.file.filename : blog.gambar,
    };

    await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.redirect('/dashboard?success=Blog berhasil diedit');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Blog
router.delete('/dashboard/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard?success=Blog berhasil dihapus');
  } catch (error) {
    res.status(500).send('Gagal menghapus artikel');
    console.log(error);
  }
});

module.exports = router;
