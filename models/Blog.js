const mongoose = require('mongoose');

// Schema dan Model (Blog)
const blogSchema = new mongoose.Schema({
  kategori: { type: String },
  judul: { type: String, required: true },
  konten: { type: String, required: true },
  gambar: { type: String }, // Bisa berupa URL gambar atau path file
  tanggal: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);

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
