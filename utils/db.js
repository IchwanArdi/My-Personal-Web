const mongoose = require('mongoose');

// Koneksi ke MongoDB Atlas
mongoose
  .connect('mongodb://127.0.0.1:27017/portfolio-db')
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => console.error('MongoDB Connection Error ❌:', err));

// Schema dan Model (Project)
const projectSchema = new mongoose.Schema({
  judul: String,
  deskripsi: String,
  tanggal: Date,
  gambar: String,
});

const Project = mongoose.model('Project', projectSchema);

// Schema dan Model (Gambar)
const gambarSchema = new mongoose.Schema({
  gambar: String,
});

const Images = mongoose.model('Images', gambarSchema);

// Tambahkan data baru ke database
// const gambar1 = new Images({
//   gambar: 'https://res.cloudinary.com/dxagnxs59/image/upload/v1741118696/4_pv1ssj.jpg',
// });

// // Simpan data ke database
// gambar1
//   .save()
//   .then((result) => {
//     console.log('Project berhasil disimpan:', result);
//     mongoose.connection.close(); // Tutup koneksi setelah selesai
//   })
//   .catch((err) => {
//     console.error('Gagal menyimpan project ❌:', err);
//   });

module.exports = { Project, Images };
