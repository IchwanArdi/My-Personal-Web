const mongoose = require('mongoose');
//XiE0LoF2Hlxb3tts

const uri = 'mongodb+srv://ichwanpwt22:mongodb@my-personal-db.13xev.mongodb.net/portfolio-db?retryWrites=true&w=majority&appName=My-Personal-Db';

mongoose
  .connect(uri)
  .then(() => console.log('MongoDB Atlas Connected ✅'))
  .catch((err) => console.error('MongoDB Connection Error ❌:', err));

// Schema dan Model (Project)
const projectSchema = new mongoose.Schema({
  kategori: String,
  link: String,
  deskripsi: String,
  tanggal: { type: Date, default: Date.now },
  gambar: String,
});

const Project = mongoose.model('Project', projectSchema);

// Schema dan Model (Gambar)
const gambarSchema = new mongoose.Schema({
  gambar: String,
});

const Images = mongoose.model('Images', gambarSchema);

// Schema dan Model (Login)
const loginSchema = new mongoose.Schema({
  nama: String,
  password: String,
});
const Login = mongoose.model('Login', loginSchema);

// Schema dan Model (Blog)
const blogSchema = new mongoose.Schema({
  kategori: { type: String },
  judul: { type: String, required: true },
  konten: { type: String, required: true },
  gambar: { type: String }, // Bisa berupa URL gambar atau path file
  tanggal: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Tambahkan data baru ke database
// const project1 = new Blog({
//   judul: 'Membuat Website menggunakan Tailwind',
//   konten: 'Dolorem, fugit! Lorem ipsum, dolor sit amet consectetur adipisicing.',
//   tanggal: '2024-08-08T00:00:00.000+00:00',
// });

// // Simpan data ke database
// project1
//   .save()
//   .then((result) => {
//     console.log('Project berhasil disimpan:', result);
//     mongoose.connection.close(); // Tutup koneksi setelah selesai
//   })
//   .catch((err) => {
//     console.error('Gagal menyimpan project ❌:', err);
//   });

module.exports = { Project, Images, Login, Blog };
