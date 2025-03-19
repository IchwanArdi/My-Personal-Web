const express = require('express');
const router = express.Router();

// ambil schema di db
const Blog = require('../models/Blog');

router.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ tanggal: -1 });
    res.render('blog', { blogs, path: '/blog' });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

router.get('/mainBlog/:judul', async (req, res) => {
  try {
    const mainBlog = await Blog.findOne({ judul: decodeURIComponent(req.params.judul) });

    if (!mainBlog) {
      return res.status(404).send('Blog tidak ditemukan');
    }
    res.render('mainBlog', { mainBlog });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

module.exports = router;
