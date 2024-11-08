const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  region: { type: String, required: true },
  beds_available: { type: Number, required: true },
  ventilators_available: { type: Number, required: true },
  icu_capacity: { type: Number, required: true },
});

module.exports = mongoose.model('Hospital', hospitalSchema);
