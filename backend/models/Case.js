const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  region: { type: String, required: true },
  active_cases: { type: Number, required: true },
  recoveries: { type: Number, required: true },
  deaths: { type: Number, required: true },
});

module.exports = mongoose.model('Case', caseSchema);
