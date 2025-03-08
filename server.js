const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const port = 3000;
const multer = require('multer');
const path = require('path');
const methodOverride = require('method-override');

app.use(
  session({
    secret: 'rahasia-ichwan', // Ganti dengan string rahasia yang kuat
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true jika pakai HTTPS
  })
);

// Middleware untuk menangani form dan file statis
app.use(express.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/images', express.static(__dirname + '/dist/picture/project'));
app.use('/images', express.static(__dirname + '/dist/picture'));
app.use('/images', express.static(__dirname + '/dist/img'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/uploads', express.static(__dirname + 'uploads'));
app.use(cors()); // Mengizinkan akses dari frontend
app.use(methodOverride('_method'));

function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect ke login jika belum login
  }
  next(); // Jika sudah login, lanjutkan ke route berikutnya
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder penyimpanan
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

const { Project, Images, Login, Blog } = require('./utils/db');

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

app.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('blog', { blogs });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
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

app.get('/login', (req, res) => {
  res.render('login', { error: null }); // Pastikan `error` selalu ada
});

app.post('/login', async (req, res) => {
  try {
    const { nama, password } = req.body;
    const user = await Login.findOne({ nama });

    if (!user || user.password !== password) {
      return res.render('login', { error: 'Nama atau password salah' });
    }

    // Simpan data pengguna dalam session
    req.session.user = { id: user._id, nama: user.nama };

    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

app.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find(); // Ambil data dari database
    res.render('dashboard', { blogs }); // Kirim ke template
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
    console.log(error);
  }
});

app.post('/artikel/tambah', authMiddleware, upload.single('gambar'), async (req, res) => {
  try {
    const newArticle = {
      judul: req.body.judul,
      konten: req.body.konten,
      gambar: req.file ? req.file.filename : null, // Simpan nama file ke database
    };

    await Blog.create(newArticle);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server.');
    console.log(error);
  }
});

app.delete('/dashboard/:id', authMiddleware, async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Gagal menghapus artikel');
    console.log(error);
  }
});

// app.post('/artikel/edit/:id', authMiddleware, async (req, res) => {
//   try {
//     const { kategori, judul, deskripsi, gambar } = req.body;
//     await Artikel.findByIdAndUpdate(req.params.id, { kategori, judul, deskripsi, gambar });
//     res.redirect('/dashboard');
//   } catch (error) {
//     res.status(500).send('Gagal mengedit artikel');
//   }
// });

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Kembali ke halaman login setelah logout
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
