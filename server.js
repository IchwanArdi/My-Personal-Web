const express = require('express');
const app = express();
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

// Root route - redirect ke home
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Route utama
app.get('/home', (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.error('Error saat render halaman home:', error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

app.get('/blog', (req, res) => {
  res.render('blog');
});

app.get('/picture', (req, res) => {
  res.render('picture');
});

// Memuat data proyek secara dinamis setiap kali halaman diakses
app.get('/project', (req, res) => {
  res.render('project');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
