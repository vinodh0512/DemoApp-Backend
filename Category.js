const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true }, // This will store the Base64 Image string
  bg: { type: String, default: '#ffffff' }
});

module.exports = mongoose.model('Category', CategorySchema);