const mongoose = require('mongoose');

// Schema dan Model (Project)
const projectSchema = new mongoose.Schema({
  kategori: String,
  link: String,
  deskripsi: String,
  tanggal: { type: Date, default: Date.now },
  gambar: String,
});

module.exports = mongoose.model('Project', projectSchema);
