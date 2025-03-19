const mongoose = require('mongoose');

// Schema dan Model (Gambar)
const gambarSchema = new mongoose.Schema({
  gambar: String,
});

module.exports = mongoose.model('Images', gambarSchema);
