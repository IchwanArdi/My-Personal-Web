const mongoose = require('mongoose');

// Schema dan Model (Login)
const loginSchema = new mongoose.Schema({
  nama: String,
  password: String,
});
module.exports = mongoose.model('Login', loginSchema);
