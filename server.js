const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Middleware untuk menangani form dan file statis
app.use(express.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/images', express.static(__dirname + '/dist/picture/project'));
app.use('/images', express.static(__dirname + '/dist/picture'));
app.use('/images', express.static(__dirname + '/dist/img'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/data', express.static(__dirname + '/data'));
app.use(cors()); // Mengizinkan akses dari frontend

const { Project, Images } = require('./utils/db');

// Root route - redirect ke home
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Route utama
app.get('/home', async (req, res) => {
  try {
    const latestProject = await Project.findOne().sort({ _id: -1 }); // Mengambil proyek terbaru berdasarkan ID terbaru
    const latestPicture = await Images.findOne().sort({ _id: -1 }); // Mengambil Picture terbaru berdasarkan ID terbaru
    res.render('index', { latestProject, latestPicture });
  } catch (error) {
    console.error('Error saat mengambil data proyek:', error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

app.get('/blog', (req, res) => {
  res.render('blog');
});

app.get('/picture', async (req, res) => {
  try {
    const images = await Images.find();
    res.render('picture', { images });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

app.get('/project', async (req, res) => {
  try {
    const { category } = req.query;
    let projects;

    if (category && category !== 'all') {
      projects = await Project.find({ kategori: category });
    } else {
      projects = await Project.find();
    }

    res.render('project', { projects });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
