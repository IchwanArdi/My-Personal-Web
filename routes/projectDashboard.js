const express = require('express');
const router = express.Router();

// Ambil schema dari database
const Project = require('../models/Project');

// Middleware autentikasi
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// Tampilkan data Project
router.get('/projectDashboard', ensureAuthenticated, async (req, res) => {
  try {
    const projects = await Project.find();
    const successMessage = req.query.success || null; // Ambil pesan sukses dari query

    res.render('projectDashboard', { projects, title: 'Dashboard Project', success: successMessage });
  } catch (error) {
    console.log(error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

// Tambah Project
router.post('/project/tambah', ensureAuthenticated, async (req, res) => {
  try {
    const newProject = {
      deskripsi: req.body.deskripsi,
      kategori: req.body.kategori,
      link: req.body.link,
      gambar: req.body.gambar,
    };

    await Project.create(newProject);

    res.redirect('/projectDashboard?success=Project berhasil ditambah');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server.');
    console.log(error);
  }
});

// Hapus Project
router.delete('/projectDashboard/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Project.deleteOne({ _id: req.params.id });

    res.redirect('/projectDashboard?success=Project berhasil dihapus');
  } catch (error) {
    res.status(500).send('Gagal menghapus project');
    console.log(error);
  }
});

// Edit Project
router.put('/project/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, {
      deskripsi: req.body.deskripsi,
      kategori: req.body.kategori,
      link: req.body.link,
      gambar: req.body.gambar,
    });

    res.redirect('/projectDashboard?success=Project berhasil diedit');
  } catch (err) {
    res.status(500).send('Server Error');
    console.log(err);
  }
});

// Jangan lupa export router-nya!
module.exports = router;
