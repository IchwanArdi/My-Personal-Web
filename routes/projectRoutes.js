const express = require('express');
const router = express.Router();

// ambil schema di db
const Project = require('../models/Project');

router.get('/project', async (req, res) => {
  try {
    const { category } = req.query;
    let projects;

    if (category && category !== 'all') {
      projects = await Project.find({ kategori: category }).sort({ tanggal: -1 });
    } else {
      projects = await Project.find().sort({ tanggal: -1 });
    }

    res.render('project', { projects, path: '/project' });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

module.exports = router;
