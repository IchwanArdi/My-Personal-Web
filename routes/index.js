const express = require('express');
const router = express.Router();

// ambil schema di db
const Project = require('../models/Project');
const Images = require('../models/Images');
const Blog = require('../models/Blog');

// Root route - redirect ke home
router.get('/', (req, res) => {
  res.redirect('/home');
});

// Route utama
router.get('/home', async (req, res) => {
  try {
    const latestProject = await Project.findOne().sort({ _id: -1 }); // Mengambil proyek terbaru berdasarkan ID terbaru
    const latestBlog = await Blog.findOne().sort({ _id: -1 }); // Mengambil Blog terbaru berdasarkan ID terbaru
    const latestPicture = await Images.findOne().sort({ _id: -1 }); // Mengambil Picture terbaru berdasarkan ID terbaru
    res.render('index', { latestProject, latestBlog, latestPicture, path: '/home' });
  } catch (error) {
    console.error('Error saat mengambil data proyek:', error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

module.exports = router;
