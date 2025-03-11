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
app.use('/uploads', express.static(__dirname + '/uploads'));
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
    const latestBlog = await Blog.findOne().sort({ _id: -1 }); // Mengambil Blog terbaru berdasarkan ID terbaru
    const latestPicture = await Images.findOne().sort({ _id: -1 }); // Mengambil Picture terbaru berdasarkan ID terbaru
    res.render('index', { latestProject, latestBlog, latestPicture });
  } catch (error) {
    console.error('Error saat mengambil data proyek:', error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

app.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ tanggal: -1 });
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

app.get('/mainBlog/:judul', async (req, res) => {
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

app.get('/project', async (req, res) => {
  try {
    const { category } = req.query;
    let projects;

    if (category && category !== 'all') {
      projects = await Project.find({ kategori: category }).sort({ tanggal: -1 });
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

// Tampilkan data Blog
app.get('/dashboard', authMiddleware, async (req, res) => {
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
app.post('/artikel/tambah', authMiddleware, upload.single('gambar'), async (req, res) => {
  try {
    const newArticle = {
      judul: req.body.judul,
      konten: req.body.konten,
      gambar: req.file ? req.file.filename : null, // Simpan nama file ke database
    };

    await Blog.create(newArticle);
    res.redirect('/dashboard?success="Blog berhasil ditambah');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server.');
    console.log(error);
  }
});

// Delete Blog
app.delete('/dashboard/:id', authMiddleware, async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard?success="Blog berhasil dihapus');
  } catch (error) {
    res.status(500).send('Gagal menghapus artikel');
    console.log(error);
  }
});

// Edit Project
app.put('/artikel/:id', authMiddleware, upload.single('gambar'), async (req, res) => {
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

// Tampilkan data Project
app.get('/projectDashboard', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find();
    const successMessage = req.query.success || null; // Ambil pesan sukses dari query

    res.render('projectDashboard', { projects, title: 'Dashboard Project', success: successMessage });
  } catch (error) {
    console.log(error);
  }
});

// Tambah Project
app.post('/project/tambah', authMiddleware, async (req, res) => {
  try {
    const newProject = {
      deskripsi: req.body.deskripsi,
      kategori: req.body.kategori,
      link: req.body.link,
      gambar: req.body.gambar,
    };

    await Project.create(newProject);

    // Ambil ulang data proyek setelah menambahkan proyek baru
    const projects = await Project.find();

    res.redirect('/projectDashboard?success=Project berhasil ditambah');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server.');
    console.log(error);
  }
});

// Delete Project
app.delete('/projectDashboard/:id', authMiddleware, async (req, res) => {
  try {
    await Project.deleteOne({ _id: req.params.id });

    // Redirect dengan query string untuk membawa pesan sukses
    res.redirect('/projectDashboard?success=Project berhasil dihapus');
  } catch (error) {
    res.status(500).send('Gagal menghapus project');
    console.log(error);
  }
});

// Edit Project
app.put('/project', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.body._id, {
      deskripsi: req.body.deskripsi,
      kategori: req.body.kategori,
      link: req.body.link,
      gambar: req.body.gambar,
    });

    res.redirect('/projectDashboard?success=Project berhasil diedit');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Kembali ke halaman login setelah logout
  });
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
