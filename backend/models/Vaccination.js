const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  region: { type: String, required: true },
  doses_given: { type: Number, required: true },
  percentage_vaccinated: { type: Number, required: true },
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);
