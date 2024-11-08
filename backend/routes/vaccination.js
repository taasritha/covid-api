const express = require('express');
const router = express.Router();
const Vaccination = require('../models/Vaccination');

// GET /covid/vaccination-status
router.get('/vaccination-status', async (req, res) => {
  try {
    const vaccinationData = await Vaccination.find();
    res.json(vaccinationData);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
